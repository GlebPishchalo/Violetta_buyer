"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ReviewCard, type ReviewCardData } from "@/components/reviews/ReviewCard";
import { ReviewModal } from "@/components/reviews/ReviewModal";

type RatingFilter = "all" | "5" | "4" | "3";

type ReviewsBrowserProps = {
  reviews: ReviewCardData[];
};

const PAGE_SIZE = 12;

export function ReviewsBrowser({ reviews }: ReviewsBrowserProps) {
  const t = useTranslations("reviews");
  const [filter, setFilter] = useState<RatingFilter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      if (filter === "all") return true;
      if (filter === "5") return review.rating === 5;
      if (filter === "4") return review.rating === 4;
      return review.rating <= 3;
    });
  }, [reviews, filter]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const filters: { key: RatingFilter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "5", label: t("filter5") },
    { key: "4", label: t("filter4") },
    { key: "3", label: t("filter3") },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setFilter(item.key);
                  setVisible(PAGE_SIZE);
                }}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  active
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-line text-ash hover:border-ash hover:text-bone"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <Button variant="ghost" onClick={() => setModalOpen(true)}>
          {t("leaveReview")}
        </Button>
      </div>

      {shown.length === 0 ? (
        <p className="font-sans text-sm text-ash">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {hasMore ? (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => setVisible((n) => n + PAGE_SIZE)}
          >
            {t("loadMore")}
          </Button>
        </div>
      ) : null}

      <ReviewModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
