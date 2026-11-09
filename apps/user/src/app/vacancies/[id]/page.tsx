import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostDetails } from '@/components/PostDetails';
import { assetUrl, getPost } from '@/lib/api';

export const revalidate = 60;

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.id);
  if (!post || post.type !== 'VACANCY') return {};
  return {
    title: post.titleUz,
    description: post.bodyUz.slice(0, 160),
    openGraph: post.imageUrl ? { images: [assetUrl(post.imageUrl)] } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const post = await getPost(params.id);
  if (!post || post.type !== 'VACANCY') notFound();
  return <PostDetails post={post} />;
}
