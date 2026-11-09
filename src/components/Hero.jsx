import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { heroImage } from "../data/media";
import { primaryPhone } from "../data/contacts";
import { Picture } from "./Picture";

/**
 * The mill itself at dusk: the most characteristic thing in this company's world.
 * The building sits on the right, the open sky on the left carries the headline.
 * In RTL the photo is mirrored so the text still sits on open sky.
 */
export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="on-dark relative isolate flex min-h-[min(86svh,46rem)] items-end overflow-hidden bg-silo-700 text-white md:items-center">
      <Picture
        pic={heroImage}
        alt={t("photos.alt.24")}
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 -z-10"
        imgClassName="h-full w-full object-cover object-[72%_50%] rtl:-scale-x-100"
      />
      {/* Legibility scrim over the sky side only; the building stays untouched. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-silo-700/90 via-silo-700/35 to-transparent md:bg-gradient-to-r md:from-silo-700/80 md:via-silo-700/25 md:to-transparent rtl:md:bg-gradient-to-l"
      />

      <div className="container pb-12 pt-32 md:py-24">
        <h1 className="max-w-[15ch] text-3xl md:text-4xl">{t("hero.title")}</h1>
        <p className="mt-5 max-w-[42ch] text-lg text-white/90">{t("hero.lead")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={{ hash: "#contact" }} className="btn-primary">
            {t("hero.ctaQuote")}
          </Link>
          <a href={primaryPhone.href} className="btn-ghost-light">
            {t("hero.ctaCall")}
            <span className="sr-only">: {primaryPhone.display}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
