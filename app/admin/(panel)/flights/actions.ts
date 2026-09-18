"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { flightSchema } from "@/lib/validations/admin";
import { revalidatePublicFlights } from "@/lib/revalidate";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId) {
    throw new Error("Unauthorized");
  }
}

export async function createFlight(raw: unknown) {
  await requireAdmin();
  const parsed = flightSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Ошибка валидации" };
  }

  const data = parsed.data;
  const flight = await prisma.flight.create({
    data: {
      date: new Date(data.date),
      direction: data.direction,
      noteRu: data.noteRu || null,
      noteEn: data.noteEn || null,
    },
  });
  revalidatePublicFlights();
  return { ok: true as const, flight };
}

export async function updateFlight(id: string, raw: unknown) {
  await requireAdmin();
  const parsed = flightSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Ошибка валидации" };
  }

  const data = parsed.data;
  await prisma.flight.update({
    where: { id },
    data: {
      date: new Date(data.date),
      direction: data.direction,
      noteRu: data.noteRu || null,
      noteEn: data.noteEn || null,
    },
  });
  revalidatePublicFlights();
  return { ok: true as const };
}

export async function deleteFlight(id: string) {
  await requireAdmin();
  await prisma.flight.delete({ where: { id } });
  revalidatePublicFlights();
  return { ok: true as const };
}
