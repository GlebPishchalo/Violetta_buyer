import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DXB·MOW — Personal Buyer Dubai",
    template: "%s · DXB·MOW",
  },
  description:
    "Персональный байер в Дубае. Выкуп из магазинов ОАЭ, стабильные вылеты, передача посылок Дубай — Москва.",
};

type RootLayoutProps = {
  children: ReactNode;
};

/** Pass-through: html/body live in [locale] and admin layouts. */
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
