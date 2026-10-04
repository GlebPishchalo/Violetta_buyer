"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Plane,
  Settings,
  Store,
  TextCursorInput,
  type LucideIcon,
} from "lucide-react";

const nav: { href: string; label: string; exact?: boolean; icon: LucideIcon }[] = [
  { href: "/admin", label: "Обзор", exact: true, icon: LayoutDashboard },
  { href: "/admin/catalog", label: "Магазины", icon: Store },
  { href: "/admin/flights", label: "Вылеты", icon: Plane },
  { href: "/admin/reviews", label: "Отзывы", icon: MessageSquareText },
  { href: "/admin/content", label: "Контент", icon: TextCursorInput },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-x-0 top-0 z-40 flex flex-col border-b border-line bg-ink/95 shadow-[0_5px_20px_rgba(31,93,86,0.06)] backdrop-blur-md md:inset-y-0 md:right-auto md:w-60 md:border-b-0 md:border-r md:bg-ink">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4 md:h-auto md:items-start md:px-5 md:py-6">
        <div>
          <p className="font-serif text-lg tracking-wide text-bone">Violetta</p>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ash md:mt-1 md:block">
          admin
          </p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-xs text-ash transition-colors hover:border-gold hover:text-gold md:hidden"
        >
          <LogOut size={15} aria-hidden="true" />
          Выйти
        </button>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-1 md:flex-col md:gap-1 md:overflow-y-auto md:overflow-x-hidden md:p-3" aria-label="Админ-навигация">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-3 font-sans text-xs transition-colors md:min-h-0 md:rounded-md md:px-3 md:py-2.5 md:text-sm ${
                active
                  ? "bg-gold/10 text-gold"
                  : "text-ash hover:bg-white/40 hover:text-bone"
              }`}
            >
              <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-line p-3 md:block">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left font-sans text-sm text-ash transition-colors hover:bg-white/40 hover:text-bone"
        >
          <LogOut size={16} aria-hidden="true" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
