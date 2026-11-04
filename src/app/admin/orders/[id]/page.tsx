import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import OrderStatusControl from "@/src/components/admin/orders/order-status-control";

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (admin?.role !== "ADMIN") redirect("/");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: true,
    },
  });

  if (!order) notFound();

  const money = (value: { toString(): string }) =>
    `₹${Number(value.toString()).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const shippingAddress = [
    order.shippingRecipientName,
    order.shippingRecipientPhone,
    order.shippingAddressLine1,
    order.shippingAddressLine2,
    order.shippingCity,
    order.shippingState,
    order.shippingPostalCode,
    order.shippingCountry,
  ].filter(Boolean);

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

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
                Order Number: {order.orderNumber}
              </p>

              <p className="mt-2 body-font text-sm text-muted-foreground">
                Order ID: {order.id}
              </p>

              <div className="mt-12 grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-8">
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      FULFILLMENT
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Order Status
                    </h2>

                    <p className="mt-3 text-sm text-muted-foreground">
                      Current status: {statusLabels[order.status] ?? order.status}
                    </p>

                    <OrderStatusControl
                      orderId={order.id}
                      initialStatus={order.status}
                    />
                  </section>

                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      ORDER ITEMS
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Products
                    </h2>

                    <div className="mt-8 space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-2xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.variantName}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-sm text-muted-foreground">
                              Unit: {money(item.unitPrice)}
                            </p>
                            <p className="mt-1 font-medium">
                              {money(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      DELIVERY
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Shipping Address
                    </h2>

                    <div className="mt-6 rounded-2xl border border-border p-6">
                      <p className="whitespace-pre-line body-font text-sm leading-relaxed">
                        {shippingAddress.join("\n")}
                      </p>
                    </div>
                  </section>
                </div>

                <aside className="space-y-8">
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      CUSTOMER
                    </p>

                    <div className="mt-6 space-y-4 body-font text-sm">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">
                          Name
                        </p>
                        <p className="mt-1">
                          {order.user.name || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase text-muted-foreground">
                          Email
                        </p>
                        <a
                          href={`mailto:${order.user.email}`}
                          className="mt-1 block break-all hover:text-primary"
                        >
                          {order.user.email || "Not provided"}
                        </a>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      PAYMENT
                    </p>

                    <div className="mt-6 space-y-4 body-font text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">
                          Payment Status
                        </span>
                        <span>{order.paymentStatus}</span>
                      </div>

                      <div>
                        <p className="text-muted-foreground">
                          Razorpay Payment ID
                        </p>
                        <p className="mt-1 break-all text-xs">
                          {order.razorpayPaymentId || "Not available"}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      ORDER TOTAL
                    </p>

                    <div className="mt-6 space-y-4 body-font text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{money(order.subtotal)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{money(order.shipping)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span>-{money(order.discount)}</span>
                      </div>

                      <div className="flex justify-between border-t border-border pt-4 font-medium">
                        <span>Total</span>
                        <span>{money(order.total)}</span>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}