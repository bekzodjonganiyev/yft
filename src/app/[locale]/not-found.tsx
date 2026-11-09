import type { Metadata } from "next";
import Link from "next/link";

import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.notFound.title };
}

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return (
    <div className="wrap py-24 md:py-32">
      <h1 className="text-3xl">{t.notFound.title}</h1>
      <p className="mt-4 max-w-[68ch] text-lg">{t.notFound.text}</p>
      <Link href={`/${locale}`} className="btn btn-primary mt-8">
        {t.notFound.home}
      </Link>
    </div>
  );
}
