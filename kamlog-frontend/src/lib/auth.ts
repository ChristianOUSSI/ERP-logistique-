// src/lib/auth.ts - Configuration NextAuth KAMLOG
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authAPI } from './api-client';
import axios from 'axios';

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

          // Récupérer le vrai rôle et les infos de l'utilisateur avec le token
          const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-83b1.up.railway.app';
          const meResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`
            }
          });
          
          const userData = meResponse.data;

          return {
            id: String(userData.id),
            email: userData.email,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            role: userData.role,
            nom: userData.full_name || '',
            prenom: '',
            is_active: userData.is_active ?? true,
          };
        } catch (error: any) {
          console.error("NextAuth Authorize Error:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            
            // On lève une erreur spécifique avec le message du backend pour le frontend
            const backendError = error.response.data?.detail || "Identifiants incorrects ou compte inactif";
            throw new Error(typeof backendError === 'string' ? backendError : JSON.stringify(backendError));
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
  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 heures par défaut
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