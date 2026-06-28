// src/app/api/auth/[...nextauth]/route.ts
process.env.AUTH_TRUST_HOST = 'true';
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }