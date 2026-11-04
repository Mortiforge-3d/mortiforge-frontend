import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  upsert: vi.fn(),
  create: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  update: vi.fn(),
  consumeReservation: vi.fn(),
  findMany: vi.fn(),
  updateMany: vi.fn(),
  recordReconciliation: vi.fn(),
}));

vi.mock("../../../../../lib/prisma", () => ({
  prisma: {
    $transaction: mocks.transaction,
    razorpayWebhookEvent: {
      upsert: mocks.upsert,
      findUnique: mocks.findUnique,
    },
    order: {
      findFirst: mocks.findFirst,
    },
    inventoryReservation: {
      findMany: mocks.findMany,
},
  },
}));

vi.mock("../../../../../lib/inventory", () => ({
  consumeReservation: mocks.consumeReservation,
}));

vi.mock("../../../../../lib/payments/reconciliation", () => ({
  recordPaymentReconciliation: mocks.recordReconciliation,
}));

const tx = {
  razorpayWebhookEvent: {
    create: mocks.create,
    update: mocks.update,
  },
  order: {
    findFirst: mocks.findFirst,
    updateMany: mocks.updateMany,
  },
};

import { POST } from "./route";

const secret = "webhook_test_secret";

function makeRequest(rawBody: string, signature: string) {
  return new Request("http://localhost/api/payments/razorpay/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-razorpay-signature": signature,
      "x-razorpay-event-id": "evt_test_001",
    },
    body: rawBody,
  });
}

function sign(rawBody: string) {
  return createHmac("sha256", secret).update(rawBody).digest("hex");
}

describe("Razorpay webhook route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RAZORPAY_WEBHOOK_SECRET = secret;
    mocks.recordReconciliation.mockResolvedValue({});
    mocks.findMany.mockResolvedValue([]);
  });

  mocks.transaction.mockImplementation(async (callback) => callback(tx));
  it("rejects an invalid signature", async () => {
    const response = await POST(makeRequest('{"event":"payment.captured"}', "invalid"));

    expect(response.status).toBe(400);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects invalid JSON even when the signature is valid", async () => {
    const rawBody = "{invalid-json";
    const response = await POST(makeRequest(rawBody, sign(rawBody)));

    expect(response.status).toBe(400);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects a request missing the event type", async () => {
    const rawBody = JSON.stringify({ payload: {} });
    const response = await POST(makeRequest(rawBody, sign(rawBody)));

    expect(response.status).toBe(400);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

it("records a valid but unsupported event without processing an order", async () => {
  const rawBody = JSON.stringify({
    event: "payment.authorized",
    payload: {},
  });

  mocks.upsert.mockResolvedValue({});

  const response = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ received: true });
  expect(mocks.upsert).toHaveBeenCalledWith({
    where: { eventId: "evt_test_001" },
    create: {
      eventId: "evt_test_001",
      eventType: "payment.authorized",
      processed: true,
    },
    update: {},
  });
  expect(mocks.transaction).not.toHaveBeenCalled();
  expect(mocks.consumeReservation).not.toHaveBeenCalled();
});


it("acknowledges an already-processed duplicate event", async () => {
  const rawBody = JSON.stringify({
    event: "payment.authorized",
    payload: {},
  });

  mocks.upsert.mockResolvedValue({});

  const firstResponse = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  const secondResponse = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(firstResponse.status).toBe(200);
  expect(secondResponse.status).toBe(200);
  expect(await secondResponse.json()).toEqual({ received: true });

  expect(mocks.upsert).toHaveBeenCalledTimes(2);
  expect(mocks.transaction).not.toHaveBeenCalled();
  expect(mocks.consumeReservation).not.toHaveBeenCalled();
});

it("confirms an order after a valid captured payment", async () => {
  const rawBody = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_test_001",
          order_id: "order_test_001",
          amount: 49900,
          currency: "INR",
          status: "captured",
        },
      },
    },
  });

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [
      {
        id: "reservation_001",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 60_000),
      },
    ],
  });

  mocks.consumeReservation.mockResolvedValue(true);
  mocks.updateMany.mockResolvedValue({ count: 1 });

  const response = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ received: true });

  expect(mocks.transaction).toHaveBeenCalledOnce();
  expect(mocks.create).toHaveBeenCalledOnce();
  expect(mocks.consumeReservation).toHaveBeenCalledWith(
    tx,
    "reservation_001"
  );

  expect(mocks.updateMany).toHaveBeenCalledWith({
    where: {
      id: "local_order_001",
      paymentStatus: "PENDING",
      status: "PENDING",
    },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayPaymentId: "pay_test_001",
    },
  });

  expect(mocks.update).toHaveBeenCalledOnce();
  expect(mocks.recordReconciliation).not.toHaveBeenCalled();
});

