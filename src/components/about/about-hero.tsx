import Link from "next/link";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

export function AboutHero() {
  return (
    <Section className="relative overflow-hidden min-h-screen ">
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
        <div className="relative z-10 min-h-screen mx-auto max-w-5xl text-center">
          {/* Label */}
          <p
            className="
            mt-15
            md:mt-0
              mb-4
              body-font
              text-sm
              uppercase
              tracking-[0.45em]
              text-primary
            "
          >
            ABOUT MORTIFORGE
          </p>

          {/* Heading */}
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
            Precision Crafted
            <br />
            3D Printed Experiences
          </h1>

          {/* Description */}
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
            We transform digital ideas into premium-quality 3D printed products
            for creators, collectors, businesses, and anyone who values
            craftsmanship, precision, and modern design.
          </p>

          {/* Buttons */}
          <div className="mt-12 mb-12 flex flex-wrap justify-center gap-4">
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
                hover:scale-105
              "
            >
              Explore Products
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
                hover:border-primary
              "
            >
              Custom Print
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
