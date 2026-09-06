import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

export default function AdminPaymentsPage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              {/* Header */}
              <div>
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  PAYMENT MANAGEMENT
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Payments
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  View and manage payment transactions, statuses, and refunds.
                </p>
              </div>

              {/* Filters */}
              <div className="mt-10 flex flex-col gap-4 md:flex-row">
                <input
                  type="search"
                  placeholder="Search payments..."
                  className="w-full rounded-full border border-border bg-card/40 px-5 py-3 body-font text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary md:max-w-sm"
                />

                <select
                  defaultValue="all"
                  className="rounded-full border border-border bg-card/40 px-5 py-3 body-font text-sm outline-none transition-colors focus:border-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Empty State */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-10 text-center backdrop-blur md:p-16">
                <p className="heading-font text-3xl uppercase md:text-4xl">
                  No Payments Yet
                </p>

                <p className="mx-auto mt-4 max-w-md body-font leading-relaxed text-muted-foreground">
                  Payment transactions will appear here once customers start
                  placing orders.
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