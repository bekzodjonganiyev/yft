import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { heroImage, primaryPhone } from "@/lib/site";
import { HeroAtmosphere } from "./HeroAtmosphere";

/** Each word in a mask so it can rise into place on load (CSS only; see globals.css "Motion 1"). */
function RisingWords({ text, start = 0 }: { text: string; start?: number }) {
  return text
    .split(" ")
    .filter(Boolean)
    .map((word, i) => (
      // The space stays outside the mask: trailing whitespace inside an inline-block is dropped.
      <Fragment key={i}>
        <span className="enter-word">
          <span style={{ "--w": start + i } as CSSProperties}>{word}</span>
        </span>{" "}
      </Fragment>
    ));
}

export const ArrowIcon = () => (
  <svg className="btn-arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.5 9h11m0 0L10 4.5M14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * The mill at dusk, full-bleed: the most characteristic thing in this company's world.
 * The headline's first sentence names what is sold; the second, in a lighter tone, how it is sold.
 */
export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [first, ...rest] = t.hero.title.split(/(?<=[.。])\s+/);
  const second = rest.join(" ");
  const firstCount = first.split(" ").filter(Boolean).length;

  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy-950 text-white">
      <div className="enter-media absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt={t.photos.alt["24"]}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          className="object-cover object-[68%_40%] rtl:-scale-x-100"
        />
      </div>
      <HeroAtmosphere />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950 via-navy-950/60 to-navy-950/10 lg:bg-linear-to-r lg:from-navy-950/95 lg:via-navy-950/70 lg:via-45% lg:to-navy-950/0 rtl:lg:bg-linear-to-l"
      />

      <div className="wrap pt-[calc(var(--nav-h)+4rem)] pb-[clamp(3rem,2rem+4vw,6rem)]">
        <h1 id="hero-title" className="max-w-[15ch] text-display">
          <span className="block">
            <RisingWords text={first} />
          </span>
          {second && (
            <span className="mt-[0.12em] block text-white/60">
              <RisingWords text={second} start={firstCount} />
            </span>
          )}
        </h1>
        <p className="enter-follow mt-7 max-w-[44ch] text-lead text-white/85" style={{ "--f": 0 } as CSSProperties}>
          {t.hero.lead}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={`/${locale}#contact`} className="btn enter-follow" style={{ "--f": 1 } as CSSProperties}>
            {t.hero.ctaQuote}
            <ArrowIcon />
          </Link>
          <a href={primaryPhone.href} className="btn btn-outline enter-follow text-white" style={{ "--f": 2 } as CSSProperties}>
            {t.hero.ctaCall}
            <span className="sr-only">: {primaryPhone.display}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
