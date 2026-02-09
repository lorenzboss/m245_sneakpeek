'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="w-1/3"></div>
        <h1 className="w-1/3 text-2xl font-bold text-center text-slate-900">SneakPeak</h1>
        <div className="w-1/3 flex justify-end">
          <Link
            href="/add"
            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add
          </Link>
        </div>
      </div>
    </header>
  );
}
