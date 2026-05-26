"use client";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { NAVBAR_LINKS } from "./navbar-data";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/5
          text-white
          backdrop-blur-xl
          transition-all
          duration-300
          hover:border-white/20
          hover:bg-white/10
          md:hidden
        "
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              fixed
              inset-0
              z-[100]
              flex
              flex-col
              bg-black/90
              backdrop-blur-2xl
            "
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-6">
              <h2 className="heading-font text-4xl uppercase">Mortiforge</h2>

              <button
                onClick={() => setIsOpen(false)}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  text-white
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <div
              className="
                flex
                flex-1
                flex-col
                items-center
                justify-center
                gap-8
              "
            >
              {NAVBAR_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="
                      heading-font
                      text-5xl
                      uppercase
                      tracking-wide
                      text-white/80
                      transition-all
                      duration-300
                      hover:text-cyan-400
                    "
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-8 text-center">
              <p className="body-font text-sm text-white/40">
                Premium futuristic 3D printing
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
