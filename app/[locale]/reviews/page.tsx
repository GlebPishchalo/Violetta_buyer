import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Review } from "@prisma/client";
import { ReviewsBrowser } from "@/components/reviews/ReviewsBrowser";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { prisma } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

type ReviewsPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: ReviewsPageProps): Promise<Metadata> {
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: "reviews" });
  return buildPageMetadata({
    locale,
    title: t("pageTitle"),
    description: t("pageDescription"),
    path: "/reviews",
  });
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const locale = params.locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("reviews");

  let reviews: Review[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    reviews = [];
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
      <ReviewsBrowser
        reviews={reviews.map((review: Review) => ({
          id: review.id,
          name: review.name,
          city: review.city,
          text: review.text,
          rating: review.rating,
          createdAt: review.createdAt.toISOString(),
        }))}
      />
    </Section>
  );
}
