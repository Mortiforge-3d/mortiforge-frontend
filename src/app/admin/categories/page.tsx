
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";
import { Field, Input, Textarea } from "@/src/components/ui/form";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    products: number;
  };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load categories.");
      }

      setCategories(data.categories ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slugify(slug),
        description: description.trim() || null,
      };

      if (payload.name.length < 2) {
        throw new Error("Category name must contain at least 2 characters.");
      }

      if (payload.slug.length < 2) {
        throw new Error("Please enter a valid category slug.");
      }

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create category.");
      }

      setName("");
      setSlug("");
      setDescription("");
      setSlugManuallyEdited(false);

      setSuccess("Category created successfully.");

      await fetchCategories();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the category."
      );
    } finally {
      setSubmitting(false);
    }
  }

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
                  CATALOG
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Categories
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  Organize the products available in the Mortiforge store.
                </p>
              </div>

              {/* Create Category */}
              <div className="mt-12 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-10">
                <div className="mb-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    CATALOG MANAGEMENT
                  </p>

                  <h2 className="heading-font mt-3 text-3xl uppercase">
                    Create Category
                  </h2>

                  <p className="mt-2 body-font text-sm text-muted-foreground">
                    Add a category to organize your products.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 body-font text-sm text-destructive"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="mb-6 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 body-font text-sm text-primary"
                  >
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Field label="Category Name" required>
                    <Input
                      value={name}
                      onChange={(event) => {
                        const value = event.target.value;
                        setName(value);

                        if (!slugManuallyEdited) {
                          setSlug(slugify(value));
                        }
                      }}
                      placeholder="Collectibles"
                      minLength={2}
                      maxLength={100}
                      required
                    />
                  </Field>

                  <Field label="Category Slug" required>
                    <Input
                      value={slug}
                      onChange={(event) => {
                        setSlugManuallyEdited(true);
                        setSlug(slugify(event.target.value));
                      }}
                      placeholder="collectibles"
                      minLength={2}
                      maxLength={120}
                      required
                    />

                    <p className="mt-2 body-font text-xs text-muted-foreground">
                      Used in URLs. Lowercase letters, numbers and hyphens only.
                    </p>
                  </Field>

                  <Field label="Description">
                    <Textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Describe the products in this category..."
                      maxLength={2000}
                    />
                  </Field>

                  <div className="flex justify-end border-t border-border pt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Creating..." : "Create Category"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Category List */}
              <div className="mt-12">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                      YOUR CATALOG
                    </p>

                    <h2 className="heading-font mt-3 text-3xl uppercase">
                      All Categories
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={fetchCategories}
                    disabled={loading}
                    className="rounded-full border border-border px-5 py-3 body-font text-xs uppercase tracking-wider transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-border bg-card/40 backdrop-blur">
                  {loading && (
                    <div className="p-12 text-center body-font text-sm text-muted-foreground">
                      Loading categories...
                    </div>
                  )}

                  {!loading && !error && categories.length === 0 && (
                    <div className="p-12 text-center">
                      <h3 className="heading-font text-2xl uppercase">
                        No categories yet
                      </h3>

                      <p className="mt-3 body-font text-sm text-muted-foreground">
                        Create your first category using the form above.
                      </p>
                    </div>
                  )}

                  {!loading &&
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex flex-col gap-3 border-b border-border p-6 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <h3 className="body-font font-medium">
                            {category.name}
                          </h3>

                          <p className="mt-1 body-font text-xs text-muted-foreground">
                            /{category.slug}
                          </p>

                          {category.description && (
                            <p className="mt-2 body-font text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0">
                          <span className="rounded-full border border-border px-4 py-2 body-font text-xs text-muted-foreground">
                            {category._count.products} products
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                <p className="mt-5 body-font text-xs text-muted-foreground">
                  {categories.length} categories in your catalog.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}