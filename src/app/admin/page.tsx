import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import AdminHeader from "@/src/components/admin/admin-header";
import AdminStats from "@/src/components/admin/admin-stats";

export default function AdminPage() {
  return (
    <main>
      <Section>
        <Container>
          <AdminHeader />

          <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div className="space-y-8">
              <AdminStats />

              {/* Recent Orders */}
              <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <div>
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    ORDER ACTIVITY
                  </p>

                  <h2 className="heading-font mt-3 text-3xl uppercase">
                    Recent Orders
                  </h2>
                </div>

                <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
                  <p className="body-font text-sm text-muted-foreground">
                    Recent orders will appear here.
                  </p>
                </div>
              </section>

              {/* Custom Requests */}
              <section className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <div>
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    CUSTOM PRINT
                  </p>

                  <h2 className="heading-font mt-3 text-3xl uppercase">
                    Custom Requests
                  </h2>
                </div>

                <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
                  <p className="body-font text-sm text-muted-foreground">
                    Custom print requests will appear here.
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