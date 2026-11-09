"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "@/assets/logo.png";
import type { Locale } from "@/i18n/config";
import { LanguageSelect } from "./LanguageSelect";

const NAV = [
  { hash: "#brands", key: "brands" },
  { hash: "#about", key: "about" },
  { hash: "#process", key: "process" },
  { hash: "#photos", key: "photos" },
] as const;

type Labels = {
  nav: Record<(typeof NAV)[number]["key"], string>;
  quote: string;
  menu: string;
  close: string;
  language: string;
  home: string;
  main: string;
};

export function Header({
  locale,
  labels,
  phone,
}: {
  locale: Locale;
  labels: Labels;
  phone: { display: string; href: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const home = `/${locale}`;

  // Close the mobile menu after navigating to another page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-flour/95 backdrop-blur supports-[backdrop-filter]:bg-flour/85">
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Link href={home} className="flex items-center gap-3" aria-label={labels.home}>
          <Image src={logo} alt="" width={40} height={40} className="h-10 w-10" />
          <span className="text-lg leading-tight font-semibold tracking-tight text-silo" lang="en" dir="ltr" translate="no">
            Yangiyer Flour Trading
          </span>
        </Link>

        <nav aria-label={labels.main} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.9375rem] font-medium">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link href={`${home}${item.hash}`} className="py-2 text-ink hover:text-silo hover:underline hover:underline-offset-8">
                  {labels.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelect locale={locale} label={labels.language} className="hidden sm:block" />
          <Link href={`${home}#contact`} className="btn btn-primary hidden min-h-[2.75rem] px-5 md:inline-flex">
            {labels.quote}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-control text-silo lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={panelRef} hidden={!open} className="border-t border-steel bg-flour lg:hidden">
        <nav aria-label={labels.main} className="wrap py-4">
          <ul className="divide-y divide-steel text-lg font-medium">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link href={`${home}${item.hash}`} onClick={close} className="block py-3.5 text-ink">
                  {labels.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3 pb-2 sm:grid-cols-2">
            <Link href={`${home}#contact`} onClick={close} className="btn btn-primary">
              {labels.quote}
            </Link>
            <a href={phone.href} className="btn border border-steel-600 whitespace-nowrap text-silo tabular-nums" dir="ltr">
              {phone.display}
            </a>
          </div>
          <LanguageSelect locale={locale} label={labels.language} className="mt-2 sm:hidden" />
        </nav>
      </div>
    </header>
  );
}
