import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { brands } from "@/lib/site";
import { BrandShelf } from "./BrandShelf";

/** The one bold element on the page: real bags on a dark band, like stock on a warehouse shelf. */
export function Brands({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="brands" aria-labelledby="brands-title" className="on-dark bg-silo py-20 text-white md:py-28">
      <div className="wrap">
        <h2 id="brands-title" className="text-2xl md:text-3xl">
          {t.brands.title}
        </h2>
        <p className="mt-3 max-w-[68ch] text-lg text-white/80">{t.brands.lead}</p>
      </div>
      <div className="wrap mt-12 md:mt-16">
        <BrandShelf
          brands={brands}
          locale={locale}
          labels={{
            grade: t.brands.grade,
            pack: t.brands.pack,
            cta: t.brands.cta,
            ctaLabel: t.brands.ctaLabel,
            bagAlt: t.brands.bagAlt,
          }}
        />
      </div>
    </section>
  );
}
