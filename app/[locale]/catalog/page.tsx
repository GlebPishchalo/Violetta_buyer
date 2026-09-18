import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Shop } from "@prisma/client";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { prisma } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type CatalogPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: CatalogPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return buildPageMetadata({
    locale,
    title: t("pageTitle"),
    description: t("pageDescription"),
    path: "/catalog",
  });
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");

  let shops: Shop[] = [];
  try {
    shops = await prisma.shop.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    shops = [];
  }

  return (
    <Section className="pt-10 md:pt-16">
      <div className="mb-10 max-w-xl space-y-3">
        <Kicker>{t("kicker")}</Kicker>
        <h1 className="font-serif text-4xl text-bone md:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="font-sans text-sm leading-relaxed text-ash md:text-base">
          {t("subtitle")}
        </p>
      </div>
      <CatalogGrid shops={shops} showSearch />
    </Section>
  );
}
