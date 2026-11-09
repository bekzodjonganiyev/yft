'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Partner } from '@/lib/api';
import { Carousel } from './Carousel';
import { SectionTitle } from './SectionTitle';

export function Partners({ partners, background }: { partners: Partner[]; background: string }) {
  const { t } = useLanguage();
  if (partners.length === 0) return null;

  const slides = partners.map((p) => {
    const logo = <PartnerLogo partner={p} />;
    return p.websiteUrl && p.websiteUrl !== '#' ? (
      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
        {logo}
      </a>
    ) : (
      logo
    );
  });

  return (
    <section id="partners" className="pt-6">
      <SectionTitle>{t.partners.title}</SectionTitle>
      <div
        className="flex min-h-96 items-center bg-cover bg-center bg-no-repeat py-12 md:bg-fixed"
        style={{ backgroundImage: `url("${background}")` }}
      >
        <div className="container lg:w-[80%]">
          <Carousel slides={slides} perView={{ base: 1, sm: 2, md: 3, lg: 4 }} label={t.partners.title} dotsClassName="bg-white" />
        </div>
      </div>
    </section>
  );
}

/** Logo tile; falls back to the partner name if the image cannot be loaded (e.g. dead legacy host). */
function PartnerLogo({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative flex aspect-[3/2] w-full items-center justify-center overflow-hidden bg-white p-3">
      {failed || !partner.logoUrl ? (
        <span className="text-center text-lg font-bold text-navy">{partner.name}</span>
      ) : (
        <Image
          src={assetUrl(partner.logoUrl)}
          alt={partner.name}
          fill
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="object-contain p-3"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
