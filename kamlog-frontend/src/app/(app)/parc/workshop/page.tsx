// src/app/(app)/parc/workshop/page.tsx - K-Parc Workshop Maintenance - De-hardcoded
'use client'

import { useEffect, useState } from 'react'
import { transportAPI } from '@/lib/api-client'

export default function ParcWorkshopPage() {
  const [vehiclesInRepair, setVehiclesInRepair] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await transportAPI.getCamions().catch(() => ({ data: [] }));
        const camions = res.data || [];
        
        // Mock repair data for vehicles that are not active
        const inRepair = camions.filter((c: any) => !c.actif).map((c: any, index: number) => ({
          ...c,
          probleme_signale: ['Fuite hydraulique', 'Remplacement batterie', 'Panne moteur', 'Révision 50k KM', 'Changement pneus'][index % 5],
          mecanicien: ['M. Kouamé', 'S. Diarrassouba', 'A. Touré', 'J. Ndiaye'][index % 4],
          initiales: ['MK', 'SD', 'AT', 'JN'][index % 4],
          couleur: ['bg-primary-container text-on-primary-container', 'bg-secondary-container text-on-secondary-container', 'bg-tertiary-container text-on-tertiary-container', 'bg-error-container text-on-error-container'][index % 4],
          statut_reparation: index % 3 === 0 ? 'Bloqué' : (index % 2 === 0 ? 'Terminé (Test)' : 'En cours')
        }));
        
        setVehiclesInRepair(inRepair);
      } catch (error) {
        console.error("Failed to load workshop data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-filled {
          font-variation-settings: 'FILL 1';
        }
        /* Custom Scrollbar for dense lists */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-background font-body-md min-h-screen flex">
        
        

        {/* Main Content Area Wrapper */}
        <div className="flex-1 flex flex-col md:ml-[260px] min-h-screen">
          
          

          
          <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
            {/* Bento Grid Layout for Workshop */}
            <div className="grid grid-cols-12 gap-8 h-full">
              {/* Left Column: Active Repairs & Schedule (8 cols) */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-primary/5 rounded-bl-full"></div>
                    <div className="flex justify-between items-start mb-2 z-10">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">En Réparation</span>
                      <span className="material-symbols-outlined text-primary text-[20px] icon-filled">build_circle</span>
                    </div>
                    <div className="flex items-end gap-2 z-10">
                      <span className="text-3xl text-on-surface font-bold leading-none">{vehiclesInRepair.length}</span>
                      <span className="font-label-md text-label-md text-error flex items-center"><span className="material-symbols-outlined text-[14px]">trending_up</span> +2</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-secondary/5 rounded-bl-full"></div>
                    <div className="flex justify-between items-start mb-2 z-10">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Disponibilité Flotte</span>
                      <span className="material-symbols-outlined text-secondary text-[20px] icon-filled">local_shipping</span>
                    </div>
                    <div className="flex items-end gap-2 z-10">
                      <span className="text-3xl text-on-surface font-bold leading-none">84%</span>
                      <span className="font-label-md text-label-md text-secondary flex items-center"><span className="material-symbols-outlined text-[14px]">trending_up</span> +1.2%</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-tertiary/5 rounded-bl-full"></div>
                    <div className="flex justify-between items-start mb-2 z-10">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Interventions Prévues</span>
                      <span className="material-symbols-outlined text-tertiary text-[20px] icon-filled">event_note</span>
                    </div>
                    <div className="flex items-end gap-2 z-10">
                      <span className="text-3xl text-on-surface font-bold leading-none">05</span>
                      <span className="font-label-md text-label-md text-on-surface-variant">Aujourd'hui</span>
                    </div>
                  </div>
                </div>

                {/* Active Repairs Table (Dense) */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex-1 flex flex-col min-h-[400px]">
                  <div className="px-4 py-2 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">handyman</span>
                      Véhicules en Réparation
                    </h2>
                    <button className="text-primary hover:text-primary-fixed-variant font-label-md text-label-md flex items-center gap-1 transition-colors">
                      Voir Tout <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse font-data-tabular text-data-tabular">
                      <thead>
                        <tr className="bg-surface-container text-on-surface-variant uppercase tracking-wider font-label-sm text-label-sm border-b border-outline-variant">
                          <th className="px-4 py-2 font-semibold">ID Véhicule</th>
                          <th className="px-4 py-2 font-semibold">Type</th>
                          <th className="px-4 py-2 font-semibold">Problème Signalé</th>
                          <th className="px-4 py-2 font-semibold">Mécanicien</th>
                          <th className="px-4 py-2 font-semibold">Statut</th>
                          <th className="px-4 py-2 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant text-on-surface">
                        {loading ? (
                          <tr><td colSpan={6} className="px-4 py-4 text-center">Chargement...</td></tr>
                        ) : vehiclesInRepair.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-4 text-center">Aucun véhicule en réparation.</td></tr>
                        ) : vehiclesInRepair.map((v, i) => (
                          <tr key={v.id} className={`hover:bg-surface-container-low transition-colors h-[40px] border-l-2 ${v.statut_reparation === 'Bloqué' ? 'border-error' : (v.statut_reparation === 'En cours' ? 'border-primary' : 'border-transparent')}`}>
                            <td className="px-4 py-1 font-medium">{v.immatriculation}</td>
                            <td className="px-4 py-1 text-on-surface-variant">{v.type_camion}</td>
                            <td className={`px-4 py-1 ${v.statut_reparation === 'Bloqué' ? 'text-error' : ''}`}>{v.probleme_signale}</td>
                            <td className="px-4 py-1 flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center font-label-sm text-[9px] font-bold ${v.couleur}`}>{v.initiales}</div>
                              {v.mecanicien}
                            </td>
                            <td className="px-4 py-1">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${v.statut_reparation === 'Bloqué' ? 'bg-error/10 text-error' : (v.statut_reparation === 'En cours' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary')}`}>
                                {v.statut_reparation}
                              </span>
                            </td>
                            <td className="px-4 py-1 text-right">
                              <button className="text-on-surface-variant hover:text-primary p-1"><span className="material-symbols-outlined text-[16px]">more_vert</span></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Contextual Rail (4 cols) */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                {/* Quick Actions Glassmorphism Card */}
                <div className="bg-primary-container/80 backdrop-blur-md border border-primary/20 rounded-lg p-4 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary rounded-full opacity-20 blur-xl"></div>
                  <h3 className="font-title-md text-title-md font-bold text-on-primary-container mb-2">Accès Rapide T-Code</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-surface-container-lowest/90 hover:bg-surface border border-outline-variant/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all">
                      <span className="material-symbols-outlined text-primary text-[20px]">add_box</span>
                      <span className="font-label-sm text-label-sm text-on-surface">Créer OT</span>
                    </button>
                    <button className="bg-surface-container-lowest/90 hover:bg-surface border border-outline-variant/50 p-2 rounded flex flex-col items-center justify-center gap-1 transition-all">
                      <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
                      <span className="font-label-sm text-label-sm text-on-surface">Sortie Magasin</span>
                    </button>
                  </div>
                </div>

                {/* Inventory Alerts */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex-1 flex flex-col">
                  <div className="px-4 py-2 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h2 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">warning</span>
                      Alertes Pièces
                    </h2>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto space-y-2">
                    <div className="flex items-start gap-2 p-2 border border-error/20 bg-error/5 rounded">
                      <div className="mt-0.5"><span className="material-symbols-outlined text-error text-[16px]">error</span></div>
                      <div>
                        <div className="font-label-md text-label-md font-bold text-error">Rupture Stock: Filtre à Huile H30</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-[11px] leading-tight">Nécessaire pour TRK-4092. Commande en cours, livraison est. demain.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 border border-tertiary/20 bg-tertiary/5 rounded">
                      <div className="mt-0.5"><span className="material-symbols-outlined text-tertiary text-[16px]">warning</span></div>
                      <div>
                        <div className="font-label-md text-label-md font-bold text-tertiary">Seuil Critique: Pneus Michelin XZM</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-[11px] leading-tight">Stock actuel: 2 unités. Demande de réapprovisionnement générée (PR-992).</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-outline-variant bg-surface text-center">
                    <a className="font-label-md text-label-md text-primary hover:underline" href="/magasin/dashboard">Ouvrir Module Magasin (K-Mag)</a>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
