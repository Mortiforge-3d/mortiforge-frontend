import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

import { VALUES } from "./data";

export function AboutValues() {
  return (
    <Section className="relative overflow-hidden">
      <Container>
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="
              mb-3
              body-font
              text-sm
              uppercase
              tracking-[0.35em]
              text-primary
            "
          >
            OUR VALUES
          </p>

          <h2
            className="
              heading-font
              text-5xl
              uppercase
              leading-none
              lg:text-7xl
            "
          >
            Built Around
            <br />
            What Matters
          </h2>

          <p
            className="
              mt-6
              body-font
              text-muted-foreground
            "
          >
            Every product we create is guided by the same principles: precision,
            quality, and creativity.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-4 lg:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="
                group
                relative
                overflow-hidden
                rounded-md
                border
                border-border
                bg-card
                p-8
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-primary
              "
            >
              {/* Glow */}
              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  h-56
                  w-56
                  rounded-full
                  bg-primary/10
                  blur-[120px]
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />

              {/* Number */}
              <p
                className="
                  relative
                  z-10
                  heading-font
                  text-7xl
                  text-primary/15
                "
              >
                {value.id}
              </p>

              {/* Title */}
              <h3
                className="
                  relative
                  z-10
                  mt-6
                  heading-font
                  text-4xl
                  uppercase
                "
              >
                {value.title}
              </h3>

              {/* Subtitle */}
              <p
                className="
                  relative
                  z-10
                  mt-2
                  body-font
                  text-primary
                  uppercase
                  tracking-[0.15em]
                  text-sm
                "
              >
                {value.subtitle}
              </p>

              {/* Description */}
              <p
                className="
                  relative
                  z-10
                  mt-6
                  body-font
                  leading-relaxed
                  text-muted-foreground
                "
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
