import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { galleryAll, galleryPreview } from "../data/media";
import { PhotoGrid } from "./PhotoGrid";

export function GalleryPreview() {
  const { t } = useTranslation();
  return (
    <section id="photos" aria-labelledby="photos-title" className="py-20 md:py-28">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="photos-title" className="text-2xl md:text-3xl">
            {t("gallery.title")}
          </h2>
          <Link to="/photos" className="link font-medium text-silo">
            {t("gallery.all")} ({galleryAll.length})
          </Link>
        </div>
        <div className="mt-10">
          <PhotoGrid photos={galleryPreview} variant="preview" />
        </div>
      </div>
    </section>
  );
}
