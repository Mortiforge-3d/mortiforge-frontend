import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import AdminHeader from "@/src/components/admin/admin-header";
import AdminStats from "@/src/components/admin/admin-stats";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (admin?.role !== "ADMIN") redirect("/");

  const [revenue, orders, pendingOrders, customers, recentOrders, recentRequests] =
    await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.printRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

  const stats = {
    revenue: Number(revenue._sum.total ?? 0),
    orders,
    pendingOrders,
    customers,
  };

  return (
    <main>
      <Section>
        <Container>
          <AdminHeader />

          <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div className="space-y-8">
              <AdminStats {...stats} />

              <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      ORDER ACTIVITY
                    </p>
                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Recent Orders
                    </h2>
                  </div>

                  <Link
                    href="/admin/orders"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <p className="mt-8 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                    No orders yet.
                  </p>
                ) : (
                  <div className="mt-8 space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col gap-3 rounded-lg border border-border p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {order.user.name || order.user.email || "Customer"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {order.createdAt.toLocaleDateString("en-IN")}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="font-medium">
                            ₹{Number(order.total).toLocaleString("en-IN")}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {order.status} · {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      CUSTOM PRINT
                    </p>
                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Custom Requests
                    </h2>
                  </div>

                  <Link
                    href="/admin/requests"
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {recentRequests.length === 0 ? (
                  <p className="mt-8 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                    No custom requests yet.
                  </p>
                ) : (
                  <div className="mt-8 space-y-4">
                    {recentRequests.map((request) => (
                      <Link
                        key={request.id}
                        href={`/admin/requests/${request.id}`}
                        className="block rounded-lg border border-border p-5 transition-colors hover:border-primary"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {request.user.name || request.user.email || "Customer"}
                            </p>
                          </div>
                          <span className="text-xs uppercase text-primary">
                            {request.status.replaceAll("_", " ")}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}