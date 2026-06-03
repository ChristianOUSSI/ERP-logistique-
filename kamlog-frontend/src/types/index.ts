// src/types/index.ts — Types TypeScript KAMLOG

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'dispatcher' | 'finance' | 'douane' | 'gate_agent';
  is_active: boolean;
  created_at: string;
}

export interface Tiers {
  id: number;
  code_tiers: string;
  raison_sociale: string;
  niu: string;
  rccm: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  pays: string;
  statut: 'ACTIF' | 'BLOQUE' | 'INACTIF';
  autorise_transport: boolean;
  autorise_transit: boolean;
  autorise_acconage: boolean;
  autorise_magasinage: boolean;
  compte_syscohada: string | null;
  limite_credit_xaf: number;
  created_at: string;
  updated_at: string;
}

export interface Camion {
  id: number;
  immatriculation: string;
  type_vehicule: 'BENNE_VRAC' | 'PORTE_CONTENEUR' | 'CITERNE' | 'FRIGORIFIQUE' | 'PLATEAU';
  marque: string;
  modele: string;
  charge_utile_kg: number;
  volume_reservoir_litres: number;
  conso_theorique_l_100: number;
  statut: string;
  actif: boolean;
  created_at: string;
}

export interface Chauffeur {
  id: number;
  nom: string;
  prenom: string;
  numero_permis: string;
  categorie_permis: string;
  telephone: string;
  actif: boolean;
  created_at: string;
}

export interface Mission {
  id: number;
  reference: string;
  tiers_id: number;
  camion_id: number;
  chauffeur_id: number;
  dossier_id: number | null;
  origine: string;
  destination: string;
  distance_km: number;
  type_marchandise: string;
  poids_kg: number | null;
  statut: 'PLANIFIE' | 'EN_CHARGEMENT' | 'EN_ROUTE' | 'EN_LIVRAISON' | 'LIVRE' | 'CLOTURE';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Facture {
  id: number;
  numero_facture: string;
  tiers_id: number;
  dossier_id: number | null;
  mission_id: number | null;
  montant_ht_xaf: number;
  tva_xaf: number;
  montant_ttc_xaf: number;
  date_emission: string;
  date_echeance: string | null;
  statut: 'BROUILLON' | 'EMISE' | 'PARTIELLEMENT_PAYEE' | 'PAYEE' | 'ANNULEE';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Encours {
  tiers_id: number;
  encours_xaf: number;
  limite_credit_xaf: number;
  taux_occupation: number | null;
  alerte: boolean;
  bloque: boolean;
}
