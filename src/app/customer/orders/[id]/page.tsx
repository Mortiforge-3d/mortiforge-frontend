
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";

const statusSteps = [
  { value: "PENDING", label: "Order Placed" },
  { value: "CONFIRMED", label: "Order Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
] as const;

function formatPrice(value: { toString(): string }) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value.toString()));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function humanizeStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      subtotal: true,
      shipping: true,
      discount: true,
      total: true,
      shippingRecipientName: true,
      shippingRecipientPhone: true,
      shippingAddressLine1: true,
      shippingAddressLine2: true,
      shippingCity: true,
      shippingState: true,
      shippingPostalCode: true,
      shippingCountry: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          productName: true,
          variantName: true,
          sku: true,
          unitPrice: true,
          quantity: true,
          subtotal: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const currentStep =
    order.status === "CANCELLED"
      ? -1
      : statusSteps.findIndex((step) => step.value === order.status);

  const paymentLabel = humanizeStatus(order.paymentStatus);

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div className="min-w-0">
              <Link
                href="/customer/orders"
                className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                ← Back to Orders
              </Link>

              <p className="body-font mt-8 text-sm uppercase tracking-[0.35em] text-primary">
                ORDER DETAILS
              </p>

              <h1 className="heading-font mt-4 break-words text-4xl uppercase md:text-6xl">
                {order.orderNumber}
              </h1>

              <p className="mt-4 body-font text-sm text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-border px-4 py-2 text-sm">
                  Order: {humanizeStatus(order.status)}
                </span>
                <span className="rounded-full border border-border px-4 py-2 text-sm">
                  Payment: {paymentLabel}
                </span>
              </div>

              {order.paymentStatus === "PENDING" && (
                <p className="mt-5 rounded-lg border border-amber-500/40 p-4 text-sm">
                  Your payment is still pending. If you have already paid,
                  allow a moment for confirmation before trying again.
                </p>
              )}

              {order.paymentStatus === "FAILED" && (
                <p className="mt-5 rounded-lg border border-destructive/40 p-4 text-sm">
                  Payment failed. Please contact support before placing
                  another order if money was deducted.
                </p>
              )}

              <div className="mt-12 space-y-8">
                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    ORDER PROGRESS
                  </p>

                  {order.status === "CANCELLED" ? (
                    <p className="mt-6 text-sm text-destructive">
                      This order has been cancelled.
                    </p>
                  ) : (
                    <div className="mt-8 space-y-6">
                      {statusSteps.map((step, index) => {
                        const isComplete =
                          currentStep >= 0 && index <= currentStep;

                        return (
                          <div
                            key={step.value}
                            className="flex items-center gap-4"
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                                isComplete
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-muted-foreground"
                              }`}
                            >
                              {isComplete ? "✓" : index + 1}
                            </div>

                            <p
                              className={`body-font text-sm ${
                                isComplete
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    ORDER ITEMS ({order.items.length})
                  </p>

                  <div className="mt-8 divide-y divide-border">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-medium">{item.productName}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Variant: {item.variantName}
                          </p>
                          {item.sku && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              SKU: {item.sku}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatPrice(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>

                        <p className="font-medium sm:text-right">
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    ))}

                    {order.items.length === 0 && (
                      <p className="py-5 text-sm text-muted-foreground">
                        No items are recorded for this order.
                      </p>
                    )}
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    SHIPPING ADDRESS
                  </p>

                  <div className="mt-6 space-y-1 text-sm">
                    <p className="font-medium">
                      {order.shippingRecipientName}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingRecipientPhone}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingAddressLine1}
                    </p>
                    {order.shippingAddressLine2 && (
                      <p className="text-muted-foreground">
                        {order.shippingAddressLine2}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {order.shippingCity}, {order.shippingState}{" "}
                      {order.shippingPostalCode}
                    </p>
                    <p className="text-muted-foreground">
                      {order.shippingCountry}
                    </p>
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    PAYMENT SUMMARY
                  </p>

                  <div className="mt-6 space-y-4 body-font text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatPrice(order.shipping)}</span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Discount</span>
                      <span>−{formatPrice(order.discount)}</span>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between gap-4">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Payment status
                      </span>
                      <span>{paymentLabel}</span>
                    </div>
                  </div>
                </section>

                <Link
                  href="/customer/orders"
                  className="inline-flex rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
