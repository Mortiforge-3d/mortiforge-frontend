import Link from "next/link";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

export function AboutCTA() {
  return (
    <Section className="relative overflow-hidden min-h-screen mt-8 ">
      {/* Grid */}
      <div
        className="
          absolute
          inset-0
          bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:80px_80px]
          pointer-events-none
        "
      />
      {/* Glow */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-[700px]
          w-[1600px]
          -translate-x-1/2
          rounded-full
          pointer-events-none
        "
        style={{
          background: "var(--glow-primary)",
          filter: "blur(220px)",
        }}
      />
      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p
            className="
              body-font
              text-sm
              uppercase
              tracking-[0.4em]
              text-primary
            "
          >
            LET'S BUILD SOMETHING AMAZING
          </p>

          <h2
            className="
              mt-6
              heading-font
              text-5xl
              uppercase
              leading-none
              lg:text-7xl
            "
          >
            Ready To Bring
            <br />
            Your Ideas To Life?
          </h2>

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
            Browse our collection of premium 3D printed products or start a
            custom project tailored to your needs.
          </p>

          <div
            className="
              mt-12
              mb-12
              flex
              flex-wrap
              justify-center
              gap-5
            "
          >
            <Link
              href="/shop"
              className="
                rounded-full
                bg-primary
                px-8
                py-3
                body-font
                text-primary-foreground
                transition-all
                duration-300
                hover:scale-105
              "
            >
              Browse Products
            </Link>

            <Link
              href="/custom-print"
              className="
                rounded-full
                border
                border-border
                px-8
                py-3
                body-font
                transition-all
                duration-300
                hover:border-primary
              "
            >
              Request Custom Print
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
