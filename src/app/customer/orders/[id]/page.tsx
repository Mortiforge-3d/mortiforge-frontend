import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";

const statuses = [
  "Order Placed",
  "Payment Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div>
              {/* Header */}
              <div>
                <Link
                  href="/customer/orders"
                  className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  ← Back to Orders
                </Link>

                <p className="body-font mt-8 text-sm uppercase tracking-[0.35em] text-primary">
                  ORDER DETAILS
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Order
                </h1>

                <p className="mt-4 body-font text-sm text-muted-foreground">
                  Order ID: {id}
                </p>
              </div>

              <div className="mt-12 space-y-8">
                {/* Status */}
                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    ORDER STATUS
                  </p>

                  <div className="mt-8 space-y-6">
                    {statuses.map((status, index) => (
                      <div
                        key={status}
                        className="flex items-center gap-4"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                            index === 0
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <p
                          className={`body-font text-sm ${
                            index === 0
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Items */}
                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    ORDER ITEMS
                  </p>

                  <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
                    <p className="body-font text-sm text-muted-foreground">
                      Order items will appear here.
                    </p>
                  </div>
                </section>

                {/* Shipping */}
                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    SHIPPING ADDRESS
                  </p>

                  <div className="mt-6 rounded-2xl border border-dashed border-border p-8">
                    <p className="body-font text-sm text-muted-foreground">
                      Shipping information will appear here.
                    </p>
                  </div>
                </section>

                {/* Payment */}
                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    PAYMENT SUMMARY
                  </p>

                  <div className="mt-6 space-y-4 body-font text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>—</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>—</span>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">—</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}