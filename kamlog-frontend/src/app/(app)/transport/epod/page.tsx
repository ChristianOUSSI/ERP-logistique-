'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { transportAPI } from '@/lib/api-client';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import SignaturePadModal from '@/components/transport/SignaturePadModal';
import { MapPin, Navigation, PackageCheck, AlertCircle, CheckCircle2, ChevronRight, Truck } from 'lucide-react';
import { CardSkeletonLoader } from '@/components/ui/Loaders';

export default function EPodPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Signature Pad State
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState<number | null>(null);

  const fetchActiveMissions = async () => {
    try {
      setLoading(true);
      // Pour la démo E-POD, on récupère toutes les missions (ou celles assignées si l'API le permet)
      // En prod, le backend filtre selon le current_user (chauffeur).
      const res = await transportAPI.getMissions();
      // On filtre côté client pour ne garder que les missions pertinentes pour le E-POD
      const active = res.data?.filter((m: any) => 
        ['PLANIFIE', 'EN_CHARGEMENT', 'EN_ROUTE', 'EN_LIVRAISON'].includes(m.statut)
      ) || [];
      setMissions(active);
    } catch (err: any) {
      console.error(err);
      setError("Impossible de charger les missions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveMissions();
  }, []);

  const handleDemarrer = async (id: number) => {
    try {
      setLoading(true);
      await transportAPI.demarrerMission(id);
      setSuccess("Mission démarrée avec succès !");
      fetchActiveMissions();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors du démarrage de la mission.");
      setLoading(false);
    }
  };

  const handleOpenLivraison = (id: number) => {
    setActiveMissionId(id);
    setIsSignatureModalOpen(true);
  };

  const handleSaveSignature = async (signatureBase64: string, name: string) => {
    if (!activeMissionId) return;
    try {
      setLoading(true);
      setIsSignatureModalOpen(false);
      
      await transportAPI.livrerMission(activeMissionId, {
        signature: signatureBase64,
        nom_receptionnaire: name
      });
      
      setSuccess("Livraison confirmée et facturation générée !");
      setActiveMissionId(null);
      fetchActiveMissions();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la confirmation de la livraison.");
      setLoading(false);
    }
  };

  return (
    <ModuleLayout module="transport">
      {/* Container optimisé pour l'affichage Mobile (Chauffeur) */}
      <div className="max-w-md mx-auto min-h-[calc(100vh-64px)] bg-slate-50 pb-20 animate-in fade-in duration-500 shadow-xl border-x border-slate-200">
        
        {/* Header App-like */}
        <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-8 h-8 opacity-80" />
            <h1 className="text-2xl font-bold">Portail Chauffeur</h1>
          </div>
          <p className="text-blue-100 text-sm">Preuve de Livraison Électronique (E-POD)</p>
        </div>

        <div className="p-4 mt-2">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <p className="text-sm text-emerald-700 font-medium">{success}</p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800">Mes Missions Actives</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {missions.length}
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <CardSkeletonLoader />
            ) : missions.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 border-dashed">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Vous n'avez aucune mission active.</p>
              </div>
            ) : (
              missions.map((mission) => (
                <div key={mission.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
                  
                  {/* Status indicator line */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    mission.statut === 'EN_ROUTE' ? 'bg-blue-500' : 'bg-amber-400'
                  }`}></div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Réf: {mission.reference}</p>
                      <h3 className="font-bold text-slate-800 text-lg">
                        {mission.nature_fret} ({mission.poids_kg ? `${mission.poids_kg} Kg` : '-'})
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      mission.statut === 'EN_ROUTE' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {mission.statut.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 relative">
                    <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                    
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Départ</p>
                        <p className="text-sm text-slate-800 font-medium">{mission.origine}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white flex-shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Destination</p>
                        <p className="text-sm text-slate-800 font-medium">{mission.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    {mission.statut === 'PLANIFIE' || mission.statut === 'EN_CHARGEMENT' ? (
                      <button 
                        onClick={() => handleDemarrer(mission.id)}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                      >
                        <Navigation className="w-5 h-5" />
                        Démarrer le Trajet
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOpenLivraison(mission.id)}
                        className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm shadow-emerald-600/20"
                      >
                        <PackageCheck className="w-5 h-5" />
                        Confirmer la Livraison
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SignaturePadModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSaveSignature}
      />

    </ModuleLayout>
  );
}
