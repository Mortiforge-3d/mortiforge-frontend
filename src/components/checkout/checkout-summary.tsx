
"use client";

import Image from "next/image";
import { useCartStore } from "@/src/store/cart-store";

export default function CheckoutSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="rounded-3xl border border-border bg-card/40 p-8 backdrop-blur">
      <h2 className="heading-font text-3xl uppercase">Order Summary</h2>

      <div className="mt-8 space-y-6">
        {items.map((item) => {
          const product = item.variant.product;
          const image = product.images[0];

          return (
            <div
              key={item.id}
              className="flex gap-4 border-b border-border pb-6"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
                {image ? (
                  <Image
                    src={image.imageUrl}
                    alt={image.altText || product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="heading-font text-xl uppercase">
                  {product.name}
                </h3>

                <div className="mt-1 body-font text-xs text-muted-foreground">
                  <p>Color: {item.variant.color}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>

              <p className="shrink-0 body-font text-sm font-semibold">
                ₹{item.lineTotal.toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4 body-font">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>
            {shipping === 0
              ? "Calculated at checkout"
              : `₹${shipping}`}
          </span>
        </div>

        <div className="border-t border-border pt-5">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}