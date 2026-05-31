import { Container } from "../../layout/container";
import { Section } from "../../layout/section";

import { FEATURES } from "./data";
import { FeatureRow } from "./featured-row";

export function WhyChooseUs() {
  return (
    <Section>
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
            Why Choose Mortiforge
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
            Built For
            <br />
            Precision
          </h2>

          <p
            className="
              body-font
              mt-6
              max-w-xl
              text-muted-foreground
            "
          >
            Combining advanced manufacturing, premium materials, and reliable
            delivery.
          </p>
        </div>

        <div className="mt-20">
          {FEATURES.map((feature) => (
            <FeatureRow key={feature.number} {...feature} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
