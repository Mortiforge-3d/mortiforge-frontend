import { Section } from "../layout/section"
import { Container } from "../layout/container"
import { Reveal } from "../animations/reveal";

export function ProductsHero() {
    return (
      <Section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div
          className="
    absolute
    inset-0
    bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
    bg-[size:80px_80px]
    z-10
  "
        />
        <Container className="flex w-full items-center justify-center">
          {/* Glow */}
          <div
            className="
          absolute
          left-1/2
          -top-[-150px]
          h-[600px]
          w-[1600px]
          -translate-x-1/2
          rounded-full
          pointer-events-none
          z-0
        "
            style={{
              background: "var(--glow-primary)",
              filter: "blur(100px)",
            }}
          />
          <Reveal>
            <div className="relative z-20 mx-auto max-w-5xl text-center ">
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
                z-20
              "
                style={{
                  textShadow: "0 4px 30px rgba(0,0,0,.35)",
                }}
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