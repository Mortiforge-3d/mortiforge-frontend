import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import ProductForm from "@/src/components/admin/product-form";
import { PRODUCTS } from "@/src/components/products/data";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              <div>
                <Link
                  href="/admin/products"
                  className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  ← Back to Products
                </Link>

                <p className="body-font mt-8 text-sm uppercase tracking-[0.35em] text-primary">
                  CATALOG
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Edit Product
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  Update the details and options for this product.
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