import { Section } from "../layout/section"
import { Container } from "../layout/container"
import { Reveal } from "../animations/reveal";

export function ProductsHero() {
    return (
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">
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
                md:text-7xl
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