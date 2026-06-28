// src/app/page.tsx  Redirect vers dashboard
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getRouteForRole } from '@/lib/role-routes'

export default async function Home() {
  const session = await auth()
  if (session?.user) {
    redirect(getRouteForRole(session.user.role))
  } else {
    redirect('/login')
  }
}
