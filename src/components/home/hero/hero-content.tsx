"use client";

import Link from "next/link";
import { HERO_DATA } from "./hero-data";
import { HeroStats } from "./hero-stats";
import { motion } from "framer-motion";
import { useEffect,useState } from "react";

export function HeroContent() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <motion.div
      initial={{
        opacity: isMobile ? 1 : 0,
        y: isMobile ? 0 : 40,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className=" relative z-10 max-w-2xl text-center lg:text-left"
    >
      {/* Eyebrow */}
      <div
        className="
    mb-6
    inline-flex
    items-center
    gap-3
    rounded-full
    border
    border-primary
    px-5
    py-2.5
    text-sm
    uppercase
    tracking-[0.2em]
    text-primary
    backdrop-blur-xl
  "
      >
        {/* Blinking Dot */}
        <div className="relative flex h-3 w-3">
          {/* Ping */}
          <span
            className="
        absolute
        inline-flex
        h-full
        w-full
        animate-ping
        rounded-full
        bg-violet-500
        opacity-75
      "
          />

          {/* Solid Dot */}
          <span
            className="
        relative
        inline-flex
        h-3
        w-3
        rounded-full
        bg-violet-500
        shadow-[0_0_12px_rgba(168,85,247,0.9)]
      "
          />
        </div>

        <span>{HERO_DATA.eyebrow}</span>
      </div>

      {/* Title */}
      <h1
        className="
    heading-font
    flex
    flex-col
    text-[4.5rem]
    uppercase
    leading-[0.9]
    tracking-wide
    sm:text-[6rem]
    md:text-[7rem]
    lg:text-[8.5rem]
  "
      >
        <span className="text-white">Forge</span>

        <span className=" text-primary">The Future</span>

        <span className="text-white">In 3D</span>
      </h1>

      {/* Description */}
      <p
        className="
          mt-8
          mx-auto max-w-xl lg:mx-0
          text-lg
          leading-relaxed
          text-white/80
          md:text-md
          body-font
        "
      >
        {HERO_DATA.description}
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
        <Link
          href={HERO_DATA.primaryCta.href}
          className="
            rounded-full
            bg-primary
            px-8
            py-4
            text-sm
            font-medium
            uppercase
            tracking-[0.15em]
            text-white
            transition-all
            duration-300
            hover:scale-[1.03]
            hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]
          "
        >
          {HERO_DATA.primaryCta.label}
        </Link>

        <Link
          href={HERO_DATA.secondaryCta.href}
          className="
            rounded-full
            border
            border-white/10
            bg-white/5
            px-8
            py-4
            text-sm
            uppercase
            tracking-[0.15em]
            text-white
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-white/20
            hover:bg-white/10
          "
        >
          {HERO_DATA.secondaryCta.label}
        </Link>
        <HeroStats />
      </div>
    </motion.div>
  );
}
