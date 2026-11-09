'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { InfoItem } from '@/lib/api';
import { pickLocalized } from '@/lib/i18n';
import { Paragraphs } from './Paragraphs';

/** Accordion styled like the flowbite-react Accordion used in version_2_1_0. */
export function Faq({ items }: { items: InfoItem[] }) {
  const { t, locale } = useLanguage();
  if (items.length === 0) return null;
  return (
    <section className="container mx-auto mb-20 w-[90%]">
      <h2 className="mb-10 text-center text-4xl font-bold text-secondary">{t.sections.faq}</h2>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200">
        {items.map((item, i) => (
          <details key={item.id} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-white p-5 text-start font-medium text-gray-500 hover:bg-gray-100 group-open:bg-gray-100 group-open:text-gray-900 [&::-webkit-details-marker]:hidden">
              <span>{pickLocalized(item, 'title', locale)}</span>
              <svg
                className="h-6 w-6 shrink-0 transition-transform group-open:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </summary>
            <div className="p-5 text-gray-500">
              <Paragraphs text={pickLocalized(item, 'body', locale)} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
