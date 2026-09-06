"use client";

import Image from "next/image";
import { Section } from "../layout/section";
import { Container } from "../layout/container";
import { useState } from "react";
import { useCartStore } from "@/src/store/cart-store";
import type { Product} from "@/src/components/products/data";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  const selectedVariant = product.variants.find(
    (variants) => variants.color === selectedColor,
  )!;
  return (
    <Section>
      <Container>
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="flex gap-4">
            {/* Thumbnails */}

            <div className="flex flex-col gap-6">
              {selectedVariant.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    overflow-hidden
        rounded-sm
        border
        border-border
        transition-all
        hover:border-primary
        ${selectedImage === index ? "border-primary" : "border-border"}
        
      `}
                >
                  <Image src={image} alt="" width={50} height={50} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div
              className="
    flex
    justify-center
    overflow-hidden
    rounded-md
    border
    border-primary/20
    bg-card
  "
            >
              <Image
                src={selectedVariant.images[selectedImage]}
                alt={product.title}
                width={450}
                height={450}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p
              className="
    text-sm
    uppercase
    tracking-[0.4em]
    text-primary
    body-font
  "
            >
              {product.category}
            </p>

            {/* Product Name */}
            <h1
              className="
    heading-font
    mt-3
    text-4xl
    md:text-5xl
    uppercase
    leading-none
  "
            >
              {product.title}
            </h1>

            {/* Price */}
            <p
              className="
    mt-6
    text-4xl
    font-bold
    text-primary
    body-font
  "
            >
              ₹{product.price}
            </p>

            {/* Specifications */}
            <div
              className="
    mt-8
    rounded-lg
    border
    
    bg-card
    p-4
  "
            >
              <div className="grid gap-6 body-font">
                <div className="flex justify-between">
                  <span>Material</span>

                  <span>{product.materials}</span>
                </div>

                <div className="flex justify-between">
                  <span>Color</span>

                  <span>{selectedColor}</span>
                </div>

                <div className="flex justify-between">
                  <span>Dimensions</span>

                  <span>{product.dimensions}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Quantity */}
              <div className="mt-8 body-font">
                <p className="mb-4 text-sm uppercase text-primary  tracking-[0.15em]">
                  Quantity
                </p>

                <div
                  className="
      flex
      w-fit
      items-center
      gap-8
      rounded-full
      border
      border-border
      px-8
      py-3
    "
                >
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  {/* <button onClick={() => setQuantity((prev) => prev + 1)}>
                    +
                  </button> */}
                  <button
  onClick={() => {
    console.log("PLUS CLICKED");
    setQuantity((prev) => prev + 1);
  }}
>
  +
</button>
                </div>
              </div>

              {/* colors */}

              <div className="mt-8 space-y-3 lg:justify-self-end">
                <p
                  className="
      text-sm
      uppercase
      tracking-[0.15em]
      text-primary
      body-font
      mb-5
    "
                >
                  Color
                </p>

                <div className="flex gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.color}
                      onClick={() => {
                        setSelectedColor(variant.color);
                        setSelectedImage(0);
                      }}
                      style={{
                        backgroundColor: variant.hex,
                      }}
                      className={`
          h-10
          w-10
          rounded-full
          border-2
          transition-all
          ${
            selectedColor === variant.color
              ? "border-primary scale-110"
              : "border-border"
          }
        `}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p
                className="
      text-sm
      uppercase
      tracking-[0.15em]
      text-primary
      body-font
    "
              >
                Custom Engraving
              </p>

              <p
                className="
      mt-2
      text-sm
      text-muted-foreground
      body-font
    "
              >
                Add a name, quote, or short message to personalize your print.
                Additional charges may apply. Leave blank if not required.
              </p>

              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={25}
                placeholder="Enter text here..."
                className="
      mt-4
      min-h-[120px]
      w-full
      rounded-lg
      border
      border-border
      bg-card
      p-4
      body-font
      outline-none
      transition-colors
      focus:border-primary
    "
              />

              <p
                className="
      mt-2
      text-xs
      text-muted-foreground
      text-right
    "
              >
                {customText.length}/25 characters
              </p>
            </div>

            {/* Actions */}
            <div className="mt-10 flex gap-4">
              <button
              onClick={() =>
  addItem(product, selectedVariant, quantity, customText)
}
                className="
      flex-1
      rounded-full
      bg-primary
      px-8
      py-4
      font-semibold
      text-black
      transition-all
      hover:scale-[1.02]
      body-font
    "
              >
                Add To Cart
              </button>

              <button
                className="
      flex-1
      rounded-full
      border
      border-primary
      px-8
      py-4
      font-semibold
      transition-all
      hover:bg-primary/10
      bg-card
      body-font
    "
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
