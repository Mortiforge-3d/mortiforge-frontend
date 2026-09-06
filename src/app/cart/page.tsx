"use client";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CartItem from "@/src/components/cart/cart-item";
import CartSummary from "@/src/components/cart/cart-summary";
import EmptyCart from "@/src/components/cart/empty-cart";
import { useCartStore } from "@/src/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

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
            {items.length === 0 ? (
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