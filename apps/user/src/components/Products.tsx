'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Wheat, Check, PackageCheck, Layers, Droplet, Flame, ArrowUpRight } from 'lucide-react';

interface ProductItem {
  id: string;
  category: 'FLOUR_PREMIUM' | 'FLOUR_FIRST' | 'FLOUR_SECOND' | 'BRAN';
  titleKey: 'titleUz' | 'titleRu' | 'titleEn' | 'titleAr';
  descKey: 'descUz' | 'descRu' | 'descEn' | 'descAr';
  gluten: string;
  ash: string;
  moisture: string;
  packaging: string;
  usesUz: string;
  usesRu: string;
  usesEn: string;
  usesAr: string;
  image: string;
  tag: string;
}

export const Products = () => {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const productsList: ProductItem[] = [
    {
      id: 'flour-premium',
      category: 'FLOUR_PREMIUM',
      titleKey: 'titleUz',
      descKey: 'descUz',
      gluten: '28 - 30%',
      ash: '0.55%',
      moisture: '14.0%',
      packaging: '50 kg, 25 kg, 10 kg, 5 kg',
      usesUz: 'Nozik qandolat, biskvitlar, qatlama va oliy navli dasturxon nonlari',
      usesRu: 'Сдобная выпечка, бисквиты, слоеное тесто, элитный хлеб',
      usesEn: 'Fine pastry, croissants, sandwich loaves, artisan cakes',
      usesAr: 'الحلويات الفاخرة، الكرواسون، الكعك والمخبوزات الراقية',
      image: '/images/fake_verstka1.png',
      tag: 'Premium Grade',
    },
    {
      id: 'flour-first',
      category: 'FLOUR_FIRST',
      titleKey: 'titleUz',
      descKey: 'descUz',
      gluten: '30 - 32%',
      ash: '0.75%',
      moisture: '14.5%',
      packaging: '50 kg, 25 kg',
      usesUz: 'Tandir nonlari, qolipli non, patir, somsa va barcha novvoychilik sexlari',
      usesRu: 'Тандырные лепешки, формовой хлеб, самса, промышленная выпечка',
      usesEn: 'Traditional flatbreads, hearth loaves, baguettes, commercial baking',
      usesAr: 'الخبز التقليدي، خبز التنور، الفطائر والمخابز التجارية',
      image: '/images/fake_verstka2.png',
      tag: 'Best Seller',
    },
    {
      id: 'flour-second',
      category: 'FLOUR_SECOND',
      titleKey: 'titleUz',
      descKey: 'descUz',
      gluten: '25 - 27%',
      ash: '1.25%',
      moisture: '14.5%',
      packaging: '50 kg',
      usesUz: 'Parhezbop quyuq nonlar, qora non, pryanik va to\'yimli xamir mahsulotlari',
      usesRu: 'Диетический хлеб, подовые буханки, пряники, питательная выпечка',
      usesEn: 'Rustic hearth bread, whole wheat loaves, gingerbread, dietary food',
      usesAr: 'الخبز الصحي الغني بالألياف، المخبوزات الريفية، الأغذية الصحية',
      image: '/images/fake_verstka3.png',
      tag: 'Dietary Choice',
    },
    {
      id: 'flour-bran',
      category: 'BRAN',
      titleKey: 'titleUz',
      descKey: 'descUz',
      gluten: '-',
      ash: '5.0%',
      moisture: '13.5%',
      packaging: '25 kg, 20 kg',
      usesUz: 'Chorva ozuqalari, parrandachilik va sog\'lom parhez oziq-ovqat mahsulotlari',
      usesRu: 'Комбикорма для животноводства, диетические добавки',
      usesEn: 'Animal feed, cereal processing, fiber-rich dietary foods',
      usesAr: 'أعلاف الماشية والدواجن، الأغذية الغنية بالألياف الطبيعية',
      image: '/images/fake_verstka4.png',
      tag: 'Animal Feed & Food',
    },
  ];

  const getProductTitle = (item: ProductItem) => {
    if (item.category === 'FLOUR_PREMIUM') {
      if (locale === 'ru') return 'Пшеничная Мука Высший Сорт';
      if (locale === 'en') return 'Premium Grade Wheat Flour';
      if (locale === 'ar') return 'دقيق القمح الدرجة الممتازة';
      return 'Oliy Navli Bug\'doy Uni (Premium)';
    }
    if (item.category === 'FLOUR_FIRST') {
      if (locale === 'ru') return 'Пшеничная Мука Первый Сорт';
      if (locale === 'en') return 'First Grade Wheat Flour';
      if (locale === 'ar') return 'دقيق القمح الدرجة الأولى';
      return '1-Navli Bug\'doy Uni (Birinchi Nav)';
    }
    if (item.category === 'FLOUR_SECOND') {
      if (locale === 'ru') return 'Пшеничная Мука Второй Сорт';
      if (locale === 'en') return 'Second Grade Wheat Flour';
      if (locale === 'ar') return 'دقيق القمح الدرجة الثانية';
      return '2-Navli Bug\'doy Uni (Ikkinchi Nav)';
    }
    if (locale === 'ru') return 'Отруби Пшеничные Очищенные';
    if (locale === 'en') return 'Cleaned Wheat Bran';
    if (locale === 'ar') return 'نخالة قمح نقية';
    return 'Tozalangan Bug\'doy Kepagi';
  };

  const getProductDesc = (item: ProductItem) => {
    if (item.category === 'FLOUR_PREMIUM') {
      if (locale === 'ru') return 'Мука тонкого помола высшего качества из отборного зерна для кондитерских изделий и пышного хлеба.';
      if (locale === 'en') return 'Superfine milled flour from select grain varieties, creating airy dough and tender texture.';
      if (locale === 'ar') return 'دقيق فائق النعومة من حبوب مختارة، مثالي للحلويات والمخبوزات الفاخرة.';
      return 'Eng sara bug\'doy donlaridan tayyorlangan oliy sifatli un. Nozik pishiriqlar va shirinliklar uchun.';
    }
    if (item.category === 'FLOUR_FIRST') {
      if (locale === 'ru') return 'Самый популярный и востребованный сорт для всех типов хлебопекарных предприятий.';
      if (locale === 'en') return 'The gold standard for commercial bakeries, offering strong gluten stability and volume.';
      if (locale === 'ar') return 'الخيار الأول للمخابز لضمان استقرار العجين وانتفاخ رغيف الخبز.';
      return 'Novvoyxonalar va non sexlari uchun eng talabgir, boy kleykovina miqdoriga ega barqaror un.';
    }
    if (item.category === 'FLOUR_SECOND') {
      if (locale === 'ru') return 'Высокое содержание растительных волокон и витаминов для традиционного темного хлеба.';
      if (locale === 'en') return 'High in wheat fiber and natural minerals, ideal for hearty whole-grain baking.';
      if (locale === 'ar') return 'غني بالألياف الطبيعية والمعادن، مثالي للخبز الصحي والكامل.';
      return 'Tabiiy don qobig\'i va minerallarga boy, quyuq xushbo\'y nonlar uchun parhezbop nav.';
    }
    if (locale === 'ru') return 'Очищенные кормовые отруби высокого качества для комбикормового производства.';
    if (locale === 'en') return 'High-purity wheat bran for animal nutrition and food dietary fiber processing.';
    if (locale === 'ar') return 'نخالة قمح نظيفة وعالية الجودة لصناعة الأعلاف والأغذية الصحية.';
    return 'Chorvachilik va ozuqa sanoati uchun tozalangan boy to\'yimli bug\'doy kepagi.';
  };

  const getUses = (item: ProductItem) => {
    if (locale === 'ru') return item.usesRu;
    if (locale === 'en') return item.usesEn;
    if (locale === 'ar') return item.usesAr;
    return item.usesUz;
  };

  const filtered = productsList.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.category === activeTab;
  });

  return (
    <section id="products" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wheat-100 text-wheat-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <Wheat className="h-4 w-4 text-wheat-600" />
              <span>{t.products.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slateIron-950 tracking-tight leading-tight">
              {t.products.title}
            </h2>
            <p className="mt-3 text-lg text-slate-600 font-normal leading-relaxed">
              {t.products.subtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-wheat-500 text-slateIron-950 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.products.filterAll}
            </button>
            <button
              onClick={() => setActiveTab('FLOUR_PREMIUM')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'FLOUR_PREMIUM'
                  ? 'bg-wheat-500 text-slateIron-950 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.products.filterPremium}
            </button>
            <button
              onClick={() => setActiveTab('FLOUR_FIRST')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'FLOUR_FIRST'
                  ? 'bg-wheat-500 text-slateIron-950 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.products.filterFirst}
            </button>
            <button
              onClick={() => setActiveTab('FLOUR_SECOND')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'FLOUR_SECOND'
                  ? 'bg-wheat-500 text-slateIron-950 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.products.filterSecond}
            </button>
            <button
              onClick={() => setActiveTab('BRAN')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'BRAN'
                  ? 'bg-wheat-500 text-slateIron-950 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.products.filterBran}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-milledCream-50/70 rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 hover:border-wheat-400"
            >
              <div>
                {/* Visual Image */}
                <div className="relative h-60 w-full mb-6 rounded-2xl overflow-hidden bg-white/80 p-4 border border-slate-200 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={getProductTitle(item)}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-wheat-500 text-slateIron-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-bold text-slateIron-950 mb-2 leading-tight">
                  {getProductTitle(item)}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {getProductDesc(item)}
                </p>

                {/* Technical Specs List */}
                <div className="space-y-2.5 py-4 border-t border-b border-slate-200/80 text-xs mb-6">
                  {item.gluten !== '-' && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                        <Flame className="h-3.5 w-3.5 text-amber-500" />
                        {t.products.glutenLabel}
                      </span>
                      <span className="font-bold text-slate-900 font-mono">{item.gluten}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      {t.products.ashLabel}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">{item.ash}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Droplet className="h-3.5 w-3.5 text-blue-500" />
                      {t.products.moistureLabel}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">{item.moisture}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
                      {t.products.packagingLabel}
                    </span>
                    <span className="font-semibold text-slate-900">{item.packaging}</span>
                  </div>
                </div>

                {/* Uses */}
                <div className="text-xs text-slate-600 mb-6 bg-white/70 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">
                    {t.products.usesLabel}
                  </span>
                  <span>{getUses(item)}</span>
                </div>
              </div>

              {/* Order Button */}
              <Link
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-slateIron-900 hover:bg-wheat-500 hover:text-slateIron-950 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <span>{t.products.orderBtn}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
