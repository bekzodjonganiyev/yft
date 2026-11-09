'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Banner, type InfoItem } from '@/lib/api';
import { pickLocalized } from '@/lib/i18n';
import { HeroIcon } from './icons';

/** Banner slider + white "motto" card overlapping it (version_2_1_0 Hero.jsx). */
export function Hero({ banners, mottos }: { banners: Banner[]; mottos: InfoItem[] }) {
  const { locale } = useLanguage();
  const [index, setIndex] = useState(0);
  const count = banners.length;

  useEffect(() => {
    if (count <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => window.clearInterval(id);
  }, [count]);

  const current = banners[index];
  const caption = current ? pickLocalized(current, 'title', locale) : '';

  return (
    <section className="mb-24">
      <div className="relative h-[480px] w-full overflow-hidden bg-black md:h-[700px]">
        {banners.map((b, i) => (
          <Image
            key={b.id}
            src={assetUrl(b.imageUrl)}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${i === index ? 'opacity-50' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-20 z-10 px-4 md:bottom-auto md:top-1/3">
          <h1 className="text-center text-5xl font-bold text-white drop-shadow max-md:hidden">
            YANGIYER FLOUR <span className="text-primary">TRADING</span>
          </h1>
          <h1 className="text-center text-3xl font-bold text-white md:hidden">
            YANGIYER FLOUR <span className="text-primary">TRADING</span>
          </h1>
          {caption && <p className="mt-6 text-center text-xl text-white md:mt-10">{caption}</p>}
        </div>
        {count > 1 && (
          <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2 md:bottom-40">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1} / ${count}`}
                aria-current={i === index}
                className={`h-2.5 w-2.5 rounded-full bg-white transition-opacity ${i === index ? 'opacity-100' : 'opacity-40'}`}
              />
            ))}
          </div>
        )}
      </div>

      {mottos.length > 0 && (
        <div className="container relative mx-auto flex justify-between gap-10 bg-white px-4 max-md:mt-10 max-md:flex-col md:-mt-32 md:w-[90%] md:rounded-3xl md:px-20 md:py-10 md:shadow-2xl">
          {mottos.slice(0, 3).map((m) => (
            <div
              key={m.id}
              className="max-md:rounded-3xl max-md:bg-slate-50 max-md:px-4 max-md:py-10 max-md:shadow-md md:w-[30%]"
            >
              <HeroIcon />
              <h2 className="my-4 text-2xl font-bold text-secondary">{pickLocalized(m, 'title', locale)}</h2>
              <p className="text-xl text-secondary">{pickLocalized(m, 'body', locale)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
