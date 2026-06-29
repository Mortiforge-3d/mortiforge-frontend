import Link from "next/link";

import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

export function FAQCTA() {
  return (
    <Section className="relative overflow-hidden ">
      {/* Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[1000px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          pointer-events-none
        "
        style={{
          background: "var(--glow-primary)",
          filter: "blur(180px)",
        }}
      />

      <Container>
        <div
          className="
            relative
            mx-auto
            max-w-4xl
            overflow-hidden
            rounded-[32px]
            border
            border-border
            bg-card
            p-10
            lg:p-16
            mb-10
          "
        >
          {/* Decorative Bubble */}
          <div
            className="
              absolute
              -right-24
              -top-24
              h-56
              w-56
              rounded-full
              bg-primary/10
              blur-[120px]
            "
          />

          <div className="relative z-10">
            {/* Small Label */}
            <p
              className="
                body-font
                text-sm
                uppercase
                tracking-[0.35em]
                text-primary
              "
            >
              STILL NEED HELP?
            </p>

            {/* Heading */}
            <h2
              className="
                mt-4
                heading-font
                text-5xl
                uppercase
                leading-none
                lg:text-7xl
              "
            >
              Let's Start
              <br />A Conversation.
            </h2>

            {/* Description */}
            <p
              className="
                mt-8
                max-w-2xl
                body-font
                leading-relaxed
                text-muted-foreground
              "
            >
              Whether you're planning a custom project, need advice on
              materials, or have a question about an order, we're here to help.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/custom-print"
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
                Request Custom Print
              </Link>

              <Link
                href="/shop"
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
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
