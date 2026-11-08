'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Play, X, CheckCircle, History, Factory, ShieldCheck, TrendingUp } from 'lucide-react';

export const AboutUs = () => {
  const { t } = useLanguage();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const milestones = [
    { year: t.about.milestone1Year, title: t.about.milestone1Title, desc: t.about.milestone1Desc, icon: History },
    { year: t.about.milestone2Year, title: t.about.milestone2Title, desc: t.about.milestone2Desc, icon: Factory },
    { year: t.about.milestone3Year, title: t.about.milestone3Title, desc: t.about.milestone3Desc, icon: ShieldCheck },
    { year: t.about.milestone4Year, title: t.about.milestone4Title, desc: t.about.milestone4Desc, icon: TrendingUp },
  ];

  return (
    <section id="about" className="py-24 bg-milledCream-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wheat-100 text-wheat-800 text-xs font-semibold uppercase tracking-wider mb-3">
            {t.about.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slateIron-950 tracking-tight leading-tight mb-4">
            {t.about.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            {t.about.subtitle}
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
            <p className="border-l-4 border-wheat-500 pl-4 italic text-slate-800 font-medium">
              {t.about.story}
            </p>
            <p>{t.about.story2}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <CheckCircle className="h-5 w-5 text-wheat-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Shveytsariya texnologiyasi</h4>
                  <p className="text-xs text-slate-500 mt-1">Avtomatlashtirilgan ko'p bosqichli maydalash liniyalari.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <CheckCircle className="h-5 w-5 text-wheat-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Akkreditatsiyalangan Lab</h4>
                  <p className="text-xs text-slate-500 mt-1">Har bir partiya don va un kleykovina tekshiruvidan o'tadi.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Banner Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group">
              <Image
                src="/images/bugdoy.jpg"
                alt="Yangiyer Tegirmon"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-slateIron-950/40 group-hover:bg-slateIron-950/30 transition-colors" />

              {/* Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="h-20 w-20 rounded-full bg-wheat-500 hover:bg-wheat-600 text-slateIron-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer group-hover:shadow-wheat-500/50"
                  aria-label="Play video tour"
                >
                  <Play className="h-8 w-8 fill-current ml-1" />
                </button>
                <span className="mt-4 text-white font-bold text-sm tracking-wide bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {t.about.watchVideo}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="border-t border-slate-200/80 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="text-3xl font-black text-wheat-500 font-mono mb-2">
                  {m.year}
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">
                  {m.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-zinc-900 text-white">
              <span className="font-semibold text-sm">Yangiyer Flour Trading — Korxona videolavhasi</span>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src="https://www.youtube.com/embed/G0zm9TybxpU?autoplay=1"
                title="Yangiyer Flour Trading Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
