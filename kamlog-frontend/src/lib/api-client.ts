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
      if (typeof window !== 'undefined') {
        // Dispatch custom event for AuthProvider to handle clean logout
        window.dispatchEvent(new CustomEvent('auth-error', { detail: { reason: 'unauthorized' } }));
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
  getAuditLogs: (params?: Record<string, unknown>) => apiClient.get('/api/admin/audit-logs', { params }),
  getAgencies: (params?: Record<string, unknown>) => apiClient.get('/api/admin/agencies', { params }),
  createAgency: (data: unknown) => apiClient.post('/api/admin/agencies', data),
  updateAgency: (id: number, data: unknown) => apiClient.put(`/api/admin/agencies/${id}`, data),
  deleteAgency: (id: number) => apiClient.delete(`/api/admin/agencies/${id}`),
  getDashboardKpis: () => apiClient.get('/api/admin/dashboard/global-kpis'),
  getSystemHealth: () => apiClient.get('/api/admin/system-health'),
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
  getVehiclesHistory: (params?: Record<string, unknown>) =>
    apiClient.get('/api/transport/analytics/vehicles-history', { params }),
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
  dissocierRemorque: (camionId: number) =>
    apiClient.put(`/api/transport/camions/${camionId}/dissocier-remorque`),
  getHistoriqueCouplage: (camionId: number) =>
    apiClient.get(`/api/transport/camions/${camionId}/historique-couplage`),
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
  lettrerEncaissement: (encaissementId: number, factureId: number) =>
    apiClient.post(`/api/finance/encaissements/${encaissementId}/lettrer/${factureId}`),
  getKpis: () =>
    apiClient.get('/api/finance/kpis'),
  getAnalyticsChartData: () =>
    apiClient.get('/api/finance/analytics/chart-data'),
  getPayroll: () =>
    apiClient.get('/api/finance/payroll/drivers'),
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
  extractOCR: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/parc/ocr-extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getWorkshopRepairs: () =>
    apiClient.get('/api/parc/workshop'),
  createZone: (data: unknown) => apiClient.post('/api/parc/zones', data),
  updateZone: (id: number, data: unknown) => apiClient.put(`/api/parc/zones/${id}`, data),
  deleteZone: (id: number) => apiClient.delete(`/api/parc/zones/${id}`),
  createEmplacement: (data: unknown) => apiClient.post('/api/parc/emplacements', data),
  updateEmplacement: (id: number, data: unknown) => apiClient.put(`/api/parc/emplacements/${id}`, data),
  deleteEmplacement: (id: number) => apiClient.delete(`/api/parc/emplacements/${id}`),
  createWorkshopRepair: (data: unknown) => apiClient.post('/api/parc/workshop', data),
  getStocksActifs: () => apiClient.get('/api/parc/stock-actifs'),
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
  getTiers: (params?: Record<string, unknown>) =>
    apiClient.get('/api/tiers', { params }),
  getTier: (id: number) =>
    apiClient.get(`/api/tiers/${id}`),
  getArticleCategories: () =>
    apiClient.get('/api/master-data/article-categories'),
  getIncoterms: () =>
    apiClient.get('/api/master-data/incoterms'),
  getContainerTypes: () =>
    apiClient.get('/api/master-data/container-types'),
};

