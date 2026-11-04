import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

const statusLabels: Record<string, string> = {
  SUBMITTED: "Request Submitted",
  CONTACTED: "Under Review",
  DISCUSSING: "Consultation",
  WAITING_FOR_CUSTOMER: "Awaiting Customer",
  PRICE_FINALIZED: "Quote Created",
  PAYMENT_PENDING: "Payment Pending",
  PRINTING: "In Production",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

export default async function AdminRequestsPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (admin?.role !== "ADMIN") redirect("/");

  const requests = await prisma.printRequest.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                CUSTOM PRINT
              </p>

              <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                Requests
              </h1>

              <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                Review and manage customer custom print requests.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-border px-5 py-2 text-sm">
                  Total Requests: {requests.length}
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="mt-8 rounded-lg border border-border bg-card/40 p-10 text-center backdrop-blur md:p-16">
                  <p className="heading-font text-3xl uppercase md:text-4xl">
                    No Custom Requests
                  </p>

                  <p className="mx-auto mt-4 max-w-md body-font leading-relaxed text-muted-foreground">
                    Customer custom print requests will appear here once
                    they are submitted.
                  </p>

                  <Link
                    href="/admin"
                    className="mt-8 inline-flex rounded-full border border-border px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {requests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/admin/requests/${request.id}`}
                      className="block rounded-lg border border-border bg-card/40 p-6 transition-colors hover:border-primary md:p-8"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h2 className="heading-font text-2xl uppercase">
                            {request.title}
                          </h2>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {request.user.name || "Customer"} ·{" "}
                            {request.user.email}
                          </p>

                          <p className="mt-2 text-sm text-muted-foreground">
                            Quantity: {request.quantity}
                          </p>
                        </div>

                        <div className="md:text-right">
                          <span className="inline-flex rounded-full border border-primary/40 px-4 py-2 text-xs uppercase tracking-wider text-primary">
                            {statusLabels[request.status] ?? request.status}
                          </span>

                          <p className="mt-3 text-sm text-muted-foreground">
                            {new Intl.DateTimeFormat("en-IN", {
                              dateStyle: "medium",
                            }).format(request.createdAt)}
                          </p>

                          {request.quotedPrice !== null && (
                            <p className="mt-2 text-sm">
                              Quote: ₹
                              {Number(request.quotedPrice).toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
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