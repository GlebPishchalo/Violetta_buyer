"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { Rating } from "@/components/ui/Rating";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  approveReview,
  rejectReview,
} from "@/app/admin/(panel)/reviews/actions";

export type PendingReview = {
  id: string;
  name: string;
  city: string | null;
  text: string;
  rating: number;
  createdAt: string;
};

type DashboardPendingProps = {
  reviews: PendingReview[];
};

export function DashboardPending({ reviews }: DashboardPendingProps) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    reviews,
    (state: PendingReview[], action: { type: "remove"; id: string }) =>
      state.filter((r) => r.id !== action.id)
  );

  function act(id: string, kind: "approve" | "reject") {
    startTransition(async () => {
      setOptimistic({ type: "remove", id });
      try {
        if (kind === "approve") {
          await approveReview(id);
          toast.success("Отзыв одобрен");
        } else {
          await rejectReview(id);
          toast.success("Отзыв отклонён");
        }
      } catch {
        toast.error("Ошибка");
      }
    });
  }

  if (optimistic.length === 0) {
    return <EmptyState text="Пока нет отзывов на модерации" />;
  }

  return (
    <ul className="divide-y divide-line border border-line">
      {optimistic.map((review) => (
        <li
          key={review.id}
          className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-3">
              <p className="font-serif text-base text-bone">{review.name}</p>
              <Rating value={review.rating} size={12} />
            </div>
            <p className="truncate font-sans text-sm text-ash">{review.text}</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() => act(review.id, "approve")}
              className="font-sans text-sm text-gold hover:underline"
            >
              Одобрить
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => act(review.id, "reject")}
              className="font-sans text-sm text-ash hover:text-bone"
            >
              Отклонить
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
