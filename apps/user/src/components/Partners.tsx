'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Handshake } from 'lucide-react';

export const Partners = () => {
  const { t } = useLanguage();

  const partners = [
    { name: 'O\'zdonmahsulot AK', logo: 'https://backend.tkti.uz/uploads/file-1680953905268.jpg' },
    { name: 'Agro Industrial Holding', logo: 'https://backend.tkti.uz/uploads/file-1680953888366.jpg' },
    { name: 'Central Asia Grain Export', logo: 'https://backend.tkti.uz/uploads/file-1680953777534.jpg' },
    { name: 'Bukhara Bakery Group', logo: 'https://backend.tkti.uz/uploads/file-1680953754646.jpg' },
    { name: 'Tashkent Mill Logistics', logo: 'https://backend.tkti.uz/uploads/file-1680953713364.jpg' },
    { name: 'Samarkand Agro Grain', logo: 'https://backend.tkti.uz/uploads/file-1680953240671.jpg' },
  ];

  const duplicated = [...partners, ...partners];

  return (
    <section id="partners" className="py-20 bg-white border-t border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wheat-100 text-wheat-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Handshake className="h-4 w-4 text-wheat-600" />
          <span>{t.partners.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slateIron-950 tracking-tight">
          {t.partners.title}
        </h2>
        <p className="mt-2 text-base text-slate-600">
          {t.partners.subtitle}
        </p>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-10 py-4">
          {duplicated.map((p, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-20 w-48 sm:w-56 px-6 py-3 rounded-2xl bg-milledCream-50 border border-slate-200/80 shrink-0 hover:border-wheat-400 transition-colors shadow-sm"
            >
              <div className="relative h-12 w-full">
                <Image
                  src={p.logo}
                  alt={p.name}
                  fill
                  className="object-contain filter grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
