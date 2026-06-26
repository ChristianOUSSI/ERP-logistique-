// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Ce handler avancé prévient les erreurs 401 liées au mismatch de NEXTAUTH_URL et VERCEL_URL sur les déploiements Vercel
async function handler(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  // Optionnel : on peut forcer NEXTAUTH_URL dynamiquement pour éviter les problèmes de CSRF sur Vercel
  const host = req.headers.get('host') || ''
  const protocol = req.headers.get('x-forwarded-proto') || 'https'
  
  // Vercel : si on est sur un domaine Vercel, on s'assure que NextAuth utilise le bon host
  if (host && process.env.VERCEL) {
    process.env.NEXTAUTH_URL = `${protocol}://${host}`
  }

  return NextAuth(req, ctx, authOptions)
}

export { handler as GET, handler as POST }