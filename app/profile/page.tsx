"use client";

import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Header } from "../../components/Header";
import { api } from "../../convex/_generated/api";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        actionButton={{
          label: "Back",
          icon: ChevronLeft,
          href: "/",
        }}
      />
      <main className="container mx-auto max-w-3xl px-4 py-6 md:py-8">
        <Authenticated>
          <ProfileSettings />
        </Authenticated>
        <Unauthenticated>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-slate-900">Sign in to manage your profile</h2>
            <Link href="/sign-in" className="mt-4 inline-block font-semibold text-slate-900 underline">
              Sign in
            </Link>
          </section>
        </Unauthenticated>
      </main>
    </div>
  );
}

function ProfileSettings() {
  const user = useQuery(api.users.getCurrentUser);
  const updateDisplayName = useMutation(api.users.updateDisplayName);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const savedDisplayName = user?.displayName ?? (user?.name && !user.name.includes("@") ? user.name : "");
  const value = displayName ?? savedDisplayName;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextDisplayName = value.trim();
    if (isSaving || !nextDisplayName || nextDisplayName.length > 32) {
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateDisplayName({ displayName: nextDisplayName });
      setDisplayName(nextDisplayName);
      setSuccess("Your display name has been saved.");
    } catch (error) {
      console.error("Failed to update display name:", error);
      setError("Could not save your display name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
      <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
      <p className="mt-2 text-sm text-slate-600">
        Choose the name shown next to your reviews. Your email stays private.
      </p>

      {user === undefined ? (
        <p className="mt-6 text-sm text-slate-600">Loading profile...</p>
      ) : user === null ? (
        <p role="alert" className="mt-6 text-sm text-red-700">
          Could not load your profile. Please refresh the page.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-slate-700">
              Public display name
            </label>
            <input
              id="displayName"
              type="text"
              value={value}
              onChange={(event) => {
                setDisplayName(event.target.value);
                setSuccess("");
              }}
              maxLength={32}
              required
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none"
              placeholder="e.g. SneakerFan42"
            />
            <p className="mt-1 text-xs text-slate-500">This name is public and can be up to 32 characters.</p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="text-sm text-green-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving || !value.trim() || value.trim() === savedDisplayName}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
    </section>
  );
}
