import { Container } from "../../layout/container";
import { Section } from "../../layout/section";

import { TESTIMONIALS } from "./data";
import { TestimonialCard } from "./testimonial-card";
import { Reveal } from "../../animations/reveal";

export function Testimonials() {
  return (
    <Section className="py-32">
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <p
              className="
              body-font
              text-sm
              uppercase
              tracking-[0.3em]
              text-primary
            "
            >
              Testimonials
            </p>

            <h2
              className="
              mt-6
              heading-font
              text-6xl
              uppercase
              leading-none
              text-white
              md:text-7xl
            "
            >
              Trusted By
              <br />
              Creators
            </h2>

            <p
              className="
            body-font
              mt-6
              max-w-xl
              text-muted-foreground
            "
            >
              Feedback from customers who trusted Mortiforge with their ideas.
            </p>
          </div>
        </Reveal>

        <div
          className="
            mt-20
            grid
            gap-8
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.author} delay={index * 0.1}>
              <TestimonialCard {...testimonial} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
