'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowIcon } from './icons';

/** "Title …… [All →]" row used above gallery, news and vacancies (version_2_1_0 Home.jsx). */
export function SectionHeader({ title, href }: { title: string; href?: string }) {
  const { t } = useLanguage();
  return (
    <div className="mb-8 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-secondary md:text-4xl">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-white transition-colors hover:bg-primary-dark max-md:hidden"
        >
          {t.sections.all}
          <ArrowIcon className="rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}

/** Full-width "All →" button shown under the section on mobile. */
export function MobileAllButton({ href }: { href: string }) {
  const { t } = useLanguage();
  return (
    <Link
      href={href}
      className="mt-7 hidden items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-white md:hidden max-md:flex"
    >
      {t.sections.all}
      <ArrowIcon className="rtl:rotate-180" />
    </Link>
  );
}
