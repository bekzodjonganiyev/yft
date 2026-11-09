import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { gridPhotos, lightboxLabels } from "@/lib/photos";
import { allPhotoNumbers, galleryPreview } from "@/lib/site";
import { PhotoGrid } from "./PhotoGrid";

export function GalleryPreview({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="photos" aria-labelledby="photos-title" className="py-20 md:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="photos-title" className="text-2xl md:text-3xl">
            {t.gallery.title}
          </h2>
          <Link href={`/${locale}/photos`} className="link font-medium text-silo">
            {t.gallery.all} ({allPhotoNumbers.length})
          </Link>
        </div>
        <div className="mt-10">
          <PhotoGrid photos={gridPhotos(galleryPreview, t)} labels={lightboxLabels(t)} variant="preview" />
        </div>
      </div>
    </section>
  );
}
