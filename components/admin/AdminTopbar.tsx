"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "Дашборд",
  "/admin/reviews": "Отзывы",
  "/admin/catalog": "Каталог",
  "/admin/content": "Контент",
  "/admin/flights": "Вылеты",
  "/admin/settings": "Настройки",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Админ";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-ink-soft/90 px-8 backdrop-blur-md">
      <h1 className="font-serif text-xl text-bone">{title}</h1>
      <a
        href="/ru"
        target="_blank"
        rel="noopener noreferrer"
        className="border border-line px-3 py-1.5 font-sans text-sm text-ash transition-colors hover:border-gold hover:text-gold"
      >
        Открыть сайт
      </a>
    </header>
  );
}
