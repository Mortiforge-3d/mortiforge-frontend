import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

export default function AdminCustomerDetailsPage() {
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
                  href="/admin/customers"
                  className="body-font text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                >
                  ← Back to Customers
                </Link>

                <p className="body-font mt-8 text-sm uppercase tracking-[0.35em] text-primary">
                  CUSTOMER DETAILS
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Customer
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  View customer information, orders, requests, and account
                  activity.
                </p>
              </div>

              {/* Customer Information */}
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                  <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                    CUSTOMER INFORMATION
                  </p>

                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Name
                      </p>
                      <p className="body-font mt-1">Customer Name</p>
                    </div>

                    <div>
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Email
                      </p>
                      <p className="body-font mt-1">customer@example.com</p>
                    </div>

                    <div>
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Phone
                      </p>
                      <p className="body-font mt-1">+91 00000 00000</p>
                    </div>

                    <div>
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Customer Since
                      </p>
                      <p className="body-font mt-1">—</p>
                    </div>
                  </div>
                </div>

                {/* Account Summary */}
                <div className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
                  <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                    ACCOUNT SUMMARY
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-5">
                    <div className="rounded-2xl border border-border p-5">
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Orders
                      </p>
                      <p className="heading-font mt-2 text-3xl">0</p>
                    </div>

                    <div className="rounded-2xl border border-border p-5">
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Requests
                      </p>
                      <p className="heading-font mt-2 text-3xl">0</p>
                    </div>

                    <div className="rounded-2xl border border-border p-5">
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Total Spent
                      </p>
                      <p className="heading-font mt-2 text-3xl">₹0</p>
                    </div>

                    <div className="rounded-2xl border border-border p-5">
                      <p className="body-font text-xs uppercase tracking-wider text-muted-foreground">
                        Reviews
                      </p>
                      <p className="heading-font mt-2 text-3xl">0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  ORDER HISTORY
                </p>

                <div className="mt-8 rounded-2xl border border-border p-8 text-center">
                  <p className="heading-font text-3xl uppercase">
                    No Orders Yet
                  </p>

                  <p className="mx-auto mt-3 max-w-md body-font text-sm leading-relaxed text-muted-foreground">
                    Orders placed by this customer will appear here.
                  </p>
                </div>
              </div>

              {/* Custom Requests */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  CUSTOM REQUESTS
                </p>

                <div className="mt-8 rounded-2xl border border-border p-8 text-center">
                  <p className="heading-font text-3xl uppercase">
                    No Requests Yet
                  </p>

                  <p className="mx-auto mt-3 max-w-md body-font text-sm leading-relaxed text-muted-foreground">
                    Custom print requests submitted by this customer will
                    appear here.
                  </p>
                </div>
              </div>

              {/* Addresses */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  SAVED ADDRESSES
                </p>

                <div className="mt-8 rounded-2xl border border-border p-8 text-center">
                  <p className="heading-font text-3xl uppercase">
                    No Addresses Yet
                  </p>

                  <p className="mx-auto mt-3 max-w-md body-font text-sm leading-relaxed text-muted-foreground">
                    Saved customer addresses will appear here.
                  </p>
                </div>
              </div>

              {/* Account Activity */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  ACCOUNT ACTIVITY
                </p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-border p-5">
                    <p className="body-font text-sm">
                      No account activity yet.
                    </p>

                    <p className="body-font mt-1 text-xs text-muted-foreground">
                      Login, order, request, and account events will appear
                      here once backend integration is added.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-8">
                <Link
                  href="/admin/customers"
                  className="inline-flex rounded-full border border-border px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                >
                  Back to Customers
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}