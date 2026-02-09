"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useQuery } from "convex/react";
import { LogOut, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { api } from "../convex/_generated/api";

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
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <h1 className="text-xl font-bold text-slate-900 md:text-2xl">SneakPeak</h1>
          </Link>

          {/* User Actions */}
          {user && (
            <div className="flex items-center gap-2 md:gap-3">
              {/* Username */}
              {convexUser?.name && (
                <span className="mt-0.5 hidden max-w-30 truncate text-slate-700 sm:inline-block md:max-w-50">
                  {convexUser.name}
                </span>
              )}

              {/* Action Button */}
              {actionButton && (
                <Link
                  href={actionButton.href}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-2 py-1.5 text-sm text-white transition-colors hover:bg-slate-800 md:gap-2 md:px-3 md:text-base"
                >
                  <actionButton.icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">{actionButton.label}</span>
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-200 md:gap-2 md:px-3 md:text-base"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
