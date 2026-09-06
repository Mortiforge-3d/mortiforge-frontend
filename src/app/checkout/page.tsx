"use client";

import Link from "next/link";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CheckoutForm from "@/src/components/checkout/checkout-form";
import CheckoutSummary from "@/src/components/checkout/checkout-summary";
import EmptyCart from "@/src/components/cart/empty-cart";
import { useCartStore } from "@/src/store/cart-store";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <main>
        <Section className="pt-32 md:pt-36">
          <Container>
            <div className="max-w-3xl">
              <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                CHECKOUT
              </p>

              <h1 className="heading-font mt-4 text-5xl uppercase lg:text-7xl">
                Checkout
              </h1>
            </div>

            <div className="mt-16">
              <EmptyCart />
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Section className="pt-32 md:pt-36">
        <Container>
          {/* Header */}

          <div className="max-w-3xl">
            <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
              COMPLETE YOUR ORDER
            </p>

            <h1 className="heading-font mt-4 text-5xl uppercase lg:text-7xl">
              Checkout
            </h1>

            <p className="mt-6 body-font leading-relaxed text-muted-foreground">
              Enter your details and shipping information to continue
              with your order.
            </p>
          </div>

          {/* Checkout */}

          <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1.6fr_1fr]">
            {/* Form */}

            <div className="rounded-3xl border border-border bg-card/40 p-8 backdrop-blur md:p-10">
              <CheckoutForm />
            </div>

            {/* Summary */}

            <div className="lg:sticky lg:top-32">
              <CheckoutSummary />

              <Link
                href="/cart"
                className="
                  mt-4
                  block
                  text-center
                  body-font
                  text-sm
                  text-muted-foreground
                  transition-colors
                  hover:text-primary
                "
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}