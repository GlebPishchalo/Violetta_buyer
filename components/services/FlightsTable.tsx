import { getFormatter, getTranslations } from "next-intl/server";
import { ArrowRight, Plane } from "lucide-react";
import { pickNote } from "@/lib/i18n-fields";
import type { Locale } from "@/i18n/routing";

export type FlightRow = {
  id: string;
  date: Date;
  direction: string;
  noteRu: string | null;
  noteEn: string | null;
};

type FlightsTableProps = {
  flights: FlightRow[];
  locale: Locale;
};

function formatDirection(direction: string): string {
  if (direction === "DXB-MOW") return "DXB→MOW";
  if (direction === "MOW-DXB") return "MOW→DXB";
  return direction;
}

export async function FlightsTable({ flights, locale }: FlightsTableProps) {
  const t = await getTranslations("services");
  const format = await getFormatter({ locale });

  if (flights.length === 0) {
    return <p className="font-sans text-sm text-ash">{t("flightsEmpty")}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {flights.map((flight, index) => (
        <article
          key={flight.id}
          className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-[#347d77]/20 bg-white/45 p-4 transition-[background,border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#347d77]/40 hover:bg-white/75 hover:shadow-[0_12px_28px_rgba(31,93,86,0.08)] sm:p-5"
        >
          <time
            dateTime={flight.date.toISOString()}
            className="flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-xl bg-[#d1ebe6] text-[#205f59]"
          >
            <span className="font-serif text-2xl leading-none">
              {format.dateTime(flight.date, { day: "numeric" })}
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em]">
              {format.dateTime(flight.date, { month: "short" })}
            </span>
          </time>
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-[#216e67]">
              <span>{formatDirection(flight.direction).split("→")[0]}</span>
              <ArrowRight size={14} aria-hidden="true" />
              <span>{formatDirection(flight.direction).split("→")[1]}</span>
            </div>
            <p className="truncate text-sm text-[#365f5b]">
              {pickNote(flight, locale) || t("direction")}
            </p>
          </div>
          <span className="col-span-2 flex items-center justify-between border-t border-[#347d77]/15 pt-3 text-[10px] uppercase tracking-[0.12em] text-[#64837f]">
            {format.dateTime(flight.date, { weekday: "long" })}
            <Plane
              size={15}
              className="text-[#347d77] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
              aria-hidden="true"
              style={{ transitionDelay: `${index * 10}ms` }}
            />
          </span>
        </article>
      ))}
    </div>
  );
}
