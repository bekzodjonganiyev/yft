import { createFileRoute } from '@tanstack/react-router'
import { PartnersFeature } from '@/features/partners'

export const Route = createFileRoute('/_authenticated/partners/')({
  component: PartnersFeature,
})
