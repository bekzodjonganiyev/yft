'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn, Layers } from 'lucide-react';

interface PhotoItem {
  id: string;
  src: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  titleAr: string;
  category: 'production' | 'laboratory' | 'factory';
  categoryLabelUz: string;
}

export const Gallery = () => {
  const { t, locale } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const initialPhotos: PhotoItem[] = [
    {
      id: 'photo-1',
      src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Yangiyer zamonaviy tegirmon agregati',
      titleRu: 'Современный мельничный комплекс Янгиер',
      titleEn: 'Yangiyer modern milling line',
      titleAr: 'مجمع مطاحن يانغير الحديث',
      category: 'production',
      categoryLabelUz: 'Tegirmon sexlari',
    },
    {
      id: 'photo-2',
      src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Sara bug\'doy donlarini saralash jarayoni',
      titleRu: 'Сортировка и калибровка отборного зерна',
      titleEn: 'Grain cleaning and calibration process',
      titleAr: 'فرز ومعايرة حبوب القمح المختارة',
      category: 'production',
      categoryLabelUz: 'Tegirmon sexlari',
    },
    {
      id: 'photo-3',
      src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Akkreditatsiyadan o\'tgan sifat nazorati laboratoriyasi',
      titleRu: 'Аккредитованная лаборатория контроля качества',
      titleEn: 'Certified quality control laboratory',
      titleAr: 'مختبر مراقبة الجودة المعتمد',
      category: 'laboratory',
      categoryLabelUz: 'Laboratoriya',
    },
    {
      id: 'photo-4',
      src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Tayyor un mahsulotlari yirik ombori',
      titleRu: 'Склад хранения готовой мучной продукции',
      titleEn: 'Finished flour products logistics warehouse',
      titleAr: 'مستودع تخزين الدقيق الجاهز للتوزيع',
      category: 'factory',
      categoryLabelUz: 'Ombor va Yuklash',
    },
    {
      id: 'photo-5',
      src: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Avtomatlashtirilgan qadoqlash liniyasi (50kg qoplar)',
      titleRu: 'Автоматическая линия фасовки в мешки 50 кг',
      titleEn: 'Automated 50kg flour bagging line',
      titleAr: 'خط تعبئة وتغليف الدقيق الآلي في أكياس 50 كغ',
      category: 'factory',
      categoryLabelUz: 'Ombor va Yuklash',
    },
    {
      id: 'photo-6',
      src: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=1200&auto=format&fit=crop',
      titleUz: 'Kleykovina va oqlik darajasini tekshirish jarayoni',
      titleRu: 'Анализ клейковины и белизны муки',
      titleEn: 'Gluten and whiteness index testing',
      titleAr: 'تحليل مؤشر الغلوتين وبياض الدقيق',
      category: 'laboratory',
      categoryLabelUz: 'Laboratoriya',
    },
  ];

  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);

  useEffect(() => {
    // Optionally fetch photos from local backend if available
    fetch('http://localhost:5000/api/photos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const mapped: PhotoItem[] = data.data.map((p: any) => ({
            id: p.id || p._id,
            src: p.photoUrl ? (p.photoUrl.startsWith('http') ? p.photoUrl : `http://localhost:5000${p.photoUrl}`) : p.src,
            titleUz: p.titleUz || p.title_uz || 'Yangiyer Flour Trading',
            titleRu: p.titleRu || 'Yangiyer Flour Trading',
            titleEn: p.titleEn || 'Yangiyer Flour Trading',
            titleAr: p.titleAr || 'Yangiyer Flour Trading',
            category: p.category || 'production',
            categoryLabelUz: p.category || 'Tegirmon',
          }));
          setPhotos(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = photos.filter((p) => {
    if (activeCategory === 'ALL') return true;
    return p.category === activeCategory;
  });

  const getTitle = (p: PhotoItem) => {
    if (locale === 'ru') return p.titleRu;
    if (locale === 'en') return p.titleEn;
    if (locale === 'ar') return p.titleAr;
    return p.titleUz;
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % filtered.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered.length]);

  return (
    <section id="gallery" className="py-24 bg-milledCream-100/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wheat-200/70 text-wheat-900 text-xs font-semibold uppercase tracking-wider mb-3">
              <Camera className="h-4 w-4 text-wheat-700" />
              <span>{t.gallery.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slateIron-950 tracking-tight leading-tight">
              {t.gallery.title}
            </h2>
            <p className="mt-3 text-lg text-slate-600 font-normal leading-relaxed">
              {t.gallery.subtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'ALL'
                  ? 'bg-slateIron-950 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {t.gallery.filterAll}
            </button>
            <button
              onClick={() => setActiveCategory('production')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'production'
                  ? 'bg-slateIron-950 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {t.gallery.filterProduction}
            </button>
            <button
              onClick={() => setActiveCategory('laboratory')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'laboratory'
                  ? 'bg-slateIron-950 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {t.gallery.filterLab}
            </button>
            <button
              onClick={() => setActiveCategory('factory')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'factory'
                  ? 'bg-slateIron-950 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {t.gallery.filterFactory}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <Image
                src={photo.src}
                alt={getTitle(photo)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slateIron-950/80 via-slateIron-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-wheat-400 block mb-1">
                    {photo.categoryLabelUz}
                  </span>
                  <h4 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2">
                    {getTitle(photo)}
                  </h4>
                </div>
                <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-white z-50">
            <span className="text-sm font-mono text-zinc-400">
              {lightboxIndex + 1} / {filtered.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              aria-label="Close image"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-50"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-50"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Main Photo View */}
          <div
            className="relative max-w-5xl max-h-[82vh] w-full h-[75vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={filtered[lightboxIndex].src}
                alt={getTitle(filtered[lightboxIndex])}
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-4 text-center text-white/90 text-sm font-medium">
              {getTitle(filtered[lightboxIndex])}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
