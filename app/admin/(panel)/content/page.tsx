import type { Metadata } from "next";
import type { ContentBlock } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ContentEditor } from "./ContentEditor";

export const metadata: Metadata = {
  title: "Контент",
};

export default async function AdminContentPage() {
  let blocks: ContentBlock[] = [];
  try {
    blocks = await prisma.contentBlock.findMany({
      orderBy: { key: "asc" },
    });
  } catch {
    blocks = [];
  }

  return (
    <ContentEditor
      blocks={blocks.map((b) => ({
        key: b.key,
        valueRu: b.valueRu,
        valueEn: b.valueEn,
      }))}
    />
  );
}
