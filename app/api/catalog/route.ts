import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const shops = await prisma.shop.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ shops });
  } catch {
    return NextResponse.json(
      { shops: [], error: "Database unavailable" },
      { status: 503 }
    );
  }
}
