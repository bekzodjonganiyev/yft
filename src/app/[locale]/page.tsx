import { notFound } from "next/navigation";

import { BrandShowcase } from "@/components/BrandShowcase";
import { Company } from "@/components/Company";
import { Faq } from "@/components/Faq";
import { Figures } from "@/components/Figures";
import { GalleryPreview } from "@/components/GalleryPreview";
import { Hero } from "@/components/Hero";
import { PhotoChapters } from "@/components/PhotoChapters";
import { Request } from "@/components/Request";
import { Statement } from "@/components/Statement";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { brands, figures, photoImage, processSteps } from "@/lib/site";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);
  const alt = t.photos.alt as Record<string, string>;
  const figureLabels = t.figures.items as Record<string, string>;

  return (
    <>
      <Hero t={t} locale={locale} />
      <Statement t={t} />
      <BrandShowcase
        brands={brands}
        locale={locale}
        labels={{
          title: t.brands.title,
          lead: t.brands.lead,
          pick: t.brands.pick,
          spec: t.brands.spec,
          specGrade: t.brands.specGrade,
          specWeight: t.brands.specWeight,
          specWheat: t.brands.specWheat,
          specUse: t.brands.specUse,
          grade: t.brands.gradeValue,
          weight: t.brands.weightValue,
          kazakhWheat: t.brands.kazakhWheat,
          bakery: t.brands.bakery,
          standard: t.about.spec.standardValue,
          ctaFor: t.brands.ctaFor,
          bagAlt: t.brands.bagAlt,
        }}
      />
      <PhotoChapters
        id="process"
        title={t.process.title}
        lead={t.process.lead}
        counter={t.chapters.counter}
        chapters={processSteps.map((s) => ({
          key: s.key,
          title: t.process.steps[s.key].title,
          text: t.process.steps[s.key].text,
          facts: t.process.steps[s.key].facts,
          image: photoImage(s.photo),
          alt: alt[s.photo],
        }))}
      />
      <Figures
        title={t.figures.title}
        lead={t.figures.lead}
        clockLabel={t.ui.clock}
        locale={locale}
        figures={figures.map((f) => ({ key: f.key, value: f.value, unit: "unit" in f ? f.unit : undefined, label: figureLabels[f.key] }))}
      />
      <Company t={t} />
      <GalleryPreview t={t} locale={locale} />
      <Faq t={t} />
      <Request t={t} locale={locale} />
    </>
  );
}
