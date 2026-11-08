'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Check, ArrowRight, Wheat, ChefHat, Cookie, Utensils } from 'lucide-react';

export const FlourRecommender = () => {
  const { t } = useLanguage();
  const [selectedIndustry, setSelectedIndustry] = useState<number>(0);

  const options = [
    {
      id: 0,
      title: t.calculator.industryBakery,
      icon: ChefHat,
      recommendedGrade: '1-Navli Bug\'doy Uni (Birinchi Nav)',
      gluten: '30 - 32%',
      ash: '0.75%',
      reasonUz: 'Tandir nonlari va qolipli nonlarning chiroyli qizarishi, xamirning uzilmasligi va g\'ovakligi uchun eng yuqori kleykovinaga ega nav.',
      reasonRu: 'Оптимальное содержание клейковины гарантирует пышность, эластичность теста и великолепную хрустящую корочку при выпечке.',
      reasonEn: 'High-strength gluten ensures excellent dough hydration, rapid proofing, and resilient volume for daily bakeries.',
      reasonAr: 'محتوى غلوتين مثالي يضمن مرونة العجين وقوة انتفاخه للحصول على خبز طازج ولذيذ.',
    },
    {
      id: 1,
      title: t.calculator.industryPastry,
      icon: Cookie,
      recommendedGrade: 'Oliy Navli Bug\'doy Uni (Premium)',
      gluten: '28 - 30%',
      ash: '0.55%',
      reasonUz: 'Eng past kul miqdori va oppoq rangi tufayli nozik tortlar, biskvitlar, qatlama xamirlar va pishiriqlar uchun tengsiz tanlov.',
      reasonRu: 'Белоснежная текстура тонкого помола обеспечивает нежную структуру бисквитов, пирожных и слоеной выпечки.',
      reasonEn: 'Ultra-low ash content and fine particle size ensure velvety textures for cakes, pastries, and fine patisserie.',
      reasonAr: 'أدنى نسبة رماد ونعومة فائقة تعطي قواماً هشاً ولوناً ناصعاً لكافة أنواع الحلويات والكعك.',
    },
    {
      id: 2,
      title: t.calculator.industryPasta,
      icon: Utensils,
      recommendedGrade: '1-Navli Un & Oliy Nav Aralashmasi',
      gluten: '31%',
      ash: '0.70%',
      reasonUz: 'Qaynash jarayonida shaklini yo\'qotmaslik, yopishib qolmaslik va elastiklikni saqlab qolish uchun mustahkam kleykovina tolalari.',
      reasonRu: 'Прочная белковая матрица предотвращает разваривание макаронных изделий и сохраняет текстуру al dente.',
      reasonEn: 'Strong protein network prevents mushiness during boiling, keeping noodles and dumplings firm and intact.',
      reasonAr: 'شبكة بروتينية متماسكة تحافظ على قوام المعكرونة والعجائن متماسكة عند الطهي دون التصاق.',
    },
    {
      id: 3,
      title: t.calculator.industryHome,
      icon: Wheat,
      recommendedGrade: '2-Navli Un va Ozuqabop Kepak',
      gluten: '25 - 27%',
      ash: '1.25%',
      reasonUz: 'Oshqozon-ichak trakti uchun nihoyatda foydali tabiiy o\'simlik tolalari, parhezbop qora nonlar va vitaminlarga boy tarkib.',
      reasonRu: 'Высокое содержание отрубяных частиц и витаминов группы В для производства лечебно-диетического хлеба.',
      reasonEn: 'Rich in dietary fiber and essential micronutrients, creating wholesome rustic loaves with deep grain aroma.',
      reasonAr: 'غني بالألياف الطبيعية والمعادن الأساسية، مثالي لصناعة الخبز الغذائي والصحي.',
    },
  ];

  const current = options[selectedIndustry];

  return (
    <section id="calculator" className="py-24 bg-slateIron-950 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wheat-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-wheat-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles className="h-4 w-4 text-wheat-400" />
            <span>{t.calculator.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {t.calculator.title}
          </h2>
          <p className="text-white/70 text-base sm:text-lg">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Wizard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Options Column */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs uppercase font-bold text-wheat-400 tracking-wider block mb-2">
              {t.calculator.prompt}
            </span>
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedIndustry === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedIndustry(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-wheat-500 text-slateIron-950 font-bold border-wheat-400 shadow-xl'
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-slateIron-950/20' : 'bg-white/10'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm sm:text-base">{opt.title}</span>
                  </div>
                  {isSelected && <Check className="h-5 w-5 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Result Card Column */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-wheat-500/20 rounded-full blur-2xl" />

            <div className="flex items-center gap-2 text-wheat-400 text-xs font-mono uppercase tracking-wider mb-2">
              <Wheat className="h-4 w-4" />
              <span>{t.calculator.recommended}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              {current.recommendedGrade}
            </h3>

            {/* Spec Chips */}
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-black/30 px-3.5 py-1.5 rounded-lg border border-white/10 text-xs">
                <span className="text-white/60 block">Kleykovina:</span>
                <span className="font-bold text-wheat-400 font-mono text-sm">{current.gluten}</span>
              </div>
              <div className="bg-black/30 px-3.5 py-1.5 rounded-lg border border-white/10 text-xs">
                <span className="text-white/60 block">Kul miqdori:</span>
                <span className="font-bold text-wheat-400 font-mono text-sm">{current.ash}</span>
              </div>
            </div>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
              {current.reasonUz}
            </p>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-wheat-500 hover:bg-wheat-600 text-slateIron-950 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-wheat-500/25"
            >
              <span>Ushbu nav bo'yicha narx so'rash</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
