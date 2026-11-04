
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";

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
  }).format(date);
}

function humanizeStatus(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function CustomerOrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          productName: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div className="min-w-0">
              <div>
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  YOUR ACTIVITY
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Orders
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  View your orders and track their progress from one place.
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="mt-12 rounded-lg border border-border bg-card/40 p-10 text-center backdrop-blur md:p-16">
                  <p className="heading-font text-3xl uppercase md:text-4xl">
                    No Orders Yet
                  </p>

                  <p className="mx-auto mt-4 max-w-md body-font leading-relaxed text-muted-foreground">
                    You haven&apos;t placed any orders yet. Explore our
                    collection and find something worth bringing to life.
                  </p>

                  <Link
                    href="/products"
                    className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="mt-12 space-y-5">
                  {orders.map((order) => (
                    <section
                      key={order.id}
                      className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.2em] text-primary">
                            ORDER NUMBER
                          </p>

                          <h2 className="mt-2 break-words text-lg font-semibold">
                            {order.orderNumber}
                          </h2>

                          <p className="mt-2 text-sm text-muted-foreground">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <p className="text-xl font-semibold">
                          {formatPrice(order.total)}
                        </p>
                      </div>

                      <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                            Order Status
                          </p>
                          <p className="mt-2 text-sm">
                            {humanizeStatus(order.status)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                            Payment Status
                          </p>
                          <p className="mt-2 text-sm">
                            {humanizeStatus(order.paymentStatus)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-border pt-5">
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Items ({order.items.length})
                        </p>

                        {order.items.length > 0 ? (
                          <ul className="mt-3 space-y-2">
                            {order.items.map((item) => (
                              <li
                                key={item.id}
                                className="flex justify-between gap-4 text-sm"
                              >
                                <span className="min-w-0">
                                  {item.productName}
                                </span>
                                <span className="shrink-0 text-muted-foreground">
                                  × {item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-sm text-muted-foreground">
                            No items recorded.
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <Link
                          href={`/customer/orders/${order.id}`}
                          className="inline-flex rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
                        >
                          View Order Details →
                        </Link>
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}