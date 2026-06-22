// API Service for Dashboard Module

export interface KPICard {
  id: string;
  title: string;
  value: number | string;
  trend: number;
  trendDirection: 'up' | 'down';
  icon: string;
  color: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  module: string;
}

export interface Operation {
  id: string;
  type: string;
  reference: string;
  module: string;
  user: string;
  timestamp: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface DashboardData {
  kpis: KPICard[];
  alerts: Alert[];
  operations: Operation[];
  systemHealth: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

class DashboardAPI {
  private baseUrl = '/api/dashboard';

  async getDashboardData(): Promise<DashboardData> {
    const response = await fetch(`${this.baseUrl}`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
  }

  async getKPIs(): Promise<KPICard[]> {
    const response = await fetch(`${this.baseUrl}/kpis`);
    if (!response.ok) throw new Error('Failed to fetch KPIs');
    return response.json();
  }

  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${this.baseUrl}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  }

  async getOperations(): Promise<Operation[]> {
    const response = await fetch(`${this.baseUrl}/operations`);
    if (!response.ok) throw new Error('Failed to fetch operations');
    return response.json();
  }

  async dismissAlert(alertId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/alerts/${alertId}/dismiss`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to dismiss alert');
  }
}

export const dashboardAPI = new DashboardAPI();
