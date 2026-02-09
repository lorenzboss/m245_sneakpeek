"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { Plus } from "lucide-react";
import { Header } from "../components/Header";
import { SneakerGrid } from "../components/SneakerGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        actionButton={{
          label: "Add",
          icon: Plus,
          href: "/add",
        }}
      />
      <main className="container mx-auto p-8">
        <Authenticated>
          <SneakerGrid />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </div>
  );
}

function SignInForm() {
  return (
    <div className="mx-auto mt-16 flex max-w-80 flex-col gap-6">
      <h2 className="text-center text-2xl font-bold text-slate-900">Welcome to SneakPeak</h2>
      <p className="text-center text-slate-600">Sign in to share your sneaker collection</p>
      <div className="flex flex-col gap-3">
        <a href="/sign-in">
          <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white shadow-sm transition-colors hover:bg-slate-800">
            Sign In
          </button>
        </a>
        <a href="/sign-up">
          <button className="w-full rounded-lg bg-slate-200 px-4 py-2 text-slate-900 transition-colors hover:bg-slate-300">
            Sign Up
          </button>
        </a>
      </div>
    </div>
  );
}
