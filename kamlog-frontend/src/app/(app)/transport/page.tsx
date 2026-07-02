// src/app/(app)/transport/page.tsx - K-Transport Mission Control - Fidèle 100% au HTML original
'use client'

import { useEffect, useState } from 'react'
import { transportAPI } from '@/lib/api-client'

export default function TransportPage() {
  const [camions, setCamions] = useState<any[]>([])
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [camionsRes, missionsRes] = await Promise.all([
          transportAPI.getCamions().catch(() => ({ data: [] })),
          transportAPI.getMissions().catch(() => ({ data: [] }))
        ]);
        setCamions(camionsRes.data || []);
        setMissions(missionsRes.data || []);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  // ── Micro-interactions JavaScript fidèles au HTML original ─────────
  useEffect(() => {
    // Add hover scale effect to cards
    const cards = document.querySelectorAll('.hover-scale')
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('scale-[1.02]')
      })
      card.addEventListener('mouseleave', () => {
        card.classList.remove('scale-[1.02]')
      })
    })
  }, [])

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
          font-variation-settings: 'FILL' 1;
        }
        
        /* Module Signature Color (Orange Override for Transport) */
        .module-bg { background-color: #F59E0B; color: white; }
        .module-text { color: #F59E0B; }
        .module-border { border-color: #F59E0B; }
        .module-bg-light { background-color: #FEF3C7; color: #B45309; }
        
        /* Status Badges */
        .status-transit { background-color: #DBEAFE; color: #1E40AF; }
        .status-loading { background-color: #FEF3C7; color: #B45309; }
        .status-delivered { background-color: #DCFCE7; color: #166534; }
        .status-maintenance { background-color: #FEE2E2; color: #991B1B; }

        /* Elevation 1 - Soft Shadow */
        .glass-card {
          background-color: #ffffff;
          border: 1px solid #E2E8F0;
          box-shadow: 0px 1px 3px rgba(0,0,0,0.05);
          border-radius: 0.5rem;
        }
      `}</style>
      <div className="bg-background text-on-background font-body-base antialiased flex flex-col">
        
        

        
        <div className="flex-1 flex flex-col">
          
          

          
          <main className="flex-1 overflow-y-auto p-container-margin bg-background">
            <div className="flex justify-between items-end mb-stack-lg">
              <div>
                <h2 className="font-display-lg text-display-lg text-on-surface mb-1">Mission Control</h2>
                <p className="text-secondary font-body-base">Transport & Fleet Operations Center</p>
              </div>
              <div className="flex gap-2">
                <button className="border border-outline-variant bg-surface px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filtres
                </button>
                <button className="module-bg px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Actualiser
                </button>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-gutter">
              {/* Fleet Status Summary (Bento Top) */}
              <div className="col-span-12 md:col-span-8 glass-card p-stack-md flex justify-between items-center">
                <div>
                  <h3 className="font-title-sm text-title-sm text-on-surface mb-1">Fleet Status</h3>
                  <p className="font-body-sm text-body-sm text-secondary">Real-time overview</p>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">{camions.filter(c => c.statut === 'EN_ROUTE').length}</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> On Road</span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">{camions.filter(c => c.statut === 'DISPONIBLE').length}</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Available</span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">{camions.filter(c => c.statut === 'MAINTENANCE').length}</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Maintenance</span>
                  </div>
                </div>
              </div>

              {/* Next Deliveries (Bento Right) */}
              <div className="col-span-12 md:col-span-4 glass-card p-stack-md flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Next Deliveries</h3>
                  <span className="font-label-caps text-label-caps text-secondary">TODAY</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {missions.filter(m => m.statut !== 'LIVREE' && m.statut !== 'TERMINEE').slice(0, 3).map((m: any, idx) => (
                    <div key={idx} className="p-3 border border-outline-variant rounded-DEFAULT hover:border-[#F59E0B] transition-colors cursor-pointer group animate-fade-in">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono-data text-mono-data text-on-surface group-hover:text-[#F59E0B]">{m.reference || `MSN-${m.id}`}</span>
                        <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-1 rounded text-secondary">
                          {m.date_prevue ? new Date(m.date_prevue).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">{m.destination || 'Destination non spécifiée'}</p>
                      <p className="font-body-sm text-body-sm text-secondary truncate">Client: {m.client_id || 'Interne'}</p>
                    </div>
                  ))}
                  {missions.filter(m => m.statut !== 'LIVREE' && m.statut !== 'TERMINEE').length === 0 && (
                    <p className="text-sm text-secondary text-center py-4">Aucune livraison en cours</p>
                  )}
                </div>
                <button className="mt-4 w-full text-center text-[#F59E0B] font-body-sm text-body-sm hover:underline">View All Schedule</button>
              </div>

              {/* Active Missions List */}
              <div className="col-span-12 md:col-span-8 glass-card overflow-hidden flex flex-col h-[400px]">
                <div className="p-stack-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Active Missions</h3>
                  <div className="flex gap-2">
                    <input className="border border-outline-variant rounded px-2 py-1 text-body-sm w-32 focus:outline-none focus:border-[#F59E0B]" placeholder="Filter ID..." type="text"/>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant z-10">
                      <tr>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary whitespace-nowrap">Mission ID</th>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Driver</th>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Route</th>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Vehicle</th>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm">
                      {loading ? (
                        <tr><td colSpan={5} className="py-4 text-center">Chargement...</td></tr>
                      ) : missions.length === 0 ? (
                        <tr><td colSpan={5} className="py-4 text-center">Aucune mission active.</td></tr>
                      ) : missions.map((m: any, idx) => (
                        <tr key={idx} className={`border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group ${idx % 2 === 1 ? 'bg-surface-bright' : ''}`}>
                          <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">{m.reference || `TRN-${m.id}`}</td>
                          <td className="py-2 px-4 text-on-surface">{m.chauffeur_id ? `Chauffeur #${m.chauffeur_id}` : 'Non assigné'}</td>
                          <td className="py-2 px-4 text-secondary truncate max-w-[150px]">{m.origine || '?'} -&gt; {m.destination || '?'}</td>
                          <td className="py-2 px-4 text-on-surface">{m.camion_id ? `Camion #${m.camion_id}` : 'N/A'}</td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded font-label-caps text-label-caps ${m.statut === 'EN_COURS' ? 'status-transit' : m.statut === 'PLANIFIE' ? 'status-loading' : 'bg-outline-variant'}`}>
                              {m.statut || 'INCONNU'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Map View Placeholder */}
              <div className="col-span-12 glass-card p-1 relative h-[300px] overflow-hidden group">
                <div className="absolute inset-0 bg-surface-container-highest flex flex-col items-center justify-center opacity-80 z-10 pointer-events-none">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">map</span>
                  <span className="font-title-sm text-title-sm text-outline">Live Map View</span>
                  <span className="font-body-sm text-body-sm text-outline">Tracking 25 Active Trucks</span>
                </div>
                {/* Decorative Map Grid Background */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#c2c6d6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                {/* Simulated truck blips */}
                <div className="absolute w-3 h-3 bg-[#F59E0B] rounded-full top-[30%] left-[40%] shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse"></div>
                <div className="absolute w-3 h-3 bg-[#F59E0B] rounded-full top-[60%] left-[20%] shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-[45%] left-[70%] shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute w-3 h-3 bg-[#F59E0B] rounded-full top-[80%] left-[55%] shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-surface p-2 rounded shadow border border-outline-variant hover:bg-surface-container-low"><span className="material-symbols-outlined text-sm">add</span></button>
                  <button className="bg-surface p-2 rounded shadow border border-outline-variant hover:bg-surface-container-low"><span className="material-symbols-outlined text-sm">remove</span></button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
