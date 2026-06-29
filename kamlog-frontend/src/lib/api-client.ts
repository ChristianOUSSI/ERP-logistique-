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
});

// Intercepteur REQUEST  injecte le JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur RESPONSE  refresh auto si 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
              refresh_token: refreshToken,
            });
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            original.headers.Authorization = `Bearer ${data.access_token}`;
            return apiClient(original);
          } catch {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Service Auth ─────────────────────────────────────────
export const authAPI = {
  login: (data: { username: string; password: string }) =>
    apiClient.post('/api/auth/login', data),
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
};

// ─── Service Finance ──────────────────────────────────────
export const financeAPI = {
  getFactures: (params?: Record<string, unknown>) =>
    apiClient.get('/api/finance/factures', { params }),
  createFacture: (data: unknown) =>
    apiClient.post('/api/finance/factures', data),
  getEncours: (tiersId: number) =>
    apiClient.get(`/api/finance/encours/${tiersId}`),
  enregistrerEncaissement: (data: unknown) =>
    apiClient.post('/api/finance/encaissements', data),
  getTarifs: (params?: Record<string, unknown>) =>
    apiClient.get('/api/finance/tarifs', { params }),
  createTarif: (data: unknown) =>
    apiClient.post('/api/finance/tarifs', data),
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
};

// ─── Service Magasin ──────────────────────────────────────
export const magasinAPI = {
  getMagasins: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/magasins', { params }),
  getStocks: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/stocks', { params }),
  getReceptions: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/receptions', { params }),
  getDeclarations: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/declarations', { params }),
  getCommandes: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/commandes', { params }),
};
