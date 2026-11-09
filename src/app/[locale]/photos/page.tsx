import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PhotoGrid } from "@/components/PhotoGrid";
import { format, isLocale, languageAlternates } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { gridPhotos, lightboxLabels } from "@/lib/photos";
import { allPhotoNumbers } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/photos">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    title: t.photos.title,
    description: format(t.photos.lead, { count: allPhotoNumbers.length }),
    alternates: { canonical: `/${locale}/photos`, languages: languageAlternates("/photos") },
  };
}

export default async function PhotosPage({ params }: PageProps<"/[locale]/photos">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <div className="bg-paper pt-[calc(var(--nav-h)+clamp(2.5rem,1.5rem+3vw,4.5rem))] pb-[var(--section-y)]">
      <div className="wrap">
        <Link href={`/${locale}`} className="ulink text-sm font-medium text-muted hover:text-ink" data-rest>
          {t.photos.back}
        </Link>
        <h1 className="mt-6 text-h2">{t.photos.title}</h1>
        <p className="mt-4 max-w-[56ch] text-lead text-muted">{format(t.photos.lead, { count: allPhotoNumbers.length })}</p>
        <div className="mt-12">
          <PhotoGrid photos={gridPhotos(allPhotoNumbers, t)} labels={lightboxLabels(t)} />
        </div>
      </div>
    </div>
  );
}
