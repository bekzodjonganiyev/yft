'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Partner } from '@/lib/api';
import { Carousel } from './Carousel';

/** Logo slider, 3 per view (version_2_1_0 Partners.jsx). */
export function Partners({ partners }: { partners: Partner[] }) {
  const { t } = useLanguage();
  if (partners.length === 0) return null;

  const slides = partners.map((p) => {
    const logo = <PartnerLogo partner={p} />;
    return p.websiteUrl && p.websiteUrl !== '#' ? (
      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={p.name} title={p.name}>
        {logo}
      </a>
    ) : (
      logo
    );
  });

  return (
    <section id="partners" className="mb-[60px] mt-[120px]">
      <h2 className="my-10 text-center text-4xl font-bold text-secondary">{t.sections.partners}</h2>
      <div className="container mx-auto w-[90%]">
        <Carousel slides={slides} perView={{ base: 1, sm: 2, lg: 3 }} interval={2000} label={t.sections.partners} />
      </div>
    </section>
  );
}

/** Falls back to the partner name if the logo cannot be loaded. */
function PartnerLogo({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative mx-auto flex h-40 w-56 items-center justify-center">
      {failed || !partner.logoUrl ? (
        <span className="text-center text-lg font-bold text-secondary">{partner.name}</span>
      ) : (
        <Image
          src={assetUrl(partner.logoUrl)}
          alt={partner.name}
          fill
          sizes="224px"
          className="object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
