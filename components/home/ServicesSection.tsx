"use client";

import { motion, useReducedMotion } from "framer-motion";
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

const icons = [
  PlaneIcon,
  BagIcon,
  ArrowDownIcon,
  ArrowUpIcon,
] as const;

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
        <div className="mb-12 max-w-xl space-y-3">
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
          const Icon = icons[index] ?? PlaneIcon;
          const number = String(index + 1).padStart(2, "0");

          const className =
            "group relative border border-line bg-ink-soft p-6 transition-colors hover:border-gold md:p-8";

          const inner = (
            <>
              <span className="pointer-events-none absolute right-5 top-4 font-serif text-5xl text-gold/30 md:text-6xl">
                {number}
              </span>
              <Icon />
              <h3 className="mt-5 font-serif text-xl text-bone md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ash">
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
              whileHover={reduceMotion ? undefined : { y: -4 }}
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

function iconProps(className = "text-gold") {
  return {
    width: 28,
    height: 28,
    viewBox: "0 0 28 28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    className,
    "aria-hidden": true as const,
  };
}

function PlaneIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 16l8-2 10-8-2 10-2 8-6-6-8-2z" />
      <path d="M12 14l-4 8" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="6" y="10" width="16" height="12" rx="1" />
      <path d="M10 10V8a4 4 0 018 0v2" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M14 5v16" />
      <path d="M8 15l6 6 6-6" />
      <path d="M6 8h16" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M14 23V7" />
      <path d="M8 13l6-6 6 6" />
      <path d="M6 20h16" />
    </svg>
  );
}