it("records reconciliation when reservations have expired", async () => {
  const rawBody = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_expired_001",
          order_id: "order_test_001",
          amount: 49900,
          currency: "INR",
          status: "captured",
        },
      },
    },
  });

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [
      {
        id: "reservation_001",
        status: "EXPIRED",
        expiresAt: new Date(Date.now() - 60_000),
      },
    ],
  });

  mocks.findMany.mockResolvedValue([
    {
      status: "EXPIRED",
      expiresAt: new Date(Date.now() - 60_000),
    },
  ]);

  const response = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    received: true,
    reconciliationRequired: true,
  });

  expect(mocks.recordReconciliation).toHaveBeenCalledWith({
    orderId: "local_order_001",
    razorpayPaymentId: "pay_expired_001",
    reason: "RESERVATION_EXPIRED",
  });

  expect(mocks.consumeReservation).not.toHaveBeenCalled();
  expect(mocks.updateMany).not.toHaveBeenCalled();
  expect(mocks.upsert).toHaveBeenCalledOnce();
});

it("records reconciliation when reservation consumption fails", async () => {
  const rawBody = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_consume_fail_001",
          order_id: "order_test_001",
          amount: 49900,
          currency: "INR",
          status: "captured",
        },
      },
    },
  });

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [
      {
        id: "reservation_001",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 60_000),
      },
    ],
  });

  mocks.consumeReservation.mockResolvedValue(false);

  const response = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    received: true,
    reconciliationRequired: true,
  });

  expect(mocks.recordReconciliation).toHaveBeenCalledWith({
    orderId: "local_order_001",
    razorpayPaymentId: "pay_consume_fail_001",
    reason: "RESERVATION_CONSUMPTION_FAILED",
  });

  expect(mocks.consumeReservation).toHaveBeenCalledOnce();
  expect(mocks.updateMany).not.toHaveBeenCalled();
  expect(mocks.upsert).toHaveBeenCalledOnce();
});

it("acknowledges duplicate payment events without processing twice", async () => {
  const rawBody = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_duplicate_001",
          order_id: "order_test_001",
          amount: 49900,
          currency: "INR",
          status: "captured",
        },
      },
    },
  });

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [
      {
        id: "reservation_001",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 60_000),
      },
    ],
  });

  mocks.consumeReservation.mockResolvedValue(true);
  mocks.updateMany.mockResolvedValue({ count: 1 });

  const firstResponse = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(firstResponse.status).toBe(200);

  // Simulate Prisma's unique-constraint error on the duplicate event.
  const duplicateError = new Prisma.PrismaClientKnownRequestError(
  "Unique constraint failed",
  {
    code: "P2002",
    clientVersion: "6.19.3",
  }
);

  mocks.transaction.mockRejectedValueOnce(duplicateError);
  mocks.findUnique.mockResolvedValue({ processed: true });

  const secondResponse = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(secondResponse.status).toBe(200);
  expect(await secondResponse.json()).toEqual({ received: true });

  expect(mocks.transaction).toHaveBeenCalledTimes(2);
  expect(mocks.consumeReservation).toHaveBeenCalledOnce();
  expect(mocks.updateMany).toHaveBeenCalledOnce();
  expect(mocks.findUnique).toHaveBeenCalledWith({
    where: { eventId: "evt_test_001" },
    select: { processed: true },
  });
});

it("returns 500 when reconciliation persistence fails", async () => {
  const rawBody = JSON.stringify({
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_reconcile_fail_001",
          order_id: "order_test_001",
          amount: 49900,
          currency: "INR",
          status: "captured",
        },
      },
    },
  });

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [],
  });

  mocks.findMany.mockResolvedValue([]);
  mocks.recordReconciliation.mockRejectedValue(
    new Error("Database unavailable")
  );

  const response = await POST(
    makeRequest(rawBody, sign(rawBody))
  );

  expect(response.status).toBe(500);
  expect(await response.json()).toEqual({
    error: "Payment reconciliation recording failed.",
  });

  expect(mocks.recordReconciliation).toHaveBeenCalledWith({
    orderId: "local_order_001",
    razorpayPaymentId: "pay_reconcile_fail_001",
    reason: "RESERVATION_MISSING",
  });

  expect(mocks.upsert).not.toHaveBeenCalled();
});
});
