import type { Metadata } from "next";
import type { ProductReview } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ProductReviewsManager } from "./ProductReviewsManager";

export const metadata: Metadata = {
  title: "Обзоры товаров",
};

export default async function AdminProductReviewsPage() {
  let productReviews: ProductReview[] = [];
  try {
    productReviews = await prisma.productReview.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    productReviews = [];
  }

  return (
    <ProductReviewsManager
      productReviews={productReviews.map((review) => ({
        id: review.id,
        title: review.title,
        descriptionRu: review.descriptionRu,
        descriptionEn: review.descriptionEn,
        image: review.image,
        images: review.images.length > 0 ? review.images : [review.image],
        productUrl: review.productUrl,
        order: review.order,
      }))}
    />
  );
}
