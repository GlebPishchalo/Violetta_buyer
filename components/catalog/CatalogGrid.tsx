"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShopCard, type ShopCardData } from "@/components/catalog/ShopCard";

export const SHOP_FILTERS = [
  "all",
  "luxury",
  "marketplace",
  "shoes",
  "tech",
  "beauty",
] as const;

export type ShopFilter = (typeof SHOP_FILTERS)[number];

type CatalogGridProps = {
  shops: ShopCardData[];
  showSearch?: boolean;
};

export function CatalogGrid({ shops, showSearch = false }: CatalogGridProps) {
  const t = useTranslations("catalog");
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<ShopFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shops.filter((shop) => {
      const byCategory = filter === "all" || shop.category === filter;
      const byQuery = !q || shop.name.toLowerCase().includes(q);
      return byCategory && byQuery;
    });
  }, [shops, filter, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {SHOP_FILTERS.map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-[background,color,border,transform] duration-200 hover:-translate-y-0.5 sm:text-[10px] ${
                  active
                    ? "border-[#216e67] bg-[#216e67] text-white shadow-[0_4px_12px_rgba(33,110,103,0.18)]"
                    : "border-[#347d77]/30 bg-white/35 text-[#426d68] hover:border-[#347d77]/60 hover:bg-white/65 hover:text-[#173e3a]"
                }`}
              >
                {t(`filters.${key}`)}
              </button>
            );
          })}
        </div>

        {showSearch ? (
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-[#347d77]/30 bg-white/45 px-4 py-2.5 font-sans text-sm text-[#173e3a] placeholder:text-[#64837f] focus:border-[#216e67] md:max-w-xs"
            aria-label={t("searchPlaceholder")}
          />
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-ash">{t("empty")}</p>
      ) : (
        <motion.div layout className="mx-auto max-w-4xl">
          <AnimatePresence mode="popLayout">
            {filtered.map((shop, index) => (
              <motion.div
                key={shop.id}
                layout
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.32, delay: reduceMotion ? 0 : index * 0.045 }}
                whileHover={reduceMotion ? undefined : { x: 3 }}
              >
                <ShopCard shop={shop} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
