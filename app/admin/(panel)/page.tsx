import type { Metadata } from "next";
import type { Flight, Review } from "@prisma/client";
import { prisma } from "@/lib/db";
import { DashboardPending } from "./DashboardPending";

export const metadata: Metadata = {
  title: "Дашборд",
};

export default async function AdminDashboardPage() {
  let pendingCount = 0;
  let approvedCount = 0;
  let shopCount = 0;
  let nextFlight: Flight | null = null;
  let pendingReviews: Review[] = [];

  try {
    const [pending, approved, shops, flight, list] = await Promise.all([
      prisma.review.count({ where: { status: "pending" } }),
      prisma.review.count({ where: { status: "approved" } }),
      prisma.shop.count(),
      prisma.flight.findFirst({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
      }),
      prisma.review.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);
    pendingCount = pending;
    approvedCount = approved;
    shopCount = shops;
    nextFlight = flight;
    pendingReviews = list;
  } catch {
    // DB unavailable
  }

  const metrics = [
    { value: String(pendingCount), label: "На модерации" },
    { value: String(approvedCount), label: "Одобрено" },
    { value: String(shopCount), label: "Магазинов" },
    {
      value: nextFlight
        ? nextFlight.date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
          })
        : "—",
      label: "Ближайший вылет",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="border border-line bg-ink px-5 py-6"
          >
            <p className="font-serif text-5xl text-gold">{m.value}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-bone">
          Последние 5 отзывов на модерации
        </h2>
        <DashboardPending
          reviews={pendingReviews.map((r) => ({
            id: r.id,
            name: r.name,
            city: r.city,
            text: r.text,
            rating: r.rating,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      </section>
    </div>
  );
}
