import type { ReactNode } from "react";
import { Header } from "./Header";

export function AuthPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <div className="mt-6">{children}</div>
        </section>
      </main>
    </>
  );
}
