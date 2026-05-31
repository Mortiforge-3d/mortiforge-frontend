import { Container } from "../../layout/container";
import { Section } from "../../layout/section";

import { TESTIMONIALS } from "./data";
import { TestimonialCard } from "./testimonial-card";

export function Testimonials() {
  return (
    <Section className="py-32">
      <Container>
        <div className="max-w-3xl">
          <p
            className="
              body-font
              text-sm
              uppercase
              tracking-[0.3em]
              text-violet-300
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

        <div
          className="
            mt-20
            grid
            gap-8
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.author} {...testimonial} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
