"use client";

import { useSignInWithEmailPassword } from "@convex-dev/auth/methods/email-password/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { AuthPanel } from "./AuthPanel";

export function SignInForm() {
  const { signIn, pending } = useSignInWithEmailPassword(api.auth);
  const { isLoading } = useConvexAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthPanel title="Sign in">
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          const result = await signIn({ email, password });
          if (result.status === "complete") {
            router.replace("/");
            return;
          }

          setError(() => {
            switch (result.userError.error) {
              case "USER_NOT_FOUND":
                return "No account exists with that email address. Make sure you validated your email.";
              case "INVALID_CREDENTIALS":
                return "Incorrect email or password.";
              case "PASSWORD_TOO_SHORT":
                return `Password must be at least ${result.userError.minimumLength} characters.`;
              case "PASSWORD_TOO_LONG":
                return `Password must be at most ${result.userError.maximumLength} characters.`;
              case "PASSWORD_HAS_SURROUNDING_WHITESPACE":
                return "Password can't start or end with whitespace.";
              case "RATE_LIMITED":
                return `Too many attempts. Try again in ${Math.ceil(result.userError.retryAfterMs / 1000)} seconds.`;
              case "OTHER_ERROR":
                console.error("Sign-in failed:", result.userError.cause);
                return "Something went wrong. Please try again.";
              default:
                result.userError satisfies never;
                console.error("Sign-in failed:", result.userError);
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
            autoComplete="current-password"
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
          disabled={pending || isLoading}
          className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-5 flex flex-col gap-2 text-sm text-slate-600">
        <Link href="/reset-password" className="underline">
          Forgot your password?
        </Link>
        <p>
          Need an account?{" "}
          <Link href="/sign-up" className="font-semibold text-slate-900 underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthPanel>
  );
}
