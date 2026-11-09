import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { assetUrl, DEFAULTS, getSettings } from '@/lib/api';

const plex = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-plex',
  display: 'swap',
});
// Persian (fa) text
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yangiyerflourtrading.uz'),
  title: { default: 'Yangiyer Flour Trading', template: '%s | Yangiyer Flour Trading' },
  description:
    '“Yangiyer Flour Trading” MChJ mustaqil, oilaviy kompaniya hisoblanadi. 1991 yildan beri faoliyat yuritadi. Markaziy Osiyoning markazida joylashgan, Jahon oziq-ovqat dasturi (WFP) hamkori. Ulgurji va ishlab chiqarish bozori sohasida 30 yildan ortiq tajribaga ega.',
  keywords: ['un zavodi', 'export', 'yangiyer', 'flour company', 'flour trading', 'yangiyer shahri'],
  icons: { icon: '/images/logo.png' },
  openGraph: { url: 'https://yangiyerflourtrading.uz/', siteName: 'Yangiyer Flour Trading' },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const logo = assetUrl(settings['asset.logo'], DEFAULTS.logo);

  return (
    <html lang="uz" dir="ltr" className={`${plex.variable} ${plexArabic.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <LanguageProvider>
          <Navbar logo={logo} phone={settings.phone || DEFAULTS.phone} />
          <main className="flex-auto">{children}</main>
          <Footer settings={settings} logo={logo} />
        </LanguageProvider>
      </body>
    </html>
  );
}
