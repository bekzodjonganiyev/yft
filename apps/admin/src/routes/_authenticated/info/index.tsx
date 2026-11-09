import { createFileRoute } from '@tanstack/react-router'
import { InfoItemsFeature } from '@/features/info-items'

export const Route = createFileRoute('/_authenticated/info/')({
  component: InfoItemsFeature,
})
