import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ProductReview } from "@prisma/client";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { ProductReviewCard } from "@/components/product-reviews/ProductReviewCard";
import { getTelegramUrl } from "@/lib/content";
import { pickDescription } from "@/lib/i18n-fields";
import { prisma } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type ProductReviewsPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: ProductReviewsPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "productReviews" });
  return buildPageMetadata({
    locale,
    title: t("pageTitle"),
    description: t("pageDescription"),
    path: "/product-reviews",
  });
}

export default async function ProductReviewsPage({
  params,
}: ProductReviewsPageProps) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("productReviews");
  const [telegramUrl, productReviews] = await Promise.all([
    getTelegramUrl(),
    prisma.productReview.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }).catch((): ProductReview[] => []),
  ]);

  return (
    <Section className="pt-10 md:pt-16">
      <div className="reveal-on-scroll mb-10 max-w-xl space-y-3">
        <Kicker>{t("kicker")}</Kicker>
        <h1 className="font-serif text-4xl text-bone md:text-5xl">
          {t("pageTitle")}
        </h1>
        <p className="font-sans text-sm leading-relaxed text-ash md:text-base">
          {t("subtitle")}
        </p>
      </div>
      {productReviews.length === 0 ? (
        <p className="font-sans text-sm text-ash">{t("empty")}</p>
      ) : (
        <div className="mx-auto max-w-5xl space-y-7">
          {productReviews.map((review) => (
            <ProductReviewCard
              key={review.id}
              review={{
                title: review.title,
                description: pickDescription(review, locale),
                images: review.images.length > 0 ? review.images : [review.image],
                productUrl: review.productUrl,
                createdAt: review.createdAt.toISOString(),
              }}
              telegramUrl={telegramUrl}
              viewProductLabel={t("viewProduct")}
              telegramLabel={t("askInTelegram")}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
