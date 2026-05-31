import Link from "next/link";
import Image from "next/image";

export function NavbarLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 md:gap-3">
      <div
        className="
        relative
    hidden
    h-11
    w-11
    items-center
    justify-center
    overflow-hidden
    rounded-full
    border
    border-violet-400/20
    bg-white/5
    backdrop-blur-xl
    md:flex
  "
      >
        <Image
          src="/logo/logo.png"
          alt="Mortiforge Logo"
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>

      {/* Text */}
      <div
        className="
          heading-font
          flex
          items-end
          text-2xl md:text-3xl
          uppercase
          leading-none
          tracking-wide
        "
      >
        <span className="text-white">Mortiforge</span>

        <span className="ml-1 text-violet-400">3D</span>
      </div>
    </Link>
  );
}
