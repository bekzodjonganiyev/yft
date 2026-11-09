import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { heroImage, primaryPhone } from "@/lib/site";

/**
 * The mill itself at dusk: the most characteristic thing in this company's world.
 * The building sits on the right, the open sky on the left carries the headline.
 * In RTL the photo is mirrored so the text still sits on open sky.
 */
export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="on-dark relative isolate flex min-h-[min(86svh,46rem)] items-end overflow-hidden bg-silo-700 text-white md:items-center">
      <Image
        src={heroImage}
        alt={t.photos.alt["24"]}
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        className="-z-10 object-cover object-[72%_50%] rtl:-scale-x-100"
      />
      {/* Legibility scrim over the sky side only; the building stays untouched. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-silo-700/90 via-silo-700/35 to-transparent md:bg-linear-to-r md:from-silo-700/80 md:via-silo-700/25 md:to-transparent rtl:md:bg-linear-to-l"
      />

      <div className="wrap pt-32 pb-12 md:py-24">
        <h1 className="max-w-[15ch] text-3xl md:text-4xl">{t.hero.title}</h1>
        <p className="mt-5 max-w-[42ch] text-lg text-white/90">{t.hero.lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}#contact`} className="btn btn-primary">
            {t.hero.ctaQuote}
          </Link>
          <a href={primaryPhone.href} className="btn btn-ghost-light">
            {t.hero.ctaCall}
            <span className="sr-only">: {primaryPhone.display}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
