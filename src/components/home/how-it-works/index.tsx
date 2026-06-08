import { Container } from "../../layout/container";
import { Section } from "../../layout/section";

import { PROCESS_STEPS } from "./data";
import { ProcessCard } from "./process-card";

import { Reveal } from "../../animations/reveal";

export function HowItWorks() {
  return (
    <Section className="overflow-hidden">
      <Container>
        {/* Heading */}

        <Reveal>
          <div className="max-w-3xl">
            <p
              className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-primary
            "
            >
              How It Works
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
              Turning Ideas
              <br />
              Into Reality
            </h2>

            <p
              className="
              mt-6
              max-w-xl
              text-muted-foreground
              body-font
            "
            >
              From concept to creation, our process is designed to make custom
              3D printing simple and reliable.
            </p>
          </div>
        </Reveal>

        {/* Steps */}
        <div
          className="
            mt-24
            grid
            gap-12
            md:grid-cols-3
          "
        >
          {PROCESS_STEPS.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.1}>
              <ProcessCard {...step} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
