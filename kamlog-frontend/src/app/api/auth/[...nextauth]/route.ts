// src/app/api/auth/[...nextauth]/route.ts
// Configuration avancée pour Vercel :
// Permet à NextAuth de fonctionner sur les Preview Deployments
if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}
process.env.AUTH_TRUST_HOST = 'true';

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }