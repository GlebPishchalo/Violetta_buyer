import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import type { ShopCardData } from "@/components/catalog/ShopCard";

type CatalogSectionProps = {
  shops: ShopCardData[];
};

export async function CatalogSection({ shops }: CatalogSectionProps) {
  const t = await getTranslations("catalog");
  const tc = await getTranslations("common");

  return (
    <Section id="catalog">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
          className="font-sans text-sm text-gold transition-colors hover:text-copper"
        >
          {tc("viewAll")} →
        </Link>
      </div>
      <CatalogGrid shops={shops} />
    </Section>
  );
}
