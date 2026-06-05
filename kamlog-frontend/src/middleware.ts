// src/middleware.ts — Protection routes KAMLOG par rôle
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { RoleKamlog } from '@/types/auth'

// Routes protégées par rôle minimum requis
const PROTECTED_ROUTES: Record<string, RoleKamlog[]> = {
  '/dashboard': ['admin', 'dispatcher', 'finance', 'douane', 'gate_agent'],
  '/tiers': ['admin', 'dispatcher', 'finance'],
  '/transport/missions': ['admin', 'dispatcher'],
  '/transport/flotte': ['admin', 'dispatcher'],
  '/finance/factures': ['admin', 'finance'],
  '/finance/encours': ['admin', 'finance'],
  '/finance/tarifs': ['admin', 'finance'],
  '/parc': ['admin', 'dispatcher', 'douane', 'gate_agent'],
}

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Routes publiques (login, etc.)
  if (pathname.startsWith('/login')) {
    // Si déjà connecté → redirect dashboard
    if (session?.user) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Pas de session → login
  if (!session?.user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Vérification rôle pour routes protégées
  const userRole = session.user.role as RoleKamlog

  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
        // Accès refusé → dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}