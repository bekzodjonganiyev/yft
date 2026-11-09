import { createFileRoute } from '@tanstack/react-router'
import { PostsFeature } from '@/features/posts'

export const Route = createFileRoute('/_authenticated/news/')({
  component: () => <PostsFeature type='NEWS' />,
})
