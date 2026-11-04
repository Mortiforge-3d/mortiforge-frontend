
import Link from "next/link";
import Image from "next/image";
import type { ApiProduct } from "../../types/product";

interface ProductCardProps {
  product: ApiProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const startingPrice = product.variants.length
    ? Math.min(...product.variants.map((variant) => Number(variant.price)))
    : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-md
        border
        border-border
        bg-card/50
        transition-all
        duration-300
        hover:border-primary/40
      "
    >
      {/* Product Visual */}
      <div
        className="
          relative
          h-[280px]
          sm:h-[320px]
          overflow-hidden
          border-b
          border-border
          bg-gradient-to-b
          from-surface
          to-background
        "
      >
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.altText || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Image coming soon
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
          {product.category.name}
        </p>

        <h3 className="heading-font mt-2 text-2xl uppercase">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
        )}

        {product.material && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-border px-3 py-1 body-font text-xs text-muted-foreground">
              {product.material}
            </span>
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              {startingPrice !== null ? (
                <p className="body-font text-2xl font-semibold text-primary">
                  ₹{startingPrice.toLocaleString("en-IN")}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    onwards
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Currently unavailable
                </p>
              )}
            </div>

            <span className="body-font text-2xl text-primary transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
