import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import PrintRequestControls from "@/src/components/admin/requests/print-request-controls";

const statusLabels = {
  SUBMITTED: "Request Submitted",
  CONTACTED: "Under Review",
  DISCUSSING: "Consultation",
  WAITING_FOR_CUSTOMER: "Awaiting Customer",
  PRICE_FINALIZED: "Quote Created",
  PAYMENT_PENDING: "Payment Pending",
  PRINTING: "In Production",
  COMPLETED: "Completed",
  CLOSED: "Closed",
} as const;

export default async function AdminRequestDetailsPage({
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

  const request = await prisma.printRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!request) notFound();

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(request.createdAt);

  const projectTypes: Record<string, string> = {
    prototype: "Prototype",
    miniature: "Miniature",
    decor: "Decor",
    "functional-part": "Functional Part",
    "replacement-part": "Replacement Part",
    cosplay: "Cosplay",
    other: "Other",
  };

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              <Link
                href="/admin/requests"
                className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                ← Back to Requests
              </Link>

              <div className="mt-8">
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  CUSTOM PRINT
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Request Details
                </h1>

                <p className="mt-4 body-font text-sm text-muted-foreground">
                  Request ID: {request.id}
                </p>
              </div>

              <div className="mt-12 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-8">
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      PROJECT STATUS
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Workflow
                    </h2>

                    <p className="mt-3 text-sm text-muted-foreground">
                      Current status: {statusLabels[request.status]}
                    </p>

                    <div className="mt-6">
                      <PrintRequestControls
                        requestId={request.id}
                        initialStatus={request.status}
                        initialNotes={request.adminNotes ?? ""}
                        initialQuote={request.quotedPrice?.toString() ?? ""}
                      />
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      REQUEST INFORMATION
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Project Details
                    </h2>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Project Title
                        </p>
                        <p className="mt-2 body-font text-sm">
                          {request.title}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Project Type
                        </p>
                        <p className="mt-2 body-font text-sm">
                          {projectTypes[request.projectType] ??
                            request.projectType}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Quantity
                        </p>
                        <p className="mt-2 body-font text-sm">
                          {request.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Submitted
                        </p>
                        <p className="mt-2 body-font text-sm">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Description
                      </p>

                      <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-dashed border-border p-6">
                        <p className="body-font text-sm leading-relaxed">
                          {request.description}
                        </p>
                      </div>
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
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Name
                        </p>
                        <p className="mt-1">
                          {request.user.name || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Email
                        </p>
                        <a
                          href={`mailto:${request.user.email}`}
                          className="mt-1 inline-block break-all hover:text-primary"
                        >
                          {request.user.email}
                        </a>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      QUOTE
                    </p>

                    <p className="heading-font mt-3 text-3xl">
                      {request.quotedPrice !== null
                        ? `₹${Number(request.quotedPrice).toLocaleString("en-IN")}`
                        : "Not quoted"}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {request.adminNotes
                        ? "Private admin notes are saved."
                        : "No private notes added yet."}
                    </p>
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