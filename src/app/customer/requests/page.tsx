import Link from "next/link";
import { auth } from "../../../../auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";

const statusLabels: Record<string, string> = {
  SUBMITTED: "Request Submitted",
  CONTACTED: "Under Review",
  DISCUSSING: "Consultation",
  WAITING_FOR_CUSTOMER: "Awaiting Approval",
  PRICE_FINALIZED: "Quote Created",
  PAYMENT_PENDING: "Payment Pending",
  PRINTING: "In Production",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

export default async function CustomerRequestsPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const requests = await prisma.printRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      projectType: true,
      quantity: true,
      status: true,
      quotedPrice: true,
      createdAt: true,
    },
  });

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div>
              <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                CUSTOM PRINT
              </p>

              <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                My Requests
              </h1>

              <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                Track your custom print requests, quotes, and project progress.
              </p>

              {requests.length === 0 ? (
                <div className="mt-12 rounded-lg border border-border bg-card/40 p-10 text-center backdrop-blur md:p-16">
                  <p className="heading-font text-3xl uppercase md:text-4xl">
                    No Custom Requests
                  </p>

                  <p className="mx-auto mt-4 max-w-md body-font leading-relaxed text-muted-foreground">
                    You haven&apos;t submitted a custom print request yet.
                  </p>

                  <Link
                    href="/custom-print"
                    className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Start a Custom Print
                  </Link>
                </div>
              ) : (
                <div className="mt-12 space-y-4">
                  {requests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/customer/requests/${request.id}`}
                      className="block rounded-lg border border-border bg-card/40 p-6 transition-colors hover:border-primary"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <h2 className="heading-font text-2xl uppercase">
                            {request.title}
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {String(request.projectType).replace(/-/g, " ")} · Quantity: {request.quantity}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Submitted: {request.createdAt.toLocaleDateString("en-IN")}
                          </p>
                        </div>

                        <div className="text-sm">
                          <p className="text-primary">
                            {statusLabels[request.status] ?? request.status}
                          </p>
                          {request.quotedPrice !== null && (
                            <p className="mt-2">
                              Quote: ₹{Number(request.quotedPrice).toFixed(2)}
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