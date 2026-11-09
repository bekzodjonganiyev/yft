'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Product } from '@/lib/api';
import { pickLocalized } from '@/lib/i18n';
import { Carousel } from './Carousel';

/** Grey band with a product image slider and yellow arrows (version_2_1_0 Products.jsx). */
export function Products({ products }: { products: Product[] }) {
  const { t, locale } = useLanguage();
  if (products.length === 0) return null;

  const slides = products.map((p) => {
    const title = pickLocalized(p, 'title', locale);
    return (
      <a href="#contactus" className="relative block h-[420px] overflow-hidden rounded md:h-[600px]" title={title}>
        {p.imageUrl ? (
          <Image
            src={assetUrl(p.imageUrl)}
            alt={title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 600px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-secondary p-6 text-center">
            <span className="text-2xl font-bold text-white">{title}</span>
            <span className="text-sm text-primary">{pickLocalized(p, 'desc', locale)}</span>
          </div>
        )}
      </a>
    );
  });

  return (
    <section id="products" className="mb-20 bg-mist py-10">
      <div className="container mx-auto mb-10 w-[90%]">
        <h2 className="mb-10 text-center text-4xl font-bold text-secondary">{t.sections.products}</h2>
        <Carousel
          slides={slides}
          perView={{ base: 1, sm: 2, md: 3, lg: 4 }}
          label={t.sections.products}
          arrows
          autoplay={false}
          prevLabel={t.gallery.prev}
          nextLabel={t.gallery.next}
        />
      </div>
    </section>
  );
}
