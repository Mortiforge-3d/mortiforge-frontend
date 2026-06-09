import Image from "next/image";
import { Section } from "../layout/section";
import { Container } from "../layout/container";

interface ProductDetailsProps {
  product: {
    title: string;
    category: string;
    price: number;
    images: string[];
    materials: string;
    color: string;
    dimensions: string;
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <Section>
      <Container>
        <div className="grid items-start gap-16 md:grid-cols-2">
          <div className="space-y-4">
            <div
              className="
    absolute
    left-1/2
    top-1/2
    h-72
    w-72
    -translate-x-1/2
    -translate-y-1/2
    rounded-full
    bg-primary/15
    blur-3xl
  "
            />
            {/* Image */}
            <div
              className="
relative
h-[520px]
overflow-hidden
rounded-[32px]
border
border-primary/20
bg-card/40
backdrop-blur-sm
"
            >
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="
object-contain
p-6
transition-transform
duration-500
group-hover:scale-105
"
              />
            </div>
            <div className="flex gap-4">
              <div
                className="
    h-24
    w-24
    rounded-2xl
    border
    border-primary
    bg-card/40
  "
              />
              <div
                className="
    h-24
    w-24
    rounded-2xl
    border
    border-border
    bg-card/40
    transition-all
    hover:border-primary
  "
              />
              <div
                className="
    h-24
    w-24
    rounded-2xl
    border
    border-border
    bg-card/40
    transition-all
    hover:border-primary
  "
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p
              className="
      text-xs
uppercase
tracking-[0.4em]
font-medium
    "
            >
              {product.category}
            </p>

            {/* Product Name */}
            <h1
              className="
      heading-font
      mt-4
      text-4xl
      uppercase
      leading-[0.9]
      md:text-6xl
      max-w-[12ch]
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
    "
            >
              ₹{product.price}
            </p>

            {/* Specifications */}
            <div
              className="
      mt-8
      rounded-3xl
      border
      border-border
      bg-card/30
      backdrop-blur-sm
      divide-y divide-border
      p-6
    "
            >
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material</span>

                <span>{product.materials}</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-muted-foreground">Color</span>

                <span>{product.color}</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-muted-foreground">Dimensions</span>

                <span>{product.dimensions}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="mb-3 text-sm uppercase tracking-wider text-muted-foreground">
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
                  className="text-xl 
                            font-semibold"
                >
                  -
                </button>

                <span>1</span>

                <button>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button
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
