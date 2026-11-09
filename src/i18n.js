import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

// Native names, so each speaker can find their own language in the list.
export const LANGUAGES = [
  { code: "uz", name: "O‘zbekcha" },
  { code: "ru", name: "Русский" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية", dir: "rtl" },
];

const dirOf = (lng) => LANGUAGES.find((l) => l.code === lng)?.dir ?? "ltr";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { uz: { translation: uz }, ru: { translation: ru }, en: { translation: en }, ar: { translation: ar } },
    supportedLngs: LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    fallbackLng: "uz",
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "yft_lang",
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// Keep <html lang/dir> in sync so screen readers, fonts and RTL layout follow the language.
const syncDocument = (lng) => {
  const code = lng?.split("-")[0] || "uz";
  document.documentElement.lang = code;
  document.documentElement.dir = dirOf(code);
};
syncDocument(i18n.resolvedLanguage);
i18n.on("languageChanged", syncDocument);

export default i18n;
