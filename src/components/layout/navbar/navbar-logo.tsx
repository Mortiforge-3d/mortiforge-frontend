import Link from "next/link";

export function NavbarLogo() {
    return (
      <Link
        href="/"
        className="heading-font text-4xl uppercase leading-none tracking-wide"
        >
            Mortiforge 3D   
      </Link>
    );
}