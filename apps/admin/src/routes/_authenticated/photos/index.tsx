import { createFileRoute } from '@tanstack/react-router'
import { PhotosFeature } from '@/features/photos'

export const Route = createFileRoute('/_authenticated/photos/')({
  component: PhotosFeature,
})
