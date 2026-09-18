import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

const siteUrl =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `/${loc}${normalized === "/" ? "" : normalized}`])
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${normalized === "/" ? "" : normalized}`,
      languages,
    },
    openGraph: {
      title,
      description,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
      url: `${siteUrl}/${locale}${normalized === "/" ? "" : normalized}`,
    },
  };
}

export { siteUrl };
