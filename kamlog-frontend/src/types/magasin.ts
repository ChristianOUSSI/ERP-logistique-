// src/types/magasin.ts - Types TypeScript pour le module K-magasin

export enum UniteMesure {
  UDB = "UDB",
  KG = "KG",
  TONNE = "TONNE",
  M3 = "M3",
  M2 = "M2",
  UNITE = "UNITE"
}

export enum StatutDeclaration {
  BROUILLON = "BROUILLON",
  VALIDEE = "VALIDEE",
  ANNULEE = "ANNULEE"
}

export enum StatutReception {
  EN_COURS = "EN_COURS",
  COMPLETEE = "COMPLETEE",
  ANNULEE = "ANNULEE"
}

export enum StatutCommande {
  EN_ATTENTE = "EN_ATTENTE",
  VERROUILLEE = "VERROUILLEE",
  PAYEE = "PAYEE",
  EN_PREPARATION = "EN_PREPARATION",
  PRETE = "PRETE",
  LIVREE = "LIVREE",
  ANNULEE = "ANNULEE"
}

// ============ MAGASIN ============
export interface Magasin {
  id: number;
  code: string;
  nom: string;
  adresse?: string;
  ville?: string;
  pays: string;
  telephone?: string;
  email?: string;
  est_actif: boolean;
  date_creation: string;
  date_modification?: string;
}

export interface MagasinCreate {
  code: string;
  nom: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  est_actif?: boolean;
}

export interface MagasinUpdate {
  nom?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  est_actif?: boolean;
}

// ============ CLIENT MAGASIN ============
export interface ClientMagasin {
  id: number;
  code: string;
  nom: string;
  prenom?: string;
  raison_sociale?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  ville?: string;
  pays: string;
  numero_contribuable?: string;
  est_actif: boolean;
  date_creation: string;
  date_modification?: string;
}

export interface ClientMagasinCreate {
  code: string;
  nom: string;
  prenom?: string;
  raison_sociale?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  numero_contribuable?: string;
  est_actif?: boolean;
}

export interface ClientMagasinUpdate {
  nom?: string;
  prenom?: string;
  raison_sociale?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  numero_contribuable?: string;
  est_actif?: boolean;
}

// ============ ARTICLE ============
export interface Article {
  id: number;
  code_article: string;
  nom: string;
  description?: string;
  unite_mesure: UniteMesure;
  poids_unitaire?: number;
  volume_unitaire?: number;
  est_actif: boolean;
  date_creation: string;
  date_modification?: string;
}

export interface ArticleCreate {
  code_article?: string;
  nom: string;
  description?: string;
  unite_mesure?: UniteMesure;
  poids_unitaire?: number;
  volume_unitaire?: number;
  est_actif?: boolean;
}

export interface ArticleUpdate {
  nom?: string;
  description?: string;
  unite_mesure?: UniteMesure;
  poids_unitaire?: number;
  volume_unitaire?: number;
  est_actif?: boolean;
}

// ============ LIGNE DECLARATION ============
export interface LigneDeclaration {
  id: number;
  declaration_id: number;
  article_id: number;
  quantite_declaree: number;
  unite_mesure: UniteMesure;
  quantite_udb?: number;
  article?: Article;
}

export interface LigneDeclarationCreate {
  article_id: number;
  quantite_declaree: number;
  unite_mesure: UniteMesure;
  quantite_udb?: number;
}

// ============ DECLARATION ============
export interface Declaration {
  id: number;
  numero_bl: string;
  client_id: number;
  date_declaration: string;
  date_arrivee_prevue?: string;
  statut: StatutDeclaration;
  notes?: string;
  cree_par?: string;
  date_creation: string;
  date_modification?: string;
  client?: ClientMagasin;
  lignes: LigneDeclaration[];
}

export interface DeclarationCreate {
  client_id: number;
  date_arrivee_prevue?: string;
  statut?: StatutDeclaration;
  notes?: string;
  lignes: LigneDeclarationCreate[];
}

export interface DeclarationUpdate {
  date_arrivee_prevue?: string;
  statut?: StatutDeclaration;
  notes?: string;
}

