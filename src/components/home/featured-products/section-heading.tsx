import { Reveal } from "../../animations/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="mx-auto max-w-3xl text-center">
        <div
          className="
          body-font
          mb-4
          text-sm
          uppercase
          tracking-[0.3em]
          text-primary
        "
        >
          {eyebrow}
        </div>

        <h2
          className="
          heading-font
          text-5xl
          uppercase
          leading-none
          text-white
          md:text-7xl
        "
        >
          {title}
        </h2>

        <p
          className="
          body-font
          mt-6
          text-base
          leading-relaxed
          text-white/60
          md:text-lg
        "
        >
          {description}
        </p>
      </div>
    </Reveal>
  );
}
