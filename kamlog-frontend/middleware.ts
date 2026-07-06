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
    // Protéger toutes les routes sous /dashboard et /admin
    '/dashboard/:path*',
    '/admin/:path*',
    // Protéger les routes API internes si nécessaire
    // '/api/:path*',
  ],
};
