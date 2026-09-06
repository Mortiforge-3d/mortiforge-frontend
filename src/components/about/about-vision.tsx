import Image from "next/image";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";

export function AboutVision() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Left */}
          <div className="relative">
            {/* Mobile Background Logo */}
            <div
              className="
    absolute
    inset-0
    flex
    items-center
    justify-center
    lg:hidden
    pointer-events-none
  "
            >
              {/* Glow */}
              <div
                className="
      absolute
      h-64
      w-64
      rounded-full
      bg-primary/10
      blur-[100px]
    "
              />

              <Image
                src="/logo/logo-nobg.png"
                alt="Mortiforge"
                width={280}
                height={280}
                className="opacity-10 object-contain"
              />
            </div>

            <div className="relative z-10">
              <p
                className="
      mb-3
      body-font
      text-sm
      uppercase
      tracking-[0.4em]
      text-primary
    "
              >
                OUR VISION
              </p>

              <h2
                className="
      heading-font
      text-5xl
      uppercase
      leading-none
      lg:text-7xl
    "
              >
                Bringing
                <br />
                Digital Ideas
                <br />
                Into Reality.
              </h2>

              <p
                className="
      mt-8
      max-w-xl
      body-font
      text-muted-foreground
      leading-relaxed
    "
              >
                Mortiforge exists to transform creative ideas into
                premium-quality physical products. Whether it&apos;s a collectible,
                desk accessory, prototype, or custom creation, every project
                deserves precision and care.
              </p>

              <p
                className="
      mt-5
      max-w-xl
      body-font
      text-muted-foreground
      leading-relaxed
    "
              >
                We focus on thoughtful design, reliable materials, and attention
                to detail so every print feels professional from concept to
                completion.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="relative aspect-square hidden lg:block">
            {/* Large soft glow */}
            <div
              className="
      absolute
      left-1/2
      top-1/2
      h-80
      w-80
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-primary/10
      blur-[150px]
    "
            />

            {/* Small intense glow */}
            <div
              className="
      absolute
      left-1/2
      top-1/2
      h-48
      w-48
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-primary/30
      blur-[70px]
    "
            />

            <Image
              src="/logo/logo-nobg.png"
              alt="Mortiforge"
              fill
              className="relative object-contain opacity-10"
            />
          </div>
        </div>
        <div className="mt-20">
          <div
            className="
    grid
    gap-6
    text-center
    md:grid-cols-5
  "
          >
            <div>
              <h3 className="heading-font text-2xl text-primary">01</h3>

              <p className="mt-3 body-font uppercase">Idea</p>
            </div>

            <div>
              <h3 className="heading-font text-2xl text-primary">02</h3>

              <p className="mt-3 body-font uppercase">Design</p>
            </div>

            <div>
              <h3 className="heading-font text-2xl text-primary">03</h3>

              <p className="mt-3 body-font uppercase">Print</p>
            </div>

            <div>
              <h3 className="heading-font text-2xl text-primary">04</h3>

              <p className="mt-3 body-font uppercase">Quality</p>
            </div>

            <div>
              <h3 className="heading-font text-2xl text-primary">05</h3>

              <p className="mt-3 body-font uppercase">Delivery</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
