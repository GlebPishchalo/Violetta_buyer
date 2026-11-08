"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Plane, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Kicker } from "@/components/ui/Kicker";
import { Section } from "@/components/ui/Section";
import { animationsEnabled } from "@/lib/animations";

type ServiceItem = {
  title: string;
  body: string;
};

type ServicesSectionProps = {
  items: ServiceItem[];
  showIntro?: boolean;
  sectionId?: string;
};

const icons = [Plane, ShoppingBag, ArrowDownToLine, ArrowUpFromLine] as const;

export function ServicesSection({
  items,
  showIntro = true,
  sectionId = "services",
}: ServicesSectionProps) {
  const t = useTranslations("services");
  const reduceMotion = useReducedMotion();
  const enabled = animationsEnabled();

  return (
    <Section id={sectionId}>
      {showIntro ? (
        <div className="reveal-on-scroll mb-12 max-w-xl space-y-3">
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="font-serif text-3xl text-bone md:text-4xl">
            {t("title")}
          </h2>
          <p className="font-sans text-sm leading-relaxed text-ash md:text-base">
            {t("subtitle")}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((item, index) => {
          const Icon = icons[index] ?? Plane;
          const number = String(index + 1).padStart(2, "0");

          const className =
            "group relative isolate min-h-[210px] overflow-hidden rounded-[1.5rem] border border-[#347d77]/20 bg-white/45 p-6 shadow-xl shadow-[#1c4434]/[0.06] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-[#347d77]/45 hover:bg-white/75 hover:shadow-2xl md:p-8";

          const inner = (
            <>
              <span className="pointer-events-none absolute -right-1 -top-7 -z-10 font-serif text-[9rem] leading-none text-[#2f968d]/[0.07] transition-transform duration-500 group-hover:translate-y-2">
                {number}
              </span>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#cae8e3] text-[#216e67] shadow-sm transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-md">
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-6 max-w-[18ch] font-serif text-xl text-[#173e3a] md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-[#527a75]">
                {item.body}
              </p>
            </>
          );

          return enabled ? (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={reduceMotion ? { opacity: 1, y: 16 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : index * 0.08,
              }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              className={className}
            >
              {inner}
            </motion.article>
          ) : (
            <article key={item.title} className={className}>
              {inner}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
