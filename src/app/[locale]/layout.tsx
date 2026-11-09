import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";

import "../globals.css";
import { Dock, THEME_SCRIPT } from "@/components/Dock";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/Toaster";
import { dirOf, isLocale, languageAlternates, locales, ogLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { primaryPhone, SITE_URL } from "@/lib/site";

// One family for the whole site: IBM Plex Sans. Headings use 600/700, text 400/500.
const plex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

// Arabic glyphs fall through to IBM Plex Sans Arabic — same family, same weights, no mixing.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

// All four languages are prerendered; any other first segment is a 404.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#071f2c" },
  ],
};

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
    // data-theme is set by the inline script before paint, so React is told not to compare it.
    <html lang={locale} dir={dirOf(locale)} className={`${plex.variable} ${plexArabic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[60] rounded-ctl bg-gold px-4 py-3 font-medium text-navy-950 focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <Header
          locale={locale}
          phone={primaryPhone}
          labels={{
            nav: { brands: t.nav.brands, about: t.nav.about, process: t.nav.process, photos: t.nav.photos, faq: t.nav.faq },
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
        <Footer t={t} locale={locale} />
        <Dock labels={{ top: t.nav.top, dark: t.ui.themeDark, light: t.ui.themeLight }} />
        <Toaster />

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DHM2LQ6MT9" strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-DHM2LQ6MT9");`}
        </Script>
      </body>
    </html>
  );
}
