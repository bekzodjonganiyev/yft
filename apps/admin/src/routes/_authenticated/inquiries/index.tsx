import { createFileRoute } from '@tanstack/react-router'
import { InquiriesFeature } from '@/features/inquiries'

export const Route = createFileRoute('/_authenticated/inquiries/')({
  component: InquiriesFeature,
})
