import { notFound } from "next/navigation";

import { About } from "@/components/About";
import { Brands } from "@/components/Brands";
import { Contact } from "@/components/Contact";
import { GalleryPreview } from "@/components/GalleryPreview";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <>
      <Hero t={t} locale={locale} />
      <Brands t={t} locale={locale} />
      <About t={t} />
      <Process t={t} />
      <GalleryPreview t={t} locale={locale} />
      <Contact t={t} />
    </>
  );
}
