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
    <div className="wrap py-14 md:py-20">
      <Link href={`/${locale}`} className="link text-silo">
        {t.photos.back}
      </Link>
      <h1 className="mt-6 text-3xl">{t.photos.title}</h1>
      <p className="mt-3 max-w-[68ch] text-lg">{format(t.photos.lead, { count: allPhotoNumbers.length })}</p>
      <div className="mt-10">
        <PhotoGrid photos={gridPhotos(allPhotoNumbers, t)} labels={lightboxLabels(t)} />
      </div>
    </div>
  );
}
