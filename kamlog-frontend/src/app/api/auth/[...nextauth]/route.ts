// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Ce handler avancé prévient les erreurs 401 liées au mismatch de NEXTAUTH_URL et VERCEL_URL sur les déploiements Vercel
async function handler(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  // Hack ultime pour Vercel : on force NEXTAUTH_URL à correspondre EXACTEMENT à l'URL demandée
  try {
    const url = new URL(req.url)
    process.env.NEXTAUTH_URL = `${url.protocol}//${url.host}`
    process.env.AUTH_TRUST_HOST = "true"
  } catch (e) {
    console.error("Failed to parse req.url", e)
  }

  return NextAuth(req, ctx, authOptions)
}

export { handler as GET, handler as POST }