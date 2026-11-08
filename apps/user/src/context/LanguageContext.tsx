'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, translations, Translations } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: Translations;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'uz',
  setLocale: () => {},
  t: translations.uz,
  dir: 'ltr',
});

export const LanguageProvider = ({ children }: { children: any }) => {
  const [locale, setLocaleState] = useState<Locale>('uz');

  useEffect(() => {
    const saved = localStorage.getItem('yft_locale') as Locale;
    if (saved && ['uz', 'ru', 'en', 'ar'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('yft_locale', newLocale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = translations[locale] || translations.uz;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
