import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const paymentLabels: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (admin?.role !== "ADMIN") redirect("/");

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const selectedStatus = orderStatuses.includes(
    params.status as (typeof orderStatuses)[number],
  )
    ? params.status
    : "";

  const orders = await prisma.order.findMany({
    where: {
      ...(selectedStatus ? { status: selectedStatus as (typeof orderStatuses)[number] } : {}),
      ...(query
        ? {
            OR: [
              { orderNumber: { contains: query, mode: "insensitive" } },
              {
                user: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
              {
                user: {
                  email: { contains: query, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const money = (value: { toString(): string }) =>
    `₹${Number(value.toString()).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              <div className="mb-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  Admin / Orders
                </p>
                <h1 className="heading-font mt-3 text-4xl">Orders</h1>
                <p className="mt-2 body-font text-sm text-muted-foreground">
                  Manage customer orders and fulfillment.
                </p>
              </div>

              <form
                method="GET"
                className="mb-8 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search order number, customer or email..."
                  className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
                />

                <select
                  name="status"
                  defaultValue={selectedStatus}
                  className="rounded-full border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
                >
                  <option value="">All statuses</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="rounded-full bg-primary px-7 py-3 body-font text-xs font-medium uppercase tracking-widest text-primary-foreground"
                >
                  Search
                </button>
              </form>

              <p className="mb-4 body-font text-sm text-muted-foreground">
                {orders.length} order{orders.length === 1 ? "" : "s"} found
                {orders.length === 100 ? " (showing latest 100)" : ""}
              </p>

              {orders.length === 0 ? (
                <div className="rounded-2xl border border-border p-10 text-center">
                  <h2 className="heading-font text-2xl">No orders found</h2>
                  <p className="mt-2 body-font text-sm text-muted-foreground">
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full min-w-[750px] text-left">
                    <thead className="border-b border-border bg-muted/30">
                      <tr className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-4">Order</th>
                        <th className="px-5 py-4">Customer</th>
                        <th className="px-5 py-4">Total</th>
                        <th className="px-5 py-4">Payment</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-5 py-4 body-font text-sm font-medium">
                            {order.orderNumber}
                          </td>

                          <td className="px-5 py-4">
                            <p className="body-font text-sm">
                              {order.user.name || "Customer"}
                            </p>
                            <p className="body-font text-xs text-muted-foreground">
                              {order.user.email}
                            </p>
                          </td>

                          <td className="px-5 py-4 body-font text-sm">
                            {money(order.total)}
                          </td>

                          <td className="px-5 py-4 body-font text-xs">
                            {paymentLabels[order.paymentStatus]}
                          </td>

                          <td className="px-5 py-4 body-font text-xs">
                            {order.status.replaceAll("_", " ")}
                          </td>

                          <td className="px-5 py-4 body-font text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="body-font text-xs font-medium text-primary hover:underline"
                            >
                              View order →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}