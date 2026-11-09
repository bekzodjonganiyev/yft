import type { MetadataRoute } from "next";

import { languageAlternates, locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

const absolute = (map: Record<string, string>) =>
  Object.fromEntries(Object.entries(map).map(([lang, path]) => [lang, `${SITE_URL}${path}`]));

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/photos"].flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
      alternates: { languages: absolute(languageAlternates(path)) },
    }))
  );
}
