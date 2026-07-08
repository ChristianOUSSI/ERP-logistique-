'use client';

import React, { useEffect, useState } from 'react';
import { transportAPI } from '@/lib/api-client';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { Wrench, ShieldAlert, CheckCircle2, Truck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { CardSkeletonLoader } from '@/components/ui/Loaders';
import { toast } from 'sonner';

export default function MaintenancePage() {
  const [camions, setCamions] = useState<any[]>([]);
  const [pannesByCamion, setPannesByCamion] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedCamion, setExpandedCamion] = useState<number | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await transportAPI.getCamions();
      const brokenCamions = (res.data || []).filter((c: any) => 
        c.statut === 'EN_MAINTENANCE' || c.statut === 'BLOQUE_HSE'
      );
      setCamions(brokenCamions);

      // Fetch pannes for broken vehicles
      const pannesMap: Record<number, any[]> = {};
      await Promise.all(
        brokenCamions.map(async (c: any) => {
          try {
            const pRes = await transportAPI.getPannes(c.id);
            pannesMap[c.id] = pRes.data || [];
          } catch (e) {
            console.error(`Failed to fetch pannes for ${c.id}`, e);
          }
        })
      );
      setPannesByCamion(pannesMap);
    } catch (error) {
      console.error("Failed to load maintenance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedCamion(expandedCamion === id ? null : id);
  };

  const updatePanneStatus = async (camionId: number, panneId: number, newStatus: string) => {
    try {
      setProcessing(panneId);
      await transportAPI.updatePanne(camionId, panneId, { statut: newStatus });
      
      // Update local state
      setPannesByCamion(prev => ({
        ...prev,
        [camionId]: prev[camionId].map(p => p.id === panneId ? { ...p, statut: newStatus } : p)
      }));
    } catch (error) {
      console.error("Failed to update panne:", error);
      toast.error("Erreur lors de la mise à jour de la panne.");
    } finally {
      setProcessing(null);
    }
  };

  const debloquerVehicule = async (camionId: number) => {
    // Check if there are unresolved pannes
    const unresolved = pannesByCamion[camionId]?.filter(p => p.statut === 'A_REPARER' || p.statut === 'EN_COURS');
    if (unresolved && unresolved.length > 0) {
      toast.error("Impossible de débloquer : il reste des pannes non résolues.");
      return;
    }

    try {
      setProcessing(camionId);
      await transportAPI.debloquerCamion(camionId);
      toast.success("Véhicule débloqué et remis en disponibilité !");
      fetchData(); // Refresh list
    } catch (error: any) {
      console.error("Failed to unlock vehicle:", error);
      toast.error(error.response?.data?.detail || "Erreur lors du déblocage.");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch(statut) {
      case 'A_REPARER':
        return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">À RÉPARER</span>;
      case 'EN_COURS':
        return <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">EN COURS</span>;
      case 'RESOLU':
        return <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">RÉSOLU</span>;
      default:
        return <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold">{statut}</span>;
    }
  };

  return (
    <ModuleLayout module="transport">
      <div className="bg-slate-50 min-h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wrench className="w-8 h-8 text-blue-600" />
            Atelier Maintenance & HSE
          </h2>
          <p className="text-sm text-slate-500 mt-1">Gérez les véhicules immobilisés et les pannes signalées</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <CardSkeletonLoader />
            <CardSkeletonLoader />
          </div>
        ) : camions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun véhicule immobilisé</h3>
            <p className="text-slate-500">Tous les véhicules de la flotte sont actuellement opérationnels.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {camions.map(camion => (
              <div key={camion.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header Vehicule */}
                <div 
                  className={`p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${camion.statut === 'BLOQUE_HSE' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-amber-500'}`}
                  onClick={() => toggleExpand(camion.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${camion.statut === 'BLOQUE_HSE' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      {camion.statut === 'BLOQUE_HSE' ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {camion.immatriculation} 
                        <span className="text-sm font-normal text-slate-500">({camion.marque} {camion.modele})</span>
                      </h3>
                      <p className={`text-xs font-bold mt-1 ${camion.statut === 'BLOQUE_HSE' ? 'text-red-600' : 'text-amber-600'}`}>
                        {camion.statut.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right mr-4 hidden md:block">
                      <p className="text-sm font-medium text-slate-900">
                        {pannesByCamion[camion.id]?.filter(p => p.statut !== 'RESOLU').length || 0} pannes non résolues
                      </p>
                    </div>
                    {expandedCamion === camion.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Details (Expanded) */}
                {expandedCamion === camion.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">Liste des pannes / signalements</h4>
                      <button 
                        onClick={() => debloquerVehicule(camion.id)}
                        disabled={processing === camion.id || (pannesByCamion[camion.id]?.filter(p => p.statut !== 'RESOLU').length > 0)}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Débloquer le véhicule
                      </button>
                    </div>

                    <div className="space-y-3">
                      {pannesByCamion[camion.id]?.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">Aucune panne enregistrée pour ce véhicule.</p>
                      ) : (
                        pannesByCamion[camion.id]?.map((panne: any) => (
                          <div key={panne.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                {getStatusBadge(panne.statut)}
                                <span className="text-xs text-slate-500">Signalé par {panne.declare_par} le {new Date(panne.date_declaration).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm font-medium text-slate-800">{panne.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {panne.statut === 'A_REPARER' && (
                                <button 
                                  onClick={() => updatePanneStatus(camion.id, panne.id, 'EN_COURS')}
                                  disabled={processing === panne.id}
                                  className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  Prendre en charge
                                </button>
                              )}
                              {(panne.statut === 'A_REPARER' || panne.statut === 'EN_COURS') && (
                                <button 
                                  onClick={() => updatePanneStatus(camion.id, panne.id, 'RESOLU')}
                                  disabled={processing === panne.id}
                                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  Marquer Résolu
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}
