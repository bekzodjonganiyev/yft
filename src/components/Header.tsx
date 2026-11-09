"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import logo from "@/assets/logo.png";
import type { Locale } from "@/i18n/config";
import { LanguageSelect } from "./LanguageSelect";

const NAV = [
  { hash: "#brands", key: "brands" },
  { hash: "#process", key: "process" },
  { hash: "#about", key: "about" },
  { hash: "#photos", key: "photos" },
  { hash: "#faq", key: "faq" },
] as const;
const SECTION_IDS = NAV.map((n) => n.hash.slice(1));

type Labels = {
  nav: Record<(typeof NAV)[number]["key"], string>;
  quote: string;
  menu: string;
  close: string;
  language: string;
  home: string;
  main: string;
};

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src={logo} alt="" width={36} height={36} className="h-9 w-9" />
      <span
        className={`font-display text-[0.9375rem] leading-[1.05] font-semibold tracking-[-0.015em] transition-colors duration-300 ${light ? "text-white" : "text-navy"}`}
        lang="en"
        dir="ltr"
        translate="no"
      >
        Yangiyer
        <br />
        Flour Trading
      </span>
    </span>
  );
}

const subscribeScroll = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const isScrolled = () => window.scrollY > 24;

/** Which section is being read: the one crossing a band around the middle of the screen. */
function useSectionInView(ids: readonly string[], enabled: boolean) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // The first visible one in page order wins.
        const next = ids.find((id) => visible.has(id)) ?? null;
        setCurrent((prev) => (prev === next ? prev : next));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, enabled]);
  return current;
}

/**
 * Fixed bar. Over the hero it is transparent with white type; once the page scrolls (or on any
 * other page, or while the menu is open) it becomes a frosted sheet of the page's own paper.
 */
export function Header({ locale, labels, phone }: { locale: Locale; labels: Labels; phone: { display: string; href: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const home = `/${locale}`;
  const isHome = pathname === home || pathname === `${home}/`;

  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);
  const overHero = isHome && !scrolled && !open;
  const reading = useSectionInView(SECTION_IDS, isHome);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      data-over={overHero ? "hero" : "page"}
      className={`fixed inset-x-0 top-0 z-40 h-[var(--nav-h)] border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        overHero ? "border-transparent bg-transparent" : "border-line bg-paper/85 backdrop-blur-xl backdrop-saturate-150"
      }`}
    >
      <div className="wrap flex h-full items-center justify-between gap-6">
        <Link href={home} aria-label={labels.home} className="shrink-0">
          <Wordmark light={overHero} />
        </Link>

        <nav aria-label={labels.main} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.9375rem] font-medium">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link
                  href={`${home}${item.hash}`}
                  data-rest={reading === item.hash.slice(1) ? "" : undefined}
                  aria-current={reading === item.hash.slice(1) ? "location" : undefined}
                  className={`ulink py-1 transition-colors duration-300 ${overHero ? "text-white/85 hover:text-white" : "text-ink/80 hover:text-ink"}`}
                >
                  {labels.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageSelect locale={locale} label={labels.language} className="hidden sm:block" tone={overHero ? "light" : "default"} />
          <Link href={`${home}#contact`} className="btn hidden min-h-11 px-5 text-[0.9375rem] md:inline-flex">
            {labels.quote}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-ctl border transition-colors duration-300 lg:hidden ${
              overHero ? "border-white/30 text-white" : "border-line text-navy"
            }`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" className="relative block h-3 w-[18px]">
              <span className={`absolute inset-x-0 top-0 h-[1.6px] rounded bg-current transition-transform duration-200 ease-[var(--ease-out)] ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute inset-x-0 bottom-0 h-[1.6px] rounded bg-current transition-transform duration-200 ease-[var(--ease-out)] ${open ? "-translate-y-[5.4px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Phone and tablet: a full-height sheet under the bar. */}
      <div
        id="mobile-menu"
        ref={sheetRef}
        hidden={!open}
        className="fixed inset-x-0 top-[var(--nav-h)] bottom-0 overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label={labels.main} className="wrap flex min-h-full flex-col py-6">
          <ul className="divide-y divide-line border-y border-line">
            {NAV.map((item) => (
              <li key={item.key}>
                <Link href={`${home}${item.hash}`} onClick={close} className="flex min-h-14 items-center font-display text-xl font-semibold tracking-[-0.015em] text-navy">
                  {labels.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 pt-10">
            <Link href={`${home}#contact`} onClick={close} className="btn w-full">
              {labels.quote}
            </Link>
            <a href={phone.href} className="btn btn-outline w-full text-navy tabular-nums" dir="ltr">
              {phone.display}
            </a>
            <LanguageSelect locale={locale} label={labels.language} className="sm:hidden" />
          </div>
        </nav>
      </div>
    </header>
  );
}
