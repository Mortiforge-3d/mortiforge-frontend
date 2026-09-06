import Link from "next/link";
import { Container } from "@/src/components/layout/container";
import { Section } from "@/src/components/layout/section";
import AdminSidebar from "@/src/components/admin/admin-sidebar";

export default function AdminSettingsPage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <AdminSidebar />

            <div>
              {/* Header */}
              <div>
                <p className="body-font text-sm uppercase tracking-[0.35em] text-primary">
                  SYSTEM CONFIGURATION
                </p>

                <h1 className="heading-font mt-4 text-5xl uppercase md:text-6xl">
                  Settings
                </h1>

                <p className="mt-5 max-w-2xl body-font leading-relaxed text-muted-foreground">
                  Manage store configuration, account preferences,
                  notifications, and system settings.
                </p>
              </div>

              {/* Store Information */}
              <div className="mt-10 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  STORE INFORMATION
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="body-font text-sm">
                      Store Name
                    </label>

                    <input
                      type="text"
                      defaultValue="Mortiforge 3D"
                      className="mt-2 w-full rounded-2xl border border-border bg-background/40 px-5 py-3 body-font text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="body-font text-sm">
                      Store Email
                    </label>

                    <input
                      type="email"
                      defaultValue="hello@mortiforge.com"
                      className="mt-2 w-full rounded-2xl border border-border bg-background/40 px-5 py-3 body-font text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="body-font text-sm">
                      Contact Phone
                    </label>

                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-2 w-full rounded-2xl border border-border bg-background/40 px-5 py-3 body-font text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="body-font text-sm">
                      Currency
                    </label>

                    <select
                      defaultValue="INR"
                      className="mt-2 w-full rounded-2xl border border-border bg-background/40 px-5 py-3 body-font text-sm outline-none transition-colors focus:border-primary"
                    >
                      <option value="INR">INR — Indian Rupee</option>
                      <option value="USD">USD — US Dollar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Settings */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  ORDER SETTINGS
                </p>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between gap-6 rounded-2xl border border-border p-5">
                    <div>
                      <p className="body-font text-sm font-medium">
                        Accept New Orders
                      </p>
                      <p className="body-font mt-1 text-xs text-muted-foreground">
                        Allow customers to place new orders.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 accent-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-6 rounded-2xl border border-border p-5">
                    <div>
                      <p className="body-font text-sm font-medium">
                        Automatically Confirm Orders
                      </p>
                      <p className="body-font mt-1 text-xs text-muted-foreground">
                        Automatically move newly paid orders to processing.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Request Settings */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  CUSTOM REQUEST SETTINGS
                </p>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between gap-6 rounded-2xl border border-border p-5">
                    <div>
                      <p className="body-font text-sm font-medium">
                        Accept Custom Requests
                      </p>
                      <p className="body-font mt-1 text-xs text-muted-foreground">
                        Allow customers to submit custom printing requests.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 accent-primary"
                    />
                  </div>

                  <div>
                    <label className="body-font text-sm">
                      Default Request Response Time
                    </label>

                    <select
                      defaultValue="2-3"
                      className="mt-2 w-full rounded-2xl border border-border bg-background/40 px-5 py-3 body-font text-sm outline-none transition-colors focus:border-primary md:max-w-sm"
                    >
                      <option value="1">Within 24 hours</option>
                      <option value="2-3">2–3 business days</option>
                      <option value="3-5">3–5 business days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  NOTIFICATIONS
                </p>

                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between gap-6 rounded-2xl border border-border p-5">
                    <div>
                      <p className="body-font text-sm font-medium">
                        New Order Notifications
                      </p>
                      <p className="body-font mt-1 text-xs text-muted-foreground">
                        Receive notifications when a new order is placed.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 accent-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-6 rounded-2xl border border-border p-5">
                    <div>
                      <p className="body-font text-sm font-medium">
                        Custom Request Notifications
                      </p>
                      <p className="body-font mt-1 text-xs text-muted-foreground">
                        Receive notifications when a new custom request is
                        submitted.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 accent-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-6 rounded-2xl border border-border p-5">
                    <div>
                      <p className="body-font text-sm font-medium">
                        Review Notifications
                      </p>
                      <p className="body-font mt-1 text-xs text-muted-foreground">
                        Receive notifications when a customer submits a
                        review.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="mt-8 rounded-lg border border-border bg-card/40 p-6 backdrop-blur md:p-8">
                <p className="body-font text-xs uppercase tracking-[0.25em] text-primary">
                  SECURITY
                </p>

                <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="body-font text-sm font-medium">
                      Administrator Account
                    </p>

                    <p className="body-font mt-1 text-xs text-muted-foreground">
                      Manage your administrator password and account security.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="rounded-full border border-border px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:border-primary hover:text-primary"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  className="rounded-full bg-primary px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Save Changes
                </button>

                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full border border-border px-7 py-4 body-font text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}