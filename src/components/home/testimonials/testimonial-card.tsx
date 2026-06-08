interface TestimonialCardProps {
  quote: string;
  author: string;
}

export function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div
      className="
        group
        relative
        flex
        min-h-[320px]
        flex-col
        justify-between
        rounded-xl
        border
        border-border
        bg-surface
        p-8
        transition-all
        duration-300
        hover:border-primary/50
      "
    >
      {/* Quote mark */}
      <span
        className="
          heading-font
          text-7xl
          leading-none
          text-primary/20
        "
      >
        &#10077;
      </span>

      {/* Quote */}
      <p
        className="
          body-font
          mt-6
          text-xl
          leading-relaxed
          text-primary
        "
      >
        {quote}
      </p>

      {/* Author */}
      <div
        className="
          heading-font
          mt-8
          text-md
          uppercase
          tracking-[0.1em]
          text-muted-foreground
        "
      >
        — {author}
      </div>
    </div>
  );
}
