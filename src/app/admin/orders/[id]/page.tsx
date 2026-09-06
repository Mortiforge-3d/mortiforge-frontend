import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              {/* Header */}
              <div>
                <Link
                  href="/admin/orders"
                  className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  ← Back to Orders
                </Link>

                <p className="body-font mt-8 text-sm uppercase tracking-[0.35em] text-primary">
                  ORDER MANAGEMENT
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Order Details
                </h1>

                <p className="mt-4 body-font text-sm text-muted-foreground">
                  Order ID: {id}
                </p>
              </div>

              <div className="mt-12 grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
                {/* Main */}
                <div className="space-y-8">
                  {/* Order Status */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                          FULFILLMENT
                        </p>

                        <h2 className="heading-font mt-3 text-3xl uppercase">
                          Order Status
                        </h2>
                      </div>

                      <select
                        defaultValue="pending"
                        className="rounded-full border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      className="mt-6 rounded-full bg-primary px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Update Status
                    </button>
                  </section>

                  {/* Items */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      ORDER ITEMS
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Products
                    </h2>

                    <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
                      <p className="body-font text-sm text-muted-foreground">
                        Ordered products will appear here.
                      </p>
                    </div>
                  </section>

                  {/* Shipping */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      DELIVERY
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Shipping Address
                    </h2>

                    <div className="mt-6 rounded-2xl border border-dashed border-border p-8">
                      <p className="body-font text-sm text-muted-foreground">
                        Customer shipping information will appear here.
                      </p>
                    </div>
                  </section>
                </div>

                {/* Sidebar Information */}
                <div className="space-y-8">
                  {/* Customer */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      CUSTOMER
                    </p>

                    <div className="mt-6">
                      <p className="body-font text-sm text-muted-foreground">
                        Customer information will appear here.
                      </p>
                    </div>
                  </section>

                  {/* Payment */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      PAYMENT
                    </p>

                    <div className="mt-6 space-y-4 body-font text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Payment Status
                        </span>

                        <span>—</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Payment Method
                        </span>

                        <span>—</span>
                      </div>
                    </div>
                  </section>

                  {/* Total */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      ORDER TOTAL
                    </p>

                    <div className="mt-6 space-y-4 body-font text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Subtotal
                        </span>

                        <span>—</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Shipping
                        </span>

                        <span>—</span>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>—</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}