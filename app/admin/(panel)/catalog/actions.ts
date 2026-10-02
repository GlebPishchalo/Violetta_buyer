"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { shopSchema } from "@/lib/validations/admin";
import { revalidatePublicCatalog } from "@/lib/revalidate";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId) {
    throw new Error("Unauthorized");
  }
}

export async function createShop(raw: unknown) {
  await requireAdmin();
  const parsed = shopSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Ошибка валидации",
    };
  }

  const data = parsed.data;
  const maxOrder = await prisma.shop.aggregate({ _max: { order: true } });
  const shop = await prisma.shop.create({
    data: {
      name: data.name,
      url: data.url,
      category: data.category,
      descriptionRu: data.descriptionRu || null,
      descriptionEn: data.descriptionEn || null,
      image: data.image || null,
      order: data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  });
  revalidatePublicCatalog();
  return { ok: true as const, shop };
}

export async function updateShop(id: string, raw: unknown) {
  await requireAdmin();
  const parsed = shopSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Ошибка валидации",
    };
  }

  const data = parsed.data;
  await prisma.shop.update({
    where: { id },
    data: {
      name: data.name,
      url: data.url,
      category: data.category,
      descriptionRu: data.descriptionRu || null,
      descriptionEn: data.descriptionEn || null,
      image: data.image || null,
    },
  });
  revalidatePublicCatalog();
  return { ok: true as const };
}

export async function deleteShop(id: string) {
  await requireAdmin();
  await prisma.shop.delete({ where: { id } });
  revalidatePublicCatalog();
  return { ok: true as const };
}

export async function reorderShops(ids: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.shop.update({
        where: { id },
        data: { order: index + 1 },
      })
    )
  );
  revalidatePublicCatalog();
  return { ok: true as const };
}
