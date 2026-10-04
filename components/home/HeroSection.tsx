"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Marquee } from "@/components/ui/Marquee";

type HeroSectionProps = {
  kicker: string;
  title: string;
  subtitle: string;
  telegramUrl: string;
  stats: {
    flights: number;
    parcels: number;
    years: number;
  };
};

export function HeroSection({
  kicker,
  title,
  subtitle,
  telegramUrl,
  stats,
}: HeroSectionProps) {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#dff2ef] text-[#173e3a]">
      <Marquee className="hidden border-t-0 border-[#347d77]/20 [&_div]:py-2 sm:block sm:[&_div]:py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#347d77]">
          {t("marquee")}
        </span>
      </Marquee>

      <div className="relative isolate mx-auto flex min-h-[520px] max-w-[1600px] flex-col items-center overflow-hidden px-5 pb-5 pt-6 sm:px-8 md:min-h-[620px] md:pb-8 md:pt-9">
        <motion.div
          className="absolute inset-0 -z-10"
          animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/hero-dubai.jpg"
            alt="Панорама Дубая на закате"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_44%] saturate-[0.72]"
          />
          <div className="absolute inset-0 bg-[#c8e8e3]/70 mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#e5f4f1]/95 via-[#d8efeb]/65 to-[#dff2ef]" />
        </motion.div>

        <motion.div
          className="relative z-10 flex w-full max-w-5xl flex-1 flex-col items-center text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#347d77]/30 bg-white/45 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#286a64] backdrop-blur-sm sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4eaaa0]" />
            {kicker}
          </span>
          <h1 className="max-w-[21ch] font-serif text-[2.3rem] leading-[0.98] text-[#173e3a] sm:text-6xl md:text-[4.5rem] lg:text-[5rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#365f5b] sm:text-base">
            {subtitle}
          </p>
          <div className="mt-6 flex flex-nowrap justify-center gap-2 sm:mt-7 sm:gap-3">
            <a
              href="#catalog"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#216e67] px-4 py-2.5 text-xs font-medium text-white shadow-[0_8px_24px_rgba(33,110,103,0.2)] transition-[transform,background,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#185a54] hover:shadow-[0_12px_28px_rgba(33,110,103,0.28)] sm:min-h-12 sm:gap-3 sm:px-6 sm:py-3 sm:text-sm"
            >
              {tc("viewCatalog")}
              <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#286a64]/35 bg-white/50 px-3 py-2.5 text-xs text-[#205b56] backdrop-blur-sm transition-[background,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/85 sm:min-h-12 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
            >
              <Send size={15} aria-hidden="true" />
              <span className="sm:hidden">Telegram</span>
              <span className="hidden sm:inline">{tc("writeTelegram")}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <motion.dl
          className="relative z-10 mt-5 grid w-full max-w-3xl grid-cols-3 divide-x divide-[#347d77]/25 border-y border-[#347d77]/25 py-2 sm:mt-9 sm:py-4"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.25 }}
        >
          <div className="px-2 text-center sm:px-5">
            <dt className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-[#426d68] sm:text-[10px] sm:tracking-[0.14em]">{t("statFlights")}</dt>
            <dd className="mt-1 font-serif text-2xl text-[#173e3a] sm:text-4xl"><AnimatedNumber value={stats.flights} /></dd>
          </div>
          <div className="px-2 text-center sm:px-5">
            <dt className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-[#426d68] sm:text-[10px] sm:tracking-[0.14em]">{t("statParcels")}</dt>
            <dd className="mt-1 font-serif text-2xl text-[#173e3a] sm:text-4xl"><AnimatedNumber value={stats.parcels} suffix="+" /></dd>
          </div>
          <div className="px-2 text-center sm:px-5">
            <dt className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-[#426d68] sm:text-[10px] sm:tracking-[0.14em]">{t("statYears")}</dt>
            <dd className="mt-1 font-serif text-2xl text-[#173e3a] sm:text-4xl"><AnimatedNumber value={stats.years} /></dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
