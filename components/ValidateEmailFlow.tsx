"use client";

import { useCompleteSignUpWithEmailPassword } from "@convex-dev/auth/methods/email-password/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { AuthPanel } from "./AuthPanel";

export function ValidateEmailFlow() {
  const searchParams = useSearchParams();
  const emailCode = searchParams.get("code");

  if (emailCode === null) {
    return (
      <AuthPanel title="Email verification">
        <p className="text-sm text-slate-600">This link is incomplete. Use the link from your verification email.</p>
        <Link href="/sign-up" className="mt-4 inline-block text-sm font-semibold underline">
          Sign up again
        </Link>
      </AuthPanel>
    );
  }

  return <ValidateEmailWithCode emailCode={emailCode} />;
}

function ValidateEmailWithCode({ emailCode }: { emailCode: string }) {
  const state = useCompleteSignUpWithEmailPassword(api.auth, { emailCode });

  if (state.status === "loading") {
    return (
      <AuthPanel title="Verifying your email">
        <p className="text-sm text-slate-600">Please wait...</p>
      </AuthPanel>
    );
  }

  if (state.status === "complete") {
    return (
      <AuthPanel title="Email verified">
        <p className="text-sm text-slate-600">Your account is ready and you are signed in.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold underline">
          Continue to home
        </Link>
      </AuthPanel>
    );
  }

  let message: string;
  switch (state.userError.error) {
    case "MISSING_SECRET":
      message = "For your security, open this link in the browser where you signed up.";
      break;
    case "INVALID_CHALLENGE":
      message = "This link is no longer valid. It may have expired or already been used.";
      break;
    case "INCORRECT_CODE":
      message = "This is not the latest link. Open the newest verification email.";
      break;
    case "EMAIL_TAKEN":
      message = "This email address is already in use. Sign in instead.";
      break;
    case "OTHER_ERROR":
      console.error("Email validation failed:", state.userError.cause);
      message = "Something went wrong. Reload the page to try again.";
      break;
    default:
      state.userError satisfies never;
      console.error("Email validation failed:", state.userError);
      message = "Something went wrong. Reload the page to try again.";
  }

  return (
    <AuthPanel title="Could not verify your email">
      <p role="alert" className="text-sm text-red-700">
        {message}
      </p>
      <Link href="/sign-up" className="mt-4 inline-block text-sm font-semibold underline">
        Sign up again
      </Link>
    </AuthPanel>
  );
}
