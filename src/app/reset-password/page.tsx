import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import ResetPasswordForm from "@/src/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main>
      <Section className="min-h-[calc(100vh-8rem)] flex items-center pt-32 md:pt-36">
        <Container>
          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-border bg-card/40 p-8 backdrop-blur md:p-10">
              <div className="mb-10">
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  MORTIFORGE 3D
                </p>

                <h1 className="heading-font mt-6 text-4xl uppercase md:text-5xl">
                  Set New Password
                </h1>

                <p className="mt-4 body-font leading-relaxed text-muted-foreground">
                  Create a new password for your Mortiforge account.
                </p>
              </div>

              <ResetPasswordForm />

              <Link
                href="/"
                className="mt-8 block text-center body-font text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                ← Back to Mortiforge
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}