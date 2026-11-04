"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, ShoppingBag, User } from "lucide-react";

import { useCartStore } from "@/src/store/cart-store";

type NavbarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

export function NavbarActions({ user }: { user: NavbarUser }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const loadCart = useCartStore((state) => state.loadCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (user) {
      void loadCart();
    } else {
      clearCart();
    }
  }, [user, loadCart, clearCart]);

  const handleLogout = async () => {
    clearCart();
    await signOut({ redirectTo: "/" });
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/cart"
        aria-label={`Shopping cart, ${user && hydrated ? totalItems : 0} items`}
        className="
          relative flex h-11 w-11 items-center justify-center
          rounded-full border border-white/10 bg-white/5 text-white
          backdrop-blur-xl transition-all duration-300
          hover:border-violet-400/30 hover:bg-violet-400/10
          hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]
        "
      >
        <ShoppingBag size={18} />

        <span
          className="
            absolute -right-1 -top-1 flex h-5 w-5 items-center
            justify-center rounded-full bg-violet-500 text-[10px]
            font-bold text-black body-font
          "
        >
          {user && hydrated ? totalItems : 0}
        </span>
      </Link>

      {user ? (
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/customer"
            className="
              flex h-11 items-center gap-2 rounded-full border
              border-white/10 bg-white/5 px-4 text-sm text-white/80
              transition-all hover:border-violet-400/30 hover:text-white
              body-font
            "
          >
            <User size={16} />
            <span className="max-w-28 truncate">
              {user.name || user.email || "My Account"}
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="
              flex h-11 w-11 items-center justify-center rounded-full
              border border-white/10 bg-white/5 text-white/80
              transition-all hover:border-red-400/30 hover:bg-red-400/10
              hover:text-red-300
            "
          >
            <LogOut size={17} />
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="
            hidden h-11 items-center rounded-full border border-white/10
            bg-white/5 px-5 text-sm text-white/80 backdrop-blur-xl
            transition-all duration-300 hover:border-white/20
            hover:bg-white/10 hover:text-white md:flex body-font
          "
        >
          <User size={16} className="mr-2" />
          Sign In
        </Link>
      )}
    </div>
  );
}