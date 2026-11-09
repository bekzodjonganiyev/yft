import { createFileRoute, redirect } from '@tanstack/react-router'
import { isTokenValid, useAuthStore } from '@/stores/auth-store'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { accessToken, reset } = useAuthStore.getState().auth
    if (!isTokenValid(accessToken)) {
      if (accessToken) reset()
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout,
})
