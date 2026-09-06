import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

export default function AdminRequestsPage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              {/* Header */}
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
                </div>
              </div>

              {/* Filters */}
              <div className="mt-10 flex flex-col gap-4 md:flex-row">
                <input
                  type="search"
                  placeholder="Search requests..."
                  className="w-full rounded-full border border-border bg-card/40 px-5 py-3 body-font text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary md:max-w-sm"
                />

                <select
                  defaultValue="all"
                  className="rounded-full border border-border bg-card/40 px-5 py-3 body-font text-sm outline-none focus:border-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Submitted</option>
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

              {/* Empty State */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-10 text-center backdrop-blur md:p-16">
                <p className="heading-font text-3xl uppercase md:text-4xl">
                  No Custom Requests
                </p>

                <p className="mx-auto mt-4 max-w-md body-font leading-relaxed text-muted-foreground">
                  Customer custom print requests will appear here once they
                  are submitted.
                </p>

                <Link
                  href="/admin"
                  className="mt-8 inline-flex rounded-full border border-border px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}