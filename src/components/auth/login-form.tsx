"use client";

import Link from "next/link";
import { Field, Input } from "@/src/components/ui/form";

export default function LoginForm() {
  return (
    <form className="space-y-6">
      {/* Email */}
      <Field label="Email Address">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>

      {/* Password */}
      <Field label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </Field>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="body-font text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Forgot password?
        </Link>
      </div>

      {/* Login */}
      <button
        type="button"
        className="body-font w-full rounded-full bg-primary px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:opacity-90"
      >
        Login
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
  className="body-font flex w-full items-center justify-center gap-3 rounded-full border border-border px-6 py-4 text-sm font-medium uppercase tracking-[0.15em] transition-all hover:border-primary hover:text-primary"
>
  <svg
  className="h-5 w-5"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
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

      {/* Register */}
      <p className="body-font text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-foreground transition-colors hover:text-primary"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}