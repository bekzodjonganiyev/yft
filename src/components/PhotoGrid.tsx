"use client";

import { lazy, Suspense, useState } from "react";
import Image, { type StaticImageData } from "next/image";

import { format } from "@/i18n/config";

// The lightbox (and its CSS) is only downloaded when someone opens a photo.
const PhotoLightbox = lazy(() => import("./PhotoLightbox"));

export type GridPhoto = { n: number; image: StaticImageData; alt: string };
type Labels = { open: string; prev: string; next: string; close: string };

// Mosaic: 4 columns × 3 rows (2 × 6 on phones). The first photo takes 2×2 and the sixth 2×1,
// so eight photographs fill the grid exactly at both widths.
const MOSAIC_SPAN: Record<number, string> = { 0: "col-span-2 row-span-2", 5: "col-span-2" };

export function PhotoGrid({ photos, labels, layout = "grid" }: { photos: GridPhoto[]; labels: Labels; layout?: "mosaic" | "grid" }) {
  const [index, setIndex] = useState(-1);
  const mosaic = layout === "mosaic";

  return (
    <>
      <ul
        className={
          mosaic
            ? "grid grid-flow-dense grid-cols-2 auto-rows-[clamp(8.5rem,24vw,11rem)] gap-2 md:grid-cols-4 md:auto-rows-[clamp(10rem,15vw,15rem)] md:gap-3"
            : "grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4"
        }
      >
        {photos.map((p, i) => (
          <li key={p.n} className={mosaic ? MOSAIC_SPAN[i] : undefined}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={format(labels.open, { alt: p.alt })}
              className={`zoom relative block w-full overflow-hidden rounded-photo bg-navy-950 ${mosaic ? "h-full" : "aspect-[4/3]"}`}
            >
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes={mosaic && i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
                placeholder="blur"
                className="object-cover"
              />
            </button>
          </li>
        ))}
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
