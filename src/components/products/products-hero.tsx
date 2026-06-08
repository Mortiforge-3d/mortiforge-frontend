import { Section } from "../layout/section"
import { Container } from "../layout/container"
import { Reveal } from "../animations/reveal";

export function ProductsHero() {
    return (
      <Section className="overflow-hidden">
        <div
          className="
    absolute
    inset-0
    bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
    bg-[size:80px_80px]
  "
        />

        <Container>
          <div
            className="
                absolute
                left-1/2
                top-2/2
                h-[600px]
                w-[600px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-primary/10
                blur-[180px]
                pointer-events-none
                "
          />
          <Reveal>
            <div className="mb-6 mt-3">
              <p className="text-md uppercase tracking-[0.3em] text-primary">
                Products
              </p>

              <h1
                className="
                heading-font
                mt-6
                text-5xl
                uppercase
                leading-[0.9]
                text-white
                md:text-8xl
              "
              >
                Explore Our
                <br />
                Collection
              </h1>

              <p
                className="
                mt-6
                max-w-xl
                text-lg
                text-muted-foreground
                body-font
              "
              >
                Discover premium 3D printed creations, collectibles, decor
                pieces, and custom fabrication services designed with precision
                and crafted for enthusiasts.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    );
}