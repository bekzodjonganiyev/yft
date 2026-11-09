"use client";

import { usePathname, useRouter } from "next/navigation";

import { languageNames, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { Select } from "./Select";

const Globe = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="sel-icon transition-colors duration-300">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1.9 8h12.2M8 1.75c1.7 1.8 2.5 3.9 2.5 6.25S9.7 12.45 8 14.25C6.3 12.45 5.5 10.35 5.5 8S6.3 3.55 8 1.75z" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

/** Header language switch: the same page in another language, remembered for next time. */
export function LanguageSelect({ locale, label, className, tone }: { locale: Locale; label: string; className?: string; tone?: "default" | "light" }) {
  const router = useRouter();
  const pathname = usePathname();

  const change = (next: string) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}${window.location.hash}`);
  };

  return (
    <Select
      variant="compact"
      tone={tone}
      ariaLabel={label}
      icon={<Globe />}
      value={locale}
      onChange={change}
      options={locales.map((code) => ({ value: code, label: languageNames[code], lang: code }))}
      className={className}
    />
  );
}
