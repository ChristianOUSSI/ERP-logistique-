// API Service for Transport Module

export interface Mission {
  id: string;
  reference: string;
  origin: string;
  destination: string;
  merchandise: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface FuelTicket {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  volume: number;
  unitPrice: number;
  total: number;
  fuelType: 'diesel' | 'essence';
}

export interface Container {
  id: string;
  number: string;
  blNumber: string;
  type: string;
  status: 'pending' | 'loaded' | 'unloaded';
  vgm: number;
}

export interface GoodsDeclaration {
  id: string;
  numero_declaration: string;
  code_article: string;
  code_transit: string;
  description: string;
  quantite: number;
  unite: string;
  poids_kg: number;
  valeur_xaf: number;
  origine: string;
  destination: string;
  numero_conteneur: string;
  observations: string;
  statut: string;
  cree_par: string;
  date_creation: string;
  date_modification: string;
}

class TransportAPI {
  private baseUrl = '/api/transport';

  async getMissions(): Promise<Mission[]> {
    // Dynamic data fetching - will be connected to backend
    const response = await fetch(`${this.baseUrl}/missions`);
    if (!response.ok) throw new Error('Failed to fetch missions');
    return response.json();
  }

  async getFuelTickets(): Promise<FuelTicket[]> {
    // Dynamic data fetching - will be connected to backend
    const response = await fetch(`${this.baseUrl}/fuel-tickets`);
    if (!response.ok) throw new Error('Failed to fetch fuel tickets');
    return response.json();
  }

  async getContainers(): Promise<Container[]> {
    // Dynamic data fetching - will be connected to backend
    const response = await fetch(`${this.baseUrl}/containers`);
    if (!response.ok) throw new Error('Failed to fetch containers');
    return response.json();
  }

  async getGoodsDeclarations(): Promise<GoodsDeclaration[]> {
    // Dynamic data fetching - will be connected to backend
    const response = await fetch(`${this.baseUrl}/goods-declarations`);
    if (!response.ok) throw new Error('Failed to fetch goods declarations');
    return response.json();
  }

  async createMission(mission: Omit<Mission, 'id' | 'createdAt'>): Promise<Mission> {
    const response = await fetch(`${this.baseUrl}/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mission),
    });
    if (!response.ok) throw new Error('Failed to create mission');
    return response.json();
  }

  async createFuelTicket(ticket: Omit<FuelTicket, 'id'>): Promise<FuelTicket> {
    const response = await fetch(`${this.baseUrl}/fuel-tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    if (!response.ok) throw new Error('Failed to create fuel ticket');
    return response.json();
  }

  async createContainer(container: Omit<Container, 'id'>): Promise<Container> {
    const response = await fetch(`${this.baseUrl}/containers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(container),
    });
    if (!response.ok) throw new Error('Failed to create container');
    return response.json();
  }

  async createGoodsDeclaration(declaration: Omit<GoodsDeclaration, 'id' | 'numero_declaration' | 'cree_par' | 'date_creation' | 'date_modification'>): Promise<GoodsDeclaration> {
    const response = await fetch(`${this.baseUrl}/goods-declarations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(declaration),
    });
    if (!response.ok) throw new Error('Failed to create goods declaration');
    return response.json();
  }
}

export const transportAPI = new TransportAPI();
