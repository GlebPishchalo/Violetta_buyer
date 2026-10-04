import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/ui/Grain";
import { PageTransition } from "@/components/layout/PageTransition";
import { getTelegramUrl } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const telegramUrl = await getTelegramUrl();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="public-body">
        <Grain />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="public-site flex min-h-screen flex-col">
            <Header telegramUrl={telegramUrl} />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer telegramUrl={telegramUrl} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
