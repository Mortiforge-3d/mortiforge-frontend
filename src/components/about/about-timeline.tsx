import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

interface AboutTimelineProps {
  children: React.ReactNode;
}

export function AboutTimeline({ children }: AboutTimelineProps) {
  return (
    <Section className="relative overflow-hidden">
      <Container>
        <div className="relative grid grid-cols-[120px_1fr] gap-8">
          {/* Timeline Column */}
          <div className="relative">{/* SVG will go here */}</div>

          {/* Content */}
          <div className="space-y-40">{children}</div>
        </div>
      </Container>
    </Section>
  );
}
