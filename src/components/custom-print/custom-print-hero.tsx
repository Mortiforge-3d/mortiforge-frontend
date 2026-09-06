import Link from "next/link";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import { Reveal } from "@/src/components/animations/reveal";

export default function CustomPrintHero() {
  return (
    <Section className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-16 md:pt-28">
      {/* Background Grid */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:80px_80px]
        "
      />

      {/* Background Glow */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-[700px]
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

      <Container className="relative z-10 flex w-full items-center justify-center">
        <div className="w-full max-w-4xl text-center">
          <Reveal>
            <div>
              <p
                className="
                  body-font
                  text-sm
                  uppercase
                  tracking-[0.4em]
                  text-primary
                "
              >
                CUSTOM PRINT
              </p>

              <h1
                className="
                  mt-6
                  heading-font
                  text-5xl
                  uppercase
                  leading-[0.9]
                  sm:text-6xl
                  lg:text-8xl
                "
              >
                Turn Your
                <br />
                Ideas Into
                <br />
                Reality.
              </h1>

              <p
                className="
                  mt-8
                  mx-auto
                  max-w-xl
                  body-font
                  text-lg
                  leading-relaxed
                  text-muted-foreground
                "
              >
                Have an idea you'd like to bring to life? Tell us about your
                project and we'll guide you through consultation, quotation,
                production, and delivery—keeping you informed every step of the
                way.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                <Link
                  href="#request-form"
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
                  Start Your Request
                </Link>

                <p
                  className="
                    body-font
                    text-sm
                    text-muted-foreground
                  "
                >
                  No design file? No problem.
                </p>
              </div>

              {/* Process Hint */}
              <div
                className="
                  mt-14
                  flex
                  flex-wrap
                  justify-center
                  gap-4
                  body-font
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  text-primary/70
                "
              >
                <span>UPLOAD</span>

                <span>•</span>

                <span>REVIEW</span>

                <span>•</span>

                <span>QUOTE</span>

                <span>•</span>

                <span>PRINT</span>

                <span>•</span>

                <span>DELIVER</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
