import { apiClient } from '../api-client';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  mfa_enabled: boolean;
}

export interface Permission {
  code: string;
  name: string;
  module: string;
}

export interface DbRole {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  permissions: Permission[];
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

export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get('/api/admin/users');
    return data;
  },

  getRoles: async (): Promise<Role[]> => {
    const { data } = await apiClient.get('/api/admin/roles');
    return data;
  },

  getPermissions: async (): Promise<Permission[]> => {
    const { data } = await apiClient.get('/api/admin/permissions');
    return data;
  },

  getDbRoles: async (): Promise<DbRole[]> => {
    const { data } = await apiClient.get('/api/admin/roles');
    return data;
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const { data } = await apiClient.get('/api/admin/audit-logs');
    return data;
  },

  getSystemHealth: async (): Promise<SystemHealth> => {
    const { data } = await apiClient.get('/api/admin/system-health');
    return data;
  },

  createUser: async (user: { username: string; email: string; password: string; full_name: string; role: string; agency_id: number }): Promise<User> => {
    const { data } = await apiClient.post('/api/admin/users', user);
    return data;
  },

  createRole: async (role: Omit<Role, 'id'>): Promise<Role> => {
    const { data } = await apiClient.post('/api/admin/roles', role);
    return data;
  },

  createDbRole: async (role: { code: string; name: string; description?: string; permission_codes: string[] }): Promise<DbRole> => {
    const { data } = await apiClient.post('/api/admin/roles', role);
    return data;
  },

  updateDbRole: async (code: string, role: { name: string; description?: string; permission_codes: string[] }): Promise<DbRole> => {
    const { data } = await apiClient.put(`/api/admin/roles/${code}`, role);
    return data;
  },

  updateUserRole: async (userId: number, role: string): Promise<User> => {
    const { data } = await apiClient.put(`/api/admin/users/${userId}/role`, { role });
    return data;
  }
};
