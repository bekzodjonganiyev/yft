import { createFileRoute } from '@tanstack/react-router'
import { BannersFeature } from '@/features/banners'

export const Route = createFileRoute('/_authenticated/banners/')({
  component: BannersFeature,
})
