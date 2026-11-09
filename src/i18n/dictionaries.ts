import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

import { isLocale, type Locale } from "./config";
import type uz from "./locales/uz.json";

export type Dictionary = typeof uz;

// Loaded on the server only; translations never ship in the client bundle.
const loaders: Record<Locale, () => Promise<Dictionary>> = {
  uz: () => import("./locales/uz.json").then((m) => m.default),
  ru: () => import("./locales/ru.json").then((m) => m.default),
  en: () => import("./locales/en.json").then((m) => m.default),
  ar: () => import("./locales/ar.json").then((m) => m.default),
};

/** Current locale from the `[locale]` root segment; 404 for anything unsupported. */
export async function getLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!isLocale(value)) notFound();
  return value;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return loaders[locale ?? (await getLocale())]();
}
