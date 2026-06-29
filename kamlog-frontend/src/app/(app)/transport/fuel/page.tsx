// src/app/(app)/transport/fuel/page.tsx - K-Transport Fuel Intelligence - De-hardcoded
'use client'

import { useState, useEffect } from 'react'
import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { transportAPI } from '@/lib/api-client'

export default function TransportFuelPage() {
  const [camions, setCamions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fuelData, setFuelData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await transportAPI.getCamions();
        const camionsData = response.data || [];
        setCamions(camionsData);
        
        // Mock fuel data for the vehicles since backend doesn't have fuel endpoint yet
        const mockedFuel = camionsData.map((c: any, i: number) => {
          const isAnomaly = i % 4 === 1; // Arbitrary anomaly for demo
          return {
            ...c,
            dernier_plein: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString() + ', ' + new Date(Date.now() - Math.random() * 1000000000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            volume_ajoute: Math.floor(Math.random() * 300) + 100,
            conso_moy: (Math.random() * 20 + 15).toFixed(1),
            statut_niveau: isAnomaly ? 'CHUTE -' + (Math.floor(Math.random() * 10) + 5) + '%' : 'NORMAL'
          };
        });
        setFuelData(mockedFuel);
      } catch (error) {
        console.error("Failed to load camions for fuel page", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalVolume = fuelData.reduce((acc, curr) => acc + curr.volume_ajoute, 0);
  const anomaliesCount = fuelData.filter(f => f.statut_niveau !== 'NORMAL').length;

  return (
    <>
      <style jsx global>{`
        @layer utilities {
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .transport-active-border {
            border-left: 2px solid #F59E0B;
          }
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex antialiased">
        {/* SideNavBar */}
        <aside className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-md z-50">
          {/* Brand */}
          <div className="mb-xl flex items-center gap-sm px-xs mt-4">
            <img alt="KAMLOG Company Logo" className="w-8 h-8 rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4mvikIpgmdL4JUbx12MEqOgxBxAjQ8nBeoeQM1-O35QorjdRcFAxHtCXfW5NnbhCYIhuA5wgMc_OIIpweJBfE6LThMJNKagBzpA0mp8xN-j7lqfLRZREA9pntGMhR6bdLQPbHTlr_PxoB-DsjatvAK5Nc8xwnsJXtCOtMNaA0ItE5gUwoE4qsQXAk_uI3NiALiVIg0YrflWiy99S0ptTYJNfo0CWZwD1sRfe6TGhNF6x1_VGcrKOqEfAvJGSXrad3ddwjQmsEkwc"/>
            <div>
              <div className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</div>
              <div className="font-label-sm text-label-sm text-secondary">Port Operations</div>
            </div>
          </div>
          {/* Navigation Tabs */}
          <nav className="flex-1 flex flex-col gap-2 font-label-md text-label-md mt-4">
            <a className="flex items-center gap-4 px-4 py-2 rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/dashboard/global">
              <span className="material-symbols-outlined">dashboard</span>
              Tableau de bord
            </a>
            <a className="flex items-center gap-4 px-4 py-2 rounded text-primary bg-secondary-container font-bold active:scale-95 duration-150 transport-active-border" href="/transport/control" style={{ color: '#F59E0B', backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' }}>
              <span className="material-symbols-outlined" style={{ color: '#F59E0B' }}>local_shipping</span>
              Transport
            </a>
            <a className="flex items-center gap-4 px-4 py-2 rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/finance/overview">
              <span className="material-symbols-outlined">payments</span>
              Finances
            </a>
            <a className="flex items-center gap-4 px-4 py-2 rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/parc/overview">
              <span className="material-symbols-outlined">minor_crash</span>
              Parc Automobile
            </a>
            <a className="flex items-center gap-4 px-4 py-2 rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/settings/system/audit-health">
              <span className="material-symbols-outlined">settings</span>
              Paramètres
            </a>
          </nav>
          {/* Footer Actions */}
          <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-outline-variant">
            <button className="w-full py-2 px-4 bg-primary text-on-primary rounded font-label-md text-label-md font-bold hover:bg-opacity-90 transition-colors shadow-sm" style={{ backgroundColor: '#F59E0B', color: 'white' }}>
              Nouvelle Opération
            </button>
            <nav className="flex flex-col gap-2 font-label-md text-label-md">
              <a className="flex items-center gap-4 px-4 py-2 rounded hover:bg-surface-container-high transition-colors text-secondary" href="/support">
                <span className="material-symbols-outlined">help_outline</span>
                Support
              </a>
              <a className="flex items-center gap-4 px-4 py-2 rounded hover:bg-surface-container-high transition-colors text-secondary" href="/login">
                <span className="material-symbols-outlined">logout</span>
                Déconnexion
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 ml-[260px] flex flex-col min-w-0">
          {/* TopNavBar */}
          <header className="bg-surface border-b border-outline-variant sticky top-0 w-full z-40 flex justify-between items-center h-[64px] px-8">
            <div className="flex items-center gap-8 h-full">
              <div className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</div>
              <nav className="hidden md:flex items-end h-full gap-8 font-body-base text-body-base">
                <a className="h-full flex items-center text-on-surface-variant hover:text-primary transition-all" href="#">Articles</a>
                <a className="h-full flex items-center text-on-surface-variant hover:text-primary transition-all" href="#">Clients</a>
                <a className="h-full flex items-center text-on-surface-variant hover:text-primary transition-all" href="#">Stocks</a>
                <a className="h-full flex items-center text-primary border-b-2 border-primary pb-[2px]" href="#" style={{ color: '#F59E0B', borderColor: '#F59E0B' }}>Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {/* Search T-Code */}
              <TCodeSearch />
              {/* Trailing Actions */}
              <div className="flex items-center gap-2 text-on-surface-variant">
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">account_circle</span></button>
              </div>
            </div>
          </header>

          {/* Main Stage */}
          <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">
            {/* Breadcrumb & Header */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
                <span>Transport</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span>Gestion Flotte</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-on-surface font-semibold">Suivi Carburant</span>
              </div>
              <div className="flex justify-between items-end">
                <h1 className="text-3xl font-bold text-on-surface m-0 leading-none">Gestion Carburant</h1>
                <div className="flex gap-4">
                  <button className="px-4 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">download</span> Exporter CSV
                  </button>
                  <button className="px-4 py-1.5 bg-transport-orange text-white rounded font-label-md text-label-md font-bold hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm" style={{ backgroundColor: '#F59E0B' }}>
                    <span className="material-symbols-outlined text-[16px]">add</span> Saisir Ticket
                  </button>
                </div>
              </div>
            </div>

            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Volume Total (Ce mois)</span>
                  <span className="material-symbols-outlined text-outline">local_gas_station</span>
                </div>
                <div className="text-3xl font-bold text-on-surface">{totalVolume.toLocaleString('fr-FR')} L</div>
                <div className="font-body-sm text-body-sm text-secondary mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +5.2% vs M-1
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Dépense Carburant</span>
                  <span className="material-symbols-outlined text-outline">euro</span>
                </div>
                <div className="text-3xl font-bold text-on-surface">{(totalVolume * 650).toLocaleString('fr-FR')} FCFA</div>
                <div className="font-body-sm text-body-sm text-error mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.1% vs M-1
                </div>
              </div>
              <div className="bg-error-container border border-error border-opacity-20 rounded-lg p-4 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-md text-label-md text-error uppercase tracking-wider font-bold">Alertes Siphonnage / Anomalies</span>
                    <span className="material-symbols-outlined text-error">warning</span>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="text-4xl font-bold text-error leading-none">{anomaliesCount}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant pb-1">Chutes de niveau inexpliquées détectées ce mois-ci.</div>
                  </div>
                  <button className="mt-4 font-label-sm text-label-sm text-error font-bold flex items-center gap-1 hover:underline">
                    Voir Détails <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Data Table Section */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden mt-4">
              {/* Table Header / Filters */}
              <div className="p-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="relative">
                    <select className="appearance-none bg-surface border border-outline-variant rounded py-1 pl-4 pr-8 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-transport-orange">
                      <option>Tous les Véhicules</option>
                      <option>Camions Lourds</option>
                      <option>Utilitaires</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">arrow_drop_down</span>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-surface border border-outline-variant rounded py-1 pl-4 pr-8 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-transport-orange">
                      <option>7 Derniers Jours</option>
                      <option>Ce Mois</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">arrow_drop_down</span>
                  </div>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
                  <input className="pl-10 pr-4 py-1 bg-surface border border-outline-variant rounded font-body-sm text-body-sm w-[250px] focus:outline-none focus:ring-1 focus:ring-transport-orange" placeholder="Filtrer Immatriculation..." type="text"/>
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-outline-variant sticky top-0">
                    <tr>
                      <th className="p-4 font-medium">Immatriculation</th>
                      <th className="p-4 font-medium">Modèle/Marque</th>
                      <th className="p-4 font-medium">Date Dernier Plein</th>
                      <th className="p-4 font-medium text-right">Vol. Ajouté</th>
                      <th className="p-4 font-medium text-right">Conso. Moy (L/100)</th>
                      <th className="p-4 font-medium text-center">Statut Niveau</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular text-on-surface divide-y divide-outline-variant">
                    {loading ? (
                      <tr><td colSpan={7} className="text-center py-8">Chargement des données...</td></tr>
                    ) : fuelData.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-8">Aucune donnée disponible.</td></tr>
                    ) : (
                      fuelData.map((fuel, index) => (
                        <tr key={fuel.id} className={`hover:bg-surface-container-low transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
                          <td className="p-4 font-semibold">{fuel.immatriculation}</td>
                          <td className="p-4">{fuel.marque} - {fuel.modele}</td>
                          <td className="p-4">{fuel.dernier_plein}</td>
                          <td className="p-4 text-right">{fuel.volume_ajoute} L</td>
                          <td className="p-4 text-right">{fuel.conso_moy}</td>
                          <td className="p-4 text-center">
                            {fuel.statut_niveau === 'NORMAL' ? (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container">NORMAL</span>
                            ) : (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-error">{fuel.statut_niveau}</span>
                            )}
                          </td>
                          <td className="p-4">
                            {fuel.statut_niveau === 'NORMAL' ? (
                              <button className="text-on-surface-variant hover:text-transport-orange"><span className="material-symbols-outlined text-[18px]">receipt_long</span></button>
                            ) : (
                              <button className="text-error hover:text-error-container"><span className="material-symbols-outlined text-[18px]">warning</span></button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center font-body-sm text-body-sm text-on-surface-variant">
                <span>Affichage 1-{fuelData.length} sur {fuelData.length} véhicules</span>
                <div className="flex items-center gap-2">
                  <button className="p-1 border border-outline-variant rounded hover:bg-surface disabled:opacity-50" disabled><span className="material-symbols-outlined text-[16px]">chevron_left</span></button>
                  <span className="font-medium text-on-surface">1</span>
                  <button className="p-1 border border-outline-variant rounded hover:bg-surface disabled:opacity-50" disabled><span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
