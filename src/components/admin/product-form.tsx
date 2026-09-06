"use client";

import { Field, Input, Textarea } from "@/src/components/ui/form";

export default function ProductForm() {
  return (
    <form className="space-y-10">
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
          <Field label="Product Name">
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Product name"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Price">
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="1499"
              />
            </Field>

            <Field label="Category">
              <Input
                id="category"
                name="category"
                type="text"
                placeholder="Collectibles"
              />
            </Field>
          </div>

          <Field label="Dimensions">
            <Input
              id="dimensions"
              name="dimensions"
              type="text"
              placeholder="120 × 100 × 150 mm"
            />
          </Field>

          <Field label="Materials">
            <Textarea
              id="materials"
              name="materials"
              placeholder="PLA, Resin, etc."
            />
          </Field>
        </div>
      </section>

      {/* Variants */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
              PRODUCT OPTIONS
            </p>

            <h2 className="heading-font mt-3 text-3xl uppercase">
              Variants
            </h2>

            <p className="mt-2 body-font text-sm text-muted-foreground">
              Add the available colors and their display settings.
            </p>
          </div>

          <button
            type="button"
            className="shrink-0 rounded-full border border-border px-5 py-3 body-font text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:border-primary hover:text-primary"
          >
            + Add Variant
          </button>
        </div>

        {/* Initial Variant */}
        <div className="rounded-lg border border-border bg-muted/20 p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Color Name">
              <Input
                id="variant-color"
                name="variant-color"
                type="text"
                placeholder="Red"
              />
            </Field>

            <Field label="Hex Color">
              <Input
                id="variant-hex"
                name="variant-hex"
                type="text"
                placeholder="#FF0000"
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Images">
              <Input
                id="variant-images"
                name="variant-images"
                type="text"
                placeholder="/products/example/image.jpg"
              />
            </Field>

            <p className="mt-2 body-font text-xs text-muted-foreground">
              Image uploading will be connected later through the backend.
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-full border border-border px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          Save Product
        </button>
      </div>
    </form>
  );
}