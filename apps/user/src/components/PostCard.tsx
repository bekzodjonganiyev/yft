'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { assetUrl, type Post } from '@/lib/api';
import { pickLocalized } from '@/lib/i18n';
import { Reveal } from './Reveal';

export const postHref = (p: Post) => `/${p.type === 'NEWS' ? 'news' : 'vacancies'}/${p.id}`;

/** Card: rounded image + title (version_2_1_0 Card.jsx). */
export function PostCard({ post }: { post: Post }) {
  const { locale } = useLanguage();
  const title = pickLocalized(post, 'title', locale);
  return (
    <Reveal>
      <Link href={postHref(post)} className="group flex flex-col">
        <div className="relative mb-4 h-72 w-full overflow-hidden rounded-xl bg-mist">
          {post.imageUrl ? (
            <Image
              src={assetUrl(post.imageUrl)}
              alt={title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary p-6">
              <span className="text-center text-lg font-semibold text-white/90">YANGIYER FLOUR TRADING</span>
            </div>
          )}
        </div>
        <h3 className="mb-4 text-start text-xl font-semibold text-secondary group-hover:underline">{title}</h3>
      </Link>
    </Reveal>
  );
}
