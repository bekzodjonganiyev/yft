import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container py-24 md:py-32">
      <h1 className="text-3xl">{t("notFound.title")}</h1>
      <p className="mt-4 max-w-prose text-lg">{t("notFound.text")}</p>
      <Link to="/" className="btn-primary mt-8">
        {t("notFound.home")}
      </Link>
    </div>
  );
}
