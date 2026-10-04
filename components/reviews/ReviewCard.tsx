"use client";

import { useFormatter } from "next-intl";
import { Quote } from "lucide-react";
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
    <article className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-[#347d77]/20 bg-white/45 p-5 transition-[background,border-color,box-shadow] duration-300 hover:border-[#347d77]/40 hover:bg-white/70 hover:shadow-[0_14px_32px_rgba(31,93,86,0.08)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <Rating value={review.rating} />
        <Quote size={20} className="shrink-0 text-[#3a9189]/40" aria-hidden="true" />
      </div>
      <p className="flex-1 font-serif text-lg leading-relaxed text-[#254b47] sm:text-xl">
        “{review.text}”
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-[#347d77]/20 pt-4">
        <p className="font-medium text-sm text-[#205f59]">
          {review.name}
          {review.city ? (
            <span className="font-sans text-xs text-[#64837f]">
              {" "}
              / {review.city}
            </span>
          ) : null}
        </p>
        <time
          dateTime={date.toISOString()}
          className="font-mono text-[9px] uppercase tracking-wider text-[#64837f]"
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
