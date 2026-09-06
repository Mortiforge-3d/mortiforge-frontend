import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";

export default function CustomerOrdersPage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div>
              <div>
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  YOUR ACTIVITY
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Orders
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  View your orders and track their progress from one place.
                </p>
              </div>

              {/* Empty State */}
              <div className="mt-12 rounded-lg border border-border bg-card/40 p-10 text-center backdrop-blur md:p-16">
                <p className="heading-font text-3xl uppercase md:text-4xl">
                  No Orders Yet
                </p>

                <p className="mx-auto mt-4 max-w-md body-font leading-relaxed text-muted-foreground">
                  You haven&apos;t placed any orders yet. Explore our collection
                  and find something worth bringing to life.
                </p>

                <Link
                  href="/shop"
                  className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Explore Shop
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}