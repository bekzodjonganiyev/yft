import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { gridPhotos, lightboxLabels } from "@/lib/photos";
import { allPhotoNumbers, galleryPreview } from "@/lib/site";
import { ArrowIcon } from "./Hero";
import { PhotoGrid } from "./PhotoGrid";

export function GalleryPreview({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="photos" aria-labelledby="photos-title" className="section-y bg-paper">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="photos-title" className="text-h2">
            {t.gallery.title}
          </h2>
          <Link href={`/${locale}/photos`} className="btn btn-outline text-navy">
            {t.gallery.all} ({allPhotoNumbers.length})
            <ArrowIcon />
          </Link>
        </div>
        <div className="mt-12">
          <PhotoGrid photos={gridPhotos(galleryPreview, t)} labels={lightboxLabels(t)} layout="mosaic" />
        </div>
      </div>
    </section>
  );
}
