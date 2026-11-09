'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Post } from '@/lib/api';
import { formatDate, pickLocalized } from '@/lib/i18n';
import { CalendarIcon } from './icons';
import { Paragraphs } from './Paragraphs';

/** Article page (version_2_1_0 Details.jsx). */
export function PostDetails({ post }: { post: Post }) {
  const { t, locale } = useLanguage();
  const listHref = post.type === 'NEWS' ? '/news' : '/vacancies';
  return (
    <article className="container mx-auto w-[90%] py-10 pt-32 lg:w-3/4">
      <Link href={listHref} className="mb-6 inline-block text-sm font-medium text-secondary/70 hover:text-secondary">
        <span className="inline-block rtl:rotate-180">←</span> {t.sections.back}
      </Link>
      <div className="mb-4 flex items-center gap-2 font-bold">
        <CalendarIcon />
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
      </div>
      <h1 className="mb-8 text-4xl font-bold">{pickLocalized(post, 'title', locale)}</h1>
      {post.imageUrl && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl">
          <Image src={assetUrl(post.imageUrl)} alt="" fill sizes="(min-width: 1024px) 75vw, 100vw" className="object-cover" priority />
        </div>
      )}
      <div className="text-lg leading-relaxed">
        <Paragraphs text={pickLocalized(post, 'body', locale)} />
      </div>
    </article>
  );
}
