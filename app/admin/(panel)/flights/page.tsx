import type { Metadata } from "next";
import type { Flight } from "@prisma/client";
import { prisma } from "@/lib/db";
import { FlightsManager } from "./FlightsManager";

export const metadata: Metadata = {
  title: "Вылеты",
};

export default async function AdminFlightsPage() {
  let flights: Flight[] = [];
  try {
    flights = await prisma.flight.findMany({
      orderBy: { date: "asc" },
    });
  } catch {
    flights = [];
  }

  return (
    <FlightsManager
      flights={flights.map((f) => ({
        id: f.id,
        date: f.date.toISOString(),
        direction: f.direction,
        noteRu: f.noteRu,
        noteEn: f.noteEn,
      }))}
    />
  );
}
