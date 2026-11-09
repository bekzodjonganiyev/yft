import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";

import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { dirOf, isLocale, languageAlternates, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { contacts, primaryPhone, SITE_URL } from "@/lib/site";

const plex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false, // only Arabic pages need it; unicode-range keeps other pages from downloading it
});

// All four languages are prerendered; any other first segment is a 404.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export const dynamicParams = false;

export const viewport: Viewport = { themeColor: "#ffffff" };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s — Yangiyer Flour Trading" },
    description: t.meta.description,
    alternates: { canonical: `/${locale}`, languages: languageAlternates("") },
    openGraph: {
      type: "website",
      siteName: "Yangiyer Flour Trading",
      locale: ogLocale[locale],
      url: `/${locale}`,
      title: t.meta.title,
      description: t.meta.description,
      // Declared here because this openGraph object replaces the one inherited from app/opengraph-image.jpg.
      images: [{ url: "/opengraph-image.jpg", width: 1280, height: 717, alt: t.photos.alt["24"] }],
    },
    verification: { google: "google8fcbddc5d4c5f505.html" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${plex.variable} ${plexArabic.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-control bg-gold px-4 py-3 font-medium text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <Header
          locale={locale}
          phone={primaryPhone}
          labels={{
            nav: { brands: t.nav.brands, about: t.nav.about, process: t.nav.process, photos: t.nav.photos },
            quote: t.nav.quote,
            menu: t.nav.menu,
            close: t.nav.close,
            language: t.nav.language,
            home: t.nav.home,
            main: t.nav.main,
          }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer t={t} contacts={contacts} />

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DHM2LQ6MT9" strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-DHM2LQ6MT9");`}
        </Script>
      </body>
    </html>
  );
}
