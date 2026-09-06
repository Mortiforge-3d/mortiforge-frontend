"use client";

import Link from "next/link";
import { Field, Input } from "@/src/components/ui/form";

export default function ResetPasswordForm() {
  return (
    <form className="space-y-6">
      <Field label="New Password">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter new password"
          autoComplete="new-password"
        />
      </Field>

      <Field label="Confirm New Password">
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          autoComplete="new-password"
        />
      </Field>

      <button
        type="button"
        className="body-font w-full rounded-full bg-primary px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:opacity-90"
      >
        Reset Password
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