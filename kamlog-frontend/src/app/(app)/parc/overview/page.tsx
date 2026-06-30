// src/app/(app)/parc/overview/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { transportAPI } from '@/lib/api-client'
import { useAuth } from '@/components/layout/AuthProvider'

export default function KParcFleetManagementOverview() {
  const { user } = useAuth();
  const [camions, setCamions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const camionsRes = await transportAPI.getCamions().catch(() => ({ data: [] }));
        setCamions(camionsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch parc data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalVehicles = camions.length;
  // We mock the status distribution since the backend only gives "actif" boolean.
  const activeVehicles = camions.filter(c => c.actif).length;
  // Let's assume some of the active ones are on mission (e.g. 70%), others are just available.
  const enMission = Math.floor(activeVehicles * 0.7);
  const available = activeVehicles - enMission;
  const inMaintenance = camions.filter(c => !c.actif).length;

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-filled {
          font-variation-settings: 'FILL' 1;
        }
        @layer utilities {
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen overflow-x-hidden antialiased">
      
      

      
      

      {/* Main Content Canvas */}
      <main className="p-gutter max-w-max-width mx-auto">
        <div className="mb-md">
          <div className="flex justify-between items-end">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Gestion de Flotte</h2>
            <div className="flex gap-sm">
              <Link href="/parc/vehicles/new" className="px-md py-sm bg-primary text-white rounded-lg flex items-center gap-xs hover:opacity-90 transition-opacity text-sm font-medium">
                <span className="material-symbols-outlined text-sm">add</span>
                Nouveau Véhicule
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
             <span className="text-primary font-bold">Chargement des données du parc...</span>
           </div>
        ) : (
          <div className="grid grid-cols-12 gap-md">
            {/* Fleet Health Summary Cards */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-md">
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex items-center justify-between mb-sm relative z-10">
                  <span className="font-title-sm text-on-surface-variant">Total Flotte</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">dataset</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <span className="font-headline-lg text-on-surface">{totalVehicles}</span>
                  <span className="text-sm text-on-surface-variant ml-xs">Unités</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                <div className="flex items-center justify-between mb-sm relative z-10">
                  <span className="font-title-sm text-on-surface-variant">En Mission (Est.)</span>
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-sm">route</span>
                  </div>
                </div>
                <div className="relative z-10 flex items-end gap-sm">
                  <span className="font-headline-lg text-on-surface">{enMission}</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
                <div className="flex items-center justify-between mb-sm relative z-10">
                  <span className="font-title-sm text-on-surface-variant">En Maintenance</span>
                  <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-sm">build</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <span className="font-headline-lg text-on-surface">{inMaintenance}</span>
                  <span className="text-sm text-on-surface-variant ml-xs">Atelier K-Parc</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline"></div>
                <div className="flex items-center justify-between mb-sm relative z-10">
                  <span className="font-title-sm text-on-surface-variant">Disponibles (Est.)</span>
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">local_parking</span>
                  </div>
                </div>
                <div className="relative z-10 flex items-end gap-sm">
                  <span className="font-headline-lg text-on-surface">{available}</span>
                </div>
              </div>
            </div>

            {/* Detailed Vehicle List */}
            <div className="col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
              <div className="px-md py-sm border-b border-outline-variant bg-surface flex justify-between items-center">
                <h3 className="font-title-md text-on-surface flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary text-sm">view_list</span>
                  Registre des Véhicules
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low font-label-md text-on-surface-variant border-b border-outline-variant">
                      <th className="py-2 px-4 font-medium">Immatriculation</th>
                      <th className="py-2 px-4 font-medium">Modèle / Type</th>
                      <th className="py-2 px-4 font-medium">Capacité</th>
                      <th className="py-2 px-4 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-on-surface divide-y divide-outline-variant">
                    {camions.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 px-4 text-center text-on-surface-variant">Aucun véhicule trouvé.</td></tr>
                    ) : (
                      camions.map((c, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-lowest transition-colors bg-white">
                          <td className="py-3 px-4 font-bold">{c.immatriculation}</td>
                          <td className="py-3 px-4">{c.marque} {c.modele} ({c.type_camion})</td>
                          <td className="py-3 px-4">{c.capacite_tonnes} tonnes</td>
                          <td className="py-3 px-4">
                            {c.actif ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Actif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Maintenance
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  )
}