// ============ LIGNE RECEPTION ============
export interface LigneReception {
  id: number;
  reception_id: number;
  article_id: number;
  quantite_recue: number;
  unite_mesure: UniteMesure;
  quantite_udb?: number;
  article?: Article;
}

export interface LigneReceptionCreate {
  article_id: number;
  quantite_recue: number;
  unite_mesure: UniteMesure;
  quantite_udb?: number;
}

// ============ RECEPTION ============
export interface Reception {
  id: number;
  numero_reception: string;
  declaration_id: number;
  magasin_id: number;
  date_reception: string;
  statut: StatutReception;
  notes?: string;
  recu_par?: string;
  date_creation: string;
  date_modification?: string;
  declaration?: Declaration;
  magasin?: Magasin;
  lignes: LigneReception[];
}

export interface ReceptionCreate {
  declaration_id: number;
  magasin_id: number;
  statut?: StatutReception;
  notes?: string;
  lignes: LigneReceptionCreate[];
}

export interface ReceptionUpdate {
  statut?: StatutReception;
  notes?: string;
}

// ============ STOCK ============
export interface Stock {
  id: number;
  magasin_id: number;
  article_id: number;
  quantite_disponible: number;
  quantite_udb: number;
  derniere_maj?: string;
  date_creation: string;
  magasin?: Magasin;
  article?: Article;
}

export interface StockCreate {
  magasin_id: number;
  article_id: number;
  quantite_disponible?: number;
  quantite_udb?: number;
}

export interface StockUpdate {
  quantite_disponible?: number;
  quantite_udb?: number;
}

export interface StockFilter {
  code_article?: string;
  nom_article?: string;
  magasin_id?: number;
  client_id?: number;
  date_debut?: string;
  date_fin?: string;
}

// ============ LIGNE COMMANDE ============
export interface LigneCommande {
  id: number;
  commande_id: number;
  article_id: number;
  quantite_demandee: number;
  quantite_livree: number;
  unite_mesure: UniteMesure;
  prix_unitaire?: number;
  article?: Article;
}

export interface LigneCommandeCreate {
  article_id: number;
  quantite_demandee: number;
  quantite_livree?: number;
  unite_mesure: UniteMesure;
  prix_unitaire?: number;
}

// ============ COMMANDE ============
export interface Commande {
  id: number;
  numero_commande: string;
  client_id: number;
  date_commande: string;
  date_livraison_souhaitee?: string;
  statut: StatutCommande;
  est_verrouille: boolean;
  paiement_valide: boolean;
  notes?: string;
  valide_par?: string;
  date_validation?: string;
  cree_par?: string;
  date_creation: string;
  date_modification?: string;
  client?: ClientMagasin;
  lignes: LigneCommande[];
}

export interface CommandeCreate {
  client_id: number;
  date_livraison_souhaitee?: string;
  statut?: StatutCommande;
  est_verrouille?: boolean;
  paiement_valide?: boolean;
  notes?: string;
  lignes: LigneCommandeCreate[];
}

export interface CommandeUpdate {
  date_livraison_souhaitee?: string;
  statut?: StatutCommande;
  est_verrouille?: boolean;
  paiement_valide?: boolean;
  notes?: string;
}

// ============ LIGNE BANDE LIVRAISON ============
export interface LigneBandeLivraison {
  id: number;
  bande_id: number;
  article_id: number;
  quantite: number;
  unite_mesure: UniteMesure;
}

export interface LigneBandeLivraisonCreate {
  article_id: number;
  quantite: number;
  unite_mesure: UniteMesure;
}

// ============ BANDE LIVRAISON ============
export interface BandeLivraison {
  id: number;
  numero_bande: string;
  commande_id: number;
  magasin_id: number;
  date_creation: string;
  date_livraison?: string;
  statut: string;
  nombre_camions: number;
  notes?: string;
  prepare_par?: string;
  commande?: Commande;
  lignes: LigneBandeLivraison[];
}

export interface BandeLivraisonCreate {
  commande_id: number;
  magasin_id: number;
  date_livraison?: string;
  statut?: string;
  nombre_camions?: number;
  notes?: string;
  lignes: LigneBandeLivraisonCreate[];
}

export interface BandeLivraisonUpdate {
  date_livraison?: string;
  statut?: string;
  nombre_camions?: number;
  notes?: string;
}
