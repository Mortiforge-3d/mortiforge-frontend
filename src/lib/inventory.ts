import {
  Prisma,
  ReservationStatus,
} from "@prisma/client";
import { prisma } from "./prisma";

const RESERVATION_MINUTES = 15;

type TransactionClient = Prisma.TransactionClient;

/**
 * Releases one active reservation and restores its stock.
 *
 * Must be called inside a Prisma transaction.
 */
export async function releaseReservation(
  tx: TransactionClient,
  reservationId: string,
  expired = false,
) {
  const reservation = await tx.inventoryReservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation || reservation.status !== ReservationStatus.ACTIVE) {
    return false;
  }

  // Conditional update makes release idempotent:
  // only one transaction can change ACTIVE to RELEASED/EXPIRED.
  const updated = await tx.inventoryReservation.updateMany({
    where: {
      id: reservationId,
      status: ReservationStatus.ACTIVE,
    },
    data: {
      status: expired
        ? ReservationStatus.EXPIRED
        : ReservationStatus.RELEASED,
    },
  });

  if (updated.count !== 1) {
    return false;
  }

  await tx.productVariant.update({
    where: { id: reservation.productVariantId },
    data: {
      stock: { increment: reservation.quantity },
    },
  });

  return true;
}


/**
 * Marks an active, unexpired reservation as consumed.
 *
 * Call inside the same database transaction that marks
 * the corresponding order as paid.
 *
 * Stock is NOT incremented: it remains deducted from
 * ProductVariant.stock after a successful purchase.
 */
export async function consumeReservation(
  tx: TransactionClient,
  reservationId: string,
) {
  const result = await tx.inventoryReservation.updateMany({
    where: {
      id: reservationId,
      status: ReservationStatus.ACTIVE,
      expiresAt: { gt: new Date() },
    },
    data: {
      status: ReservationStatus.CONSUMED,
    },
  });

  return result.count === 1;
}


/**
 * Creates a reservation for one variant.
 *
 * The caller must already have created the order and must call
 * this function inside the same transaction.
 */
export async function reserveInventory(
  tx: TransactionClient,
  input: {
    orderId: string;
    productVariantId: string;
    quantity: number;
  },
) {
  if (
    !Number.isInteger(input.quantity) ||
    input.quantity < 1 ||
    input.quantity > 99
  ) {
    throw new Error("INVALID_RESERVATION_QUANTITY");
  }

  const expiresAt = new Date(
    Date.now() + RESERVATION_MINUTES * 60 * 1000,
  );

  // Atomic conditional decrement prevents two transactions
  // from reserving stock that is no longer available.
  const result = await tx.productVariant.updateMany({
    where: {
      id: input.productVariantId,
      status: "ACTIVE",
      stock: { gte: input.quantity },
      product: { status: "PUBLISHED" },
    },
    data: {
      stock: { decrement: input.quantity },
    },
  });

  if (result.count !== 1) {
    throw new Error("INSUFFICIENT_OR_UNAVAILABLE_STOCK");
  }

  return tx.inventoryReservation.create({
    data: {
      orderId: input.orderId,
      productVariantId: input.productVariantId,
      quantity: input.quantity,
      expiresAt,
    },
  });
}

/**
 * Releases every expired active reservation.
 *
 * Invoke this from a scheduled server-side job.
 */
export async function releaseExpiredReservations() {
  const expiredReservations = await prisma.inventoryReservation.findMany({
    where: {
      status: ReservationStatus.ACTIVE,
      expiresAt: { lte: new Date() },
    },
    select: { id: true },
    take: 100,
    orderBy: { expiresAt: "asc" },
  });

  let released = 0;

  for (const reservation of expiredReservations) {
    const didRelease = await prisma.$transaction(async (tx) => {
      const current = await tx.inventoryReservation.findUnique({
        where: { id: reservation.id },
      });

      if (
        !current ||
        current.status !== ReservationStatus.ACTIVE ||
        current.expiresAt > new Date()
      ) {
        return false;
      }

      return releaseReservation(tx, reservation.id, true);
    });

    if (didRelease) released++;
  }

  return { checked: expiredReservations.length, released };
}
