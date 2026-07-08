// API Service for Parc Module

export interface Vehicle {
  id: string;
  plaque: string;
  type: 'camion' | 'remorque' | 'engin';
  chassis: string;
  chauffeur: string;
  pole: string;
  status: 'active' | 'maintenance' | 'inactive';
  fuelLevel: number;
  odometer: number;
  lastMaintenance: string;
}

export interface MaintenanceOrder {
  id: string;
  vehicleId: string;
  type: 'preventive' | 'corrective';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface WorkshopRepair {
  id: number;
  reference: string;
  camion_id: number;
  type_intervention: string;
  description: string;
  statut: string;
  cout_estime: number | null;
  date_entree: string;
  date_sortie_prevue: string | null;
  mecanicien_en_charge: string | null;
}

export interface WorkOrder {
  id: string;
  vehicleId: string;
  description: string;
  parts: Array<{ code: string; quantity: number; price: number }>;
  laborCost: number;
  totalCost: number;
  status: 'draft' | 'submitted' | 'approved' | 'completed';
}

export interface EmplacementParc {
  id: number;
  code_emplacement: string;
  type_emplacement: string;
  statut: string;
  coordonnee_x: number;
  coordonnee_y: number;
}

export interface StockPhysiqueParc {
  id: number;
  numero_conteneur: string;
  type_conteneur: string;
  poids_kg: number;
  date_entree: string;
  statut: string;
  emplacement_id: number;
}

class ParcAPI {
  private baseUrl = '/api/parc';

  async getVehicles(): Promise<Vehicle[]> {
    const response = await fetch(`${this.baseUrl}/vehicles`);
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    return response.json();
  }

  async getMaintenanceOrders(): Promise<MaintenanceOrder[]> {
    const response = await fetch(`${this.baseUrl}/maintenance-orders`);
    if (!response.ok) throw new Error('Failed to fetch maintenance orders');
    return response.json();
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    const response = await fetch(`${this.baseUrl}/work-orders`);
    if (!response.ok) throw new Error('Failed to fetch work orders');
    return response.json();
  }

  async createVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const response = await fetch(`${this.baseUrl}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) throw new Error('Failed to create vehicle');
    return response.json();
  }

  async createMaintenanceOrder(order: Omit<MaintenanceOrder, 'id' | 'createdAt'>): Promise<MaintenanceOrder> {
    const response = await fetch(`${this.baseUrl}/maintenance-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create maintenance order');
    return response.json();
  }

  async createWorkOrder(order: Omit<WorkOrder, 'id'>): Promise<WorkOrder> {
    const response = await fetch(`${this.baseUrl}/work-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create work order');
    return response.json();
  }

  async getEmplacements(): Promise<EmplacementParc[]> {
    const response = await fetch(`${this.baseUrl}/emplacements`);
    if (!response.ok) throw new Error('Failed to fetch emplacements');
    return response.json();
  }

  async getStocksActifs(): Promise<StockPhysiqueParc[]> {
    const response = await fetch(`${this.baseUrl}/stock/actifs`);
    if (!response.ok) throw new Error('Failed to fetch active stock');
    return response.json();
  }

  async gateIn(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/gate-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to process Gate In');
    }
    return response.json();
  }

  async gateOut(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/gate-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to process Gate Out');
    }
    return response.json();
  }

  async getWorkshopRepairs(): Promise<WorkshopRepair[]> {
    const response = await fetch(`${this.baseUrl}/workshop`);
    if (!response.ok) throw new Error('Failed to fetch workshop repairs');
    return response.json();
  }

  async createWorkshopRepair(repair: Omit<WorkshopRepair, 'id'>): Promise<WorkshopRepair> {
    const response = await fetch(`${this.baseUrl}/workshop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(repair),
    });
    if (!response.ok) throw new Error('Failed to create workshop repair');
    return response.json();
  }
}

export const parcAPI = new ParcAPI();
