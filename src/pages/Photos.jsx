import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { galleryAll } from "../data/media";
import { PhotoGrid } from "../components/PhotoGrid";

export function Photos() {
  const { t } = useTranslation();
  return (
    <div className="container py-14 md:py-20">
      <Link to="/" className="link text-silo">
        {t("photos.back")}
      </Link>
      <h1 className="mt-6 text-3xl">{t("photos.title")}</h1>
      <p className="mt-3 max-w-prose text-lg">{t("photos.lead", { count: galleryAll.length })}</p>
      <div className="mt-10">
        <PhotoGrid photos={galleryAll} />
      </div>
    </div>
  );
}
