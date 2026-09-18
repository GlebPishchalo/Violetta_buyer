"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Kicker } from "@/components/ui/Kicker";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Marquee } from "@/components/ui/Marquee";
import { Button } from "@/components/ui/Button";

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
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 120 * 0.3]
  );

  return (
    <section ref={ref} className="relative overflow-hidden">
      <Marquee className="border-t-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
          {t("marquee")}
        </span>
      </Marquee>

      <div className="relative min-h-[88vh]">
        <motion.div style={{ y }} className="absolute inset-0">
          {/* TODO: replace with WebP from stock-images MCP when available */}
          <Image
            src="/images/hero-dubai.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-ink/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
        </motion.div>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20">
          <div className="max-w-3xl space-y-6">
            <Kicker>{kicker}</Kicker>
            <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-bone sm:text-5xl md:text-6xl lg:text-[5.5rem] lg:leading-[1.02]">
              {title}
            </h1>
            <p className="max-w-xl font-sans text-base leading-relaxed text-ash md:text-lg">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#catalog">
                <Button variant="primary">{tc("viewCatalog")}</Button>
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost">{tc("writeTelegram")}</Button>
              </a>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                {t("statFlights")}
              </dt>
              <dd className="mt-2 font-serif text-4xl text-bone md:text-5xl">
                <AnimatedNumber value={stats.flights} />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                {t("statParcels")}
              </dt>
              <dd className="mt-2 font-serif text-4xl text-bone md:text-5xl">
                <AnimatedNumber value={stats.parcels} suffix="+" />
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                {t("statYears")}
              </dt>
              <dd className="mt-2 font-serif text-4xl text-bone md:text-5xl">
                <AnimatedNumber value={stats.years} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
