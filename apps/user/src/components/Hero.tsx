'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Award, ShieldCheck, Factory } from 'lucide-react';

export const Hero = () => {
  const { t, dir } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Video with Dark Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/bugdoy.jpg"
          className="w-full h-full object-cover scale-105 filter brightness-75"
        >
          <source src="/video/videoBg.mp4" type="video/mp4" />
        </video>
        {/* Multilayer gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slateIron-950 via-slateIron-950/70 to-slateIron-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wheat-500/10 via-transparent to-slateIron-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-wheat-400/30 text-wheat-300 text-xs sm:text-sm font-medium mb-6 animate-fade-in shadow-inner">
          <Award className="h-4 w-4 text-wheat-400" />
          <span>{t.hero.badge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mb-6">
          <span className="block text-wheat-400 font-serif italic mb-2 sm:mb-3">
            {t.hero.titleLine1}
          </span>
          <span className="block text-white drop-shadow-sm">
            {t.hero.titleLine2}
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-white/80 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {t.hero.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link
            href="#products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-wheat-500 hover:bg-wheat-600 text-slateIron-950 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-wheat-500/25 hover:-translate-y-0.5"
          >
            <span>{t.hero.ctaCatalog}</span>
            <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </Link>
          <Link
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-xl text-sm border border-white/20 backdrop-blur-md transition-all hover:-translate-y-0.5"
          >
            <span>{t.hero.ctaQuote}</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center hover:border-wheat-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-wheat-400 font-mono mb-1">
              {t.hero.statsYears}
            </div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">
              {t.hero.statsYearsDesc}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center hover:border-wheat-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-wheat-400 font-mono mb-1">
              {t.hero.statsCapacity}
            </div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">
              {t.hero.statsCapacityDesc}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center hover:border-wheat-500/40 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-wheat-400 font-mono mb-1">
              {t.hero.statsGrain}
            </div>
            <div className="text-xs sm:text-sm text-white/70 font-medium">
              {t.hero.statsGrainDesc}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
