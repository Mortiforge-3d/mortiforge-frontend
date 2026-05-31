import { HERO_STATS } from "./hero-stats-data";

export function HeroStats() {
  return (
    <div
      className="
        relative
        mt-14
      "
    >
      {/* Background Glow */}
      <div
        className="
            absolute
            left-1/2
            top-1/2
            -z-10
            h-[220px]
            w-[420px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-500/12
            blur-[120px]
  "
      />
      <div
        className="grid
        grid-cols-3
        gap-4"
      >
        {HERO_STATS.map((stat) => (
          <div
            key={stat.label}
            className="
            px-4
            py-5
          "
          >
            <div
              className="
              heading-font
              text-2xl
              text-white
              md:text-3xl
            "
            >
              {stat.value}
            </div>

            <div
              className="
              mt-1
              text-xs
              uppercase
              tracking-[0.15em]
              text-white/50
              md:text-sm
            "
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
