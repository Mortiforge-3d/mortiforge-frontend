import Link from "next/link";

import { ShoppingBag, User } from "lucide-react";

export function NavbarActions() {
  return (
    <div className="flex items-center gap-3">
      {/* Cart Button */}
      <button
        className="
          relative
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
          hover:border-violet-400/30
          hover:bg-violet-400/10
          hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]
        "
      >
        <ShoppingBag size={18} />

        {/* Cart Count */}
        <span
          className="
            absolute
            -top-1
            -right-1
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-violet-500
            text-[10px]
            font-bold
            text-black
            body-font
          "
        >
          0
        </span>
      </button>

      {/* Account Button */}
      <Link
        href="/login"
        className="
          hidden
          h-11
          items-center
          rounded-full
          border
          border-white/10
          bg-white/5
          px-5
          text-sm
          text-white/80
          backdrop-blur-xl
          transition-all
          duration-300
          hover:border-white/20
          hover:bg-white/10
          hover:text-white
          md:flex
          body-font
        "
      >
        <User size={16} className="mr-2" />
        Sign In
      </Link>
    </div>
  );
}
