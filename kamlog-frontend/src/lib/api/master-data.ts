// API Service for Master Data Module

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

class MasterDataAPI {
  private baseUrl = '/api/master-data';

  async getArticles(): Promise<Article[]> {
    const response = await fetch(`${this.baseUrl}/articles`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  }

  async getTiers(): Promise<Tier[]> {
    const response = await fetch(`${this.baseUrl}/tiers`);
    if (!response.ok) throw new Error('Failed to fetch tiers');
    return response.json();
  }

  async getClientProfiles(): Promise<ClientProfile[]> {
    const response = await fetch(`${this.baseUrl}/client-profiles`);
    if (!response.ok) throw new Error('Failed to fetch client profiles');
    return response.json();
  }

  async getSuppliers(): Promise<Supplier[]> {
    const response = await fetch(`${this.baseUrl}/suppliers`);
    if (!response.ok) throw new Error('Failed to fetch suppliers');
    return response.json();
  }

  async createArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const response = await fetch(`${this.baseUrl}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  }

  async createTier(tier: Omit<Tier, 'id'>): Promise<Tier> {
    const response = await fetch(`${this.baseUrl}/tiers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tier),
    });
    if (!response.ok) throw new Error('Failed to create tier');
    return response.json();
  }

  async createClientProfile(profile: Omit<ClientProfile, 'id'>): Promise<ClientProfile> {
    const response = await fetch(`${this.baseUrl}/client-profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to create client profile');
    return response.json();
  }

  async createSupplier(supplier: Omit<Supplier, 'id' | 'code_fournisseur' | 'cree_par' | 'date_creation' | 'date_modification'>): Promise<Supplier> {
    const response = await fetch(`${this.baseUrl}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier),
    });
    if (!response.ok) throw new Error('Failed to create supplier');
    return response.json();
  }
}

export const masterDataAPI = new MasterDataAPI();
