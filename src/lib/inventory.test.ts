import { describe, it, expect, vi } from "vitest";
import type { Prisma } from "@prisma/client";
import { consumeReservation } from "./inventory";

describe("consumeReservation", () => {
  it("returns true when an active, unexpired reservation is consumed", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });

    const tx = {
      inventoryReservation: {
        updateMany,
      },
    } as unknown as Prisma.TransactionClient;

    const result = await consumeReservation(tx, "reservation-test-1");

    expect(result).toBe(true);
    expect(updateMany).toHaveBeenCalledWith({
      where: {
        id: "reservation-test-1",
        status: "ACTIVE",
        expiresAt: { gt: expect.any(Date) },
      },
      data: {
        status: "CONSUMED",
      },
    });
  });

  it("returns false when the reservation was already consumed or expired", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 0 });

    const tx = {
      inventoryReservation: {
        updateMany,
      },
    } as unknown as Prisma.TransactionClient;

    const result = await consumeReservation(tx, "reservation-test-1");

    expect(result).toBe(false);
  });
});
