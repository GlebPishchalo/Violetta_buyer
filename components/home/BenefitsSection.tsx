import { getTranslations } from "next-intl/server";
import { ArrowRight, BadgeCheck, Building2, Plane, ShoppingBag } from "lucide-react";

const benefitIcons = [ShoppingBag, BadgeCheck, Building2] as const;

export async function BenefitsSection() {
  const t = await getTranslations("benefits");
  const items = t.raw("items") as { title: string; body: string }[];

  return (
    <section className="bg-[#e8f4f1] px-5 py-12 text-[#203c3a] sm:py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <header className="text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#387a73] sm:text-[10px]">
            {t("kicker")}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-[#183b38] sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </header>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3 sm:mt-10 sm:gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#337d76]/35 bg-[#e3eee7] text-[#337d76]">
              <Building2 size={20} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#426d68] sm:text-[10px]">
              {t("dubai")}
            </span>
          </div>
          <div className="relative flex w-[min(30vw,15rem)] items-center justify-center text-[#347d77] sm:w-60">
            <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#65938d]/55" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f4f1]">
              <Plane size={20} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2" size={15} strokeWidth={1.3} aria-hidden="true" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#337d76]/35 bg-[#e3eee7] text-[#337d76]">
              <Building2 size={20} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#426d68] sm:text-[10px]">
              {t("moscow")}
            </span>
          </div>
        </div>

        <div className="mt-8 grid divide-y divide-[#347d77]/20 border-y border-[#347d77]/20 md:mt-12 md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item, index) => {
            const Icon = benefitIcons[index] ?? BadgeCheck;
            return (
              <article key={item.title} className="flex gap-4 px-1 py-5 sm:px-5 md:flex-col md:px-7 md:py-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#347d77]/25 text-[#347d77] md:h-12 md:w-12">
                  <Icon size={20} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-[#183b38] sm:text-xl">{item.title}</h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[#58736e]">{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}