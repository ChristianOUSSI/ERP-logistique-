import { apiClient } from '../api-client';

export interface Passerelle {
  id: number;
  source_module: string;
  source_id: number;
  cible_module: string;
  cible_id?: number;
  type_passerelle: string;
  statut: string;
  donnees_json: Record<string, any>;
  message_erreur?: string;
  date_creation: string;
  date_traitement?: string;
  cree_par?: string;
}

export const gatewayAPI = {
  getPasserellesEnAttente: () => 
    apiClient.get<Passerelle[]>('/gateway/passerelles/en-attente').then(res => res.data),
    
  getPasserellesBySource: (module: string, id: number) =>
    apiClient.get<Passerelle[]>(`/gateway/passerelles/source/${module}/${id}`).then(res => res.data),
    
  traiterPasserelle: (passerelleId: number, cibleId: number) =>
    apiClient.post<Passerelle>(`/gateway/passerelles/${passerelleId}/traiter/${cibleId}`).then(res => res.data),
};
