import Link from "next/link";
import { auth } from "../../../../../auth";
import { prisma } from "@/src/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

const statuses = [
  { key: "SUBMITTED", label: "Request Submitted" },
  { key: "CONTACTED", label: "Under Review" },
  { key: "DISCUSSING", label: "Consultation" },
  { key: "WAITING_FOR_CUSTOMER", label: "Awaiting Approval" },
  { key: "PRICE_FINALIZED", label: "Quote Created" },
  { key: "PAYMENT_PENDING", label: "Payment Pending" },
  { key: "PRINTING", label: "In Production" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CLOSED", label: "Closed" },
];

export default async function RequestDetailsPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const { requestId } = await params;

  const request = await prisma.printRequest.findFirst({
    where: {
      id: requestId,
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      projectType: true,
      quantity: true,
      description: true,
      status: true,
      quotedPrice: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!request) notFound();

  const currentIndex = statuses.findIndex(
    (status) => status.key === request.status,
  );

  const isClosed = request.status === "CLOSED";

  return (
    <main>
      <Section>
        <Container>
          <div className="mx-auto max-w-5xl">
            <Link
              href="/customer/requests"
              className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              ← Back to Requests
            </Link>

            <p className="body-font mt-8 text-sm uppercase tracking-[0.35em] text-primary">
              CUSTOM PRINT REQUEST
            </p>

            <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
              Project Tracking
            </h1>

            <p className="mt-4 body-font text-sm text-muted-foreground">
              Request ID: {request.id}
            </p>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                  PROJECT PROGRESS
                </p>

                <div className="mt-8 space-y-6">
                  {statuses.map((status, index) => {
                    const isCompleted =
                      currentIndex >= 0 &&
                      index <= currentIndex &&
                      !isClosed;

                    return (
                      <div key={status.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                              isCompleted
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? "✓" : index + 1}
                          </div>

                          {index !== statuses.length - 1 && (
                            <div className="mt-2 h-8 w-px bg-border" />
                          )}
                        </div>

                        <div className="pt-2">
                          <p
                            className={`body-font text-sm ${
                              status.key === request.status
                                ? "font-medium text-primary"
                                : isCompleted
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {status.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isClosed && (
                  <p className="mt-6 text-sm text-muted-foreground">
                    This request has been closed.
                  </p>
                )}
              </section>

              <div className="space-y-8">
                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    REQUEST DETAILS
                  </p>

                  <div className="mt-6 space-y-5 body-font text-sm">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Project
                      </p>
                      <p className="mt-1">{request.title}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Type
                      </p>
                      <p className="mt-1">
                        {String(request.projectType ?? "Unknown")
                          .replace(/-/g, " ")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Quantity
                      </p>
                      <p className="mt-1">{request.quantity}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Submitted
                      </p>
                      <p className="mt-1">
                        {request.createdAt.toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-muted-foreground">
                        Description
                      </p>
                      <p className="mt-2 leading-relaxed text-muted-foreground">
                        {request.description}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    QUOTE
                  </p>

                  {request.quotedPrice !== null ? (
                    <div className="mt-6">
                      <p className="text-xs uppercase text-muted-foreground">
                        Personalized Quote
                      </p>
                      <p className="mt-2 heading-font text-3xl">
                        ₹{Number(request.quotedPrice).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-6 body-font text-sm text-muted-foreground">
                      Your personalized quote will appear here once your
                      request has been reviewed.
                    </p>
                  )}
                </section>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}