// src/lib/api-client.ts  Client API TypeScript KAMLOG
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

let BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-83b1.up.railway.app';
if (process.env.NODE_ENV === 'production' && BASE_URL.includes('localhost')) {
  BASE_URL = 'https://backend-production-83b1.up.railway.app';
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

// Token storage: set by AuthProvider after login
let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

// Intercepteur REQUEST - inject Bearer token from NextAuth session
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (_authToken && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${_authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur RESPONSE
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


// ─── Service Admin ────────────────────────────────────────
export const adminAPI = {
  getUsers: () => apiClient.get('/api/admin/users'),
  createUser: (data: any) => apiClient.post('/api/admin/users', data),
  getRoles: () => apiClient.get('/api/admin/roles'),
  createRole: (data: any) => apiClient.post('/api/admin/roles', data),
  getAuditLogs: () => apiClient.get('/api/admin/audit-logs'),
  getAgencies: (params?: Record<string, unknown>) => apiClient.get('/api/admin/agencies', { params }),
  createAgency: (data: unknown) => apiClient.post('/api/admin/agencies', data),
  updateAgency: (id: number, data: unknown) => apiClient.put(`/api/admin/agencies/${id}`, data),
  deleteAgency: (id: number) => apiClient.delete(`/api/admin/agencies/${id}`),
};

// ─── Service Auth ─────────────────────────────────────────
export const authAPI = {
  login: (data: { username: string; password: string }) =>
    apiClient.post('/api/auth/login', data),
  logout: () => apiClient.post('/api/auth/logout'),
  register: (data: unknown) =>
    apiClient.post('/api/auth/register', data),
  getMe: () =>
    apiClient.get('/api/auth/me'),
};

// ─── Service Transport ────────────────────────────────────
export const transportAPI = {
  getMissions: (params?: Record<string, unknown>) =>
    apiClient.get('/api/transport/missions', { params }),
  getMission: (id: number) =>
    apiClient.get(`/api/transport/missions/${id}`),
  createMission: (data: unknown) =>
    apiClient.post('/api/transport/missions', data),
  updateStatut: (id: number, statut: string) =>
    apiClient.patch(`/api/transport/missions/${id}/statut`, { statut }),
  demarrerMission: (id: number) =>
    apiClient.post(`/api/transport/missions/${id}/demarrer`),
  livrerMission: (id: number, data: { signature: string; nom_receptionnaire: string }) =>
    apiClient.post(`/api/transport/missions/${id}/livrer`, data),
  getCamions: (params?: Record<string, unknown>) =>
    apiClient.get('/api/transport/camions', { params }),
  createCamion: (data: unknown) =>
    apiClient.post('/api/transport/camions', data),
  getChauffeurs: (params?: Record<string, unknown>) =>
    apiClient.get('/api/transport/chauffeurs', { params }),
  createChauffeur: (data: unknown) =>
    apiClient.post('/api/transport/chauffeurs', data),
  genererBL: (missionId: number) =>
    apiClient.post(`/api/documents/bl`, { mission_id: missionId }),
  getFuel: () =>
    apiClient.get('/api/transport/fuel'),
  getKPIs: () =>
    apiClient.get('/api/transport/kpis'),
  getKpis: () =>
    apiClient.get('/api/transport/kpis'),
  getGPS: () =>
    apiClient.get('/api/transport/gps'),
  getPannes: (camionId: number) =>
    apiClient.get(`/api/transport/camions/${camionId}/pannes`),
  updatePanne: (camionId: number, panneId: number, data: unknown) =>
    apiClient.put(`/api/transport/camions/${camionId}/pannes/${panneId}`, data),
  debloquerCamion: (camionId: number) =>
    apiClient.put(`/api/transport/camions/${camionId}/debloquer`),
  associerRemorque: (camionId: number, remorqueId: number | null) =>
    apiClient.put(`/api/transport/camions/${camionId}/associer-remorque?remorque_id=${remorqueId || ''}`),
};

// ─── Service Finance ──────────────────────────────────────
export const financeAPI = {
  getFactures: (params?: Record<string, unknown>) =>
    apiClient.get('/api/finance/factures', { params }),
  createFacture: (data: unknown) =>
    apiClient.post('/api/finance/factures', data),
  getEncaissements: (params?: Record<string, unknown>) =>
    apiClient.get('/api/finance/encaissements', { params }),
  getEncours: (tiersId: number) =>
    apiClient.get(`/api/finance/encours/${tiersId}`),
  enregistrerEncaissement: (data: unknown) =>
    apiClient.post('/api/finance/encaissements', data),
  getTarifs: (params?: Record<string, unknown>) =>
    apiClient.get('/api/finance/tarifs', { params }),
  createTarif: (data: unknown) =>
    apiClient.post('/api/finance/tarifs', data),
  getKpis: () =>
    apiClient.get('/api/finance/kpis'),
};

// ─── Service Purchases (K-Achats) ─────────────────────────
export const purchaseAPI = {
  getRequisitions: (params?: Record<string, unknown>) =>
    apiClient.get('/api/purchase/requisitions/', { params }),
  createRequisition: (data: unknown) =>
    apiClient.post('/api/purchase/requisitions/', data),
  getRequisition: (id: number) =>
    apiClient.get(`/api/purchase/requisitions/${id}`),
  updateRequisition: (id: number, data: unknown) =>
    apiClient.put(`/api/purchase/requisitions/${id}`, data),
  deleteRequisition: (id: number) =>
    apiClient.delete(`/api/purchase/requisitions/${id}`),
  submitRequisition: (id: number) =>
    apiClient.post(`/api/purchase/requisitions/${id}/submit`),
  approveRequisition: (id: number, notes?: string) =>
    apiClient.post(`/api/purchase/requisitions/${id}/approve`, { notes_approbation: notes }),
  rejectRequisition: (id: number, notes?: string) =>
    apiClient.post(`/api/purchase/requisitions/${id}/reject`, { notes_approbation: notes }),
};


// ─── Service Parc ─────────────────────────────────────────
export const parcAPI = {
  getZones: (params?: Record<string, unknown>) =>
    apiClient.get('/api/parc/zones', { params }),
  getEmplacements: (params?: Record<string, unknown>) =>
    apiClient.get('/api/parc/emplacements', { params }),
  getStock: (params?: Record<string, unknown>) =>
    apiClient.get('/api/parc/stock', { params }),
  gateIn: (data: unknown) => apiClient.post('/api/parc/gate-in', data),
  gateOut: (data: unknown) => apiClient.post('/api/parc/gate-out', data),
  getWorkshopRepairs: () =>
    apiClient.get('/api/parc/workshop'),
};

// ─── Service Tiers ────────────────────────────────────────
export const tiersAPI = {
  getTiers: (params?: Record<string, unknown>) =>
    apiClient.get('/api/tiers', { params }),
  getTiersById: (id: number) =>
    apiClient.get(`/api/tiers/${id}`),
  createTiers: (data: unknown) =>
    apiClient.post('/api/tiers', data),
  updateTiers: (id: number, data: unknown) =>
    apiClient.put(`/api/tiers/${id}`, data),
  deleteTiers: (id: number) =>
    apiClient.delete(`/api/tiers/${id}`),
};

// ─── Service Suppliers (Fournisseurs) ─────────────────────
export const suppliersAPI = {
  getSuppliers: (params?: Record<string, unknown>) =>
    apiClient.get('/api/suppliers', { params }),
  getSupplier: (id: number) =>
    apiClient.get(`/api/suppliers/${id}`),
  createSupplier: (data: unknown) =>
    apiClient.post('/api/suppliers', data),
  updateSupplier: (id: number, data: unknown) =>
    apiClient.put(`/api/suppliers/${id}`, data),
};

// ─── Service Master Data ──────────────────────────────────
export const masterDataAPI = {
  getArticles: (params?: Record<string, unknown>) =>
    apiClient.get('/api/master-data/articles', { params }),
  getArticle: (id: number) =>
    apiClient.get(`/api/master-data/articles/${id}`),
  createArticle: (data: unknown) =>
    apiClient.post('/api/master-data/articles', data),
  updateArticle: (id: number, data: unknown) =>
    apiClient.put(`/api/master-data/articles/${id}`, data),
  deleteArticle: (id: number) =>
    apiClient.delete(`/api/master-data/articles/${id}`),
};

// ─── Service Magasin ────────────────────────────────────── // 📦 Service Magasin 🏭
export const magasinAPI = {
  getMagasins: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/magasins', { params }),
  getStocks: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/stocks', { params }),
  getKpis: () =>
    apiClient.get('/api/magasin/kpis'),
  getReceptions: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/receptions', { params }),
  createReception: async (data: any) => {
    const response = await apiClient.post('/api/magasin/receptions', data)
    return response.data
  },
  createRemovalSlip: async (data: any) => {
    const response = await apiClient.post('/api/magasin/removal-slips', data)
    return response.data
  },
  createReceptionMag3: (data: unknown) =>
    apiClient.post('/api/magasin/receptions-mag3', data),
  getDeclarations: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/declarations', { params }),
  getDeclarationReceptionsSummary: (id: number) =>
    apiClient.get(`/api/magasin/declarations/${id}/receptions-summary`),
  completeReception: (data: unknown) =>
    apiClient.post('/api/magasin/receptions', data),
  getCommandes: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/commandes', { params }),
  getHistory: async (params?: Record<string, unknown>) => {
    try {
      const response = await apiClient.get('/api/magasin/history', { params })
      return response.data
    } catch {
      return [] // Fallback since history endpoint might not exist yet
    }
  }
};

// ─── Service Notifications ───────────────────────────────
export const notificationsAPI = {
  getMyNotifications: (params?: Record<string, unknown>) =>
    apiClient.get('/api/notifications/', { params }),
  getStats: () =>
    apiClient.get('/api/notifications/stats'),
  markAsRead: (id: number) =>
    apiClient.put(`/api/notifications/${id}/mark-read`),
  markAllAsRead: () =>
    apiClient.put('/api/notifications/mark-all-read'),
  deleteRead: () =>
    apiClient.delete('/api/notifications/read'),
};
