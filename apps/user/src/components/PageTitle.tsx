'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Dictionary } from '@/lib/i18n';

/** Inner-page heading; offsets the fixed navbar. */
export function PageTitle({ section }: { section: keyof Dictionary['sections'] }) {
  const { t } = useLanguage();
  return <h1 className="container mx-auto mt-10 w-[90%] pt-24 text-3xl font-bold text-secondary">{t.sections[section]}</h1>;
}
