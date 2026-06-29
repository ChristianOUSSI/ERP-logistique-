// src/app/(app)/transport/fuel/page.tsx - K-Transport Fuel Intelligence - Fidèle 100% au HTML original
'use client'


import { TCodeSearch } from '@/components/ui/TCodeSearch'
export default function TransportFuelPage() {
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
          <div className="mb-xl flex items-center gap-sm px-xs">
            <img alt="KAMLOG Company Logo" className="w-8 h-8 rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4mvikIpgmdL4JUbx12MEqOgxBxAjQ8nBeoeQM1-O35QorjdRcFAxHtCXfW5NnbhCYIhuA5wgMc_OIIpweJBfE6LThMJNKagBzpA0mp8xN-j7lqfLRZREA9pntGMhR6bdLQPbHTlr_PxoB-DsjatvAK5Nc8xwnsJXtCOtMNaA0ItE5gUwoE4qsQXAk_uI3NiALiVIg0YrflWiy99S0ptTYJNfo0CWZwD1sRfe6TGhNF6x1_VGcrKOqEfAvJGSXrad3ddwjQmsEkwc"/>
            <div>
              <div className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</div>
              <div className="font-label-sm text-label-sm text-secondary">Port Operations</div>
            </div>
          </div>
          {/* Navigation Tabs */}
          <nav className="flex-1 flex flex-col gap-xxs font-label-md text-label-md">
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/dashboard/global">
              <span className="material-symbols-outlined">dashboard</span>
              Tableau de bord
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded text-primary bg-secondary-container font-bold active:scale-95 duration-150 transport-active-border" href="/transport/control" style={{ color: '#F59E0B', backgroundColor: '#FEF3C7', borderLeftColor: '#F59E0B' }}>
              <span className="material-symbols-outlined" style={{ color: '#F59E0B' }}>local_shipping</span>
              Transport
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/finance/overview">
              <span className="material-symbols-outlined">payments</span>
              Finances
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/parc/overview">
              <span className="material-symbols-outlined">minor_crash</span>
              Parc Automobile
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary active:scale-95 duration-150" href="/settings/system/audit-health">
              <span className="material-symbols-outlined">settings</span>
              Paramètres
            </a>
          </nav>
          {/* Footer Actions */}
          <div className="mt-auto flex flex-col gap-sm pt-md border-t border-outline-variant">
            <button className="w-full py-xs px-sm bg-primary text-on-primary rounded font-label-md text-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors shadow-sm" style={{ backgroundColor: '#F59E0B', color: 'white' }}>
              Nouvelle Opération
            </button>
            <nav className="flex flex-col gap-xxs font-label-md text-label-md">
              <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="/support">
                <span className="material-symbols-outlined">help_outline</span>
                Support
              </a>
              <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="/login">
                <span className="material-symbols-outlined">logout</span>
                Déconnexion
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 ml-[260px] flex flex-col min-w-0">
          {/* TopNavBar */}
          <header className="bg-surface border-b border-outline-variant sticky top-0 w-full z-40 flex justify-between items-center h-[64px] px-gutter">
            <div className="flex items-center gap-xl h-full">
              <div className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</div>
              <nav className="hidden md:flex items-end h-full gap-lg font-body-base text-body-base">
                <a className="h-full flex items-center text-on-surface-variant hover:text-primary transition-all" href="#">Articles</a>
                <a className="h-full flex items-center text-on-surface-variant hover:text-primary transition-all" href="#">Clients</a>
                <a className="h-full flex items-center text-on-surface-variant hover:text-primary transition-all" href="#">Stocks</a>
                <a className="h-full flex items-center text-primary border-b-2 border-primary pb-[2px]" href="#" style={{ color: '#F59E0B', borderColor: '#F59E0B' }}>Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-md">
              {/* Search T-Code */}
              <TCodeSearch />
              {/* Trailing Actions */}
              <div className="flex items-center gap-xs text-on-surface-variant">
                <button className="p-xs hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                <button className="p-xs hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
                <button className="p-xs hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">account_circle</span></button>
              </div>
            </div>
          </header>

          {/* Main Stage */}
          <main className="flex-1 p-gutter max-w-max-width mx-auto w-full flex flex-col gap-gutter">
            {/* Breadcrumb & Header */}
            <div className="flex flex-col gap-xs mb-sm">
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                <span>Transport</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span>Gestion Flotte</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-on-surface font-semibold">Suivi Carburant</span>
              </div>
              <div className="flex justify-between items-end">
                <h1 className="font-headline-lg text-headline-lg text-on-surface m-0 leading-none">Gestion Carburant</h1>
                <div className="flex gap-sm">
                  <button className="px-sm py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">download</span> Exporter CSV
                  </button>
                  <button className="px-sm py-1.5 bg-transport-orange text-white rounded font-label-md text-label-md font-bold hover:bg-opacity-90 transition-colors flex items-center gap-xs shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">add</span> Saisir Ticket
                  </button>
                </div>
              </div>
            </div>

            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-sm">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
                <div className="flex justify-between items-start mb-sm">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Volume Total (Ce mois)</span>
                  <span className="material-symbols-outlined text-outline">local_gas_station</span>
                </div>
                <div className="font-headline-md text-headline-md text-on-surface">14,250 L</div>
                <div className="font-body-sm text-body-sm text-secondary mt-xs flex items-center gap-xxs">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +5.2% vs M-1
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-sm">
                <div className="flex justify-between items-start mb-sm">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Dépense Carburant</span>
                  <span className="material-symbols-outlined text-outline">euro</span>
                </div>
                <div className="font-headline-md text-headline-md text-on-surface">21,375 FCFA</div>
                <div className="font-body-sm text-body-sm text-error mt-xs flex items-center gap-xxs">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.1% vs M-1
                </div>
              </div>
              <div className="bg-error-container border border-error border-opacity-20 rounded-lg p-md shadow-sm col-span-1 md:col-span-2 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-sm">
                    <span className="font-label-md text-label-md text-error uppercase tracking-wider font-bold">Alertes Siphonnage / Anomalies</span>
                    <span className="material-symbols-outlined text-error">warning</span>
                  </div>
                  <div className="flex items-end gap-md">
                    <div className="font-headline-lg text-headline-lg text-error leading-none">3</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant pb-1">Chutes de niveau inexpliquées &gt; 5% détectées ce mois-ci.</div>
                  </div>
                  <button className="mt-sm font-label-sm text-label-sm text-error font-bold flex items-center gap-xxs hover:underline">
                    Voir Détails <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Data Table Section */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden mt-sm">
              {/* Table Header / Filters */}
              <div className="p-sm border-b border-outline-variant bg-surface-bright flex justify-between items-center">
                <div className="flex gap-sm">
                  <div className="relative">
                    <select className="appearance-none bg-surface border border-outline-variant rounded py-1 pl-sm pr-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-transport-orange">
                      <option>Tous les Véhicules</option>
                      <option>Camions Lourds</option>
                      <option>Utilitaires</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-xs top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">arrow_drop_down</span>
                  </div>
                  <div className="relative">
                    <select className="appearance-none bg-surface border border-outline-variant rounded py-1 pl-sm pr-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-transport-orange">
                      <option>7 Derniers Jours</option>
                      <option>Ce Mois</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-xs top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">arrow_drop_down</span>
                  </div>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-xs top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
                  <input className="pl-xl pr-sm py-1 bg-surface border border-outline-variant rounded font-body-sm text-body-sm w-[250px] focus:outline-none focus:ring-1 focus:ring-transport-orange" placeholder="Filtrer Immatriculation..." type="text"/>
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-outline-variant sticky top-0">
                    <tr>
                      <th className="p-sm font-medium">Immatriculation</th>
                      <th className="p-sm font-medium">Chauffeur</th>
                      <th className="p-sm font-medium">Date Dernier Plein</th>
                      <th className="p-sm font-medium text-right">Vol. Ajouté</th>
                      <th className="p-sm font-medium text-right">Conso. Moy (L/100)</th>
                      <th className="p-sm font-medium text-center">Statut Niveau</th>
                      <th className="p-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular text-on-surface divide-y divide-outline-variant">
                    {/* Row 1 */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-white">
                      <td className="p-sm font-semibold">TRK-902-AB</td>
                      <td className="p-sm">Jean Dupont</td>
                      <td className="p-sm">12 Nov, 08:45</td>
                      <td className="p-sm text-right">450 L</td>
                      <td className="p-sm text-right">32.4</td>
                      <td className="p-sm text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container">NORMAL</span>
                      </td>
                      <td className="p-sm">
                        <button className="text-on-surface-variant hover:text-transport-orange"><span className="material-symbols-outlined text-[18px]">receipt_long</span></button>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-[#F9FAFB]">
                      <td className="p-sm font-semibold">TRK-114-XY</td>
                      <td className="p-sm">Marc Lemoine</td>
                      <td className="p-sm">11 Nov, 14:20</td>
                      <td className="p-sm text-right">380 L</td>
                      <td className="p-sm text-right">34.1</td>
                      <td className="p-sm text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-error">CHUTE -8%</span>
                      </td>
                      <td className="p-sm">
                        <button className="text-error hover:text-error-container"><span className="material-symbols-outlined text-[18px]">warning</span></button>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-white">
                      <td className="p-sm font-semibold">VUL-551-ZZ</td>
                      <td className="p-sm">Alice Dubois</td>
                      <td className="p-sm">10 Nov, 09:15</td>
                      <td className="p-sm text-right">65 L</td>
                      <td className="p-sm text-right">8.5</td>
                      <td className="p-sm text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container">NORMAL</span>
                      </td>
                      <td className="p-sm">
                        <button className="text-on-surface-variant hover:text-transport-orange"><span className="material-symbols-outlined text-[18px]">receipt_long</span></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="p-xs border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center font-body-sm text-body-sm text-on-surface-variant">
                <span>Affichage 1-3 sur 42 véhicules</span>
                <div className="flex items-center gap-xs">
                  <button className="p-1 border border-outline-variant rounded hover:bg-surface disabled:opacity-50" disabled><span className="material-symbols-outlined text-[16px]">chevron_left</span></button>
                  <span className="font-medium text-on-surface">1</span>
                  <button className="p-1 border border-outline-variant rounded hover:bg-surface"><span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
