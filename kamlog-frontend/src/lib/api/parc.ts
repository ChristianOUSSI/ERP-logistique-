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

export interface WorkOrder {
  id: string;
  vehicleId: string;
  description: string;
  parts: Array<{ code: string; quantity: number; price: number }>;
  laborCost: number;
  totalCost: number;
  status: 'draft' | 'submitted' | 'approved' | 'completed';
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
}

export const parcAPI = new ParcAPI();
