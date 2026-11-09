'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Post } from '@/lib/api';
import { PostCard } from './PostCard';
import { MobileAllButton, SectionHeader } from './SectionHeader';

/** News (4 columns) / Vacancies (3 columns) preview on the home page. */
export function PostsSection({ kind, posts }: { kind: 'news' | 'vacancies'; posts: Post[] }) {
  const { t } = useLanguage();
  if (posts.length === 0) return null;
  const href = `/${kind}`;
  return (
    <section className="container mx-auto mb-20 w-[90%]">
      <SectionHeader title={kind === 'news' ? t.sections.news : t.sections.vacancies} href={href} />
      <div className={`grid grid-cols-1 gap-6 ${kind === 'news' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <MobileAllButton href={href} />
    </section>
  );
}
