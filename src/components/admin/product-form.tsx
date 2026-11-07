
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Field, Input, Textarea } from "@/src/components/ui/form";

type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type VariantStatus = "ACTIVE" | "INACTIVE";

type Category = {
  id: string;
  name: string;
};

type ProductVariant = {
  id?: string;
  color: string;
  sku: string;
  price: string;
  stock: number;
  status: VariantStatus;
};

type ProductImage = {
  imageUrl: string;
  altText: string;
};

type ProductFormProps = {
  productId?: string;
};

type ProductResponse = {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string | null;
  description: string;
  material: string | null;
  weightGrams: number | null;
  dimensions: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ProductStatus;
  variants: Array<{
    id: string;
    color: string;
    sku: string;
    price: string;
    stock: number;
    status: VariantStatus;
  }>;
  images: Array<{
    imageUrl: string;
    altText: string | null;
  }>;
};

const emptyVariant = (): ProductVariant => ({
  color: "",
  sku: "",
  price: "",
  stock: 0,
  status: "ACTIVE",
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(productId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [weightGrams, setWeightGrams] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<ProductStatus>("DRAFT");

  const [variants, setVariants] = useState<ProductVariant[]>([
    emptyVariant(),
  ]);

  const [images, setImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadFormData() {
      setLoading(true);
      setError("");

      try {
        const categoryResponse = await fetch("/api/admin/categories");

        const categoryData = await categoryResponse.json();

        if (!categoryResponse.ok) {
          throw new Error(
            categoryData.error || "Unable to load categories."
          );
        }

        if (cancelled) return;

        setCategories(categoryData.categories ?? []);

        if (productId) {
          const productResponse = await fetch(
            `/api/admin/products/${productId}`
          );

          const productData = await productResponse.json();

          if (!productResponse.ok) {
            throw new Error(
              productData.error || "Unable to load product."
            );
          }

          if (cancelled) return;

          const product: ProductResponse = productData.product;

          setName(product.name);
          setSlug(product.slug);
          setSlugManuallyEdited(true);
          setCategoryId(product.categoryId);
          setShortDescription(product.shortDescription ?? "");
          setDescription(product.description);
          setMaterial(product.material ?? "");
          setWeightGrams(
            product.weightGrams?.toString() ?? ""
          );
          setDimensions(product.dimensions ?? "");
          setSeoTitle(product.seoTitle ?? "");
          setSeoDescription(product.seoDescription ?? "");
          setStatus(product.status);

          setVariants(
            product.variants.length > 0
              ? product.variants.map((variant) => ({
                  id: variant.id,
                  color: variant.color,
                  sku: variant.sku,
                  price: variant.price.toString(),
                  stock: variant.stock,
                  status: variant.status,
                }))
              : [emptyVariant()]
          );

          setImages(
            product.images.map((image) => ({
              imageUrl: image.imageUrl,
              altText: image.altText ?? "",
            }))
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load product form."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFormData();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index
          ? { ...variant, [field]: value }
          : variant
      )
    );
  }

  function updateImage(
    index: number,
    field: keyof ProductImage,
    value: string
  ) {
    setImages((current) =>
      current.map((image, i) =>
        i === index
          ? { ...image, [field]: value }
          : image
      )
    );
  }

  function addVariant() {
    setVariants((current) => [...current, emptyVariant()]);
  }

  function removeVariant(index: number) {
    if (variants.length <= 1) return;

    setVariants((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function addImage() {
    setImages((current) => [
      ...current,
      { imageUrl: "", altText: "" },
    ]);
  }

  function removeImage(index: number) {
    setImages((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (!categoryId) {
        throw new Error("Please select a product category.");
      }

      if (variants.some((variant) => !variant.color.trim())) {
        throw new Error("Please enter a color for every variant.");
      }

      if (variants.some((variant) => !variant.sku.trim())) {
        throw new Error("Please enter a SKU for every variant.");
      }

      if (variants.some((variant) => !variant.price.trim())) {
        throw new Error("Please enter a price for every variant.");
      }

      const invalidPrice = variants.some(
        (variant) =>
          !/^\d{1,8}(?:\.\d{1,2})?$/.test(variant.price) ||
          Number(variant.price) <= 0
      );

      if (invalidPrice) {
        throw new Error(
          "Prices must be greater than zero and have at most two decimal places."
        );
      }

      if (
        images.some(
          (image) =>
            image.imageUrl.trim() &&
            image.imageUrl.trim().startsWith("//")
        )
      ) {
        throw new Error("Please enter valid image URLs.");
      }

      const cleanText = (value: string) =>
        value.trim() || (isEditing ? null : undefined);

      const payload = {
        name: name.trim(),
        slug: slugify(slug),
        categoryId,
        shortDescription: cleanText(shortDescription),
        description: description.trim(),
        material: cleanText(material),
        weightGrams: weightGrams.trim()
          ? Number(weightGrams)
          : isEditing
            ? null
            : undefined,
        dimensions: cleanText(dimensions),
        seoTitle: cleanText(seoTitle),
        seoDescription: cleanText(seoDescription),
        status,

        variants: variants.map((variant) => ({
          ...(variant.id ? { id: variant.id } : {}),
          color: variant.color.trim(),
          sku: variant.sku.trim(),
          price: variant.price.trim(),
          stock: variant.stock,
          status: variant.status,
        })),

        images: images
          .filter((image) => image.imageUrl.trim())
          .map((image, index) => ({
            imageUrl: image.imageUrl.trim(),
            ...(image.altText.trim()
              ? { altText: image.altText.trim() }
              : {}),
            displayOrder: index,
          })),
      };

      const response = await fetch(
        isEditing
          ? `/api/admin/products/${productId}`
          : "/api/admin/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const detailMessages = result.details
          ? Object.values(result.details)
              .flat()
              .filter(Boolean)
              .join(" ")
          : "";

        throw new Error(
          [result.error, detailMessages].filter(Boolean).join(" ")
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the product."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2";

  if (loading) {
    return (
      <div className="py-16 text-center body-font text-sm text-muted-foreground">
        Loading product form...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-5 py-4 body-font text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Product Information */}
      <section>
        <div className="mb-6">
          <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
            PRODUCT INFORMATION
          </p>

          <h2 className="heading-font mt-3 text-3xl uppercase">
            Basic Details
          </h2>
        </div>

        <div className="space-y-6">
          <Field label="Product Name" required>
            <Input
              id="name"
              name="name"
              className={inputClass}
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);

                if (!slugManuallyEdited) {
                  setSlug(slugify(value));
                }
              }}
              placeholder="Product name"
              required
              maxLength={160}
            />
          </Field>

          <Field label="Product Slug" required>
            <Input
              id="slug"
              name="slug"
              className={inputClass}
              value={slug}
              onChange={(event) => {
                setSlugManuallyEdited(true);
                setSlug(slugify(event.target.value));
              }}
              placeholder="product-name"
              required
              maxLength={180}
            />
            <p className="mt-2 body-font text-xs text-muted-foreground">
              Used in the product URL. Only lowercase letters, numbers and hyphens.
            </p>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Category" required>
              <select
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-border bg-card px-5 py-4 body-font text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {categories.length === 0 && (
                <p className="mt-2 body-font text-xs text-destructive">
                  No categories exist yet. Create a category before adding products.
                </p>
              )}
            </Field>

            <Field label="Publishing Status" required>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ProductStatus)
                }
                className="mt-2 w-full rounded-xl border border-border bg-card px-5 py-4 body-font text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </Field>
          </div>

          <Field label="Short Description">
            <Textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(event) =>
                setShortDescription(event.target.value)
              }
              placeholder="A short summary of the product..."
              maxLength={300}
            />
          </Field>

          <Field label="Full Description" required>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the product in detail..."
              required
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Material">
              <Input
                value={material}
                onChange={(event) => setMaterial(event.target.value)}
                placeholder="PLA, Resin, etc."
                maxLength={100}
              />
            </Field>

            <Field label="Weight (grams)">
              <Input
                type="number"
                min="1"
                step="1"
                value={weightGrams}
                onChange={(event) =>
                  setWeightGrams(event.target.value)
                }
                placeholder="250"
              />
            </Field>
          </div>

          <Field label="Dimensions">
            <Input
              value={dimensions}
              onChange={(event) => setDimensions(event.target.value)}
              placeholder="120 x 100 x 150 mm"
              maxLength={100}
            />
          </Field>
        </div>
      </section>

      {/* Variants */}
      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
              PRODUCT OPTIONS
            </p>

            <h2 className="heading-font mt-3 text-3xl uppercase">
              Variants
            </h2>

            <p className="mt-2 body-font text-sm text-muted-foreground">
              Configure colors, individual SKUs, prices and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="shrink-0 rounded-full border border-border px-5 py-3 body-font text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:border-primary hover:text-primary"
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-5">
          {variants.map((variant, index) => (
            <div
              key={variant.id ?? `new-variant-${index}`}
              className="rounded-lg border border-border bg-muted/20 p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="body-font text-xs uppercase tracking-[0.15em] text-primary">
                  Variant {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  disabled={variants.length === 1}
                  className="body-font text-xs text-destructive transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Color Name" required>
                  <Input
                    value={variant.color}
                    onChange={(event) =>
                      updateVariant(index, "color", event.target.value)
                    }
                    placeholder="Matte Black"
                    maxLength={60}
                    required
                  />
                </Field>

                <Field label="SKU" required>
                  <Input
                    value={variant.sku}
                    onChange={(event) =>
                      updateVariant(index, "sku", event.target.value)
                    }
                    placeholder="MODEL-BLK-001"
                    maxLength={100}
                    required
                  />
                </Field>

                <Field label="Price (INR)" required>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={variant.price}
                    onChange={(event) =>
                      updateVariant(index, "price", event.target.value)
                    }
                    placeholder="1499.00"
                    required
                  />
                </Field>

                <Field label="Available Stock" required>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stock}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "stock",
                        Math.max(0, Number(event.target.value))
                      )
                    }
                    required
                  />
                </Field>

                <Field label="Variant Status">
                  <select
                    value={variant.status}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "status",
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-border bg-card px-5 py-4 body-font text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Images */}
      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
              PRODUCT MEDIA
            </p>

            <h2 className="heading-font mt-3 text-3xl uppercase">
              Images
            </h2>

            <p className="mt-2 body-font text-sm text-muted-foreground">
              Add image URLs for product previews and gallery images.
            </p>
          </div>

          <button
            type="button"
            onClick={addImage}
            disabled={images.length >= 20}
            className="shrink-0 rounded-full border border-border px-5 py-3 body-font text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
          >
            + Add Image
          </button>
        </div>

        <div className="space-y-5">
          {images.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-8 text-center body-font text-sm text-muted-foreground">
              No product images added yet.
            </p>
          )}

          {images.map((image, index) => (
            <div
              key={`image-${index}`}
              className="rounded-lg border border-border bg-muted/20 p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="body-font text-xs uppercase tracking-[0.15em] text-primary">
                  Image {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="body-font text-xs text-destructive hover:opacity-70"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-5">
                <Field label="Image URL">
                  <Input
                    type="url"
                    value={image.imageUrl}
                    onChange={(event) =>
                      updateImage(index, "imageUrl", event.target.value)
                    }
                    placeholder="https://example.com/product-image.jpg"
                  />
                </Field>

                <Field label="Alt Text">
                  <Input
                    value={image.altText}
                    onChange={(event) =>
                      updateImage(index, "altText", event.target.value)
                    }
                    placeholder="Product image description"
                    maxLength={250}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 body-font text-xs text-muted-foreground">
          Maximum 20 images. Image uploading can be connected through Cloudinary separately.
        </p>
      </section>

      {/* SEO */}
      <section>
        <div className="mb-6">
          <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
            SEARCH OPTIMIZATION
          </p>

          <h2 className="heading-font mt-3 text-3xl uppercase">
            SEO Details
          </h2>
        </div>

        <div className="space-y-6">
          <Field label="SEO Title">
            <Input
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
              placeholder="Product title for search engines"
              maxLength={180}
            />
          </Field>

          <Field label="SEO Description">
            <Textarea
              value={seoDescription}
              onChange={(event) =>
                setSeoDescription(event.target.value)
              }
              placeholder="Short search engine description..."
              maxLength={320}
            />
          </Field>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          disabled={submitting}
          className="rounded-full border border-border px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || categories.length === 0}
          className="rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>
    </form>
  );
}