import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";

export default function CustomerAddressesPage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div>
              {/* Header */}
              <div>
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  ACCOUNT
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Addresses
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  Manage the addresses you use for your Mortiforge orders.
                </p>
              </div>

              {/* Empty State */}
              <div className="mt-12 rounded-lg border border-border bg-card/40 p-10 text-center backdrop-blur md:p-16">
                <p className="heading-font text-3xl uppercase md:text-4xl">
                  No Saved Addresses
                </p>

                <p className="mx-auto mt-4 max-w-md body-font leading-relaxed text-muted-foreground">
                  Save an address to make your future checkout experience
                  faster.
                </p>

                <Link
                  href="/checkout"
                  className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Add Address
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}