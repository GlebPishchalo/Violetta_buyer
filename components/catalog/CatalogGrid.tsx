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
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-line text-ash hover:border-ash hover:text-bone"
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
            className="w-full border border-line bg-ink px-3 py-2 font-sans text-sm text-bone placeholder:text-ash md:max-w-xs"
            aria-label={t("searchPlaceholder")}
          />
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-ash">{t("empty")}</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((shop) => (
              <motion.div
                key={shop.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={reduceMotion ? { opacity: 1, y: 10 } : { opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0, y: 10 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
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
