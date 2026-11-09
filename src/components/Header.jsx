import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo from "../data/logo";
import { primaryPhone } from "../data/contacts";
import { LanguageSelect } from "./LanguageSelect";

export const NAV = [
  { hash: "#brands", key: "brands" },
  { hash: "#about", key: "about" },
  { hash: "#process", key: "process" },
  { hash: "#photos", key: "photos" },
];

export function Brand() {
  const { t } = useTranslation();
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={t("nav.home")}>
      <img src={logo} alt="" width="40" height="40" className="h-10 w-10" />
      <span className="text-lg font-semibold leading-tight tracking-tight text-silo" lang="en" dir="ltr" translate="no">
        Yangiyer Flour Trading
      </span>
    </Link>
  );
}

export function Header() {
  const { t } = useTranslation();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("a")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-flour/95 backdrop-blur supports-[backdrop-filter]:bg-flour/85">
      <div className="container flex h-[4.5rem] items-center justify-between gap-6">
        <Brand />

        <nav aria-label={t("nav.main")} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9375rem] font-medium">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link to={{ pathname: "/", hash: item.hash }} className="py-2 text-ink hover:text-silo hover:underline hover:underline-offset-8">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelect className="hidden sm:block" />
          <Link to={{ pathname: "/", hash: "#contact" }} className="btn-primary hidden min-h-[2.75rem] px-5 md:inline-flex">
            {t("nav.quote")}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-control text-silo lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-steel bg-flour lg:hidden"
      >
        <nav aria-label={t("nav.main")} className="container py-4">
          <ul className="divide-y divide-steel text-lg font-medium">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link to={{ pathname: "/", hash: item.hash }} className="block py-3.5 text-ink">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3 pb-2 sm:grid-cols-2">
            <Link to={{ pathname: "/", hash: "#contact" }} className="btn-primary">
              {t("nav.quote")}
            </Link>
            <a href={primaryPhone.href} className="btn whitespace-nowrap border border-steel-600 tabular-nums text-silo" dir="ltr">
              {primaryPhone.display}
            </a>
          </div>
          <LanguageSelect className="mt-2 sm:hidden" />
        </nav>
      </div>
    </header>
  );
}
