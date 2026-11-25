"use client";

import { useSignUpWithEmailPassword } from "@convex-dev/auth/methods/email-password/react";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { AuthPanel } from "./AuthPanel";

export function SignUpForm() {
  const { signUp, pending } = useSignUpWithEmailPassword(api.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (sentTo !== null) {
    return (
      <AuthPanel title="Check your email">
        <p className="text-sm leading-6 text-slate-600">
          We sent a verification link to <strong>{sentTo}</strong>. Open it in this browser to validate your email and
          finish signing in.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Already verified?{" "}
          <Link href="/sign-in" className="font-semibold underline">
            Sign in
          </Link>
        </p>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel title="Create an account">
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          const result = await signUp({ email, password });
          if (result.success) {
            setSentTo(email);
            return;
          }

          setError(() => {
            switch (result.userError.error) {
              case "INVALID_EMAIL":
                return "That email address doesn't look valid.";
              case "EMAIL_TAKEN":
                return "An account already exists with that email address.";
              case "RATE_LIMITED":
                return `Too many attempts. Try again in ${Math.ceil(result.userError.retryAfterMs / 1000)} seconds.`;
              case "PASSWORD_TOO_SHORT":
                return `Password must be at least ${result.userError.minimumLength} characters.`;
              case "PASSWORD_TOO_LONG":
                return `Password must be at most ${result.userError.maximumLength} characters.`;
              case "PASSWORD_HAS_SURROUNDING_WHITESPACE":
                return "Password can't start or end with whitespace.";
              case "PASSWORD_TOO_COMMON":
                return "This password is too common. Please choose a different one.";
              case "OTHER_ERROR":
                console.error("Sign-up failed:", result.userError.cause);
                return "Something went wrong. Please try again.";
              default:
                result.userError satisfies never;
                console.error("Sign-up failed:", result.userError);
                return "Something went wrong. Please try again.";
            }
          });
        }}
      >
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
            disabled={pending}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            disabled={pending}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-slate-900 underline">
          Sign in
        </Link>
      </p>
    </AuthPanel>
  );
}
