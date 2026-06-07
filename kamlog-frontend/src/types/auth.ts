// src/types/auth.ts  Types Auth KAMLOG

export type RoleKamlog = 
  | 'admin' 
  | 'dispatcher' 
  | 'finance' 
  | 'douane' 
  | 'gate_agent'

export interface UserKamlog {
  id: number
  email: string
  nom: string
  prenom: string
  role: RoleKamlog
  is_active: boolean
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}

export interface AuthResponse extends AuthTokens {
  user: UserKamlog
}

// Permissions par rôle
export const ROLE_PERMISSIONS: Record<RoleKamlog, string[]> = {
  admin: ['*'],  // Accès total
  dispatcher: [
    'transport.read', 
    'transport.write', 
    'tiers.read',
    'dashboard.read'
  ],
  finance: [
    'finance.read', 
    'finance.write', 
    'tiers.read',
    'dashboard.read'
  ],
  douane: [
    'transit.read', 
    'transit.write', 
    'parc.read',
    'dashboard.read'
  ],
  gate_agent: [
    'parc.read', 
    'parc.write',
    'dashboard.read'
  ],
}

// Labels affichage des rôles
export const ROLE_LABELS: Record<RoleKamlog, string> = {
  admin: 'Administrateur',
  dispatcher: 'Dispatcher',
  finance: 'Finance',
  douane: 'Douane',
  gate_agent: 'Agent de Guérite',
}

// Couleurs badge par rôle
export const ROLE_COLORS: Record<RoleKamlog, string> = {
  admin: 'bg-red-100 text-red-800',
  dispatcher: 'bg-blue-100 text-blue-800',
  finance: 'bg-green-100 text-green-800',
  douane: 'bg-orange-100 text-orange-800',
  gate_agent: 'bg-gray-100 text-gray-800',
}