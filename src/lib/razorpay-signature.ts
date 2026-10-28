import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  if (!/^[a-fA-F0-9]{64}$/.test(signature)) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest();

  const received = Buffer.from(signature, "hex");

  return timingSafeEqual(received, expected);
}
