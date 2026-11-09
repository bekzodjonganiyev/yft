'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Small dependency-free replacement for the react-slick sliders used on the master site:
 * autoplay, pause on hover/focus, dots, responsive number of slides.
 */
type PerView = { base: number; sm?: number; md?: number; lg?: number };

const usePerView = ({ base, sm, md, lg }: PerView) => {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount((w >= 1024 && lg) || (w >= 768 && md) || (w >= 480 && sm) || base);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [base, sm, md, lg]);
  return count;
};

interface CarouselProps {
  slides: ReactNode[];
  perView: PerView;
  interval?: number;
  label: string;
  dotsClassName?: string;
}

export function Carousel({ slides, perView, interval = 3000, label, dotsClassName = 'bg-navy' }: CarouselProps) {
  const { dir } = useLanguage();
  const visible = usePerView(perView);
  const pages = Math.max(1, slides.length - visible + 1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (index > pages - 1) setIndex(0);
  }, [index, pages]);

  useEffect(() => {
    if (paused || pages <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % pages), interval);
    return () => window.clearInterval(id);
  }, [paused, pages, interval]);

  const offset = (index * 100) / visible;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${dir === 'rtl' ? offset : -offset}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="shrink-0 px-2"
              style={{ flexBasis: `${100 / visible}%` }}
              aria-hidden={i < index || i >= index + visible}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1} / ${pages}`}
              aria-current={i === index}
              className={`h-2.5 w-2.5 rounded-full transition-opacity ${dotsClassName} ${
                i === index ? 'opacity-100' : 'opacity-30 hover:opacity-60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
