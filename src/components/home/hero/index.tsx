import { Container } from "../../layout/container";
import { Section } from "../../layout/section";

import { HeroBackground } from "./hero-background";
import { HeroVisual } from "./hero-visual";
import { HeroContent } from "./hero-content";
import { HeroMarquee } from "./hero-marquee";

export function HeroSection() {
  return (
    <Section
      className="
        overflow-hidden
        min-h-screen pt-32 pb-16 md:pt-40 md:pb-24
      "
    >
      <HeroBackground />
      <div
        className="
    absolute
    inset-0
    bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
    bg-[size:80px_80px]
  "
      />

      <Container>
        <div
          className="
            relative
            grid
            items-center
            gap-10
            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-4
          "
        >
          <HeroContent />

          <HeroVisual />
        </div>
      </Container>
      <HeroMarquee />
    </Section>
  );
}
