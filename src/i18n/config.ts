// Shared by the proxy, server components and client components (no server-only imports here).

export const locales = ["uz", "ru", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

/** Cookie set when a visitor picks a language, so the proxy remembers it. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Native names, so each speaker can find their own language in the list.
export const languageNames: Record<Locale, string> = {
  uz: "O‘zbekcha",
  ru: "Русский",
  en: "English",
  ar: "العربية",
};

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

export const dirOf = (locale: Locale): "ltr" | "rtl" => (locale === "ar" ? "rtl" : "ltr");

/** hreflang alternates for a path that exists in every language ("" or "/photos"). */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
    "x-default": `/${defaultLocale}${path}`,
  };
}

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = { uz: "uz_UZ", ru: "ru_RU", en: "en_US", ar: "ar_AR" };

/** "Tez orada {{phone}} raqamiga…" → fills {{name}} placeholders. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(vars[key] ?? ""));
}
