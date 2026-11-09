'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALES } from '@/lib/i18n';
import { telHref } from '@/lib/api';
import { LangIcon, PhoneIcon } from './icons';

const NAV = [
  { hash: 'aboutus', key: 'about' },
  { hash: 'products', key: 'products' },
  { hash: 'partners', key: 'partners' },
  { hash: 'contactus', key: 'contact' },
] as const;

export function Brand({ logo, size = 56, textClass = '' }: { logo: string; size?: number; textClass?: string }) {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image src={logo} alt="Yangiyer Flour Trading" width={size} height={size} priority />
      <span className={`text-center font-bold leading-tight text-white ${textClass}`}>
        YANGIYER FLOUR
        <br />
        <span className="text-primary">TRADING</span>
      </span>
    </Link>
  );
}

export function Navbar({ logo, phone }: { logo: string; phone: string }) {
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => !langRef.current?.contains(e.target as Node) && setLangOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [langOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // On the home page the bar floats (blurred) over the hero; elsewhere and after scrolling it is solid.
  const solid = !isHome || scrolled;
  const href = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);

  return (
    <header
      className={`fixed top-0 z-40 w-full text-white transition-colors duration-300 max-md:bg-secondary ${
        solid ? 'bg-secondary shadow-md' : 'md:bg-black/10 md:backdrop-blur-xl'
      }`}
    >
      <div className="container mx-auto flex w-[90%] items-center justify-between py-3">
        <Brand logo={logo} />

        <nav aria-label="Main" className="hidden items-center gap-10 xl:flex">
          {NAV.map((item) => (
            <a key={item.key} href={href(item.hash)} className="text-xl font-bold transition-colors hover:text-primary">
              {t.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={telHref(phone)} className="flex items-center gap-2 max-[779px]:hidden" dir="ltr">
            <PhoneIcon />
            <span>{phone}</span>
          </a>
          <div ref={langRef} className="relative ms-6 hidden xl:block">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t.nav.language}
              className="flex items-center gap-2 rounded bg-[#F2F2F2] p-2.5 text-black"
            >
              <LangIcon />
              <span className="text-sm font-bold uppercase">{locale}</span>
            </button>
            {langOpen && (
              <ul role="listbox" className="absolute end-0 top-full mt-1 w-full overflow-hidden rounded bg-[#F2F2F2] pb-1 text-black shadow">
                {LOCALES.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={l.code === locale}
                      onClick={() => {
                        setLocale(l.code);
                        setLangOpen(false);
                      }}
                      className="w-full px-2.5 py-1 text-start hover:bg-black hover:text-white"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="relative z-50 flex h-12 w-12 flex-col items-center justify-center gap-1.5 xl:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 w-7 bg-white transition-all duration-300 ${
                  menuOpen && i === 0 ? 'translate-y-2 rotate-45' : ''
                } ${menuOpen && i === 1 ? 'opacity-0' : ''} ${menuOpen && i === 2 ? '-translate-y-2 -rotate-45' : ''}`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu: full-screen dark overlay (version_2_1_0 Navbar.jsx) */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-black/95 pt-8 xl:hidden ${menuOpen ? '' : 'hidden'}`}
      >
        <div className="mb-10 ps-14" onClick={() => setMenuOpen(false)}>
          <Brand logo={logo} size={60} textClass="text-sm" />
        </div>
        {NAV.map((item) => (
          <a
            key={item.key}
            href={href(item.hash)}
            onClick={() => setMenuOpen(false)}
            className="mb-4 ps-14 text-xl font-bold text-flame"
          >
            {t.nav[item.key]}
          </a>
        ))}
        <a href={telHref(phone)} className="mt-4 flex items-center gap-2 ps-14" dir="ltr">
          <PhoneIcon /> {phone}
        </a>
        <div className="mt-8 flex gap-4 ps-14">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code);
                setMenuOpen(false);
              }}
              className={`rounded p-2 ${l.code === locale ? 'bg-primary text-white' : 'bg-[#F2F2F2] text-black'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
