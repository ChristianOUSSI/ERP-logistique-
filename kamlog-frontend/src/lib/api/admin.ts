// API Service for Admin Module

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'locked';
  mfaEnabled: boolean;
  lastLogin: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    read: boolean;
    create: boolean;
    modify: boolean;
    delete: boolean;
    approve: boolean;
  };
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  event: string;
  admin: string;
  target: string;
  details: string;
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  dbConnectionPool: number;
  activeConnections: number;
}

class AdminAPI {
  private baseUrl = '/api/admin';

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${this.baseUrl}/roles`);
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    const response = await fetch(`${this.baseUrl}/audit-logs`);
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return response.json();
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(`${this.baseUrl}/system-health`);
    if (!response.ok) throw new Error('Failed to fetch system health');
    return response.json();
  }

  async createUser(user: Omit<User, 'id' | 'lastLogin'>): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  }

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const response = await fetch(`${this.baseUrl}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error('Failed to create role');
    return response.json();
  }
}

export const adminAPI = new AdminAPI();
