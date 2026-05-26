"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { Container } from "../container";

import { NavbarLogo } from "./navbar-logo";
import { NavbarLinks } from "./navbar-links";
import { MobileMenu } from "./mobile-menu";
import { NavbarActions } from "./navbar-actions";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="
        fixed
        top-4
        left-0
        z-50
        w-full
      "
    >
      <Container>
        <div
          className={`
                flex
                items-center
                justify-between
                rounded-full
                border
                px-6
                backdrop-blur-xl
                transition-all
                duration-500
                    
                ${
                  scrolled
                    ? `
                        h-16
                        border-white/15
                        bg-black/70
                        shadow-[0_10px_40px_rgba(0,0,0,0.45)]
                    `
                    : `
                        h-[72px]
                        border-white/10
                        bg-black/40
                    `
                }
  `}
        >
          <NavbarLogo />

          <NavbarLinks />

          <div className="flex items-center gap-3">
            <NavbarActions />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
