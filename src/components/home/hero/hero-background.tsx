"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroBackground() {
  const { scrollY } = useScroll();

  const topGlowY = useTransform(scrollY, [0, 500], [0, 120]);

  const sideGlowY = useTransform(scrollY, [0, 500], [0, 80]);
  return (
    <>
      {/* Top Glow */}
      <motion.div
        style={{ y: topGlowY }}
        className="
          absolute
          top-[-200px]
          left-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-violet-500/15
          blur-[140px]
        "
      />

      {/* Side Glow */}
      <motion.div
        style={{ y: sideGlowY }}
        className="
          absolute
          right-0
          top-1/2
          h-[400px]
          w-[400px]
          -translate-y-1/2
          rounded-full
          bg-fuchsia-500/15
          blur-[140px]
        "
      />
    </>
  );
}
