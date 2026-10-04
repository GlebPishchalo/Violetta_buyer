"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Search, X, Store, Plane, PanelsTopLeft, Send, Star, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

type HeaderProps = {
  telegramUrl: string;
};

export function Header({ telegramUrl }: HeaderProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hash, setHash] = useState("");

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

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  function selectNavItem(href: string) {
    setHash(href.endsWith("#flights") ? "#flights" : "");
    setMenuOpen(false);
  }

  const nav = [
    { href: "/catalog" as const, label: t("shops"), icon: Store },
    { href: "/services#flights" as const, label: t("flights"), icon: Plane },
    { href: "/services" as const, label: t("services"), icon: PanelsTopLeft },
    { href: "/reviews" as const, label: t("reviews"), icon: Star },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-[#347d77]/20 transition-[background,box-shadow] duration-300 ${
          scrolled ? "bg-[#e6f4f1]/95 shadow-[0_5px_25px_rgba(29,91,85,0.08)] backdrop-blur-md" : "bg-[#e6f4f1]/85 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto grid h-[68px] max-w-7xl grid-cols-3 items-center px-4 sm:px-6">
          <Link
            href="/catalog"
            className="inline-flex h-9 w-9 items-center justify-center gap-2 justify-self-start rounded-full border border-[#347d77]/30 px-0 text-[#347d77] transition-[background,color] hover:bg-white/70 hover:text-[#173e3a] sm:w-auto sm:justify-center sm:px-3"
            aria-label={t("shops")}
            title={t("shops")}
          >
            <Search size={16} strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden font-sans text-xs sm:inline">{t("shops")}</span>
          </Link>
          <Link
            href="/"
            className="justify-self-center whitespace-nowrap font-serif text-[1.5rem] leading-none text-[#286a64] transition-transform duration-300 hover:scale-[1.03] sm:text-[1.8rem]"
          >
            AVALISE
          </Link>
          <div className="flex items-center justify-self-end gap-3 sm:gap-5">
            <LocaleSwitcher />
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#cae8e3] text-[#286a64] transition-[background,transform] hover:scale-105 hover:bg-[#b5ded7] sm:inline-flex"
              aria-label={tc("telegram")}
              title={tc("telegram")}
            >
              <Send size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#286a64] transition-colors hover:bg-[#cae8e3] md:hidden"
              aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        <nav
          className="hidden h-[54px] items-end justify-center gap-1 border-t border-[#347d77]/15 px-5 md:flex"
          aria-label={t("mainNav")}
        >
          {nav.map((item) => (
            <DesktopNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              onClick={() => selectNavItem(item.href)}
              active={
                item.href === "/services#flights"
                  ? pathname === "/services" && hash === "#flights"
                  : item.href === "/services"
                    ? pathname === "/services" && hash !== "#flights"
                    : pathname === item.href
              }
            />
          ))}
        </nav>
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
              className="absolute inset-0 bg-bone/40 backdrop-blur-sm"
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
                <span className="font-serif text-lg tracking-wide text-bone">AVALISE</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-ash"
                  aria-label={t("menuClose")}
                >
                  <X size={20} />
                </button>
              </div>
              <ul className="flex flex-col gap-6">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => selectNavItem(item.href)}
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

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-ink-soft/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(20,76,72,0.12)] backdrop-blur-md md:hidden" aria-label={t("mobileNav")}>
        <DockLink href="/catalog" icon={Store} label={t("shops")} active={pathname === "/catalog"} onClick={() => selectNavItem("/catalog")} />
        <DockLink href="/services#flights" icon={Plane} label={t("flights")} active={pathname === "/services" && hash === "#flights"} onClick={() => selectNavItem("/services#flights")} />
        <DockLink href="/services" icon={PanelsTopLeft} label={t("services")} active={pathname === "/services" && hash !== "#flights"} onClick={() => selectNavItem("/services")} />
        <DockLink href="/reviews" icon={Star} label={t("reviews")} active={pathname === "/reviews"} onClick={() => selectNavItem("/reviews")} />
      </nav>
    </>
  );
}

function DockLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: "/catalog" | "/services#flights" | "/services" | "/reviews";
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-t-[20px] px-1 text-center transition-[background,color] duration-200 hover:bg-[#cce9e4] hover:text-[#173e3a] ${
        active ? "bg-[#e6f4f1] text-[#205f59]" : "text-[#286a64]"
      }`}
    >
      <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
      <span className="max-w-full text-[9px] leading-tight">{label}</span>
    </Link>
  );
}

function DesktopNavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: "/catalog" | "/services#flights" | "/services" | "/reviews";
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-[46px] items-center gap-2 rounded-t-[16px] px-5 text-[11px] uppercase tracking-[0.08em] transition-[background,color] duration-200 ${
        active
          ? "bg-[#cce9e4] text-[#174e49]"
          : "text-[#527a75] hover:bg-white/65 hover:text-[#173e3a]"
      }`}
    >
      <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
      {label}
    </Link>
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
