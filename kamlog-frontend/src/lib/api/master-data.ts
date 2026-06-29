import { apiClient } from '../api-client';

export interface Article {
  id: string;
  code: string;
  description: string;
  unit: string;
  materialGroup: string;
  weight: number;
  volume: number;
  materialType: string;
  storageConditions: string;
  taxClassification: string;
}

export interface Tier {
  id: string;
  type: 'client' | 'supplier' | 'partner';
  name: string;
  acronym: string;
  entityType: string;
  niu: string;
  rccm: string;
  address: string;
  poBox: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  paymentTerms: string;
  currency: string;
  creditLimit: number;
}

export interface ClientProfile {
  id: string;
  companyName: string;
  acronym: string;
  entityType: string;
  niu: string;
  rccm: string;
  address: string;
  poBox: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  paymentTerms: string;
  currency: string;
  creditLimit: number;
  keyContacts: Array<{ name: string; role: string; phone: string; email: string }>;
}

export interface Supplier {
  id: string;
  code_fournisseur: string;
  raison_sociale: string;
  acronyme: string;
  type_entite: string;
  niu: string;
  rccm: string;
  id_fiscal: string;
  adresse: string;
  boite_postale: string;
  ville: string;
  region: string;
  pays: string;
  telephone: string;
  email: string;
  conditions_paiement: string;
  devise: string;
  limite_credit_xaf: number;
  compte_bancaire: string;
  nom_banque: string;
  categorie: string;
  statut: string;
  est_actif: boolean;
  cree_par: string;
  date_creation: string;
  date_modification: string;
}

export const masterDataAPI = {
  getArticles: async (): Promise<Article[]> => {
    const { data } = await apiClient.get('/api/master-data/articles');
    return data;
  },

  getTiers: async (): Promise<Tier[]> => {
    const { data } = await apiClient.get('/api/master-data/tiers');
    return data;
  },

  getClientProfiles: async (): Promise<ClientProfile[]> => {
    const { data } = await apiClient.get('/api/master-data/client-profiles');
    return data;
  },

  getSuppliers: async (): Promise<Supplier[]> => {
    const { data } = await apiClient.get('/api/master-data/suppliers');
    return data;
  },

  createArticle: async (article: Omit<Article, 'id'>): Promise<Article> => {
    const { data } = await apiClient.post('/api/master-data/articles', article);
    return data;
  },

  createTier: async (tier: any): Promise<any> => {
    const { data } = await apiClient.post('/api/tiers/', tier);
    return data;
  },

  createClientProfile: async (profile: any): Promise<any> => {
    // Map ClientProfile to TiersCreate payload
    const payload = {
      code_tiers: `CLT-${Date.now().toString().slice(-6)}`,
      raison_sociale: profile.companyName,
      niu: profile.niu,
      rccm: profile.rccm,
      email: profile.email,
      telephone: profile.phone,
      adresse: profile.address,
      ville: profile.city,
      pays: 'Cameroun',
      autorise_transport: true,
      autorise_transit: true,
      autorise_acconage: true,
      autorise_magasinage: true,
      compte_syscohada: null,
      limite_credit_xaf: profile.creditLimit || 0
    };
    const { data } = await apiClient.post('/api/tiers/', payload);
    return data;
  },

  createSupplier: async (supplier: Omit<Supplier, 'id' | 'code_fournisseur' | 'cree_par' | 'date_creation' | 'date_modification'>): Promise<Supplier> => {
    const { data } = await apiClient.post('/api/master-data/suppliers', supplier);
    return data;
  }
};
