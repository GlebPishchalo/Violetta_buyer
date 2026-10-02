"use client";

import { useLocale, useTranslations } from "next-intl";
import { pickDescription } from "@/lib/i18n-fields";
import type { Locale } from "@/i18n/routing";

export type ShopCardData = {
  id: string;
  name: string;
  url: string;
  category: string;
  descriptionRu: string | null;
  descriptionEn: string | null;
  image: string | null;
};

type ShopCardProps = {
  shop: ShopCardData;
};

export function ShopCard({ shop }: ShopCardProps) {
  const t = useTranslations("catalog");
  const locale = useLocale() as Locale;
  const description = pickDescription(shop, locale);
  const categoryKey = shop.category as
    | "luxury"
    | "marketplace"
    | "shoes"
    | "tech"
    | "beauty"
    | "other"
    | "department";
  return (
    <article className="group grid grid-cols-1 items-center gap-3 py-5 transition-colors sm:grid-cols-[minmax(8rem,1fr)_minmax(0,3fr)_auto] sm:gap-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
        {t(`filters.${categoryKey}`)}
      </p>
      <div className="min-w-0 space-y-1.5">
        <h3 className="font-serif text-xl text-bone transition-colors group-hover:text-gold">
          {shop.name}
        </h3>
        {description ? (
          <p className="font-sans text-sm leading-relaxed text-ash">
            {description}
          </p>
        ) : null}
      </div>
      <a
        href={shop.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-sans text-sm text-gold transition-colors hover:text-copper sm:justify-self-end"
      >
        {t("viewShop")}
        <span aria-hidden>→</span>
      </a>
    </article>
  );
}
