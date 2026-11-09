"use client";

import { lazy, Suspense, useState } from "react";
import Image, { type StaticImageData } from "next/image";

import { format } from "@/i18n/config";

// The lightbox (and its CSS) is only downloaded when someone opens a photo.
const PhotoLightbox = lazy(() => import("./PhotoLightbox"));

export type GridPhoto = { n: number; image: StaticImageData; alt: string };
type Labels = { open: string; prev: string; next: string; close: string };

/**
 * variant="preview": a mosaic where the first photo takes a 2×2 cell (home page).
 * variant="all": an even grid of every photo (/photos).
 */
export function PhotoGrid({ photos, labels, variant = "all" }: { photos: GridPhoto[]; labels: Labels; variant?: "preview" | "all" }) {
  const [index, setIndex] = useState(-1);
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
                aria-label={format(labels.open, { alt: p.alt })}
                className="relative block aspect-[4/3] h-full w-full overflow-hidden rounded-photo bg-steel"
              >
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes={big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
                  placeholder="blur"
                  className="object-cover transition-opacity hover:opacity-90"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {index >= 0 && (
        <Suspense fallback={null}>
          <PhotoLightbox
            index={index}
            onClose={() => setIndex(-1)}
            labels={{ Previous: labels.prev, Next: labels.next, Close: labels.close }}
            slides={photos.map((p) => ({ src: p.image.src, width: p.image.width, height: p.image.height, alt: p.alt }))}
          />
        </Suspense>
      )}
    </>
  );
}
