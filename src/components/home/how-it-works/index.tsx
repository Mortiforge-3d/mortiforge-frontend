import { Container } from "../../layout/container";
import { Section } from "../../layout/section";

import { PROCESS_STEPS } from "./data";
import { ProcessCard } from "./process-card";

export function HowItWorks() {
  return (
    <Section className="overflow-hidden">
      <Container>
        {/* Heading */}
        <div className="max-w-3xl">
          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-violet-300
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
            From concept to creation, our process is designed to make custom 3D
            printing simple and reliable.
          </p>
        </div>

        {/* Steps */}
        <div
          className="
            mt-24
            grid
            gap-12
            md:grid-cols-3
          "
        >
          {PROCESS_STEPS.map((step) => (
            <ProcessCard key={step.number} {...step} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
