import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Grain } from "@/components/ui/Grain";
import { AdminProviders } from "@/components/admin/AdminProviders";
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

export const metadata: Metadata = {
  title: {
    default: "Admin · Avalise",
    template: "%s · Admin · Avalise",
  },
  robots: { index: false, follow: false },
};

type AdminRootLayoutProps = {
  children: React.ReactNode;
};

/** Admin shell — всегда русский, вне [locale]. */
export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <html
      lang="ru"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-ink text-bone antialiased">
        <Grain />
        <AdminProviders>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#111114",
                color: "#EDEDED",
                border: "1px solid rgba(201,162,39,0.3)",
              },
            }}
          />
        </AdminProviders>
      </body>
    </html>
  );
}
