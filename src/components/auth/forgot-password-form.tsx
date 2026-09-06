"use client";

import Link from "next/link";
import { Field, Input } from "@/src/components/ui/form";

export default function ForgotPasswordForm() {
  return (
    <form className="space-y-6">
      <Field label="Email Address">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>

      <button
        type="button"
        className="body-font w-full rounded-full bg-primary px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:opacity-90"
      >
        Send Reset Link
      </button>

      <p className="body-font text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-foreground transition-colors hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}