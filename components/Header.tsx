'use client';

import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useQuery } from 'convex/react';
import { LogOut, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { api } from '../convex/_generated/api';

interface HeaderProps {
  actionButton?: {
    label: string;
    icon: LucideIcon;
    href: string;
  };
}

export function Header({ actionButton }: HeaderProps) {
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
                <span className="hidden mt-0.5 sm:inline-block text-slate-700 truncate max-w-30 md:max-w-50">
                  {convexUser.name}
                </span>
              )}

              {/* Action Button */}
              {actionButton && (
                <Link
                  href={actionButton.href}
                  className="bg-slate-900 text-white px-2 md:px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 md:gap-2 text-sm md:text-base shrink-0"
                >
                  <actionButton.icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">{actionButton.label}</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-2 md:px-3 py-1.5 md:gap-2 rounded-lg transition-colors gap-1.5 items-center text-sm md:text-base flex shrink-0"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
