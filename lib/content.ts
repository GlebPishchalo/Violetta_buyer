import { prisma } from "@/lib/db";
import { pickField } from "@/lib/i18n-fields";
import type { Locale } from "@/i18n/routing";
import type { ContentBlock } from "@prisma/client";

export type ContentValue = {
  valueRu: string;
  valueEn: string | null;
};

export async function getContentBlocks(): Promise<Map<string, ContentValue>> {
  try {
    const blocks: ContentBlock[] = await prisma.contentBlock.findMany();
    return new Map(
      blocks.map((block) => [
        block.key,
        { valueRu: block.valueRu, valueEn: block.valueEn },
      ])
    );
  } catch {
    return new Map();
  }
}

export function getBlock(
  blocks: Map<string, ContentValue>,
  key: string,
  locale: Locale | string,
  fallback = ""
): string {
  const block = blocks.get(key);
  if (!block) return fallback;
  return pickField(block, locale);
}

export async function getTelegramUrl(): Promise<string> {
  try {
    const block = await prisma.contentBlock.findUnique({
      where: { key: "telegram_url" },
    });
    return block?.valueRu ?? "https://t.me/PLACEHOLDER";
  } catch {
    return "https://t.me/PLACEHOLDER";
  }
}
