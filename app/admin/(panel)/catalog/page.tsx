import type { Metadata } from "next";
import type { Shop } from "@prisma/client";
import { prisma } from "@/lib/db";
import { CatalogManager } from "./CatalogManager";

export const metadata: Metadata = {
  title: "Каталог",
};

export default async function AdminCatalogPage() {
  let shops: Shop[] = [];
  try {
    shops = await prisma.shop.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    shops = [];
  }

  return (
    <CatalogManager
      shops={shops.map((s) => ({
        id: s.id,
        name: s.name,
        url: s.url,
        category: s.category,
        descriptionRu: s.descriptionRu,
        descriptionEn: s.descriptionEn,
        image: s.image,
        order: s.order,
      }))}
    />
  );
}
