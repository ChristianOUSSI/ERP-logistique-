// API Service for Magasin Module

export interface StockItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  category: string;
  minStock: number;
  maxStock: number;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  date: string;
  reason: string;
  userId: string;
}

export interface Reception {
  id: string;
  reference: string;
  supplier: string;
  date: string;
  status: 'pending' | 'received' | 'validated';
  items: Array<{ itemId: string; quantity: number; unitPrice: number }>;
}

export interface RemovalSlip {
  id: string;
  numero_bon: string;
  magasin_source: string;
  magasin_destination: string;
  article_id: string;
  quantite: number;
  unite: string;
  declaration_douaniere: string;
  motif: string;
  observations: string;
  statut: string;
  autorise_par: string;
  date_autorisation: string;
  date_bon: string;
  cree_par: string;
  date_creation: string;
  date_modification: string;
}

export interface ReceptionMag3 {
  id: string;
  numero_reception: string;
  removal_slip_id: string;
  magasin_source: string;
  magasin_destination: string;
  article_id: string;
  quantite_attendue: number;
  quantite_recue: number;
  unite: string;
  declaration_douaniere: string;
  recu_par: string;
  date_reception: string;
  observations: string;
  statut: string;
  cree_par: string;
  date_creation: string;
  date_modification: string;
}

class MagasinAPI {
  private baseUrl = '/api/magasin';

  async getStockItems(): Promise<StockItem[]> {
    const response = await fetch(`${this.baseUrl}/stock-items`);
    if (!response.ok) throw new Error('Failed to fetch stock items');
    return response.json();
  }

  async getStockMovements(): Promise<StockMovement[]> {
    const response = await fetch(`${this.baseUrl}/stock-movements`);
    if (!response.ok) throw new Error('Failed to fetch stock movements');
    return response.json();
  }

  async getReceptions(): Promise<Reception[]> {
    const response = await fetch(`${this.baseUrl}/receptions`);
    if (!response.ok) throw new Error('Failed to fetch receptions');
    return response.json();
  }

  async getRemovalSlips(): Promise<RemovalSlip[]> {
    const response = await fetch(`${this.baseUrl}/removal-slips`);
    if (!response.ok) throw new Error('Failed to fetch removal slips');
    return response.json();
  }

  async getReceptionsMag3(): Promise<ReceptionMag3[]> {
    const response = await fetch(`${this.baseUrl}/receptions-mag3`);
    if (!response.ok) throw new Error('Failed to fetch receptions mag3');
    return response.json();
  }

  async createStockMovement(movement: Omit<StockMovement, 'id'>): Promise<StockMovement> {
    const response = await fetch(`${this.baseUrl}/stock-movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movement),
    });
    if (!response.ok) throw new Error('Failed to create stock movement');
    return response.json();
  }

  async createReception(reception: Omit<Reception, 'id'>): Promise<Reception> {
    const response = await fetch(`${this.baseUrl}/receptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reception),
    });
    if (!response.ok) throw new Error('Failed to create reception');
    return response.json();
  }

  async createRemovalSlip(slip: Omit<RemovalSlip, 'id' | 'numero_bon' | 'cree_par' | 'date_creation' | 'date_modification'>): Promise<RemovalSlip> {
    const response = await fetch(`${this.baseUrl}/removal-slips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slip),
    });
    if (!response.ok) throw new Error('Failed to create removal slip');
    return response.json();
  }

  async createReceptionMag3(reception: Omit<ReceptionMag3, 'id' | 'numero_reception' | 'cree_par' | 'date_creation' | 'date_modification'>): Promise<ReceptionMag3> {
    const response = await fetch(`${this.baseUrl}/receptions-mag3`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reception),
    });
    if (!response.ok) throw new Error('Failed to create reception mag3');
    return response.json();
  }
}

export const magasinAPI = new MagasinAPI();
