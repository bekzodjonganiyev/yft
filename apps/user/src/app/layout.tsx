import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'Yangiyer Flour Trading',
  description:
    "Yangiyer Flour Trading — 1991-yildan buyon faoliyat yurituvchi oilaviy korxona. Oliy, birinchi va ikkinchi navli bug'doy uni ishlab chiqarish va ulgurji savdo.",
  icons: { icon: '/images/logo.png' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" dir="ltr">
      <body className="flex min-h-screen flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
