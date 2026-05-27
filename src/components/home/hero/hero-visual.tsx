"use client";
import { Scene } from "../../3d/scene";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
export function HeroVisual() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  if (isMobile === null) return null;
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
        duration: 1.2,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        h-[320px] sm:h-[420px] lg:h-[700px]
        w-full
        lg:h-[700px]
      "
    >
      <Scene />
    </motion.div>
  );
}
