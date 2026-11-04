import "server-only";

import { prisma } from "@/src/lib/prisma";

export type ReconciliationReason =
  | "RESERVATION_EXPIRED"
  | "RESERVATION_MISSING"
  | "RESERVATION_CONSUMPTION_FAILED"
  | "PAYMENT_STATE_MISMATCH";

export async function recordPaymentReconciliation(input: {
  orderId: string;
  razorpayPaymentId: string;
  reason: ReconciliationReason;
}) {
  try {
    const record = await prisma.paymentReconciliation.upsert({
      where: {
        razorpayPaymentId: input.razorpayPaymentId,
      },
      create: {
        orderId: input.orderId,
        razorpayPaymentId: input.razorpayPaymentId,
        reason: input.reason,
        status: "PENDING",
      },
      update: {},
    });

    if (record.orderId !== input.orderId) {
      throw new Error(
        "Payment reconciliation conflict: payment is already linked to another order."
      );
    }

    return record;
  } catch (error) {
    console.error("Payment reconciliation recording failed:", {
      orderId: input.orderId,
      razorpayPaymentId: input.razorpayPaymentId,
      reason: input.reason,
      error,
    });

    throw error;
  }
}