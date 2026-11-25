"use client";

import { useCompletePasswordRecovery, useStartPasswordRecovery } from "@convex-dev/auth/methods/email-password/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { AuthPanel } from "./AuthPanel";

export function PasswordRecoveryFlow() {
  const searchParams = useSearchParams();
  const emailCode = searchParams.get("code");

  return emailCode === null ? <RequestPasswordReset /> : <ResetPassword emailCode={emailCode} />;
}

function RequestPasswordReset() {
  const { startPasswordRecovery, pending } = useStartPasswordRecovery(api.auth);
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (sentTo !== null) {
    return (
      <AuthPanel title="Check your email">
        <p className="text-sm leading-6 text-slate-600">
          We sent a password-reset link to <strong>{sentTo}</strong>. Open it in this browser; the link expires after 10
          minutes.
        </p>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel title="Reset your password">
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          const result = await startPasswordRecovery({ email });
          if (result.success) {
            setSentTo(result.sentTo);
            return;
          }

          setError(() => {
            switch (result.userError.error) {
              case "INVALID_EMAIL":
                return "That email address doesn't look valid.";
              case "EMAIL_NOT_FOUND":
                return "No account exists with that email address.";
              case "RATE_LIMITED":
                return `Too many attempts. Try again in ${Math.ceil(result.userError.retryAfterMs / 1000)} seconds.`;
              case "OTHER_ERROR":
                console.error("Password reset request failed:", result.userError.cause);
                return "Something went wrong. Please try again.";
              default:
                result.userError satisfies never;
                console.error("Password reset request failed:", result.userError);
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
          {pending ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <Link href="/sign-in" className="mt-5 inline-block text-sm font-semibold underline">
        Back to sign in
      </Link>
    </AuthPanel>
  );
}

function ResetPassword({ emailCode }: { emailCode: string }) {
  const state = useCompletePasswordRecovery(api.auth, { emailCode });
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (state.status === "loading") {
    return (
      <AuthPanel title="Checking reset link">
        <p className="text-sm text-slate-600">Please wait...</p>
      </AuthPanel>
    );
  }

  if (state.status === "complete") {
    return (
      <AuthPanel title="Password reset">
        <p className="text-sm text-slate-600">Your password has been reset and you are signed in.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold underline">
          Continue to home
        </Link>
      </AuthPanel>
    );
  }

  if (state.status === "error") {
    let message: string;
    switch (state.userError.error) {
      case "MISSING_SECRET":
        message = "For your security, open the reset link in the browser where you requested it.";
        break;
      case "INVALID_CHALLENGE":
        message = "This link is no longer valid. It may have expired or already been used.";
        break;
      case "INCORRECT_CODE":
        message = "This is not the latest link. Open the newest reset email.";
        break;
      default:
        state.userError satisfies never;
        console.error("Password reset verification failed:", state.userError);
        message = "Something went wrong. Reload the page to try again.";
    }

    return (
      <AuthPanel title="Could not reset your password">
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
        <Link href="/reset-password" className="mt-4 inline-block text-sm font-semibold underline">
          Request a new link
        </Link>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel title="Choose a new password">
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          const result = await state.completePasswordRecovery({ newPassword });
          if (result.status === "complete") {
            router.replace("/");
            return;
          }

          setError(() => {
            switch (result.userError.error) {
              case "INVALID_CHALLENGE":
              case "INCORRECT_CODE":
                return null;
              case "PASSWORD_TOO_SHORT":
                return `Password must be at least ${result.userError.minimumLength} characters.`;
              case "PASSWORD_TOO_LONG":
                return `Password must be at most ${result.userError.maximumLength} characters.`;
              case "PASSWORD_HAS_SURROUNDING_WHITESPACE":
                return "Password can't start or end with whitespace.";
              case "PASSWORD_TOO_COMMON":
                return "This password is too common. Please choose a different one.";
              case "OTHER_ERROR":
                console.error("Password reset failed:", result.userError.cause);
                return "Something went wrong. Please try again.";
              default:
                result.userError satisfies never;
                console.error("Password reset failed:", result.userError);
                return "Something went wrong. Please try again.";
            }
          });
        }}
      >
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            required
            disabled={state.pending}
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
          disabled={state.pending}
          className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {state.pending ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </AuthPanel>
  );
}
