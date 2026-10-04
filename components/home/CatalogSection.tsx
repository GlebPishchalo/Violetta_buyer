import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Kicker } from "@/components/ui/Kicker";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import type { ShopCardData } from "@/components/catalog/ShopCard";

type CatalogSectionProps = {
  shops: ShopCardData[];
};

export async function CatalogSection({ shops }: CatalogSectionProps) {
  const t = await getTranslations("catalog");
  const tc = await getTranslations("common");

  return (
    <section id="catalog" className="bg-[#96d6cf] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex flex-col items-center gap-5 text-center md:mb-10">
          <div className="max-w-xl space-y-3">
            <Kicker>{t("kicker")}</Kicker>
            <h2 className="font-serif text-3xl text-bone md:text-4xl">
              {t("title")}
            </h2>
            <p className="font-sans text-sm leading-relaxed text-ash md:text-base">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full border border-[#286a64]/35 bg-white/20 px-4 py-2 font-sans text-xs text-[#205b56] transition-[background,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/45"
          >
            {tc("viewAll")} <span aria-hidden>↗</span>
          </Link>
        </div>
        <CatalogGrid shops={shops} />
      </div>
    </section>
  );
}
