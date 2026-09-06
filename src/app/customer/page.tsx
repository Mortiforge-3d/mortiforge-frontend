import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerHeader from "@/src/components/customer/customer-header";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";
import DashboardStats from "@/src/components/customer/dashboard-stats";

export default function CustomerPage() {
  return (
    <main>
      <Section>
        <Container>
          <CustomerHeader />

          <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div className="space-y-8">
              <DashboardStats />

              <section className="rounded-3xl border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <div>
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    RECENT ACTIVITY
                  </p>

                  <h2 className="heading-font mt-3 text-3xl uppercase">
                    Recent Orders
                  </h2>
                </div>

                <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
                  <p className="body-font text-sm text-muted-foreground">
                    Your recent orders will appear here.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}