import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Review, Shop } from "@prisma/client";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CatalogSection } from "@/components/home/CatalogSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Divider } from "@/components/ui/Divider";
import { getBlock, getContentBlocks } from "@/lib/content";
import { prisma } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type HomePageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildPageMetadata({
    locale,
    title: t("homeTitle"),
    description: t("homeDescription"),
    path: "/",
  });
}

async function safeShops(): Promise<Shop[]> {
  try {
    return await prisma.shop.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

async function safeReviews(take = 6): Promise<Review[]> {
  try {
    return await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take,
    });
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);

  const [blocks, shops, reviews] = await Promise.all([
    getContentBlocks(),
    safeShops(),
    safeReviews(6),
  ]);

  const telegramUrl = getBlock(
    blocks,
    "telegram_url",
    locale,
    "https://t.me/PLACEHOLDER"
  );

  const services = [1, 2, 3, 4].map((n) => ({
    title: getBlock(
      blocks,
      `service_${n}_title`,
      locale,
      fallbackServices[n - 1]?.title[locale === "en" ? "en" : "ru"] ?? ""
    ),
    body: getBlock(
      blocks,
      `service_${n}_body`,
      locale,
      fallbackServices[n - 1]?.body[locale === "en" ? "en" : "ru"] ?? ""
    ),
  }));

  return (
    <>
      <HeroSection
        kicker={getBlock(
          blocks,
          "hero_kicker",
          locale,
          "Personal Buyer · Dubai"
        )}
        title={getBlock(
          blocks,
          "hero_title",
          locale,
          locale === "en"
            ? "I buy in Dubai what you won't find in Moscow"
            : "Покупаю в Дубае то, что вы не найдёте в Москве"
        )}
        subtitle={getBlock(
          blocks,
          "hero_subtitle",
          locale,
          locale === "en"
            ? "Regular flights, purchases from any UAE store, parcel handoff both ways."
            : "Стабильные вылеты, выкуп из любых магазинов ОАЭ, передача посылок в обе стороны."
        )}
        telegramUrl={telegramUrl}
        stats={{
          flights: Number(getBlock(blocks, "stat_flights", locale, "12")) || 12,
          parcels:
            Number(getBlock(blocks, "stat_parcels", locale, "800")) || 800,
          years: Number(getBlock(blocks, "stat_years", locale, "5")) || 5,
        }}
      />
      <Divider variant="diamond" />
      <ServicesSection items={services} />
      <Divider />
      <CatalogSection shops={shops} />
      <Divider variant="diamond" />
      <ReviewsSection
        reviews={reviews.map((review: Review) => ({
          id: review.id,
          name: review.name,
          city: review.city,
          text: review.text,
          rating: review.rating,
          createdAt: review.createdAt.toISOString(),
        }))}
      />
    </>
  );
}

const fallbackServices = [
  {
    title: { ru: "Стабильные вылеты", en: "Regular flights" },
    body: {
      ru: "Дважды в месяц. Расписание — в разделе вылетов.",
      en: "Twice a month. Schedule is in the flights section.",
    },
  },
  {
    title: { ru: "Выкуп товара", en: "Product purchase" },
    body: {
      ru: "Аванс 50% или полная предоплата. Официальные чеки.",
      en: "50% deposit or full prepayment. Official receipts.",
    },
  },
  {
    title: { ru: "Дубай → Москва", en: "Dubai → Moscow" },
    body: {
      ru: "Передача посылок лично в руки или через курьера.",
      en: "Parcel handoff in person or via courier.",
    },
  },
  {
    title: { ru: "Москва → Дубай", en: "Moscow → Dubai" },
    body: {
      ru: "Обратное направление для отправки документов и вещей.",
      en: "Reverse direction for documents and personal items.",
    },
  },
] as const;
