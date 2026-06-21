import { Container } from "../layout/container";
import { Section } from "../layout/section";
import type { Product } from "./data";
import Image from "next/image";

interface RelatedProductsProps {
  product: Product[];
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  return (
    <Section className=" overfolw-hidden mt-12 md:pt-16">
      <div
        className="
    absolute
    inset-0
    bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
    bg-[size:80px_80px]
  "
      />
      <div
        className="
          absolute
          top-20
          left-1/2
          h-[150px]
          w-full
          -translate-x-1/2
          rounded-full
          bg-violet-500/15
          blur-[100px]
        "
      />

      <Container>
        <div className="relative">
          <div className="mb-4">
            <p className="text-sm tracking-[0.4em] text-primary body-font">
              DISCOVER MORE
            </p>
          </div>

          <h2
            className="
      relative
      heading-font
      text-6xl
      uppercase
    "
          >
            Explore More Prints
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground body-font">
            Explore handcrafted 3D printed creations designed to elevate your
            workspace, gaming setup, and collection.
          </p>
          <div className="mt-10 mb-17 grid gap-3 md:grid-cols-3 ">
            {product.map((product) => (
              <div
                key={product.id}
                className="
  group
  rounded-sm
  border
  border-border
  bg-card
  p-3
  transition-all
  duration-300
  hover:scale-105
  hover:border-primary
  "
              >
                <div className="flex items-center gap-4 w-full">
                  <div
                    className="
        overflow-hidden
        rounded-sm
        shrink-0
      "
                  >
                    <Image
                      src={product.variants[0].images[0]}
                      alt={product.title}
                      width={100}
                      height={100}
                      className="
          h-full
          w-full
          object-cover
          transition-transform
          duration-300
          group-hover:scale-110
        "
                    />
                  </div>

                  <div className="flex flex-col gap-12 flex-1">
                    <div className="flex flex-col  justify-items-center">
                      <p
                        className="
          text-sm
          uppercase
          tracking-[0.2em]
          text-primary
          body-font
        "
                      >
                        {product.category}
                      </p>

                      <h3
                        className="
          mt-1
          text-xl
          lg:text-3xl
          heading-font
          font-semibold
        "
                      >
                        {product.title}
                      </h3>
                    </div>

                    <div className="flex justify-between item-center">
                      <p
                        className="
          text-xl
          lg:text-3xl
          font-bold
          text-primary
          body-font
          self-end
        "
                      >
                        ₹{product.price}
                      </p>
                      <p
                        className="
      text-primary
      text-xl
      lg:text-2xl
      body-font
      mr-2
    "
                      >
                        →
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
