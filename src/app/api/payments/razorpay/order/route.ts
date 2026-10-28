
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../../../../lib/prisma";
import { razorpay } from "../../../../../lib/razorpay";
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
      !("orderId" in body) ||
      typeof body.orderId !== "string" ||
      !body.orderId.trim()
    ) {
      return NextResponse.json(
        { error: "A valid order ID is required." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: body.orderId,
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

    if (
      order.paymentStatus !== "PENDING" ||
      order.status !== "PENDING"
    ) {
      return NextResponse.json(
        { error: "This order is not awaiting payment." },
        { status: 409 }
      );
    }

    if (order.reservations.length === 0) {
      return NextResponse.json(
        { error: "This order has no inventory reservation." },
        { status: 409 }
      );
    }

    const now = new Date();

    if (
      order.reservations.some(
        (reservation) =>
          reservation.status !== "ACTIVE" ||
          reservation.expiresAt <= now
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Your checkout reservation has expired. Please start checkout again.",
        },
        { status: 409 }
      );
    }

    // Reuse the existing Razorpay order when a retry occurs.
    if (order.razorpayOrderId) {
      return NextResponse.json({
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: order.razorpayOrderId,
        orderId: order.id,
        amount: new Prisma.Decimal(order.total)
          .mul(100)
          .toDecimalPlaces(0)
          .toNumber(),
        currency: "INR",
      });
    }

    const amount = new Prisma.Decimal(order.total)
      .mul(100)
      .toDecimalPlaces(0)
      .toNumber();

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount." },
        { status: 400 }
      );
    }

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        localOrderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    // Save only if another request hasn't already created a gateway order.
    const saved = await prisma.order.updateMany({
      where: {
        id: order.id,
        userId,
        paymentStatus: "PENDING",
        status: "PENDING",
        razorpayOrderId: null,
      },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    if (saved.count !== 1) {
      return NextResponse.json(
        {
          error:
            "Payment initialization changed. Please retry the request.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      orderId: order.id,
      amount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    return NextResponse.json(
      { error: "Unable to initialize payment. Please try again." },
      { status: 500 }
    );
  }
}
