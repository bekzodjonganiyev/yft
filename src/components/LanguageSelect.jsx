import { useId } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

/** Native <select>: keyboard, screen reader and mobile pickers work out of the box. */
export function LanguageSelect({ className = "" }) {
  const { t, i18n } = useTranslation();
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {t("nav.language")}
      </label>
      <select
        id={id}
        value={i18n.resolvedLanguage}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="h-11 cursor-pointer rounded-control border border-steel-600 bg-flour pe-8 ps-3 text-sm font-medium text-ink"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
