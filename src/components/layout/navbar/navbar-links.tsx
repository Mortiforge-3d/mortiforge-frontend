"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { useState } from "react";

import { NAVBAR_LINKS } from "./navbar-data";

export function NavbarLinks() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {NAVBAR_LINKS.map((link) => {
        const isHovered = hovered === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="
              relative
              body-font
              text-sm
              uppercase
              tracking-[0.12em]
              text-[var(--text-secondary)]
              transition-colors
              duration-300
              hover:text-white
            "
            onMouseEnter={() => setHovered(link.href)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="relative z-10">{link.label}</span>

            {isHovered && (
              <motion.div
                layoutId="navbar-hover"
                className="
                  absolute
                  left-0
                  top-full
                  mt-2
                  h-[2px]
                  w-full
                  rounded-full
                  bg-violet-500
                  shadow-[0_0_18px_rgba(139,92,246,0.55)]
                "
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 26,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
