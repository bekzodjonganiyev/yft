import { createFileRoute } from '@tanstack/react-router'
import { SiteSettings } from '@/features/site-settings'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SiteSettings,
})
