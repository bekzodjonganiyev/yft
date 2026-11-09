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
    <div className="flex min-h-[80svh] items-center bg-paper pt-[var(--nav-h)]">
      <div className="wrap py-20">
        <p className="font-display text-[clamp(5rem,3rem+10vw,11rem)] leading-none font-bold tracking-[-0.04em] text-navy/10" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-h2">{t.notFound.title}</h1>
        <p className="mt-4 max-w-[48ch] text-lead text-muted">{t.notFound.text}</p>
        <Link href={`/${locale}`} className="btn mt-9">
          {t.notFound.home}
        </Link>
      </div>
    </div>
  );
}
