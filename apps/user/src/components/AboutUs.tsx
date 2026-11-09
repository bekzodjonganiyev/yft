'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export function AboutUs({ background, videoUrl }: { background: string; videoUrl: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section id="about" className="my-24">
      <div className="container">
        <h2 className="my-4 text-center text-3xl font-bold text-navy sm:text-4xl">
          {t.brand.name} <span className="text-gold">{t.brand.name2}</span>
        </h2>
        <p className="mx-auto mb-8 max-w-5xl text-lg leading-relaxed text-navy sm:text-xl">{t.about.text}</p>

        <div
          className="flex h-[300px] items-center justify-center rounded-[10px] bg-cover bg-center bg-no-repeat sm:h-[400px]"
          style={{ backgroundImage: `url("${background}")` }}
        >
          <button type="button" onClick={() => setOpen(true)} aria-label={t.about.watch} className="play-btn" />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.about.watch}
        >
          <div className="relative w-full max-w-4xl bg-black" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-14 end-0 h-12 w-12 rounded-full bg-red-600 text-xl font-bold text-white sm:-end-14 sm:top-0"
              aria-label={t.about.close}
              autoFocus
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title="Yangiyer Flour Trading"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
