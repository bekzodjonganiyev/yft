import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { Picture, toSrcSet } from "./Picture";

// The lightbox (and its CSS) is only downloaded when someone opens a photo.
const PhotoLightbox = lazy(() => import("./PhotoLightbox"));

/**
 * variant="preview": a mosaic where the first photo takes a 2×2 cell (home page).
 * variant="all": an even grid of every photo (/photos).
 */
export function PhotoGrid({ photos, variant = "all" }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(-1);

  const slides = photos.map((p) => ({
    src: p.pic.img.src,
    width: p.pic.img.w,
    height: p.pic.img.h,
    alt: t(p.altKey),
    srcSet: toSrcSet(p.pic),
  }));

  const preview = variant === "preview";

  return (
    <>
      <ul
        className={
          preview
            ? "grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"
            : "grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4"
        }
      >
        {photos.map((p, i) => {
          const big = preview && i === 0;
          return (
            <li key={p.n} className={big ? "col-span-2 row-span-2" : undefined}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("photos.open", { alt: t(p.altKey) })}
                className="block h-full w-full overflow-hidden rounded-photo bg-steel"
              >
                <Picture
                  pic={p.pic}
                  alt={t(p.altKey)}
                  sizes={big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
                  className="block h-full"
                  imgClassName="aspect-[4/3] h-full w-full object-cover transition-opacity hover:opacity-90"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {index >= 0 && (
        <Suspense fallback={null}>
          <PhotoLightbox
            slides={slides}
            index={index}
            onClose={() => setIndex(-1)}
            labels={{ Previous: t("photos.prev"), Next: t("photos.next"), Close: t("photos.close") }}
          />
        </Suspense>
      )}
    </>
  );
}
