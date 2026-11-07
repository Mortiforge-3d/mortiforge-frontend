
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

type Product = {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: {
    id: string;
    price: string;
    stock: number;
    status: "ACTIVE" | "INACTIVE";
  }[];
  images: {
    id: string;
    imageUrl: string;
    altText: string | null;
  }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/products?limit=50",
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load products.");
      }

      setProducts(data.products ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.slug} ${product.category.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

              {/* Search */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-border bg-card px-6 py-4 body-font text-sm outline-none transition-colors focus:border-primary"
                />

                <button
                  type="button"
                  onClick={fetchProducts}
                  disabled={loading}
                  className="rounded-full border border-border px-6 py-4 body-font text-xs uppercase tracking-wider transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              {/* Product List */}
              <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card/40 backdrop-blur">
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

                {loading && (
                  <div className="p-12 text-center body-font text-sm text-muted-foreground">
                    Loading products...
                  </div>
                )}

                {!loading && error && (
                  <div className="p-12 text-center">
                    <p className="body-font text-sm text-destructive">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={fetchProducts}
                      className="mt-5 body-font text-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!loading && !error && filteredProducts.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="heading-font text-2xl uppercase">
                      {search ? "No matching products" : "No products yet"}
                    </p>

                    <p className="mt-3 body-font text-sm text-muted-foreground">
                      {search
                        ? "Try another search term."
                        : "Create your first product to populate the store catalog."}
                    </p>

                    {!search && (
                      <Link
                        href="/admin/products/new"
                        className="mt-6 inline-block rounded-full bg-primary px-6 py-3 body-font text-xs uppercase tracking-wider text-primary-foreground"
                      >
                        Add Product
                      </Link>
                    )}
                  </div>
                )}

                {!loading &&
                  !error &&
                  filteredProducts.map((product) => {
                    const activeVariants = product.variants.filter(
                      (variant) => variant.status === "ACTIVE"
                    );

                    const prices = activeVariants.map((variant) =>
                      Number(variant.price)
                    );

                    const lowestPrice =
                      prices.length > 0 ? Math.min(...prices) : null;

                    const firstImage = product.images[0]?.imageUrl;

                    return (
                      <div
                        key={product.id}
                        className="grid gap-4 border-b border-border p-6 last:border-b-0 md:grid-cols-[1.5fr_1fr_120px_120px] md:items-center md:gap-6"
                      >
                        {/* Product */}
                        <div className="flex items-center gap-4">
                          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                            {firstImage ? (
                              <img
                                src={firstImage}
                                alt={product.images[0]?.altText || product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-xl text-muted-foreground">
                                ◇
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="body-font truncate font-medium">
                              {product.name}
                            </p>

                            <p className="mt-1 body-font text-xs text-muted-foreground">
                              {product.variants.length} variants
                            </p>

                            <span className="mt-2 inline-block rounded-full border border-border px-3 py-1 body-font text-[10px] uppercase tracking-wider text-muted-foreground">
                              {product.status}
                            </span>
                          </div>
                        </div>

                        {/* Category */}
                        <div>
                          <p className="body-font text-sm text-muted-foreground">
                            {product.category.name}
                          </p>
                        </div>

                        {/* Price */}
                        <div>
                          <p className="body-font text-sm font-medium">
                            {lowestPrice !== null
                              ? `₹${lowestPrice.toLocaleString("en-IN")}`
                              : "No active price"}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          {product.status === "PUBLISHED" && (
                            <Link
                              href={`/shop/${product.slug}`}
                              target="_blank"
                              className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                              View
                            </Link>
                          )}

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <p className="mt-5 body-font text-xs text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} loaded products.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}