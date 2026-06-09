import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  slug: string;
  title: string;
  category: string;
  images: string[];
  materials: string;
  price: number;
}

export function ProductCard({
  slug,
  title,
  category,
  images,
  materials,
  price,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-[5px]
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
    h-[420px]
    overflow-hidden
    border-b
    border-border
    bg-gradient-to-b
    from-surface
    to-background
  "
      >
        <Image
          src={images[0] || "/products/placeholder.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw,
    (max-width: 1280px) 50vw,
    33vw"
          className="
    object-cover
    transition-transform
    duration-700
    group-hover:scale-110
  "
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p
          className="
            text-xs
            uppercase
            body-font
            tracking-[0.2em]
            text-primary
          "
        >
          {category}
        </p>

        <h3
          className="
            mt-2
            heading-font
            text-3xl
            uppercase
          "
        >
          {title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            key={materials}
            className="
                rounded-full
                border
                border-border
                px-3
                py-1
                body-font
                text-xs
                text-muted-foreground
              "
          >
            {materials}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between">
            <p className="text-2xl body-font text-primary font-semibold">
              ₹{price}
            </p>

            <span
              className="
                text-primary
                transition-transform
                duration-300
                body-font
              "
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
