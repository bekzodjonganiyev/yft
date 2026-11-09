import type { Metadata } from 'next';
import { PostList } from '@/components/PostList';
import { getPosts } from '@/lib/api';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Vakansiyalar' };

export default async function Page() {
  const posts = await getPosts('VACANCY');
  return <PostList kind="vacancies" posts={posts} />;
}
