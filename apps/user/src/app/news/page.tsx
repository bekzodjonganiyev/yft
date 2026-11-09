import type { Metadata } from 'next';
import { PostList } from '@/components/PostList';
import { getPosts } from '@/lib/api';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Yangiliklar' };

export default async function Page() {
  const posts = await getPosts('NEWS');
  return <PostList kind="news" posts={posts} />;
}
