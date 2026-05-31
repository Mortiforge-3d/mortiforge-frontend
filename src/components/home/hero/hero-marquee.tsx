"use client";

const ITEMS = [
  "CUSTOM 3D PRINTING",
  "FUTURISTIC DESIGNS",
  "RAPID PROTOTYPING",
  "HIGH PRECISION",
  "PREMIUM MATERIALS",
  "CREATIVE ENGINEERING",
];

export function HeroMarquee() {
  return (
    <div
      className="
        relative
        mt-20
        overflow-hidden
        border-y
        border-white/10
        bg-white/[0.02]
        py-4
      "
    >
      <div
        className="
          flex
          min-w-max
          animate-marquee
          gap-10
        "
      >
        {[...ITEMS, ...ITEMS].map((item, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              gap-10
            "
          >
            <span
              className="
                heading-font
                text-lg
                tracking-[0.2em]
                text-white/70
                md:text-xl
              "
            >
              {item}
            </span>

            <span className="text-violet-400">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
