
"use client";

import { useEffect } from "react";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CartItem from "@/src/components/cart/cart-item";
import CartSummary from "@/src/components/cart/cart-summary";
import EmptyCart from "@/src/components/cart/empty-cart";
import { useCartStore } from "@/src/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  return (
    <main>
      <Section className="pt-32 md:pt-36">
        <Container>
          {/* Header */}
          <div className="max-w-3xl">
            <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
              YOUR SELECTION
            </p>

            <h1 className="heading-font mt-4 text-5xl uppercase lg:text-7xl">
              Shopping Cart
            </h1>

            <p className="mt-6 body-font leading-relaxed text-muted-foreground">
              Review your selected prints before moving to checkout.
            </p>
          </div>

          {/* Cart */}
          <div className="mt-16">
            {isLoading ? (
              <div
                className="rounded-3xl border border-border bg-card/40 px-6 py-16 text-center backdrop-blur"
                role="status"
              >
                <p className="text-lg font-medium">Loading your cart...</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Retrieving your selected prints.
                </p>
              </div>
            ) : error ? (
              <div
                className="rounded-3xl border border-border bg-card/40 px-6 py-12 text-center backdrop-blur"
                role="alert"
              >
                <p className="text-lg font-medium">
                  We couldn&apos;t load your cart.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadCart()}
                  className="mt-6 rounded-full border border-primary px-6 py-3 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Try Again
                </button>
              </div>
            ) : items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid items-start gap-12 lg:grid-cols-[2fr_1fr]">
                {/* Items */}
                <div className="rounded-3xl border border-border bg-card/40 px-6 backdrop-blur md:px-8">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Summary */}
                <div className="lg:sticky lg:top-32">
                  <CartSummary />
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}