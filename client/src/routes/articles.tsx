import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/articles')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession()
    if (!data?.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <Outlet />,
})