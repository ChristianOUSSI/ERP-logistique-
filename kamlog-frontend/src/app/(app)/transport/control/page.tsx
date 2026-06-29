// src/app/(app)/transport/control/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { transportAPI } from '@/lib/api-client'
import { useAuth } from '@/components/layout/AuthProvider'

export default function KTransportControl() {
  const { user } = useAuth();
  const [camions, setCamions] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [camionsRes, missionsRes] = await Promise.all([
          transportAPI.getCamions().catch(() => ({ data: [] })),
          transportAPI.getMissions().catch(() => ({ data: [] }))
        ]);
        setCamions(camionsRes.data || []);
        setMissions(missionsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch transport data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute Fleet KPIs
  const totalCamions = camions.length || 0;
  // If we don't have explicit statuses in the model, let's derive them
  // Assuming 'actif' means available, but if it has a mission it's on road.
  // We'll mock the distribution for now if data is very limited.
  const onRoad = missions.filter(m => m.statut === 'EN_TRANSIT' || m.statut === 'EN_COURS').length;
  const available = Math.max(0, camions.filter(c => c.actif).length - onRoad);
  const maintenance = camions.filter(c => !c.actif).length;

  const activeMissions = missions.filter(m => m.statut !== 'TERMINEE' && m.statut !== 'ANNULEE');
  const upcomingDeliveries = missions.filter(m => m.statut === 'PLANIFIEE').slice(0, 3);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'EN_TRANSIT':
      case 'EN_COURS': return 'bg-blue-100 text-blue-800';
      case 'EN_CHARGEMENT': return 'bg-orange-100 text-orange-800';
      case 'LIVREE':
      case 'TERMINEE': return 'bg-green-100 text-green-800';
      case 'PLANIFIEE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="bg-background text-on-background font-body-base antialiased flex h-screen overflow-hidden">
      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack-md z-50">
        <div className="flex items-center gap-3 mb-8 px-2 mt-16 md:mt-0">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-white">K</div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
            <span className="font-label-caps text-label-caps text-secondary">Port Operations</span>
          </div>
        </div>

        <button className="bg-primary hover:opacity-90 active:scale-95 duration-150 rounded px-4 py-2 mb-6 flex items-center justify-center gap-2 font-title-sm text-title-sm w-full transition-all shadow-sm text-white">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nouvelle Opération
        </button>

        <ul className="flex-1 space-y-1">
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/dashboard/global">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body-base text-body-base">Tableau de bord</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-primary bg-primary/10 font-bold hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/transport/control">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span className="font-body-base text-body-base">Transport</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/finance/overview">
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="font-body-base text-body-base">Finances</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/parc/overview">
              <span className="material-symbols-outlined text-[20px]">minor_crash</span>
              <span className="font-body-base text-body-base">Parc Automobile</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/magasin/dashboard">
              <span className="material-symbols-outlined text-[20px]">warehouse</span>
              <span className="font-body-base text-body-base">Magasin</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-[260px] flex flex-col h-screen overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-surface border-b border-outline-variant sticky top-0 w-full z-40 flex justify-between items-center h-[64px] px-gutter">
          <div className="flex items-center gap-6">
            <span className="font-title-sm text-title-sm text-on-surface font-black ml-10 lg:ml-0">KAMLOG EM-ERP</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-secondary">
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center font-bold text-primary">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-container-margin bg-background">
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface mb-1">Mission Control</h2>
              <p className="text-secondary font-body-base">Transport & Fleet Operations Center</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-primary text-white px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Actualiser
              </button>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
               <span className="text-primary font-bold">Chargement des données...</span>
             </div>
          ) : (
            <div className="grid grid-cols-12 gap-gutter">
              {/* Fleet Status Summary */}
              <div className="col-span-12 md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-md flex justify-between items-center">
                <div>
                  <h3 className="font-title-sm text-title-sm text-on-surface mb-1">État de la flotte</h3>
                  <p className="font-body-sm text-body-sm text-secondary">Aperçu en temps réel</p>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">{onRoad}</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> En route
                    </span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">{available}</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Disponible
                    </span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">{maintenance}</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Maintenance
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Deliveries */}
              <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-md flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Prochaines Livraisons</h3>
                  <span className="font-label-caps text-label-caps text-secondary">AUJOURD'HUI</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {upcomingDeliveries.length === 0 ? (
                    <p className="text-on-surface-variant text-center mt-10">Aucune livraison planifiée.</p>
                  ) : (
                    upcomingDeliveries.map((d, i) => (
                      <div key={i} className="p-3 border border-outline-variant rounded-DEFAULT hover:border-[#F59E0B] transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono-data text-mono-data text-on-surface group-hover:text-[#F59E0B]">{d.reference || `TRN-${d.id}`}</span>
                          <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-1 rounded text-secondary">{new Date(d.date_depart_prevue || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">{d.point_arrivee}</p>
                        <p className="font-body-sm text-body-sm text-secondary truncate">Client: {d.client_id || 'N/A'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Missions List */}
              <div className="col-span-12 md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col h-[400px]">
                <div className="p-stack-md border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Missions Actives</h3>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant z-10">
                      <tr>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary whitespace-nowrap">Mission ID</th>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Route</th>
                        <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm">
                      {activeMissions.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 px-4 text-center text-on-surface-variant">Aucune mission active.</td>
                        </tr>
                      ) : (
                        activeMissions.map((m, i) => (
                          <tr key={i} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors group">
                            <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">{m.reference || `TRN-${m.id}`}</td>
                            <td className="py-2 px-4 text-secondary truncate max-w-[250px]">{m.point_depart} {'->'} {m.point_arrivee}</td>
                            <td className="py-2 px-4">
                              <span className={`${getStatusClass(m.statut)} px-2 py-1 rounded font-label-caps text-label-caps`}>{m.statut}</span>
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
    </div>
  )
}
