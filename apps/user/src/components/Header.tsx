'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { LOCALES } from '@/lib/i18n';

export const NAV_ITEMS = [
  { href: '#about', key: 'about' },
  { href: '#products', key: 'products' },
  { href: '#gallery', key: 'gallery' },
  { href: '#partners', key: 'partners' },
  { href: '#contact', key: 'contact' },
] as const;

export function Brand({ logo, light = false }: { logo: string; light?: boolean }) {
  const { t } = useLanguage();
  return (
    <a href="#top" className="flex items-center gap-2">
      <Image src={logo} alt="Yangiyer Flour Trading" width={88} height={88} className="h-16 w-16 sm:h-20 sm:w-20" priority />
      <span className={`text-lg font-bold leading-tight sm:text-2xl ${light ? 'text-white' : 'text-navy'}`}>
        {t.brand.name}
        <br />
        <span className="ms-6 text-gold sm:ms-10">{t.brand.name2}</span>
      </span>
    </a>
  );
}

export function Header({ logo }: { logo: string }) {
  const { t, locale, setLocale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [langOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow">
      <div className="container flex items-center justify-between py-1">
        <Brand logo={logo} />

        <nav aria-label="Main" className="hidden items-center text-lg font-bold text-navy xl:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.key} href={item.href} className="mx-5 transition-colors hover:text-gold">
              {t.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div ref={langRef} className="relative hidden xl:block">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              className="flex items-center gap-2 rounded bg-[#F2F2F2] px-3 py-2.5 text-ink"
            >
              {t.nav.language}
              <span className="text-xs font-bold uppercase text-navy">{locale}</span>
            </button>
            {langOpen && (
              <ul role="listbox" className="absolute end-0 top-full mt-1 w-full overflow-hidden rounded bg-[#efe9e9] py-1 text-ink shadow">
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
                      className="w-full px-3 py-1 text-start hover:bg-ink hover:text-white"
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
                className={`block h-0.5 w-7 transition-all duration-300 ${menuOpen ? 'bg-white' : 'bg-navy'} ${
                  menuOpen && i === 0 ? 'translate-y-2 rotate-45' : ''
                } ${menuOpen && i === 1 ? 'opacity-0' : ''} ${menuOpen && i === 2 ? '-translate-y-2 -rotate-45' : ''}`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu — full-screen dark overlay like the master site */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col bg-black/95 pt-28 text-lg font-bold xl:hidden ${menuOpen ? '' : 'hidden'}`}
      >
        {NAV_ITEMS.map((item) => (
          <a key={item.key} href={item.href} onClick={() => setMenuOpen(false)} className="mb-8 ps-14 text-flame">
            {t.nav[item.key]}
          </a>
        ))}
        <div className="mt-4 flex gap-4 ps-14">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLocale(l.code);
                setMenuOpen(false);
              }}
              className={`rounded p-2 text-lg ${l.code === locale ? 'bg-gold text-navy' : 'bg-[#F2F2F2] text-ink'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
