"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { format, type Locale } from "@/i18n/config";

type Brand = { id: string; name: string; image: StaticImageData };
type Labels = { grade: string; pack: string; cta: string; ctaLabel: string; bagAlt: string };

/** True once the element has been on screen; never flips back. */
function useSeenOnce<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/**
 * The four bags standing on one unbroken shelf line.
 * "Request price" deep-links to the form with the brand preselected (?brand=…#contact).
 */
export function BrandShelf({ brands, labels, locale }: { brands: readonly Brand[]; labels: Labels; locale: Locale }) {
  const [shelfRef, settled] = useSeenOnce<HTMLUListElement>();

  return (
    <ul
      ref={shelfRef}
      data-settled={settled}
      className="shelf shelf-scroll -mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0"
    >
      {brands.map((brand, i) => (
        // No gap between items, so the shelf line under the bags runs unbroken.
        <li key={brand.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-auto">
          <div className="flex h-60 items-end justify-center border-b-4 border-silo-300 px-3 sm:h-72 md:px-4 lg:h-[26rem]">
            <Image
              src={brand.image}
              alt={format(labels.bagAlt, { name: brand.name })}
              sizes="(min-width: 768px) 22vw, 44vw"
              className="shelf-bag h-full w-auto object-contain object-bottom"
              style={{ "--i": i } as CSSProperties}
            />
          </div>
          <div className="px-3 md:px-4">
            <h3 className="mt-5 text-lg font-semibold">
              <bdi translate="no">{brand.name}</bdi>
            </h3>
            <p className="mt-1 text-sm text-white/75">
              {labels.grade}
              <br />
              {labels.pack}
            </p>
            <Link
              href={`/${locale}?brand=${brand.id}#contact`}
              className="link mt-3 inline-flex min-h-[2.75rem] items-center text-[0.9375rem] font-medium text-gold"
              aria-label={format(labels.ctaLabel, { name: brand.name })}
            >
              {labels.cta}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
