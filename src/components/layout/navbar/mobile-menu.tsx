"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, User, X } from "lucide-react";

import { NAVBAR_LINKS } from "./navbar-data";

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export function MobileMenu({ user }: { user: NavbarUser }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut({ redirectTo: "/" });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="
          flex h-11 w-11 items-center justify-center rounded-full
          border border-white/10 bg-white/5 text-white backdrop-blur-xl
          transition-all duration-300 hover:border-white/20
          hover:bg-white/10 md:hidden
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
              fixed left-0 top-0 z-50 h-screen w-full overflow-y-auto
              border bg-black px-6 pt-28 pb-10
            "
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="
                absolute right-6 top-6 flex h-11 w-11 items-center
                justify-center rounded-full border border-white/10
                bg-white/5 text-white
              "
            >
              <X size={20} />
            </button>

            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              {NAVBAR_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="
                      heading-font text-5xl uppercase tracking-wide
                      text-violet-500/80 transition-all duration-300
                      hover:text-violet-500
                    "
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {user ? (
                <>
                  <Link
                    href="/customer"
                    onClick={() => setIsOpen(false)}
                    className="
                      mt-2 flex items-center gap-2 rounded-full
                      border border-white/10 bg-white/5 px-6 py-3
                      text-sm uppercase tracking-[0.15em] text-white/80
                      transition-colors hover:border-violet-500/50
                      hover:text-violet-500 body-font
                    "
                  >
                    <User size={16} />
                    {user.name || "My Account"}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex items-center gap-2 rounded-full
                      border border-white/10 bg-white/5 px-6 py-3
                      text-sm uppercase tracking-[0.15em] text-white/80
                      transition-colors hover:border-red-400/50
                      hover:text-red-300 body-font
                    "
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="
                    mt-2 flex items-center gap-2 rounded-full
                    border border-white/10 bg-white/5 px-6 py-3
                    text-sm uppercase tracking-[0.15em] text-white/80
                    transition-colors hover:border-violet-500/50
                    hover:text-violet-500 body-font
                  "
                >
                  <User size={16} />
                  Sign In
                </Link>
              )}
            </div>

            <div className="p-8 text-center">
              <p className="body-font text-sm text-white">
                Premium futuristic 3D printing
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}