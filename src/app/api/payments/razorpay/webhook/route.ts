import "server-only";

import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { consumeReservation } from "../../../../../lib/inventory";
import { Prisma } from "@prisma/client";

import { verifyRazorpayWebhookSignature } from "../../../../../lib/razorpay-webhook-signature";

import { recordPaymentReconciliation } from "../../../../../lib/payments/reconciliation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not configured.");

    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  const eventId = request.headers.get("x-razorpay-event-id");

  if (!signature || !eventId) {
    return NextResponse.json(
      { error: "Missing webhook headers." },
      { status: 400 }
    );
  }

  // Verify the exact raw request body before parsing JSON.
  const rawBody = await request.text();

  if (!verifyRazorpayWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
        };
      };
      order?: {
        entity?: {
          id?: string;
          amount?: number;
          currency?: string;
          status?: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (!event.event) {
    return NextResponse.json(
      { error: "Missing event type." },
      { status: 400 }
    );
  }

  // Only these events can confirm a payment in this initial version.
  const isPaymentCaptured = event.event === "payment.captured";
  const isOrderPaid = event.event === "order.paid";

  if (!isPaymentCaptured && !isOrderPaid) {
    try {
      await prisma.razorpayWebhookEvent.upsert({
        where: { eventId },
        create: {
          eventId,
          eventType: event.event,
          processed: true,
        },
        update: {},
      });

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Webhook event recording failed:", error);

      return NextResponse.json(
        { error: "Unable to record webhook event." },
        { status: 500 }
      );
    }
  }

  const payment = event.payload?.payment?.entity;
  const gatewayOrder = event.payload?.order?.entity;

  const razorpayOrderId =
    payment?.order_id ?? gatewayOrder?.id;

  const razorpayPaymentId = payment?.id;

  const amount = payment?.amount ?? gatewayOrder?.amount;
  const currency = payment?.currency ?? gatewayOrder?.currency;

  if (
    !razorpayOrderId ||
    !Number.isSafeInteger(amount) ||
    amount! <= 0 ||
    currency !== "INR" ||
    (isPaymentCaptured && payment?.status !== "captured") ||
    (isOrderPaid && gatewayOrder?.status !== "paid")
  ) {
    return NextResponse.json(
      { error: "Incomplete or invalid payment event." },
      { status: 400 }
    );
  }

    let reconciliationOrderId: string | null = null;

  try {
    await prisma.$transaction(async (tx) => {
      // Claim the event ID. Concurrent deliveries cannot both claim it.
      await tx.razorpayWebhookEvent.create({
        data: {
          eventId,
          eventType: event.event!,
          processed: false,
        },
      });

      const order = await tx.order.findFirst({
        where: { razorpayOrderId },
        include: { reservations: true },
      });

      if (!order) {
        throw new Error("LOCAL_ORDER_NOT_FOUND");
      }
      reconciliationOrderId = order.id;

      const expectedAmount = new Prisma.Decimal(order.total)
        .mul(100)
        .toDecimalPlaces(0)
        .toNumber();

      if (amount !== expectedAmount) {
        throw new Error("PAYMENT_AMOUNT_MISMATCH");
      }


if (order.paymentStatus === "PAID") {
  // Only acknowledge the event if it matches the payment already recorded.
  if (
    !razorpayPaymentId ||
    order.razorpayPaymentId !== razorpayPaymentId
  ) {
    throw new Error("PAID_ORDER_PAYMENT_MISMATCH");
  }

  await tx.razorpayWebhookEvent.update({
    where: { eventId },
    data: {
      processed: true,
      processedAt: new Date(),
    },
  });

  return;
}


      if (
        order.paymentStatus !== "PENDING" ||
        order.status !== "PENDING" ||
        !razorpayPaymentId
      ) {
        throw new Error("ORDER_NOT_PAYABLE");
      }

      const now = new Date();

      if (
        order.reservations.length === 0 ||
        order.reservations.some(
          (reservation) =>
            reservation.status !== "ACTIVE" ||
            reservation.expiresAt <= now
        )
      ) {
        // Do not confirm an order without valid stock reservations.
        // This event remains unprocessed for manual reconciliation.
        throw new Error("PAYMENT_REQUIRES_RECONCILIATION");
      }

      for (const reservation of order.reservations) {
        const consumed = await consumeReservation(tx, reservation.id);

        if (!consumed) {
          throw new Error("RESERVATION_CONSUMPTION_FAILED");
        }
      }

      const updated = await tx.order.updateMany({
        where: {
          id: order.id,
          paymentStatus: "PENDING",
          status: "PENDING",
        },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          razorpayPaymentId,
        },
      });

      if (updated.count !== 1) {
        throw new Error("ORDER_STATE_CHANGED");
      }

      await tx.razorpayWebhookEvent.update({
        where: { eventId },
        data: {
          processed: true,
          processedAt: new Date(),
        },
      });
    });

    return NextResponse.json({ received: true });
    } catch (error) {
    // Handle duplicate webhook deliveries.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      try {
        const existingEvent =
          await prisma.razorpayWebhookEvent.findUnique({
            where: { eventId },
            select: { processed: true },
          });

        if (existingEvent?.processed) {
          return NextResponse.json({ received: true });
        }
      } catch (lookupError) {
        console.error("Duplicate webhook lookup failed:", {
          eventId,
          lookupError,
        });
      }
    }

    // Record captured payments that could not be fulfilled because
    // inventory reservations were missing, expired, or unconsumable.
    if (
      error instanceof Error &&
      [
        "PAYMENT_REQUIRES_RECONCILIATION",
        "RESERVATION_CONSUMPTION_FAILED",
      ].includes(error.message)
    ) {
      try {
        if (!reconciliationOrderId || !razorpayPaymentId) {
          throw new Error("Missing order or payment ID for reconciliation.");
        }

        let reason:
          | "RESERVATION_EXPIRED"
          | "RESERVATION_MISSING"
          | "RESERVATION_CONSUMPTION_FAILED"
          | "PAYMENT_STATE_MISMATCH";

        if (error.message === "RESERVATION_CONSUMPTION_FAILED") {
          reason = "RESERVATION_CONSUMPTION_FAILED";
        } else {
          const currentReservations =
            await prisma.inventoryReservation.findMany({
              where: { orderId: reconciliationOrderId },
              select: {
                status: true,
                expiresAt: true,
              },
            });

          const now = new Date();

          reason =
            currentReservations.length === 0
              ? "RESERVATION_MISSING"
              : currentReservations.some(
                    (reservation) =>
                      reservation.status === "EXPIRED" ||
                      reservation.expiresAt <= now
                  )
                ? "RESERVATION_EXPIRED"
                : "PAYMENT_STATE_MISMATCH";
        }

        await recordPaymentReconciliation({
          orderId: reconciliationOrderId,
          razorpayPaymentId,
          reason,
        });

        // The reconciliation record is now safely persisted.
        // Acknowledge the webhook so Razorpay does not retry forever.
        await prisma.razorpayWebhookEvent.upsert({
          where: { eventId },
          create: {
            eventId,
            eventType: event.event!,
            processed: true,
            processedAt: new Date(),
          },
          update: {
            processed: true,
            processedAt: new Date(),
          },
        });

        console.error("Captured payment requires reconciliation:", {
          eventId,
          orderId: reconciliationOrderId,
          razorpayPaymentId,
          reason,
        });

        return NextResponse.json({
          received: true,
          reconciliationRequired: true,
        });
      } catch (reconciliationError) {
        console.error("Webhook reconciliation failed:", {
          eventId,
          orderId: reconciliationOrderId,
          razorpayPaymentId,
          error: reconciliationError,
        });

        return NextResponse.json(
          { error: "Payment reconciliation recording failed." },
          { status: 500 }
        );
      }
    }

    console.error("Razorpay webhook processing failed:", {
      eventId,
      eventType: event.event,
      error,
    });

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
