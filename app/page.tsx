"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Plus } from "lucide-react";
import { Header } from "../components/Header";
import { SneakerGrid } from "../components/SneakerGrid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header
        actionButton={{
          label: "Add",
          icon: Plus,
          href: "/add",
        }}
      />
      <main className="container mx-auto flex flex-1 flex-col p-8">
        <Authenticated>
          <SneakerGrid />
        </Authenticated>
        <AuthLoading>
          <div className="flex flex-1 items-center justify-center text-slate-600">Loading...</div>
        </AuthLoading>
        <Unauthenticated>
          <div className="flex flex-1 items-center justify-center">
            <SignInForm />
          </div>
        </Unauthenticated>
      </main>
    </div>
  );
}

function SignInForm() {
  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-center text-2xl font-bold text-slate-900">Welcome to SneakPeek</h2>
      <p className="mt-3 text-center text-slate-600">Sign in to share your sneaker collection</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link href="/sign-in">
          <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white shadow-sm transition-colors hover:bg-slate-800">
            Sign In
          </button>
        </Link>
        <Link href="/sign-up">
          <button className="w-full rounded-lg bg-slate-200 px-4 py-2 text-slate-900 transition-colors hover:bg-slate-300">
            Sign Up
          </button>
        </Link>
      </div>
    </section>
  );
}
