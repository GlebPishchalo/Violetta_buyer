import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Flight } from "@prisma/client";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FlightsTable } from "@/components/services/FlightsTable";
import { TermsMarkdown } from "@/components/services/TermsMarkdown";
import { Divider } from "@/components/ui/Divider";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { getBlock, getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type ServicesPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "services" });
  return buildPageMetadata({
    locale,
    title: t("pageTitle"),
    description: t("pageDescription"),
    path: "/services",
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  let flights: Flight[] = [];
  try {
    flights = await prisma.flight.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
    });
  } catch {
    flights = [];
  }

  const blocks = await getContentBlocks();

  const services = [1, 2, 3, 4].map((n) => ({
    title: getBlock(blocks, `service_${n}_title`, locale),
    body: getBlock(blocks, `service_${n}_body`, locale),
  }));

  const terms = getBlock(blocks, "terms_body", locale);

  return (
    <>
      <Section className="pb-0 pt-10 md:pt-16">
        <div className="max-w-xl space-y-3">
          <Kicker>{t("kicker")}</Kicker>
          <h1 className="font-serif text-4xl text-bone md:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="font-sans text-sm leading-relaxed text-ash md:text-base">
            {t("subtitle")}
          </p>
        </div>
      </Section>

      <ServicesSection items={services} showIntro={false} />

      <Divider />

      <Section id="flights">
        <div className="mb-8 max-w-xl space-y-3">
          <Kicker>{t("flightsKicker")}</Kicker>
          <h2 className="font-serif text-3xl text-bone md:text-4xl">
            {t("flightsTitle")}
          </h2>
        </div>
        <FlightsTable flights={flights} locale={locale} />
      </Section>

      {terms ? (
        <>
          <Divider variant="diamond" />
          <Section>
            <div className="mb-8 max-w-xl space-y-3">
              <Kicker>{t("termsKicker")}</Kicker>
              <h2 className="font-serif text-3xl text-bone md:text-4xl">
                {t("termsTitle")}
              </h2>
            </div>
            <TermsMarkdown content={terms} />
          </Section>
        </>
      ) : null}
    </>
  );
}
