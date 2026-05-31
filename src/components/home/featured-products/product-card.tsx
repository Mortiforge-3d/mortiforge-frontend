"use client";

import { motion } from "framer-motion";

interface ProductCardProps {
  name: string;
  category: string;
  price: string;
  emoji: string;
  description: string;
}

export function ProductCard({
  name,
  category,
  price,
  emoji,
  description,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
        group
        relative
        flex
        min-h-[600px]
        flex-col
        overflow-hidden
        border
        border-white/5
        bg-[#08080c]
        p-5
        rounded-sm
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/3
          h-[220px]
          w-[220px]
          -translate-x-1/2
          rounded-full
          bg-violet-500/10
          blur-[120px]
          transition-all
          duration-500
          group-hover:bg-violet-500/20
        "
      />
      {/* Subtle Grid */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.02]
          bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      <div
        className="
          relative
          flex
          h-[300px]
          items-center
          justify-center
        "
      >
        <motion.div
          whileHover={{
            scale: 1.04,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            relative
            h-[140px]
            w-[140px]
          "
        >
          <div
            style={{
              filter: "sepia(1) saturate(6) hue-rotate(240deg)",
            }}
            className="
                text-[8rem]
                transition-transform
                duration-500
                opacity-15
                group-hover:opacity-100
                group-hover:scale-110
              "
          >
            {emoji}
          </div>
          <div
            className="
                absolute
                h-[180px]
                w-[180px]
                rounded-full
                bg-violet-500/20
                blur-[100px]
              "
          />
        </motion.div>
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Small Meta */}
        <span
          className="
              inline-flex
              w-fit
              rounded-full
              border
              border-violet-500/20
              px-3
              py-1
              text-xs
              uppercase
              tracking-[0.2em]
              text-violet-300
              mt-3
            "
        >
          {category}
        </span>

        {/* Title */}
        <h3 className="heading-font mt-8 text-5xl uppercase leading-[0.9] tracking-wide text-white/80">
          {name.split(" ").slice(0, -1).join(" ")}
          <br />
          {name.split(" ").slice(-1)}
        </h3>

        {/* Description */}
        <p
          className="
            mt-2
            max-w-sm
            text-sm
            leading-relaxed
            text-violet-300
            body-font
          "
        >
          {description}
        </p>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between pt-8">
          <div>
            <p className="text-xs body-font uppercase tracking-[0.2em] text-white/40">
              Starting at
            </p>

            <p className="mt-1 heading-font text-3xl text-violet-300">{price}</p>
          </div>

          <span className="text-white/30 body-font">→</span>
        </div>
      </div>
    </motion.div>
  );
}
