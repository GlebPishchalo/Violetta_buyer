"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { reviewUpdateSchema } from "@/lib/validations/admin";
import { revalidatePublicReviews } from "@/lib/revalidate";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function approveReview(id: string) {
  await requireAdmin();
  await prisma.review.update({
    where: { id },
    data: { status: "approved" },
  });
  revalidatePublicReviews();
  return { ok: true as const };
}

export async function rejectReview(id: string) {
  await requireAdmin();
  await prisma.review.update({
    where: { id },
    data: { status: "rejected" },
  });
  revalidatePublicReviews();
  return { ok: true as const };
}

export async function updateReview(id: string, raw: unknown) {
  await requireAdmin();
  const parsed = reviewUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Ошибка валидации" };
  }

  const data = parsed.data;
  await prisma.review.update({
    where: { id },
    data: {
      name: data.name,
      city: data.city || null,
      telegram: data.telegram || null,
      text: data.text,
      rating: data.rating,
      ...(data.status ? { status: data.status } : {}),
      ...(data.locale ? { locale: data.locale } : {}),
    },
  });
  revalidatePublicReviews();
  return { ok: true as const };
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePublicReviews();
  return { ok: true as const };
}

export async function bulkApprove(ids: string[]) {
  await requireAdmin();
  await prisma.review.updateMany({
    where: { id: { in: ids } },
    data: { status: "approved" },
  });
  revalidatePublicReviews();
  return { ok: true as const };
}

export async function bulkReject(ids: string[]) {
  await requireAdmin();
  await prisma.review.updateMany({
    where: { id: { in: ids } },
    data: { status: "rejected" },
  });
  revalidatePublicReviews();
  return { ok: true as const };
}

export async function bulkDelete(ids: string[]) {
  await requireAdmin();
  await prisma.review.deleteMany({ where: { id: { in: ids } } });
  revalidatePublicReviews();
  return { ok: true as const };
}
