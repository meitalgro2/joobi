"use client";

import { useState } from "react";
import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
import { SignOutButton } from "@/components/SignOutButton";

export function DashboardShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
        <span className="px-1 text-lg font-bold text-indigo-600">Joobi</span>
        <nav className="mt-6 flex-1">
          <NavLinks />
        </nav>
        <div className="border-t border-slate-200 pt-3">
          <Link
            href="/account"
            className="block truncate rounded-lg px-1 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
          >
            {userName}
          </Link>
          <div className="px-1">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="text-lg font-bold text-indigo-600">Joobi</span>
        <button
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <BurgerIcon />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between px-1">
              <span className="text-lg font-bold text-indigo-600">Joobi</span>
              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <nav className="mt-6 flex-1">
              <NavLinks onNavigate={() => setDrawerOpen(false)} />
            </nav>
            <div className="border-t border-slate-200 pt-3">
              <Link
                href="/account"
                onClick={() => setDrawerOpen(false)}
                className="block truncate rounded-lg px-1 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
              >
                {userName}
              </Link>
              <div className="px-1">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 lg:pl-60">{children}</main>
    </div>
  );
}

function BurgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5h14M3 10h14M3 15h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
