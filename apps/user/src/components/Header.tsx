'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Locale } from '@/lib/translations';
import { Menu, X, Globe, PhoneCall, ChevronDown, Sparkles } from 'lucide-react';

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
];

export const Header = () => {
  const { locale, setLocale, t, dir } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slateIron-950/90 backdrop-blur-md shadow-lg py-3 border-b border-white/10'
          : 'bg-gradient-to-b from-slateIron-950/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-white/10 p-1 border border-wheat-500/40 group-hover:border-wheat-400 transition-colors">
              <Image
                src="/images/logo.png"
                alt="Yangiyer Flour Trading"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight text-lg sm:text-xl leading-tight">
                YANGIYER FLOUR
              </span>
              <span className="text-wheat-400 font-semibold text-xs sm:text-sm tracking-widest uppercase">
                TRADING
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              href="#about"
              className="text-white/80 hover:text-wheat-400 text-sm font-medium transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              href="#products"
              className="text-white/80 hover:text-wheat-400 text-sm font-medium transition-colors"
            >
              {t.nav.products}
            </Link>
            <Link
              href="#calculator"
              className="text-white/80 hover:text-wheat-400 text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-wheat-400" />
              {t.nav.calculator}
            </Link>
            <Link
              href="#gallery"
              className="text-white/80 hover:text-wheat-400 text-sm font-medium transition-colors"
            >
              {t.nav.gallery}
            </Link>
            <Link
              href="#partners"
              className="text-white/80 hover:text-wheat-400 text-sm font-medium transition-colors"
            >
              {t.nav.partners}
            </Link>
            <Link
              href="#contact"
              className="text-white/80 hover:text-wheat-400 text-sm font-medium transition-colors"
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* Actions: Lang Switcher & CTAs */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/15 transition-all"
                aria-label="Change Language"
              >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-white/70" />
              </button>

              {langDropdownOpen && (
                <div
                  className={`absolute mt-2 w-36 rounded-xl bg-slateIron-900 border border-white/10 shadow-2xl py-1 z-50 text-white ${
                    dir === 'rtl' ? 'left-0' : 'right-0'
                  }`}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLocale(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/10 transition-colors ${
                        locale === l.code ? 'text-wheat-400 font-bold bg-white/5' : 'text-white/80'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quote Button */}
            <Link
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 bg-wheat-500 hover:bg-wheat-600 text-slateIron-950 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all shadow-md hover:shadow-wheat-500/30"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              {t.nav.quoteBtn}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-6 border-t border-white/10 bg-slateIron-950/95 rounded-2xl px-5 space-y-3 shadow-2xl">
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white/90 hover:text-wheat-400 font-medium"
            >
              {t.nav.about}
            </Link>
            <Link
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white/90 hover:text-wheat-400 font-medium"
            >
              {t.nav.products}
            </Link>
            <Link
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white/90 hover:text-wheat-400 font-medium"
            >
              {t.nav.calculator}
            </Link>
            <Link
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white/90 hover:text-wheat-400 font-medium"
            >
              {t.nav.gallery}
            </Link>
            <Link
              href="#partners"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white/90 hover:text-wheat-400 font-medium"
            >
              {t.nav.partners}
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-white/90 hover:text-wheat-400 font-medium"
            >
              {t.nav.contact}
            </Link>
            <div className="pt-2">
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block bg-wheat-500 hover:bg-wheat-600 text-slateIron-950 font-bold py-2.5 rounded-xl uppercase text-xs tracking-wider"
              >
                {t.nav.quoteBtn}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
