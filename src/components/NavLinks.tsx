"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, LOCKED_NAV_ITEMS } from "@/lib/nav-items";
import { ProBadge } from "@/components/ProTeaser";

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span aria-hidden className="text-lg leading-none">
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        );
      })}

      <li className="my-2 border-t border-slate-100" />

      {LOCKED_NAV_ITEMS.map((item) => (
        <li key={item.label}>
          <span
            title="Coming soon with Joobi Pro"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
          >
            <span aria-hidden className="text-lg leading-none">
              {item.icon}
            </span>
            <span className="flex-1">{item.label}</span>
            <ProBadge />
          </span>
        </li>
      ))}
    </ul>
  );
}
