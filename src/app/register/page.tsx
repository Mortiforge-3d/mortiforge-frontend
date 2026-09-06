import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main>
      <Section className="min-h-[calc(100vh-8rem)] flex items-center pt-32 md:pt-36">
        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Brand Side */}
            <div className="hidden lg:block">
              <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                MORTIFORGE 3D
              </p>

              <h1 className="heading-font mt-6 max-w-xl text-6xl uppercase leading-[0.9] xl:text-8xl">
                Enter
                <br />
                The Forge.
              </h1>

              <p className="mt-8 max-w-lg body-font leading-relaxed text-muted-foreground">
                Create your Mortiforge account to manage orders, track custom
                projects, and build your collection.
              </p>

              <Link
                href="/"
                className="mt-8 inline-block body-font text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                ← Back to Mortiforge
              </Link>
            </div>

            {/* Register Card */}
            <div className="mx-auto w-full max-w-xl">
              <div className="rounded-3xl border border-border bg-card/40 p-8 backdrop-blur md:p-10">
                {/* Mobile Branding */}
                <div className="mb-10 lg:hidden">
                  <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                    MORTIFORGE 3D
                  </p>
                </div>

                <div className="mb-10">
                  <h2 className="heading-font text-4xl uppercase md:text-5xl">
                    Create Account
                  </h2>

                  <p className="mt-4 body-font text-sm leading-relaxed text-muted-foreground">
                    Join Mortiforge and start your 3D printing journey.
                  </p>
                </div>

                <RegisterForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}