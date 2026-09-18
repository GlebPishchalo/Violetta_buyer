"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const nav: { href: string; label: string; exact?: boolean }[] = [
  { href: "/admin", label: "Дашборд", exact: true },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/catalog", label: "Каталог" },
  { href: "/admin/content", label: "Контент" },
  { href: "/admin/flights", label: "Вылеты" },
  { href: "/admin/settings", label: "Настройки" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-line bg-ink">
      <div className="border-b border-line px-5 py-6">
        <p className="font-serif text-lg tracking-wide text-bone">Violetta</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
          admin
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Админ-навигация">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-3 py-2.5 font-sans text-sm transition-colors ${
                active
                  ? "bg-gold/10 text-gold"
                  : "text-ash hover:bg-white/[0.02] hover:text-bone"
              }`}
            >
              {active ? (
                <span
                  className="absolute inset-y-1.5 left-0 w-0.5 bg-gold"
                  aria-hidden
                />
              ) : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full px-3 py-2.5 text-left font-sans text-sm text-ash transition-colors hover:text-bone"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
