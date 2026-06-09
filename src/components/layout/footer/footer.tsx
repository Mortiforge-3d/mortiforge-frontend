import { Container } from "../container";

import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border py-24">
      <div
        className="
        absolute
        top-1/2
        left-0
        -translate-y-1/2
        pointer-events-none
  "
      >
        <div
          className="
          inset-0
          absolute
          blur-[120px]
          bg-primary/20
    "
        />
        <div
          className="
          h-[500px]
          relative
          opacity-[0.1]
          w-[500px]
    "
        >
          <Image
            src="/logo/logo-nobg.png"
            alt="Mortiforge"
            sizes=""
            fill
            className="object-contain"
          />
        </div>
      </div>
      <Container>
        <div className="grid gap-16 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2
              className="
                heading-font
                text-5xl
                uppercase
                text-white
              "
            >
              Mortiforge
            </h2>

            <p
              className="
                body-font
                mt-4
                max-w-sm
                text-muted-foreground
              "
            >
              Premium 3D printing, custom fabrication, and collectible designs
              crafted with precision.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="
                text-sm
                uppercase
                tracking-[0.2em]
                text-primary
                body-font
              "
            >
              Navigation
            </h3>

            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href="#"
                  className="
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                    body-font
                "
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                    body-font
                "
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                    body-font
                "
                >
                  Custom Printing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                    body-font
                "
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="
                text-sm
                uppercase
                tracking-[0.2em]
                text-primary
                body-font
              "
            >
              Connect
            </h3>

            <ul className="mt-6 space-y-3">
              <li>
                <a
                  href="#"
                  className="
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                    body-font
                "
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                    body-font
                "
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="
                    text-muted-foreground
                    transition-colors
                    hover:text-primary
                    body-font
                "
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="
            mt-20
            border-t
            border-border
            pt-8
            text-sm
            text-muted-foreground
            body-font
          "
        >
          © 2026 Mortiforge. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
