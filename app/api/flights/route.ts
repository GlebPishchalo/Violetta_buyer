import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const flights = await prisma.flight.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ flights });
  } catch {
    return NextResponse.json(
      { flights: [], error: "Database unavailable" },
      { status: 503 }
    );
  }
}
