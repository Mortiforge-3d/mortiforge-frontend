import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("relative pt-24 md:pt-32", className)}>
      {children}
    </section>
  );
}
