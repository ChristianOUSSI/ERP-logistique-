// src/lib/auth.ts - Configuration NextAuth KAMLOG
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authAPI } from './api-client';

export const authOptions: NextAuthOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || "k9M+3L/7jBvW4zTqRcX8yF2pE5aH1nD6vK9M+3L/7jBv=",
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await authAPI.login({
            username: credentials?.email as string,
            password: credentials?.password as string,
          });

          return {
            id: '1',
            email: credentials?.email as string,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            role: 'user',
            nom: '',
            prenom: '',
            is_active: true,
          };
        } catch (error: any) {
          console.error("NextAuth Authorize Error:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            
            // On lève une erreur spécifique avec le message du backend pour le frontend
            const backendError = error.response.data?.detail || "Identifiants incorrects ou compte inactif";
            throw new Error(backendError);
          } else {
            console.error("Error message:", error.message);
            // Erreur réseau (ex: NEXT_PUBLIC_API_URL incorrect)
            throw new Error("Erreur de connexion au serveur d'authentification");
          }
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
      // @ts-ignore
      session.user.accessToken = token.accessToken as string;
      // @ts-ignore
      session.user.refreshToken = token.refreshToken as string;
      // @ts-ignore
      session.user.role = token.role as string;
      // @ts-ignore
      session.user.nom = token.nom as string;
      // @ts-ignore
      session.user.prenom = token.prenom as string;
      // @ts-ignore
      session.user.is_active = token.is_active as boolean;
      // @ts-ignore
      session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};


// Pour les composants serveur, utiliser getServerSession
import { getServerSession } from 'next-auth';

export async function auth() {
  return await getServerSession();
}