'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Product } from '@/lib/api';
import { pickLocalized } from '@/lib/i18n';
import { Carousel } from './Carousel';
import { SectionTitle } from './SectionTitle';

export function Products({ products }: { products: Product[] }) {
  const { t, locale } = useLanguage();
  if (products.length === 0) return null;

  const slides = products.map((p) => {
    const title = pickLocalized(p as unknown as Record<string, unknown>, 'title', locale);
    const src = assetUrl(p.imageUrl);
    return (
      <a href="#contact" className="group block" title={t.products.order}>
        <figure className="relative aspect-square overflow-hidden rounded-md bg-navy">
          {src ? (
            <Image
              src={src}
              alt={title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 480px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          ) : (
            // No photo yet: navy card with the gold corner triangle from the master mock-ups
            <div className="flex h-full items-center justify-center p-6 text-center">
              <span className="absolute start-0 top-0 h-0 w-0 border-e-[56px] border-t-[56px] border-e-transparent border-t-gold" />
              <span className="text-xl font-bold text-white">{title}</span>
            </div>
          )}
        </figure>
        {src && <figcaption className="mt-3 text-center font-semibold text-navy">{title}</figcaption>}
      </a>
    );
  });

  return (
    <section id="products" className="py-10">
      <div className="container">
        <SectionTitle accent={t.products.title2}>{t.products.title}</SectionTitle>
        <div className="mx-auto lg:w-[85%]">
          <Carousel slides={slides} perView={{ base: 1, sm: 2, lg: 4 }} label={t.nav.products} />
        </div>
      </div>
    </section>
  );
}
