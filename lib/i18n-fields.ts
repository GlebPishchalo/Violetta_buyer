import type { Locale } from "@/i18n/routing";

type LocalizedValue = {
  valueRu: string;
  valueEn?: string | null;
};

type LocalizedDescription = {
  descriptionRu?: string | null;
  descriptionEn?: string | null;
};

type LocalizedNote = {
  noteRu?: string | null;
  noteEn?: string | null;
};

export function pickField(item: LocalizedValue, locale: Locale | string): string {
  return locale === "en" && item.valueEn ? item.valueEn : item.valueRu;
}

export function pickDescription(
  item: LocalizedDescription,
  locale: Locale | string
): string {
  if (locale === "en" && item.descriptionEn) {
    return item.descriptionEn;
  }
  return item.descriptionRu ?? "";
}

export function pickNote(
  item: LocalizedNote,
  locale: Locale | string
): string {
  if (locale === "en" && item.noteEn) {
    return item.noteEn;
  }
  return item.noteRu ?? "";
}