// ─── Service Magasin ────────────────────────────────────── // 📦 Service Magasin 🏭
export const magasinAPI = {
  generateStockValuationReport: (params: any) => apiClient.post('/api/magasin/reports/stock-valuation', params),
  generateMouvementAnalysisReport: (params: any) => apiClient.post('/api/magasin/reports/mouvement-analysis', params),
  generateClientPerformanceReport: (params: any) => apiClient.post('/api/magasin/reports/client-performance', params),
  exportReportToCSV: (data: any) => apiClient.post('/api/magasin/reports/export/csv', data),
  exportReportToJSON: (data: any) => apiClient.post('/api/magasin/reports/export/json', data),
  exportClientsToCSV: () => apiClient.get('/api/magasin/export/clients/csv'),
  exportArticlesToCSV: () => apiClient.get('/api/magasin/export/articles/csv'),
  importArticlesFromCSV: (data: any) => apiClient.post('/api/magasin/import/articles', data),
  importClientsFromCSV: (data: any) => apiClient.post('/api/magasin/import/clients', data),
  importMagasinsFromCSV: (data: any) => apiClient.post('/api/magasin/import/magasins', data),
  getArticles: (params?: any) => apiClient.get('/api/magasin/articles', { params }),
  exportMagasinsToCSV: () => apiClient.get('/api/magasin/export/magasins/csv'),
  deleteMagasin: (id: number) => apiClient.delete(`/api/magasin/magasins/${id}`),
  getMagasins: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/magasins', { params }),
  getStocks: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/stocks', { params }),
  getKpis: () =>
    apiClient.get('/api/magasin/kpis'),
  getClients: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/clients', { params }),
  createClient: (data: unknown) =>
    apiClient.post('/api/magasin/clients', data),
  updateClient: (id: number, data: unknown) =>
    apiClient.put(`/api/magasin/clients/${id}`, data),
  deleteClient: (id: number) =>
    apiClient.delete(`/api/magasin/clients/${id}`),
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
  getDeclaration: (id: number) =>
    apiClient.get(`/api/magasin/declarations/${id}`),
  getDeclarationReceptionsSummary: (id: number) =>
    apiClient.get(`/api/magasin/declarations/${id}/receptions-summary`),
  getDeclarationReceptionsHistory: (id: number) =>
    apiClient.get(`/api/magasin/declarations/${id}/receptions-history`),
  completeReception: (data: unknown) =>
    apiClient.post('/api/magasin/receptions', data),
  getCommandes: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/commandes', { params }),
  getHistory: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/history', { params }),
  // Ordres de Transfert
  getOrdresTransfert: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/ordres-transfert', { params }),
  getOrdreTransfert: (id: number) =>
    apiClient.get(`/api/magasin/ordres-transfert/${id}`),
  createOrdreTransfert: (data: unknown) =>
    apiClient.post('/api/magasin/ordres-transfert', data),
  validerOrdreTransfert: (id: number) =>
    apiClient.post(`/api/magasin/ordres-transfert/${id}/valider`),
  validerPaiementOT: (id: number) =>
    apiClient.post(`/api/magasin/ordres-transfert/${id}/valider-paiement`),
  expedierOrdreTransfert: (id: number) =>
    apiClient.post(`/api/magasin/ordres-transfert/${id}/expedier`),
  receptionnerOrdreTransfert: (id: number) =>
    apiClient.post(`/api/magasin/ordres-transfert/${id}/receptionner`),
  annulerOrdreTransfert: (id: number) =>
    apiClient.post(`/api/magasin/ordres-transfert/${id}/annuler`),
  getTransactions: () =>
    apiClient.get('/api/magasin/transactions'),
  getStockStatuses: () =>
    apiClient.get('/api/magasin/stock-statuses'),
  getArticleByCode: (code: string) =>
    apiClient.get(`/api/magasin/articles/by-code/${code}`),
  createDeclaration: (data: any) =>
    apiClient.post('/api/magasin/declarations', data),
  // New BandeLivraison endpoints
  getBandes: (params?: Record<string, unknown>) =>
    apiClient.get('/api/magasin/bandes-livraison', { params }),
  getBande: (id: number) =>
    apiClient.get(`/api/magasin/bandes-livraison/${id}`),
  createBande: async (data: any) => {
    const response = await apiClient.post('/api/magasin/bandes-livraison', data)
    return response.data
  },
  updateBande: (id: number, data: unknown) =>
    apiClient.put(`/api/magasin/bandes-livraison/${id}`, data),
  // Special endpoints
  createBandeFromOrdreTransfert: (otId: number, prepare_par: string) =>
    apiClient.post(`/api/magasin/bandes-livraison/from-ordre-transfert/${otId}`, { prepare_par }),
  getBandeByOrdreTransfert: (otId: number) =>
    apiClient.get(`/api/magasin/bandes-livraison/ordre-transfert/${otId}`),
  // Predictive endpoint
  getReceptionTimingPrediction: (declarationId: number) =>
    apiClient.get(`/api/magasin/predictions/reception-timing/${declarationId}`)
};

// ─── Advanced Analytics Endpoints ────────────────────────
export const analyticsAPI = {
  postDemandForecast: (data: {
    article_id: number;
    magasin_id?: number;
    horizon_days?: number;
  }) =>
    apiClient.post('/api/magasin/analytics/demand-forecast', data),
  postStockTurnoverAnalysis: (data: {
    article_id: number;
    months?: number;
  }) =>
    apiClient.post('/api/magasin/analytics/stock-turnover', data),
  postSafetyStockCalculation: (data: {
    article_id: number;
    magasin_id: number;
    service_level?: number;
    lead_time_days?: number;
  }) =>
    apiClient.post('/api/magasin/analytics/safety-stock', data),
  postAnomalyDetection: (data: {
    article_id: number;
    magasin_id: number;
    days?: number;
    sensitivity?: number;
  }) =>
    apiClient.post('/api/magasin/analytics/anomaly-detection', data)
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

// ─── Service Incidents (Ticketing) ────────────────────────
export const incidentsAPI = {
  getIncidents: () => apiClient.get('/api/incidents'),
  getClientIncidents: (tiersId: number) => apiClient.get(`/api/incidents/client/${tiersId}`),
  createIncident: (data: unknown) => apiClient.post('/api/incidents', data),
  updateIncident: (id: number, data: unknown) => apiClient.patch(`/api/incidents/${id}`, data),
};

// ─── Service Ressources Humaines (RH) ──────────────────────
export const rhAPI = {
  getEmployes: (params?: Record<string, unknown>) => apiClient.get('/api/rh/employes', { params }),
  createEmploye: (data: unknown) => apiClient.post('/api/rh/employes', data),
  getMyProfile: () => apiClient.get('/api/rh/employes/me'),
  getConges: (params?: Record<string, unknown>) => apiClient.get('/api/rh/conges', { params }),
  createConge: (data: unknown) => apiClient.post('/api/rh/conges', data),
  updateCongeStatut: (id: number, statut: string) => apiClient.patch(`/api/rh/conges/${id}/statut`, { statut }),
  getPaie: (params?: Record<string, unknown>) => apiClient.get('/api/rh/paie', { params }),
  createFichePaie: (data: unknown) => apiClient.post('/api/rh/paie', data),
};

// ─── Service Gateway ──────────────────────────────────────
export const gatewayAPI = {
  getPasserellesEnAttente: () => apiClient.get('/api/passerelles/en-attente').then(r => r.data),
  getPasserelles: () => apiClient.get('/api/passerelles').then(r => r.data),
};

export const aiAPI = {
  sendMessage: (message: string) => apiClient.post('/api/ai/chat', { message })
};

export const supportAPI = {
  getTickets: () => apiClient.get('/api/support/tickets')
};

export default apiClient;
