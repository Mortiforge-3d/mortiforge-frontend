
"use client";

import Image from "next/image";
import { useState } from "react";
import { Section } from "../layout/section";
import { Container } from "../layout/container";
import { useCartStore } from "@/src/store/cart-store";
import type { ApiProductDetail } from "@/src/types/product";

interface ProductDetailsProps {
  product: ApiProductDetail;
}

const COLOR_HEX: Record<string, string> = {
  black: "#171717",
  white: "#f5f5f5",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  violet: "#8b5cf6",
  pink: "#ec4899",
  gray: "#6b7280",
  grey: "#6b7280",
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const cartError = useCartStore((state) => state.error);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  const images = product.images;
  const currentImage = images[selectedImage] ?? images[0];
  const stock = selectedVariant?.stock ?? 0;
  const price = selectedVariant ? Number(selectedVariant.price) : null;
  const canPurchase = Boolean(selectedVariant && stock > 0);

  async function handleAddToCart() {
    if (!selectedVariant || !canPurchase || isAdding) return;

    setIsAdding(true);
    setCartMessage(null);

    try {
      await addItem(selectedVariant.id, quantity);
      setCartMessage("Added to your cart.");
    } catch {
      // The cart store records the API error.
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Section>
      <Container>
        <div className="grid items-start gap-8 md:grid-cols-2">
          {/* Product images */}
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="flex flex-col gap-4">
                {images.map((image, index) => (
                  <button
                    key={`${image.imageUrl}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    className={`overflow-hidden rounded-sm border transition-all hover:border-primary ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex min-h-[320px] flex-1 items-center justify-center overflow-hidden rounded-md border border-primary/20 bg-card">
              {currentImage ? (
                <Image
                  src={currentImage.imageUrl}
                  alt={currentImage.altText || product.name}
                  width={600}
                  height={600}
                  priority
                  className="h-auto max-h-[600px] w-full object-contain"
                />
              ) : (
                <p className="p-8 text-sm text-muted-foreground">
                  Images coming soon
                </p>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="flex flex-col justify-center">
            <p className="body-font text-sm uppercase tracking-[0.4em] text-primary">
              {product.category.name}
            </p>

            <h1 className="heading-font mt-3 text-4xl uppercase leading-none md:text-5xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-4 body-font leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>
            )}

            <p className="body-font mt-6 text-4xl font-bold text-primary">
              {price !== null
                ? `₹${price.toLocaleString("en-IN")}`
                : "Unavailable"}
            </p>

            <div className="mt-8 rounded-lg border border-border bg-card p-4">
              <div className="grid gap-6 body-font">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Material</span>
                  <span>{product.material || "Not specified"}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Color</span>
                  <span>{selectedVariant?.color ?? "Unavailable"}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span>{product.dimensions || "Not specified"}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={stock > 0 ? "text-primary" : "text-destructive"}>
                    {stock > 0 ? `${stock} available` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8 body-font">
              <p className="mb-4 text-sm uppercase tracking-[0.15em] text-primary">
                Quantity
              </p>

              <div className="flex w-fit items-center gap-8 rounded-full border border-border px-8 py-3">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="disabled:opacity-40"
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={!canPurchase || quantity >= Math.min(stock, 99)}
                  onClick={() =>
                    setQuantity((value) => Math.min(Math.min(stock, 99), value + 1))
                  }
                  className="disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Variant selector */}
            {product.variants.length > 0 && (
              <div className="mt-8 space-y-3">
                <p className="body-font mb-5 text-sm uppercase tracking-[0.15em] text-primary">
                  Color
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => {
                    const colorKey = variant.color.trim().toLowerCase();
                    const hex = COLOR_HEX[colorKey] ?? "#8b5cf6";

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        title={`${variant.color}${variant.stock === 0 ? " — out of stock" : ""}`}
                        aria-label={`Select ${variant.color}`}
                        aria-pressed={selectedVariantId === variant.id}
                        disabled={variant.stock <= 0}
                        onClick={() => {
                          setSelectedVariantId(variant.id);
                          setSelectedImage(0);
                          setQuantity(1);
                          setCartMessage(null);
                        }}
                        style={{ backgroundColor: hex }}
                        className={`h-10 w-10 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
                          selectedVariantId === variant.id
                            ? "scale-110 border-primary"
                            : "border-border"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cart action */}
            <div className="mt-10">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canPurchase || isAdding || quantity > stock}
                className="w-full rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding
                  ? "Adding..."
                  : !canPurchase
                    ? "Out of Stock"
                    : "Add To Cart"}
              </button>

              {cartMessage && (
                <p role="status" className="mt-3 text-sm text-primary">
                  {cartMessage}
                </p>
              )}

              {cartError && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  {cartError}
                </p>
              )}

              <p className="mt-3 text-xs text-muted-foreground">
                You must sign in to add products to your cart.
              </p>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="heading-font text-3xl uppercase">
              About This Print
            </h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}