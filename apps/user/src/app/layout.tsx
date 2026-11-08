import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yangiyer Flour Trading | Oliy Sifatli Bug\'doy Uni & Don Mahsulotlari',
  description: '1991-yildan buyon faoliyat yurituvchi Yangiyer Flour Trading — O‘zbekiston va Markaziy Osiyo bozoriga kleykovinaga boy, yuqori sifatli bug‘doy uni va kepak mahsulotlari yetkazib beruvchi yetakchi korxona.',
  keywords: ['Yangiyer flour trading', 'un ishlab chiqarish', 'bugdoy uni', 'oliy nav un', '1 nav un', 'sirdaryo tegirmon', 'flour uzbekistan', 'мука высший сорт'],
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: any;
}) {
  return (
    <html lang="uz" className={jakarta.variable}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
