"use client";

import Image from "next/image";
import { CartItem as CartItemType, useCartStore } from "@/src/store/cart-store";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const image = item.variant.images[0];
  const total = item.product.price * item.quantity;

  return (
    <div className="flex flex-col gap-6 border-b border-border py-6 last:border-b-0 sm:flex-row">
      {/* Image */}

      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
        <Image
          src={image}
          alt={item.product.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}

      <div className="flex flex-1 flex-col justify-between gap-5">
        <div>
          <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
            {item.product.category}
          </p>

          <h2 className="heading-font mt-2 text-2xl uppercase">
            {item.product.title}
          </h2>

          <div className="mt-3 space-y-1 body-font text-sm text-muted-foreground">
            <p>
              Color:{" "}
              <span className="text-foreground">
                {item.variant.color}
              </span>
            </p>

            {item.customText && (
              <p>
                Custom Text:{" "}
                <span className="text-foreground">
                  {item.customText}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quantity */}

          <div className="flex items-center gap-5 rounded-full border border-border px-5 py-2 body-font">
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              className="transition-colors hover:text-primary"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1)
              }
              className="transition-colors hover:text-primary"
            >
              +
            </button>
          </div>

          {/* Remove */}

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="body-font text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}

      <div className="shrink-0 sm:text-right">
        <p className="body-font text-lg font-semibold">
          ₹{total}
        </p>

        {item.quantity > 1 && (
          <p className="mt-1 body-font text-xs text-muted-foreground">
            ₹{item.product.price} each
          </p>
        )}
      </div>
    </div>
  );
}