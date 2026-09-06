import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import ProductForm from "@/src/components/admin/product-form";

export default function NewProductPage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              <div>
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  CATALOG
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Add Product
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  Create a new product for the Mortiforge store.
                </p>
              </div>

              <div className="mt-12 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-10">
                <ProductForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}