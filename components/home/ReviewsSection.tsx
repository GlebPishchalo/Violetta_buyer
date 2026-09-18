"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ReviewCard, type ReviewCardData } from "@/components/reviews/ReviewCard";
import { ReviewModal } from "@/components/reviews/ReviewModal";

type ReviewsSectionProps = {
  reviews: ReviewCardData[];
};

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const t = useTranslations("reviews");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <Section id="reviews">
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
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => setOpen(true)}>
            {t("leaveReview")}
          </Button>
          <Link
            href="/reviews"
            className="inline-flex items-center font-sans text-sm text-gold transition-colors hover:text-copper"
          >
            {tc("viewAll")} →
          </Link>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="font-sans text-sm text-ash">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <ReviewModal open={open} onClose={() => setOpen(false)} />
    </Section>
  );
}
