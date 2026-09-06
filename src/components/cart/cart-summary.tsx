"use client";

import Link from "next/link";
import { useCartStore } from "@/src/store/cart-store";

export default function CartSummary() {
  const subtotal = useCartStore((state) => state.getSubtotal());

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="rounded-3xl border border-border bg-card/40 p-8 backdrop-blur">
      <h2 className="heading-font text-3xl uppercase">
        Order Summary
      </h2>

      <div className="mt-8 space-y-4 body-font">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "Calculated at checkout" : `₹${shipping}`}
          </span>
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">₹{total}</span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="
          mt-8
          block
          w-full
          rounded-full
          bg-primary
          px-8
          py-4
          text-center
          body-font
          font-semibold
          text-primary-foreground
          transition-all
          hover:scale-[1.02]
        "
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/shop"
        className="
          mt-4
          block
          w-full
          rounded-full
          border
          border-border
          px-8
          py-4
          text-center
          body-font
          transition-colors
          hover:border-primary
          hover:text-primary
        "
      >
        Continue Shopping
      </Link>
    </div>
  );
}