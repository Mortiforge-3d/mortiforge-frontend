import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

const statuses = [
  "Request Submitted",
  "Under Review",
  "Consultation",
  "Quote Created",
  "Awaiting Approval",
  "Approved / Paid",
  "In Production",
  "Shipped",
  "Completed",
];

export default async function RequestDetailsPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  return (
    <main>
      <Section>
        <Container>
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div>
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
                Request ID: {requestId}
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Status Timeline */}
              <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                  PROJECT PROGRESS
                </p>

                <div className="mt-8 space-y-6">
                  {statuses.map((status, index) => {
                    const isFirst = index === 0;

                    return (
                      <div key={status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                              isFirst
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>

                          {index !== statuses.length - 1 && (
                            <div className="mt-2 h-8 w-px bg-border" />
                          )}
                        </div>

                        <div className="pt-2">
                          <p
                            className={`body-font text-sm ${
                              isFirst
                                ? "font-medium text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Request Information */}
              <div className="space-y-8">
                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    REQUEST DETAILS
                  </p>

                  <div className="mt-6 space-y-5 body-font text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Project
                      </p>

                      <p className="mt-1">—</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Type
                      </p>

                      <p className="mt-1">—</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Quantity
                      </p>

                      <p className="mt-1">—</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Submitted
                      </p>

                      <p className="mt-1">—</p>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    QUOTE
                  </p>

                  <div className="mt-6">
                    <p className="body-font text-sm text-muted-foreground">
                      Your personalized quote will appear here once the
                      request has been reviewed.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}