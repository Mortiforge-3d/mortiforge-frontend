
import "server-only";

import { verifyRazorpaySignature } from "../../../../../lib/razorpay-signature";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../lib/prisma";
import { razorpay } from "../../../../../lib/razorpay";
import { consumeReservation } from "../../../../../lib/inventory";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("razorpay_order_id" in body) ||
      !("razorpay_payment_id" in body) ||
      !("razorpay_signature" in body) ||
      typeof body.razorpay_order_id !== "string" ||
      typeof body.razorpay_payment_id !== "string" ||
      typeof body.razorpay_signature !== "string" ||
      !body.razorpay_order_id ||
      !body.razorpay_payment_id ||
      !body.razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Invalid payment verification details." },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = body;

    if (
  !verifyRazorpaySignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    process.env.RAZORPAY_KEY_SECRET ?? ""
  )
) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        razorpayOrderId,
        userId,
      },
      include: {
        reservations: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // Fetch payment details directly from Razorpay.
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (
      payment.order_id !== razorpayOrderId ||
      payment.currency !== "INR"
    ) {
      return NextResponse.json(
        { error: "Payment details do not match this order." },
        { status: 400 }
      );
    }

    const expectedAmount = new Prisma.Decimal(order.total)
      .mul(100)
      .toDecimalPlaces(0)
      .toNumber();

    if (payment.amount !== expectedAmount) {
      return NextResponse.json(
        { error: "Payment amount does not match the order." },
        { status: 400 }
      );
    }

    // Only captured payments can confirm an order.
    if (payment.status !== "captured") {
      return NextResponse.json(
        {
          error:
            "Payment has not been captured yet. Please wait for confirmation.",
        },
        { status: 409 }
      );
    }

    // Safe retry after a previous successful verification.
    if (order.paymentStatus === "PAID") {
      if (order.razorpayPaymentId === razorpayPaymentId) {
        return NextResponse.json({
          success: true,
          message: "Payment already verified.",
          orderId: order.id,
        });
      }

      return NextResponse.json(
        { error: "This order has already been paid." },
        { status: 409 }
      );
    }

    if (
      order.paymentStatus !== "PENDING" ||
      order.status !== "PENDING"
    ) {
      return NextResponse.json(
        { error: "This order cannot be confirmed." },
        { status: 409 }
      );
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
      // The gateway captured money, but inventory is no longer safely
      // reserved. Do not confirm the order; reconcile/refund this payment.
      console.error(
        "CAPTURED PAYMENT NEEDS RECONCILIATION",
        {
          orderId: order.id,
          razorpayOrderId,
          razorpayPaymentId,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment was received, but the reservation needs reconciliation. Contact support and quote your order number.",
          orderNumber: order.orderNumber,
        },
        { status: 409 }
      );
    }


const transactionResult = await prisma.$transaction(async (tx) => {
  const currentOrder = await tx.order.findFirst({
    where: {
      id: order.id,
      userId,
      razorpayOrderId,
    },
    include: {
      reservations: true,
    },
  });

  if (!currentOrder) {
    throw new Error("ORDER_NOT_FOUND");
  }

  // A retry of the same successfully verified payment is safe.
  if (currentOrder.paymentStatus === "PAID") {
    if (currentOrder.razorpayPaymentId === razorpayPaymentId) {
      return "already-paid" as const;
    }

    throw new Error("ORDER_ALREADY_PAID");
  }

  if (
    currentOrder.paymentStatus !== "PENDING" ||
    currentOrder.status !== "PENDING"
  ) {
    throw new Error("ORDER_NOT_PAYABLE");
  }

  const now = new Date();

  if (
    currentOrder.reservations.length === 0 ||
    currentOrder.reservations.some(
      (reservation) =>
        reservation.status !== "ACTIVE" ||
        reservation.expiresAt <= now
    )
  ) {
    throw new Error("RESERVATION_REQUIRES_RECONCILIATION");
  }

  // Claim the pending order first. Concurrent requests cannot both
  // transition the same order from PENDING to PAID.
  const updated = await tx.order.updateMany({
    where: {
      id: currentOrder.id,
      userId,
      razorpayOrderId,
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
    // Another transaction may have completed this same payment.
    const latestOrder = await tx.order.findUnique({
      where: { id: currentOrder.id },
      select: {
        paymentStatus: true,
        razorpayPaymentId: true,
      },
    });

    if (
      latestOrder?.paymentStatus === "PAID" &&
      latestOrder.razorpayPaymentId === razorpayPaymentId
    ) {
      return "already-paid" as const;
    }

    throw new Error("ORDER_STATE_CHANGED");
  }

  // If any reservation cannot be consumed, throwing rolls back both
  // the order update and all inventory changes.
  for (const reservation of currentOrder.reservations) {
    const consumed = await consumeReservation(tx, reservation.id);

    if (!consumed) {
      throw new Error("RESERVATION_CONSUMPTION_FAILED");
    }
  }

  return "paid" as const;
});


    return NextResponse.json({
  success: true,
  message:
    transactionResult === "already-paid"
      ? "Payment already verified."
      : "Payment verified successfully.",
  orderId: order.id,
  orderNumber: order.orderNumber,
});
  } catch (error) {
    console.error("Payment verification failed:", error);

    return NextResponse.json(
      { error: "Unable to verify payment. Please contact support if money was deducted." },
      { status: 500 }
    );
  }
}
