'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Reveal } from './Reveal';

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
    <section id="aboutus" className="container mx-auto mb-20 flex w-[90%] justify-between gap-10 max-md:flex-col">
      <Reveal className="w-1/2 max-md:w-full">
        <h2 className="mb-10 text-4xl font-bold text-secondary max-md:mb-4 max-md:text-xl">{t.about.title}</h2>
        <p className="text-2xl text-secondary max-md:text-lg">{t.about.text}</p>
      </Reveal>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.about.watch}
        className="relative flex min-h-96 w-1/2 items-center justify-center overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat max-md:h-96 max-md:w-full"
        style={{ backgroundImage: `url("${background}")` }}
      >
        <span className="play-btn" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.about.watch}
        >
          <div className="relative w-2/3 bg-black max-md:w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute end-2 top-2 z-10 h-12 w-12 rounded-full bg-red-600 text-xl font-bold text-white"
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
