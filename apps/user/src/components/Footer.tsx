'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Send, Shield, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slateIron-950 text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white/10 p-1 border border-wheat-500/40">
                <Image
                  src="/images/logo.png"
                  alt="Yangiyer Flour Trading"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-tight text-lg leading-tight">
                  YANGIYER FLOUR
                </span>
                <span className="text-wheat-400 font-semibold text-xs tracking-widest uppercase">
                  TRADING
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-wheat-500 hover:text-slateIron-950 flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-wheat-500 hover:text-slateIron-950 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-wheat-500 hover:text-slateIron-950 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/10 hover:bg-wheat-500 hover:text-slateIron-950 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <polygon points="10 15 15 12 10 9 10 15" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-wheat-400 font-bold text-xs uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="#about" className="hover:text-wheat-400 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-wheat-400 transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href="#calculator" className="hover:text-wheat-400 transition-colors">
                  {t.nav.calculator}
                </Link>
              </li>
              <li>
                <Link href="#gallery" className="hover:text-wheat-400 transition-colors">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link href="#partners" className="hover:text-wheat-400 transition-colors">
                  {t.nav.partners}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-wheat-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-wheat-400 font-bold text-xs uppercase tracking-wider">
              {t.footer.contacts}
            </h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>Sirdaryo viloyati, Yangiyer shahri, Sanoat rayoni</p>
              <p className="font-mono text-white/90">+998 71 875 64 56</p>
              <p className="font-mono text-white/90">+998 90 123 45 67</p>
              <p>Yangiyerflour@gmail.com</p>
            </div>
          </div>

          {/* Admin Portal Direct Link */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-wheat-400 font-bold text-xs uppercase tracking-wider">
              Boshqaruv
            </h4>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-wheat-500 hover:text-slateIron-950 text-white text-xs font-semibold transition-all border border-white/15"
            >
              <Shield className="h-3.5 w-3.5 text-wheat-400" />
              <span>Admin Portal</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} Yangiyer Flour Trading. {t.footer.rights}</p>
          <p>Sifat va ishonch kafolatlangan milliy brend.</p>
        </div>
      </div>
    </footer>
  );
};
