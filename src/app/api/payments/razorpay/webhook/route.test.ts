
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
  },
}));

vi.mock("../../../../../lib/inventory", () => ({
  consumeReservation: mocks.consumeReservation,
}));

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
  });

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

});
