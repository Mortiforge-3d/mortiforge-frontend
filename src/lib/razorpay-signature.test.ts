
import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyRazorpaySignature } from "./razorpay-signature";

const secret = "test_secret_for_unit_tests";
const orderId = "order_test123";
const paymentId = "pay_test123";

function makeSignature() {
  return createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

describe("verifyRazorpaySignature", () => {
  it("accepts a valid signature", () => {
    const signature = makeSignature();

    expect(
      verifyRazorpaySignature(orderId, paymentId, signature, secret)
    ).toBe(true);
  });

  it("rejects an incorrect signature", () => {
    const signature = "a".repeat(64);

    expect(
      verifyRazorpaySignature(orderId, paymentId, signature, secret)
    ).toBe(false);
  });

  it("rejects a malformed hexadecimal signature", () => {
    expect(
      verifyRazorpaySignature(orderId, paymentId, "not-a-signature", secret)
    ).toBe(false);
  });

  it("rejects a signature with the wrong length", () => {
    expect(
      verifyRazorpaySignature(orderId, paymentId, "abcd", secret)
    ).toBe(false);
  });

  it("rejects a signature generated with a different secret", () => {
    const signature = makeSignature();

    expect(
      verifyRazorpaySignature(orderId, paymentId, signature, "wrong_secret")
    ).toBe(false);
  });
});
