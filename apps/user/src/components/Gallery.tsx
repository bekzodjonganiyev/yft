'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Photo } from '@/lib/api';
import { pickLocalized } from '@/lib/i18n';
import { SectionTitle } from './SectionTitle';

const ROW_HEIGHT = 240; // minimum row height before rows stretch to fill the width (master used a ~300px "rows" layout)

export function Gallery({ photos }: { photos: Photo[] }) {
  const { t, locale } = useLanguage();
  const [index, setIndex] = useState(-1);
  const count = photos.length;

  const close = useCallback(() => setIndex(-1), []);
  const step = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (index < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(locale === 'ar' ? 1 : -1);
      if (e.key === 'ArrowRight') step(locale === 'ar' ? -1 : 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, step, locale]);

  if (count === 0) return null;

  const titleOf = (p: Photo) => pickLocalized(p as unknown as Record<string, unknown>, 'title', locale) || 'Yangiyer Flour Trading';
  const current = index >= 0 ? photos[index] : null;

  return (
    <section id="gallery" className="my-14">
      <div className="container">
        <SectionTitle>{t.gallery.title}</SectionTitle>

        {/* Justified rows: every photo keeps its aspect ratio and rows fill the full width */}
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => {
            const ratio = p.width && p.height ? p.width / p.height : 1.5;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                className="group relative overflow-hidden bg-navy/10"
                style={{ flexGrow: ratio, flexBasis: `${ratio * ROW_HEIGHT}px` }}
                aria-label={titleOf(p)}
              >
                <span className="block" style={{ paddingBottom: `${100 / ratio}%` }} />
                <Image
                  src={assetUrl(p.photoUrl)}
                  alt={titleOf(p)}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            );
          })}
          <span aria-hidden="true" style={{ flexGrow: 999 }} />
        </div>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={titleOf(current)}
          onClick={close}
        >
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm tabular-nums text-white/70">
              {index + 1} / {count}
            </span>
            <button type="button" onClick={close} className="h-11 w-11 text-2xl" aria-label={t.gallery.close} autoFocus>
              ✕
            </button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={assetUrl(current.photoUrl)} alt={titleOf(current)} fill sizes="100vw" className="object-contain" />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute start-2 top-1/2 -translate-y-1/2 p-4 text-4xl text-white/80 hover:text-white rtl:rotate-180"
                  aria-label={t.gallery.prev}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute end-2 top-1/2 -translate-y-1/2 p-4 text-4xl text-white/80 hover:text-white rtl:rotate-180"
                  aria-label={t.gallery.next}
                >
                  ›
                </button>
              </>
            )}
          </div>
          <p className="p-4 text-center text-sm text-white/90">{titleOf(current)}</p>
        </div>
      )}
    </section>
  );
}
