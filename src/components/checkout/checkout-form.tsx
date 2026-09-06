"use client";

import { Field, Input } from "@/src/components/ui/form";

export default function CheckoutForm() {
  return (
    <div className="space-y-10">
      {/* Customer Information */}

      <div>
        <h2 className="heading-font text-3xl uppercase">
          Customer Information
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field label="First Name" required>
            <Input
              name="firstName"
              placeholder="Enter your first name"
              autoComplete="given-name"
            />
          </Field>

          <Field label="Last Name" required>
            <Input
              name="lastName"
              placeholder="Enter your last name"
              autoComplete="family-name"
            />
          </Field>

          <Field label="Email Address" required>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </Field>

          <Field label="Phone Number" required>
            <Input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              autoComplete="tel"
            />
          </Field>
        </div>
      </div>

      {/* Shipping Address */}

      <div>
        <h2 className="heading-font text-3xl uppercase">
          Shipping Address
        </h2>

        <div className="mt-6 space-y-6">
          <Field label="Address" required>
            <Input
              name="address"
              placeholder="House number, street, area"
              autoComplete="street-address"
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="City" required>
              <Input
                name="city"
                placeholder="Enter your city"
                autoComplete="address-level2"
              />
            </Field>

            <Field label="State" required>
              <Input
                name="state"
                placeholder="Enter your state"
                autoComplete="address-level1"
              />
            </Field>

            <Field label="Pincode" required>
              <Input
                type="text"
                name="pincode"
                placeholder="Enter pincode"
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </Field>

            <Field label="Country" required>
              <Input
                name="country"
                defaultValue="India"
                autoComplete="country-name"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Payment */}

      <div>
        <h2 className="heading-font text-3xl uppercase">
          Payment
        </h2>

        <div className="mt-6 rounded-2xl border border-border bg-card/40 p-6">
          <p className="body-font text-sm text-muted-foreground">
            Secure online payment will be available here once the
            payment system is connected.
          </p>
        </div>
      </div>

      {/* Place Order */}

      <button
        type="button"
        className="
          w-full
          rounded-full
          bg-primary
          px-8
          py-4
          body-font
          font-semibold
          text-primary-foreground
          transition-all
          hover:scale-[1.01]
        "
      >
        Place Order
      </button>
    </div>
  );
}