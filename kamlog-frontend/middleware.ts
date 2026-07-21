import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Vérifier si l'utilisateur est actif
    const token = req.nextauth.token;
    if (token && !token.is_active) {
      return NextResponse.redirect(new URL('/login?error=inactive', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    // Protéger toutes les routes de l'application sauf les pages publiques et assets
    '/((?!login|register|logout|session-expired|reset-password|mfa|_next/static|_next/image|favicon.ico|images|icons|sw.js|manifest.json|api/auth).*)',
  ],
};
