"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
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
    <article className="reveal-on-scroll group overflow-hidden rounded-2xl border border-[#347d77]/20 bg-white/35 shadow-sm backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#347d77]/40 hover:bg-white/65 hover:shadow-xl">
      <a
        href={shop.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`grid min-h-24 items-center gap-4 px-4 py-5 transition-all duration-300 ease-out sm:min-h-28 sm:gap-8 sm:px-6 sm:py-6 ${
          shop.image
            ? "grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:grid-cols-[5rem_minmax(0,1fr)_auto]"
            : "grid-cols-[minmax(0,1fr)_auto]"
        }`}
      >
        {shop.image ? (
          <div className="relative aspect-square w-14 overflow-hidden rounded-xl border border-[#347d77]/20 bg-white p-1.5 shadow-sm sm:w-20 sm:p-2">
            <Image
              src={shop.image}
              alt={`${shop.name} логотип`}
              fill
              sizes="(min-width: 640px) 80px, 56px"
              className="object-contain p-1"
            />
          </div>
        ) : null}
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="truncate font-serif text-xl text-[#173e3a] sm:text-2xl">
              {shop.name}
            </h3>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#347d77]">
              {t(`filters.${categoryKey}`)}
            </span>
          </div>
          {description ? (
            <p className="line-clamp-2 max-w-2xl text-sm leading-relaxed text-[#426d68]">
              {description}
            </p>
          ) : (
            <p className="truncate text-xs text-[#426d68]">{shop.url}</p>
          )}
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#347d77]/35 text-[#1e625c] transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:bg-[#1e625c] group-hover:text-white sm:h-12 sm:w-12">
          <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">{t("viewShop")}</span>
        </span>
      </a>
    </article>
  );
}