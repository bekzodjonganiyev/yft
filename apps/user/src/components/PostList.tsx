'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Post } from '@/lib/api';
import { PostCard } from './PostCard';

export function PostList({ kind, posts }: { kind: 'news' | 'vacancies'; posts: Post[] }) {
  const { t } = useLanguage();
  return (
    <>
      <h1 className="container mx-auto mt-10 w-[90%] pt-24 text-3xl font-bold text-secondary">
        {kind === 'news' ? t.sections.news : t.sections.vacancies}
      </h1>
      {posts.length === 0 ? (
        <p className="container mx-auto w-[90%] py-10 text-secondary/70">{t.sections.empty}</p>
      ) : (
        <div className="container mx-auto grid w-[90%] grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </>
  );
}
