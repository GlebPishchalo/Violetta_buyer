import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { reviewCreateSchema } from "@/lib/validations/admin";

function originAllowed(req: NextRequest): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const expected = process.env.NEXTAUTH_URL?.replace(/\/$/, "");
  if (!expected) return true;

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (origin) {
    return origin.replace(/\/$/, "") === expected;
  }

  if (referer) {
    try {
      return new URL(referer).origin === expected;
    } catch {
      return false;
    }
  }

  return true;
}

export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  try {
    const reviews = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: limit && Number.isFinite(limit) && limit > 0 ? limit : undefined,
      select: {
        id: true,
        name: true,
        city: true,
        text: true,
        rating: true,
        locale: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json(
      { reviews: [], error: "Database unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!originAllowed(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(req.headers);
  const limited = rateLimit(`reviews:${ip}`, 3, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте позже." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = reviewCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ошибка валидации", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (data._gotcha) {
    return NextResponse.json({ ok: true });
  }

  try {
    await prisma.review.create({
      data: {
        name: data.name,
        city: data.city || null,
        telegram: data.telegram || null,
        text: data.text,
        rating: data.rating,
        locale: data.locale,
        status: "pending",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Не удалось сохранить отзыв" },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
