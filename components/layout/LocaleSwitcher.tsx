"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: Locale) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-2">
          {index > 0 ? <span className="text-line">/</span> : null}
          <button
            type="button"
            onClick={() => switchLocale(loc)}
            className={
              locale === loc
                ? "text-gold"
                : "text-ash transition-colors hover:text-bone"
            }
            aria-current={locale === loc ? "true" : undefined}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
