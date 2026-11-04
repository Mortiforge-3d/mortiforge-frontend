
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import type { ApiProduct } from "@/src/types/product";

type RelatedProductsProps = {
  product: ApiProduct[];
};

export function RelatedProducts({ product }: RelatedProductsProps) {
  if (product.length === 0) {
    return null;
  }

  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]"
      />

      <Container className="relative">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Discover More
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore More Prints
          </h2>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Discover more designs from our collection of carefully crafted
            3D-printed models.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {product.map((item) => {
            const image = item.images[0];
            const startingPrice = item.variants.reduce<number | null>(
              (lowest, variant) => {
                const price = Number(variant.price);

                if (!Number.isFinite(price)) {
                  return lowest;
                }

                return lowest === null || price < lowest ? price : lowest;
              },
              null,
            );

            return (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-colors hover:border-primary/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                  {image ? (
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Image coming soon
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {item.category.name}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold transition-colors group-hover:text-primary">
                    {item.name}
                  </h3>

                  {item.material && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Material: {item.material}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="font-semibold">
                      {startingPrice === null
                        ? "Price unavailable"
                        : `₹${startingPrice.toLocaleString("en-IN")}`}
                    </p>

                    <span
                      aria-hidden="true"
                      className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}