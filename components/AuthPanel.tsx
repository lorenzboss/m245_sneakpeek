import Link from "next/link";
import type { ReactNode } from "react";

export function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
          SneakPeek
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
