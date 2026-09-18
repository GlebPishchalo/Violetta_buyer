"use client";

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
  // TODO: replace shop-placeholder with per-shop WebP via stock-images MCP
  const imageSrc = shop.image ?? "/images/shop-placeholder.jpg";

  return (
    <article className="group flex h-full flex-col border border-line bg-ink-soft transition-colors hover:border-gold/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        <Image
          src={imageSrc}
          alt={shop.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
          {t(`filters.${categoryKey}`)}
        </p>
        <h3 className="font-serif text-xl text-bone">{shop.name}</h3>
        {description ? (
          <p className="flex-1 font-sans text-sm leading-relaxed text-ash">
            {description}
          </p>
        ) : null}
        <a
          href={shop.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 font-sans text-sm text-gold transition-colors hover:text-copper"
        >
          {t("viewShop")}
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}
