// src/types/next-auth.d.ts
// On doit typer EXPLICITEMENT chaque champ du JWT

import type { DefaultSession } from 'next-auth'

// ── Étendre Session ────────────────────────────────────────
declare module 'next-auth' {

  interface Session {
    user: {
      id: string
      role: string
      nom: string
      prenom: string
      is_active: boolean
      accessToken: string
      refreshToken: string
    } & DefaultSession['user']
  }

  // ── Étendre User (retour de authorize) ──────────────────
  interface User {
    role: string
    nom: string
    prenom: string
    is_active: boolean
    accessToken: string
    refreshToken: string
  }
}

// ── Étendre JWT — CRUCIAL : typer chaque champ ────────────
declare module 'next-auth/jwt' {
  interface JWT {
    role: string           // ← string, pas unknown !
    nom: string            // ← string, pas unknown !
    prenom: string         // ← string, pas unknown !
    is_active: boolean     // ← boolean, pas unknown !
    accessToken: string    // ← string, pas unknown !
    refreshToken: string   // ← string, pas unknown !
    userId: string         // ← string, pas unknown !
  }
}