"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, Input } from "@/src/components/ui/form";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create your account.");
      }

      setSuccess(
        data.message ?? "Account created successfully. You can now sign in.",
      );
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="First Name" required>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First name"
            autoComplete="given-name"
            minLength={1}
            maxLength={80}
            required
          />
        </Field>

        <Field label="Last Name" required>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last name"
            autoComplete="family-name"
            minLength={1}
            maxLength={80}
            required
          />
        </Field>
      </div>

      <Field label="Email Address" required>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          maxLength={254}
          required
        />
      </Field>

      <Field label="Password" hint="Use at least 8 characters." required>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
        />
      </Field>

      <Field label="Confirm Password" required>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {success && (
        <div role="status" className="space-y-3 text-sm text-primary">
          <p>{success}</p>
          <Link href="/login" className="inline-block underline">
            Continue to login
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="body-font w-full rounded-full bg-primary px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center">
          <span className="body-font bg-card px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { redirectTo: "/customer" })}
        className="body-font flex w-full items-center justify-center gap-3 rounded-full border border-border px-6 py-4 text-sm font-medium uppercase tracking-[0.15em] transition-all hover:border-primary hover:text-primary"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.35 12.27c0-.78-.07-1.54-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
          />
          <path
            fill="#34A853"
            d="M12 21.5c2.63 0 4.84-.87 6.46-2.36l-3.14-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.71-1.72-5.49-4.03H3.27v2.53A9.75 9.75 0 0 0 12 21.5Z"
          />
          <path
            fill="#FBBC05"
            d="M6.51 13.59A5.86 5.86 0 0 1 6.2 12c0-.55.11-1.09.31-1.59V7.88H3.27A9.5 9.5 0 0 0 2.25 12c0 1.48.35 2.88 1.02 4.12l3.24-2.53Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.47 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.73 5.38l3.24 2.53C7.29 8.1 9.45 6.38 12 6.38Z"
          />
        </svg>
        Continue with Google
      </button>

      <p className="body-font text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
