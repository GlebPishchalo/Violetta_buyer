import { getFormatter, getTranslations } from "next-intl/server";
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
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead className="border-b border-line bg-ink-soft">
          <tr>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              {t("date")}
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              {t("direction")}
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              {t("note")}
            </th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id} className="border-b border-line last:border-0">
              <td className="px-4 py-4 font-sans text-sm text-bone">
                {format.dateTime(flight.date, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="px-4 py-4 font-mono text-xs tracking-wider text-gold">
                {formatDirection(flight.direction)}
              </td>
              <td className="px-4 py-4 font-sans text-sm text-ash">
                {pickNote(flight, locale) || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
