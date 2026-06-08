"use client";

interface FeatureRowProps {
  number: string;
  title: string;
  description: string;
}

export function FeatureRow({ number, title, description }: FeatureRowProps) {
  return (
    <div
      className="
        group
        grid
        gap-6
        border-b
        border-border
        py-10
        transition-all
        duration-300
        md:grid-cols-[120px_1fr_320px]
      "
    >
      {/* Number */}
      <div
        className="
          heading-font
          text-4xl
          text-primary/50
          transition-all
          duration-300
          group-hover:text-primary
        "
      >
        {number}
      </div>

      {/* Title */}
      <h3
        className="
          heading-font
          text-3xl
          uppercase
          text-white
          transition-all
          duration-300
          group-hover:translate-x-2
        "
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="
          body-font
          text-sm
          leading-relaxed
          text-muted-foreground
        "
      >
        {description}
      </p>
    </div>
  );
}
