"use client";

import { useFormatter } from "next-intl";
import { Rating } from "@/components/ui/Rating";

export type ReviewCardData = {
  id: string;
  name: string;
  city: string | null;
  text: string;
  rating: number;
  createdAt: Date | string;
};

type ReviewCardProps = {
  review: ReviewCardData;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const format = useFormatter();
  const date =
    typeof review.createdAt === "string"
      ? new Date(review.createdAt)
      : review.createdAt;

  return (
    <article className="flex h-full flex-col gap-4 border border-line bg-ink-soft p-6">
      <Rating value={review.rating} />
      <p className="flex-1 font-sans text-sm leading-relaxed text-bone">
        {review.text}
      </p>
      <div className="flex items-baseline justify-between gap-3 border-t border-line pt-4">
        <p className="font-serif text-base text-bone">
          {review.name}
          {review.city ? (
            <span className="font-sans text-sm text-ash">
              {" "}
              · {review.city}
            </span>
          ) : null}
        </p>
        <time
          dateTime={date.toISOString()}
          className="font-mono text-[10px] uppercase tracking-wider text-ash"
        >
          {format.dateTime(date, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
