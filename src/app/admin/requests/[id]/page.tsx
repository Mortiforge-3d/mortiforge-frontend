import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

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

export default async function AdminRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              {/* Header */}
              <div>
                <Link
                  href="/admin/requests"
                  className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  ← Back to Requests
                </Link>

                <p className="body-font mt-8 text-sm uppercase tracking-[0.35em] text-primary">
                  CUSTOM PRINT
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Request Details
                </h1>

                <p className="mt-4 body-font text-sm text-muted-foreground">
                  Request ID: {id}
                </p>
              </div>

              <div className="mt-12 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
                {/* Main Content */}
                <div className="space-y-8">
                  {/* Status */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                          PROJECT STATUS
                        </p>

                        <h2 className="heading-font mt-3 text-3xl uppercase">
                          Workflow
                        </h2>
                      </div>

                      <select
                        defaultValue="submitted"
                        className="rounded-full border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
                      >
                        <option value="submitted">Request Submitted</option>
                        <option value="review">Under Review</option>
                        <option value="consultation">Consultation</option>
                        <option value="quote">Quote Created</option>
                        <option value="approval">Awaiting Approval</option>
                        <option value="paid">Approved / Paid</option>
                        <option value="production">In Production</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      className="mt-6 rounded-full bg-primary px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Update Status
                    </button>

                    <div className="mt-10 space-y-5">
                      {statuses.map((status, index) => (
                        <div key={status} className="flex items-center gap-4">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                              index === 0
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>

                          <p
                            className={`body-font text-sm ${
                              index === 0
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {status}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Request Information */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      REQUEST INFORMATION
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Project Details
                    </h2>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Project Title
                        </p>
                        <p className="mt-2 body-font text-sm">—</p>
                      </div>

                      <div>
                        <p className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Project Type
                        </p>
                        <p className="mt-2 body-font text-sm">—</p>
                      </div>

                      <div>
                        <p className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Quantity
                        </p>
                        <p className="mt-2 body-font text-sm">—</p>
                      </div>

                      <div>
                        <p className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Submitted
                        </p>
                        <p className="mt-2 body-font text-sm">—</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        Description
                      </p>

                      <div className="mt-3 rounded-2xl border border-dashed border-border p-6">
                        <p className="body-font text-sm leading-relaxed text-muted-foreground">
                          Customer project description will appear here.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Consultation */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      CONSULTATION
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Project Notes
                    </h2>

                    <textarea
                      placeholder="Add private notes about the consultation..."
                      className="mt-6 min-h-32 w-full resize-y rounded-2xl border border-border bg-background px-5 py-4 body-font text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                    />

                    <button
                      type="button"
                      className="mt-4 rounded-full border border-border px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                    >
                      Save Notes
                    </button>
                  </section>

                  {/* Quote */}
                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      QUOTE
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      Personalized Quote
                    </h2>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="quoteAmount"
                          className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground"
                        >
                          Quote Amount
                        </label>

                        <input
                          id="quoteAmount"
                          type="number"
                          min="0"
                          placeholder="₹0"
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="quoteNote"
                          className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground"
                        >
                          Quote Note
                        </label>

                        <input
                          id="quoteNote"
                          type="text"
                          placeholder="Optional note"
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-6 rounded-full bg-primary px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Create Quote
                    </button>
                  </section>
                </div>

                {/* Customer */}
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
                        <p className="mt-1">—</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Email
                        </p>
                        <p className="mt-1">—</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Phone
                        </p>
                        <p className="mt-1">—</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      PROJECT FILES
                    </p>

                    <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center">
                      <p className="body-font text-sm text-muted-foreground">
                        Files exchanged during consultation will appear here.
                      </p>
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