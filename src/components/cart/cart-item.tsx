
"use client";

import Image from "next/image";
import type { ApiCartItem } from "@/src/types/cart";
import { useCartStore } from "@/src/store/cart-store";

interface CartItemProps {
  item: ApiCartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const product = item.variant.product;
  const image = product.images[0];
  const price = item.variant.price;

  return (
    <div className="flex flex-col gap-6 border-b border-border py-6 last:border-b-0 sm:flex-row">
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-border bg-card">
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.altText || product.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5">
        <div>
          <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
            {item.variant.color}
          </p>

          <h2 className="heading-font mt-2 text-2xl uppercase">
            {product.name}
          </h2>

          <p className="mt-2 body-font text-sm text-muted-foreground">
            ₹{price.toLocaleString("en-IN")} each
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5 rounded-full border border-border px-5 py-2 body-font">
            <button
              type="button"
              aria-label={`Decrease quantity of ${product.name}`}
              disabled={item.quantity <= 1}
              onClick={() => void updateQuantity(item.id, item.quantity - 1)}
              className="transition-colors hover:text-primary disabled:opacity-40"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              type="button"
              aria-label={`Increase quantity of ${product.name}`}
              disabled={item.quantity >= Math.min(item.variant.stock, 99)}
              onClick={() => void updateQuantity(item.id, item.quantity + 1)}
              className="transition-colors hover:text-primary disabled:opacity-40"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => void removeItem(item.id)}
            className="body-font text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="shrink-0 sm:text-right">
        <p className="body-font text-lg font-semibold">
          ₹{item.lineTotal.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}