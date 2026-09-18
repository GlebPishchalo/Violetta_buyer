import type { Metadata } from "next";
import type { Review } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ReviewsManager } from "./ReviewsManager";

export const metadata: Metadata = {
  title: "Отзывы",
};

export default async function AdminReviewsPage() {
  let reviews: Review[] = [];
  try {
    reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    reviews = [];
  }

  return (
    <ReviewsManager
      reviews={reviews.map((r) => ({
        id: r.id,
        name: r.name,
        city: r.city,
        telegram: r.telegram,
        text: r.text,
        rating: r.rating,
        status: r.status,
        locale: r.locale,
        createdAt: r.createdAt.toISOString(),
      }))}
    />
  );
}
