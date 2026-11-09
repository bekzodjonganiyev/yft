"use client";

import { useId } from "react";
import { usePathname, useRouter } from "next/navigation";

import { languageNames, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";

/** Native <select>: keyboard, screen reader and mobile pickers work out of the box. */
export function LanguageSelect({ locale, label, className = "" }: { locale: Locale; label: string; className?: string }) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();

  const change = (next: Locale) => {
    // Remember the choice for the proxy (one year), then open the same page in that language.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}${window.location.hash}`);
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={locale}
        onChange={(e) => change(e.target.value as Locale)}
        className="h-11 cursor-pointer rounded-control border border-steel-600 bg-flour ps-3 pe-8 text-sm font-medium text-ink"
      >
        {locales.map((code) => (
          <option key={code} value={code} lang={code}>
            {languageNames[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
