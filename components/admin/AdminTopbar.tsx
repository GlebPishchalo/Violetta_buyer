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
    <header className="sticky top-[112px] z-30 flex h-14 items-center justify-between border-b border-line bg-ink-soft/90 px-4 backdrop-blur-md sm:px-6 md:top-0 md:h-16 md:px-8">
      <h1 className="truncate font-serif text-lg text-bone sm:text-xl">{title}</h1>
      <a
        href="/ru"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5 font-sans text-xs text-ash transition-colors hover:border-gold hover:text-gold sm:text-sm"
      >
        Открыть сайт
      </a>
    </header>
  );
}
