import { createFileRoute } from '@tanstack/react-router'
import { PostsFeature } from '@/features/posts'

export const Route = createFileRoute('/_authenticated/vacancies/')({
  component: () => <PostsFeature type='VACANCY' />,
})
