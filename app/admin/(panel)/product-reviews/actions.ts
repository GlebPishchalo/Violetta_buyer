"use server";

import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productReviewSchema } from "@/lib/validations/admin";
import { revalidatePublicProductReviews } from "@/lib/revalidate";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId) {
    throw new Error("Unauthorized");
  }
}

function isMissingProductReviewsTable(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

export async function createProductReview(raw: unknown) {
  await requireAdmin();
  const parsed = productReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Ошибка валидации",
    };
  }

  const data = parsed.data;
  let productReview;
  try {
    const maxOrder = await prisma.productReview.aggregate({
      _max: { order: true },
    });
    productReview = await prisma.productReview.create({
      data: {
        title: data.title,
        descriptionRu: data.descriptionRu,
        descriptionEn: data.descriptionEn || null,
        image: data.images[0],
        images: data.images,
        productUrl: data.productUrl,
        order: data.order ?? (maxOrder._max.order ?? 0) + 1,
      },
    });
  } catch (error) {
    if (isMissingProductReviewsTable(error)) {
      return {
        ok: false as const,
        error: "Таблица обзоров отсутствует. Обновите схему базы данных командой pnpm db:push.",
      };
    }
    throw error;
  }
  revalidatePublicProductReviews();
  return { ok: true as const, productReview };
}

export async function updateProductReview(id: string, raw: unknown) {
  await requireAdmin();
  const parsed = productReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Ошибка валидации",
    };
  }

  const data = parsed.data;
  let productReview;
  try {
    productReview = await prisma.productReview.update({
      where: { id },
      data: {
        title: data.title,
        descriptionRu: data.descriptionRu,
        descriptionEn: data.descriptionEn || null,
        image: data.images[0],
        images: data.images,
        productUrl: data.productUrl,
        order: data.order,
      },
    });
  } catch (error) {
    if (isMissingProductReviewsTable(error)) {
      return {
        ok: false as const,
        error: "Таблица обзоров отсутствует. Обновите схему базы данных командой pnpm db:push.",
      };
    }
    throw error;
  }
  revalidatePublicProductReviews();
  return { ok: true as const, productReview };
}

export async function deleteProductReview(id: string) {
  await requireAdmin();
  await prisma.productReview.delete({ where: { id } });
  revalidatePublicProductReviews();
  return { ok: true as const };
}
