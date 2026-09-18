"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { updateContentBlocks } from "./actions";

export type ContentItem = {
  key: string;
  valueRu: string;
  valueEn: string | null;
};

type ContentEditorProps = {
  blocks: ContentItem[];
};

const GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "Hero",
    keys: ["hero_kicker", "hero_title", "hero_subtitle"],
  },
  {
    title: "Услуги",
    keys: [
      "service_1_title",
      "service_1_body",
      "service_2_title",
      "service_2_body",
      "service_3_title",
      "service_3_body",
      "service_4_title",
      "service_4_body",
    ],
  },
  {
    title: "Статистика",
    keys: ["stat_flights", "stat_parcels", "stat_years"],
  },
  {
    title: "Условия",
    keys: ["terms_body"],
  },
  {
    title: "Telegram",
    keys: ["telegram_url"],
  },
];

export function ContentEditor({ blocks }: ContentEditorProps) {
  const [tab, setTab] = useState<"ru" | "en">("ru");
  const [values, setValues] = useState(() => {
    const initial: Record<string, { valueRu: string; valueEn: string }> = {};
    for (const group of GROUPS) {
      for (const key of group.keys) {
        initial[key] = { valueRu: "", valueEn: "" };
      }
    }
    for (const b of blocks) {
      initial[b.key] = { valueRu: b.valueRu, valueEn: b.valueEn ?? "" };
    }
    return initial;
  });
  const [pending, startTransition] = useTransition();

  const knownKeys = useMemo(
    () => new Set(GROUPS.flatMap((g) => g.keys)),
    []
  );

  const extra = blocks.filter((b) => !knownKeys.has(b.key));

  function setField(key: string, field: "valueRu" | "valueEn", value: string) {
    setValues((prev) => ({
      ...prev,
      [key]: {
        valueRu: prev[key]?.valueRu ?? "",
        valueEn: prev[key]?.valueEn ?? "",
        [field]: value,
      },
    }));
  }

  function save() {
    const payload = Object.entries(values).map(([key, v]) => ({
      key,
      valueRu: v.valueRu,
      valueEn: v.valueEn || null,
    }));

    startTransition(async () => {
      const result = await updateContentBlocks(payload);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Контент сохранён");
    });
  }

  function renderGroup(title: string, keys: string[]) {
    const present = keys.filter((k) => values[k] !== undefined || blocks.some((b) => b.key === k));
    // Ensure keys exist in values even if missing from DB
    for (const key of keys) {
      if (!values[key]) {
        // skip rendering empty unknown — still show inputs for known group keys
      }
    }

    return (
      <section key={title} className="space-y-4 border border-line bg-ink p-5">
        <h2 className="font-serif text-xl text-bone">{title}</h2>
        <div className="space-y-5">
          {keys.map((key) => {
            const current = values[key] ?? { valueRu: "", valueEn: "" };
            const enMissing = !current.valueEn.trim();
            const isLong =
              key.includes("body") ||
              key.includes("subtitle") ||
              key === "terms_body";

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
                    {key}
                  </p>
                  {enMissing ? (
                    <span
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-gold"
                      title="EN missing"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      EN missing
                    </span>
                  ) : null}
                </div>
                {tab === "ru" ? (
                  isLong ? (
                    <textarea
                      className={`${inputClass} min-h-28`}
                      value={current.valueRu}
                      onChange={(e) =>
                        setField(key, "valueRu", e.target.value)
                      }
                    />
                  ) : (
                    <input
                      className={inputClass}
                      value={current.valueRu}
                      onChange={(e) =>
                        setField(key, "valueRu", e.target.value)
                      }
                    />
                  )
                ) : isLong ? (
                  <textarea
                    className={`${inputClass} min-h-28`}
                    value={current.valueEn}
                    onChange={(e) =>
                      setField(key, "valueEn", e.target.value)
                    }
                  />
                ) : (
                  <input
                    className={inputClass}
                    value={current.valueEn}
                    onChange={(e) =>
                      setField(key, "valueEn", e.target.value)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
        {present.length === 0 ? null : null}
      </section>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("ru")}
          className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] ${
            tab === "ru"
              ? "border-gold bg-gold/10 text-gold"
              : "border-line text-ash"
          }`}
        >
          Русский
        </button>
        <button
          type="button"
          onClick={() => setTab("en")}
          className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] ${
            tab === "en"
              ? "border-gold bg-gold/10 text-gold"
              : "border-line text-ash"
          }`}
        >
          English
        </button>
      </div>

      {GROUPS.map((g) => renderGroup(g.title, g.keys))}

      {extra.length > 0 ? (
        <section className="space-y-4 border border-line bg-ink p-5">
          <h2 className="font-serif text-xl text-bone">Прочее</h2>
          {extra.map((block) => {
            const current = values[block.key] ?? {
              valueRu: block.valueRu,
              valueEn: block.valueEn ?? "",
            };
            return (
              <div key={block.key} className="space-y-2">
                <p className="font-mono text-[10px] text-ash">{block.key}</p>
                {tab === "ru" ? (
                  <textarea
                    className={`${inputClass} min-h-20`}
                    value={current.valueRu}
                    onChange={(e) =>
                      setField(block.key, "valueRu", e.target.value)
                    }
                  />
                ) : (
                  <textarea
                    className={`${inputClass} min-h-20`}
                    value={current.valueEn}
                    onChange={(e) =>
                      setField(block.key, "valueEn", e.target.value)
                    }
                  />
                )}
              </div>
            );
          })}
        </section>
      ) : null}

      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button onClick={save} disabled={pending}>
          {pending ? "Сохранение…" : "Сохранить всё"}
        </Button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full border border-line bg-ink-soft px-3 py-2 font-sans text-sm text-bone focus:border-gold";
