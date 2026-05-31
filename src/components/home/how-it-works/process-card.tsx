"use client";

interface ProcessCardProps {
  number: string;
  title: string;
  description: string;
}

export function ProcessCard({ number, title, description }: ProcessCardProps) {
  return (
    <div
      className="
        group
        relative
        border-t
        border-primary/25
        pt-10
      "
    >
        <div
            className="
                absolute
                left-1/2
                top-1/2
                h-[600px]
                w-[600px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-primary/10
                blur-[180px]
                pointer-events-none
                "
        />
      {/* Huge Number */}
      <div
        className="
          absolute
          right-0
          top-0
          heading-font
          text-[7rem]
          leading-none
          text-primary/5
          transition-all
          duration-500
          group-hover:text-primary/100
        "
      >
        {number}
      </div>

      {/* Title */}
      <h3
        className="
          relative
          z-10
          heading-font
          text-4xl
          uppercase
          leading-[0.9]
          text-white
        "
      >
        {title.split("\n").map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>

      {/* Description */}
      <p
        className="
          mt-6
          max-w-xs
          text-muted-foreground
          leading-relaxed
          body-font
        "
      >
        {description}
      </p>

      {/* Hover Line */}
      <div
        className="
          mt-8
          h-[2px]
          w-0
          bg-primary
          transition-all
          duration-500
          group-hover:w-20
        "
      />
    </div>
  );
}
