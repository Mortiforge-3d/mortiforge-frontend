import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import CustomerSidebar from "@/src/components/customer/customer-sidebar";
import { Field, Input } from "@/src/components/ui/form";

export default function CustomerProfilePage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <CustomerSidebar />

            <div>
              <div>
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  ACCOUNT
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Profile
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  Manage your personal information and account details.
                </p>
              </div>

              <div className="mt-12 rounded-3xl border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <div className="mb-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    PERSONAL INFORMATION
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="First Name">
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                    </Field>

                    <Field label="Last Name">
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>

                  <Field label="Email Address">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Field>

                  <Field label="Phone Number">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      autoComplete="tel"
                    />
                  </Field>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      className="rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="mt-8 rounded-3xl border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <div className="mb-8">
                  <p className="body-font text-xs uppercase tracking-[0.2em] text-primary">
                    SECURITY
                  </p>

                  <h2 className="heading-font mt-3 text-3xl uppercase">
                    Password
                  </h2>

                  <p className="mt-3 body-font text-sm leading-relaxed text-muted-foreground">
                    Change your account password.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-border px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}