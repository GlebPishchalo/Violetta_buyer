import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type FooterProps = {
  telegramUrl: string;
};

export async function Footer({ telegramUrl }: FooterProps) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white/50 shadow-[0_-16px_50px_rgba(28,68,52,0.04)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            {t("contact")}
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block font-serif text-3xl text-gold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-copper"
          >
            <span className="underline-offset-8 group-hover:underline">
              {t("telegramCta")}
            </span>
          </a>
          <p className="max-w-xs font-sans text-sm leading-relaxed text-ash">
            {t("tagline")}
          </p>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            {t("navigation")}
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/services"
                className="font-sans text-sm text-bone transition-all duration-300 ease-out hover:translate-x-1 hover:text-gold"
              >
                {tn("services")}
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className="font-sans text-sm text-bone transition-colors hover:text-gold"
              >
                {tn("shops")}
              </Link>
            </li>
            <li>
              <Link
                href="/services#flights"
                className="font-sans text-sm text-bone transition-colors hover:text-gold"
              >
                {tn("flights")}
              </Link>
            </li>
            <li>
              <Link
                href="/reviews"
                className="font-sans text-sm text-bone transition-colors hover:text-gold"
              >
                {tn("reviews")}
              </Link>
            </li>
            <li>
              <Link
                href="/product-reviews"
                className="font-sans text-sm text-bone transition-colors hover:text-gold"
              >
                {tn("productReviews")}
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-6 md:items-end md:text-right">
          <Link
            href="/"
            className="font-serif text-xl tracking-wide text-bone transition-colors hover:text-gold"
          >
            Avalise
          </Link>
          <p className="font-mono text-xs text-ash">
            © {year}  {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
