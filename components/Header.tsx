'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { api } from '../convex/_generated/api';

export function Header() {
  const { user, signOut } = useAuth();
  const convexUser = useQuery(api.users.getCurrentUser);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">SneakPeak</h1>
          </Link>

          {/* User Actions */}
          {user && (
            <div className="flex items-center gap-2 md:gap-3">
              {/* Username */}
              {convexUser?.name && (
                <span className="hidden sm:inline-block text-sm text-slate-700 truncate max-w-30 md:max-w-50">
                  {convexUser.name}
                </span>
              )}

              {/* Add Button */}
              <Link
                href="/add"
                className="bg-slate-900 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 md:gap-2 text-sm md:text-base shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 md:w-5 md:h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base shrink-0"
              >
                <span className="hidden sm:inline">Sign out</span>
                <span className="sm:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
