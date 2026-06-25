// src/lib/auth.ts - Configuration NextAuth KAMLOG
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authAPI } from './api-client';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "k9M+3L/7jBvW4zTqRcX8yF2pE5aH1nD6vK9M+3L/7jBv=",
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await authAPI.login({
            username: credentials?.username as string,
            password: credentials?.password as string,
          });

          return {
            id: '1',
            email: credentials?.username as string,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            role: 'user',
            nom: '',
            prenom: '',
            is_active: true,
          };
        } catch (error) {
          console.error("NextAuth Authorize Error:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          } else {
            console.error("Error message:", error.message);
          }
          console.error("API URL used:", process.env.NEXT_PUBLIC_API_URL);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.is_active = user.is_active;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.role = token.role as string;
      session.user.nom = token.nom as string;
      session.user.prenom = token.prenom as string;
      session.user.is_active = token.is_active as boolean;
      session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };

// Pour les composants serveur, utiliser getServerSession
import { getServerSession } from 'next-auth';

export async function auth() {
  return await getServerSession();
}