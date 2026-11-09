import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { brands } from "../data/media";
import { Picture } from "./Picture";

/** True once the element has been on screen; never flips back. */
function useSeenOnce(threshold = 0.35) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
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
  return [ref, seen];
}

/**
 * The brand shelf: the one bold element on the page.
 * Four real bags stand side by side on a dark band, like stock on a warehouse shelf.
 */
export function Brands({ onRequestPrice }) {
  const { t } = useTranslation();
  const [shelfRef, settled] = useSeenOnce();

  return (
    <section id="brands" aria-labelledby="brands-title" className="on-dark bg-silo py-20 text-white md:py-28">
      <div className="container">
        <h2 id="brands-title" className="text-2xl md:text-3xl">
          {t("brands.title")}
        </h2>
        <p className="mt-3 max-w-prose text-lg text-white/80">{t("brands.lead")}</p>
      </div>

      <div className="container mt-12 md:mt-16">
        <ul
          ref={shelfRef}
          data-settled={settled}
          className="shelf shelf-scroll -mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0"
        >
          {brands.map((brand, i) => (
            // No gap between items, so the shelf line under the bags runs unbroken.
            <li key={brand.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-auto">
              <div className="flex h-60 items-end justify-center border-b-4 border-silo-300 px-3 sm:h-72 md:px-4 lg:h-[26rem]">
                <Picture
                  pic={brand.image}
                  alt={t("brands.bagAlt", { name: brand.name })}
                  sizes="(min-width: 768px) 22vw, 44vw"
                  className="shelf-bag block h-full"
                  imgClassName="h-full w-auto object-contain object-bottom"
                  style={{ "--i": i }} // drives the stagger in index.css
                />
              </div>
              <div className="px-3 md:px-4">
                <h3 className="mt-5 text-lg font-semibold">
                  <bdi translate="no">{brand.name}</bdi>
                </h3>
                <p className="mt-1 text-sm text-white/75">
                  {t("brands.grade")}
                  <br />
                  {t("brands.pack")}
                </p>
                <button
                  type="button"
                  onClick={() => onRequestPrice(brand.id)}
                  className="link mt-3 min-h-[2.75rem] text-start text-[0.9375rem] font-medium text-gold"
                  aria-label={t("brands.ctaLabel", { name: brand.name })}
                >
                  {t("brands.cta")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
