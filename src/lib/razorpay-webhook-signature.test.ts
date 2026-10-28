
import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyRazorpayWebhookSignature } from "./razorpay-webhook-signature";

const secret = "webhook_test_secret";
const rawBody = JSON.stringify({
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_test123",
        status: "captured",
      },
    },
  },
});

function makeSignature(body: string, signingSecret: string = secret) {
  return createHmac("sha256", signingSecret)
    .update(body)
    .digest("hex");
}

describe("verifyRazorpayWebhookSignature", () => {
  it("accepts a valid raw-body signature", () => {
    expect(
      verifyRazorpayWebhookSignature(
        rawBody,
        makeSignature(rawBody),
        secret
      )
    ).toBe(true);
  });

  it("rejects a signature for a different body", () => {
    expect(
      verifyRazorpayWebhookSignature(
        rawBody,
        makeSignature('{"event":"different"}'),
        secret
      )
    ).toBe(false);
  });

  it("rejects a signature generated with the wrong secret", () => {
    expect(
      verifyRazorpayWebhookSignature(
        rawBody,
        makeSignature(rawBody, "wrong_secret"),
        secret
      )
    ).toBe(false);
  });

  it("rejects malformed signatures", () => {
    expect(
      verifyRazorpayWebhookSignature(rawBody, "not-a-signature", secret)
    ).toBe(false);
  });

  it("rejects signatures with the wrong length", () => {
    expect(
      verifyRazorpayWebhookSignature(rawBody, "abcd", secret)
    ).toBe(false);
  });
});
