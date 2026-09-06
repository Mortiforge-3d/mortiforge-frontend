import { Container } from "../layout/container";
import { Section } from "../layout/section";

export function FAQHero() {
    return (
      <Section className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* {Glow} */}
        <div
          className="absolute
          inset-0
          pointer-events-none
          bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:80px_80px]"
        />
        {/* Glow */}
        <div
          className="
          absolute
          left-1/2
          top-0
          h-[600px]
          w-[1200px]
          -translate-x-1/2
          rounded-full
          pointer-events-none
        "
          style={{
            background: "var(--glow-primary)",
            filter: "blur(180px)",
          }}
        />
        <Container className="flex w-full items-center justify-center">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p
              className="
              mb-4
              body-font
              text-sm
              uppercase
              tracking-[0.4em]
              text-primary
            "
            >
              FAQ
            </p>

            <h1
              className="
              heading-font
              text-5xl
              uppercase
              leading-none
              sm:text-6xl
              lg:text-8xl
            "
            >
              Frequently
              <br />
              Asked Questions
            </h1>

            <p
              className="
              mx-auto
              mt-8
              max-w-2xl
              body-font
              text-lg
              leading-relaxed
              text-muted-foreground
            "
            >
              Find answers to the most common questions about our products,
              custom printing process, materials, and shipping.
            </p>
          </div>
        </Container>
      </Section>
    );
}