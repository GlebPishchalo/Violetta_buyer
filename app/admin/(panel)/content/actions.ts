"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { contentBlocksSchema } from "@/lib/validations/admin";
import { revalidatePublicContent } from "@/lib/revalidate";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId) {
    throw new Error("Unauthorized");
  }
}

export async function updateContentBlocks(raw: unknown) {
  await requireAdmin();
  const parsed = contentBlocksSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Ошибка валидации" };
  }

  await prisma.$transaction(
    parsed.data.map((block) =>
      prisma.contentBlock.upsert({
        where: { key: block.key },
        update: {
          valueRu: block.valueRu,
          valueEn: block.valueEn ?? null,
        },
        create: {
          key: block.key,
          valueRu: block.valueRu,
          valueEn: block.valueEn ?? null,
        },
      })
    )
  );

  revalidatePublicContent();
  return { ok: true as const };
}
