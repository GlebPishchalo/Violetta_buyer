"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

type HeaderProps = {
  telegramUrl: string;
};

export function Header({ telegramUrl }: HeaderProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const nav = [
    { href: "/services" as const, label: t("services") },
    { href: "/catalog" as const, label: t("shops") },
    { href: "/services#flights" as const, label: t("flights") },
    { href: "/reviews" as const, label: t("reviews") },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-line transition-[height,background-color] duration-300 ${
          scrolled
            ? "bg-ink-soft/90 backdrop-blur-md"
            : "bg-ink/80 backdrop-blur-md"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <Link
            href="/"
            className="font-serif text-lg tracking-wide text-bone transition-colors hover:text-gold"
          >
            Avalise
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label={t("mainNav")}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm text-ash transition-colors hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <LocaleSwitcher />
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 bg-gold px-4 py-2 font-sans text-sm font-medium text-ink transition-colors hover:bg-copper sm:inline-flex"
            >
              <TelegramIcon />
              {tc("telegram")}
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-line text-bone md:hidden"
              aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="sr-only">
                {menuOpen ? t("menuClose") : t("menuOpen")}
              </span>
              <Burger open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/80"
              aria-label={t("menuClose")}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              aria-label={t("mobileNav")}
              className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-line bg-ink-soft px-6 py-8"
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: "easeOut" }}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-serif text-lg text-bone">DXB·MOW</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-sm text-ash"
                  aria-label={t("menuClose")}
                >
                  ✕
                </button>
              </div>
              <ul className="flex flex-col gap-6">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-serif text-2xl text-bone transition-colors hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 bg-gold px-4 py-3 font-sans text-sm font-medium text-ink"
              >
                <TelegramIcon />
                {tc("telegram")}
              </a>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden>
      <span
        className={`absolute left-0 top-0 h-px w-full bg-bone transition-transform ${
          open ? "translate-y-[7px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[7px] h-px w-full bg-bone transition-opacity ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 top-[14px] h-px w-full bg-bone transition-transform ${
          open ? "-translate-y-[7px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function TelegramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden fill="none">
      <path
        d="M21 4L3.5 11.5l5.5 2L11 20l2.5-4.5L19 17l2-13z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}
