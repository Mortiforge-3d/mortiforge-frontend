import Link from "next/link";
import Image from "next/image";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import { PRODUCTS } from "@/src/components/products/data";

export default function AdminProductsPage() {
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
                    CATALOG
                  </p>

                  <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                    Products
                  </h1>

                  <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                    Manage the products available in the Mortiforge store.
                  </p>
                </div>

                <Link
  href="/admin/products/new"
  className="w-fit rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
>
  Add Product
</Link>
              </div>

              {/* Product List */}
              <div className="mt-12 overflow-hidden rounded-lg border border-border bg-card/40 backdrop-blur">
                <div className="hidden border-b border-border px-6 py-4 md:grid md:grid-cols-[1.5fr_1fr_120px_120px] md:gap-6">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Product
                  </p>

                  <p className="body-font text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Category
                  </p>

                  <p className="body-font text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Price
                  </p>

                  <p className="body-font text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Action
                  </p>
                </div>

                {PRODUCTS.map((product) => {
                  const variant = product.variants[0];

                  return (
                    <div
                      key={product.id}
                      className="border-b border-border p-6 last:border-b-0 md:grid md:grid-cols-[1.5fr_1fr_120px_120px] md:items-center md:gap-6"
                    >
                      {/* Product */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                          <Image
                            src={variant.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <p className="body-font font-medium">
                            {product.title}
                          </p>

                          <p className="mt-1 body-font text-xs text-muted-foreground">
                            {product.variants.length} variants
                          </p>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="mt-4 md:mt-0">
                        <p className="body-font text-sm text-muted-foreground">
                          {product.category}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mt-3 md:mt-0">
                        <p className="body-font text-sm font-medium">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="mt-5 md:mt-0">
                        <div className="flex items-center gap-4">
  <Link
    href={`/shop/${product.slug}`}
    className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
  >
    View
  </Link>

  <Link
    href={`/admin/products/${product.id}/edit`}
    className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
  >
    Edit
  </Link>
</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}