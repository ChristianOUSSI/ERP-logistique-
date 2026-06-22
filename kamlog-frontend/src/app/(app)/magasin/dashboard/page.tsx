// src/app/(app)/magasin/dashboard/page.tsx - K-Magasin Dashboard ERP Design - Fidèle au HTML original
'use client'

export default function KMagasinDashboard() {
  return (
    <div className="flex h-screen bg-surface text-on-background font-body-base antialiased overflow-hidden">
      {/* SideNavBar */}
      <aside className="bg-surface-container-lowest text-on-surface flex flex-col h-screen p-stack-md fixed left-0 top-0 h-full w-[260px] border-r border-outline-variant shadow-sm z-50">
        <div className="mb-stack-lg flex items-center gap-3 px-3">
          <div className="w-10 h-10 bg-primary text-on-primary rounded flex items-center justify-center font-bold font-title-sm">
            K
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Port Operations</p>
          </div>
        </div>
        
        <button className="w-full bg-primary text-on-primary rounded py-2 px-4 flex items-center justify-center gap-2 mb-stack-lg font-title-sm hover:opacity-90 active:scale-95 duration-150 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nouvelle Opération
        </button>
        
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors font-label-caps text-label-caps active:scale-95 duration-150" href="/dashboard/global">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Tableau de bord
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors font-label-caps text-label-caps active:scale-95 duration-150" href="/transport/control">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            Transport
          </a>
          {/* Active State on Stocks (K-Magasin logic) */}
          <a className="flex items-center gap-3 px-3 py-2 rounded text-primary bg-primary-container font-bold font-label-caps text-label-caps active:scale-95 duration-150" href="/magasin/dashboard">
            <span className="material-symbols-outlined text-[20px]">warehouse</span>
            K-Magasin
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors font-label-caps text-label-caps active:scale-95 duration-150" href="/finance/overview">
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Finances
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors font-label-caps text-label-caps active:scale-95 duration-150" href="/parc/overview">
            <span className="material-symbols-outlined text-[20px]">minor_crash</span>
            Parc Automobile
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors font-label-caps text-label-caps active:scale-95 duration-150" href="/settings/system/audit-health">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Paramètres
          </a>
        </nav>
        
        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-3">
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors font-label-caps text-label-caps" href="/support">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            Support
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors font-label-caps text-label-caps" href="/login">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Déconnexion
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen bg-surface">
        {/* TopNavBar */}
        <header className="bg-surface text-primary sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter">
          <div className="flex items-center gap-stack-lg">
            <h2 className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</h2>
            <nav className="hidden md:flex gap-stack-md">
              <a className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base" href="#">Articles</a>
              <a className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base" href="#">Clients</a>
              {/* Active top nav */}
              <a className="text-primary border-b-2 border-primary pb-1 font-body-base text-body-base" href="#">Stocks</a>
              <a className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base" href="#">Rapports</a>
            </nav>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="relative focus-within:ring-2 focus-within:ring-primary rounded">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
              <input 
                className="pl-9 pr-4 py-1.5 bg-surface-container-highest border-none rounded text-on-surface font-mono-data text-mono-data focus:outline-none w-48" 
                placeholder="Rechercher T-Code" 
                type="text" 
                defaultValue="KM24"
              />
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <button className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </button>
              <button className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Canvas / Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-container-margin">
          {/* Dashboard Header */}
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h3 className="font-display-lg text-display-lg text-on-surface mb-1">K-Magasin</h3>
              <p className="font-body-base text-body-base text-on-surface-variant">Warehouse Management Overview</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded font-title-sm text-sm hover:bg-surface-container-high flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export
              </button>
              <button className="bg-primary text-on-primary px-4 py-2 rounded font-title-sm text-sm hover:opacity-90 flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">sync</span>
                Refresh Data
              </button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-stack-md">
            {/* KPI Cards (Cols 1-8, top row) */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-stack-md">
              {/* KPI 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-caps text-label-caps text-secondary">Total Stock Value</span>
                  <span className="material-symbols-outlined text-outline text-[20px]">account_balance_wallet</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">€ 2.4M</div>
                  <div className="font-body-sm text-body-sm text-primary flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +3.2%
                  </div>
                </div>
              </div>
              
              {/* KPI 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-caps text-label-caps text-secondary">Occupation Rate</span>
                  <span className="material-symbols-outlined text-outline text-[20px]">warehouse</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">85%</div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              
              {/* KPI 3 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-caps text-label-caps text-secondary">Pending Receptions</span>
                  <span className="material-symbols-outlined text-outline text-[20px]">input</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">14 <span className="text-sm text-on-surface-variant font-normal">T-Codes</span></div>
                  <div className="font-body-sm text-body-sm text-secondary mt-1">Next: KM24</div>
                </div>
              </div>
              
              {/* KPI 4 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-caps text-label-caps text-secondary">Active Declarations</span>
                  <span className="material-symbols-outlined text-outline text-[20px]">description</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">8</div>
                  <div className="font-body-sm text-body-sm text-secondary mt-1">Alert: KT10</div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Cols 9-12, top row) */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm">
              <h4 className="font-label-caps text-label-caps text-secondary mb-3 border-b border-outline-variant pb-2">Quick Actions</h4>
              <div className="flex flex-col gap-2">
                <button className="w-full text-left px-3 py-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between border border-transparent hover:border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">add</span>
                    <span className="font-body-base text-sm font-medium text-on-surface">New Reception</span>
                  </div>
                  <span className="font-mono-data text-xs text-on-surface-variant">NR</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between border border-transparent hover:border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">search</span>
                    <span className="font-body-base text-sm font-medium text-on-surface">Stock Search</span>
                  </div>
                  <span className="font-mono-data text-xs text-on-surface-variant">SS</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded bg-error-container text-on-error-container hover:bg-opacity-80 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span className="font-body-base text-sm font-medium">Cancel Operation (OT)</span>
                  </div>
                  <span className="font-mono-data text-xs opacity-70">CO</span>
                </button>
              </div>
            </div>

            {/* Recent Operation Trace Table (Cols 1-8, bottom row) */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center">
                <h4 className="font-title-sm text-title-sm text-on-surface">Recent Operation Trace</h4>
                <button className="text-primary text-sm font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-highest border-b border-outline-variant">
                      <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">numero_ot</th>
                      <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">type_operation</th>
                      <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">user</th>
                      <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">status</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant">
                    <tr className="hover:bg-surface-container-low transition-colors group h-grid-row-height">
                      <td className="px-4 py-2 font-mono-data">OT-2023-881</td>
                      <td className="px-4 py-2">Reception (KM24)</td>
                      <td className="px-4 py-2">J. Dupont</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Terminé</span>
                      </td>
                      <td className="px-4 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group h-grid-row-height">
                      <td className="px-4 py-2 font-mono-data">OT-2023-882</td>
                      <td className="px-4 py-2">Expédition</td>
                      <td className="px-4 py-2">M. Lavoie</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">En cours</span>
                      </td>
                      <td className="px-4 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group h-grid-row-height">
                      <td className="px-4 py-2 font-mono-data">OT-2023-883</td>
                      <td className="px-4 py-2">Inventaire</td>
                      <td className="px-4 py-2">A. Martin</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">En attente</span>
                      </td>
                      <td className="px-4 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group h-grid-row-height">
                      <td className="px-4 py-2 font-mono-data">OT-2023-884</td>
                      <td className="px-4 py-2">Déclaration (KT10)</td>
                      <td className="px-4 py-2">S. Bernard</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error-container text-on-error-container border border-error">Bloqué</span>
                      </td>
                      <td className="px-4 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group h-grid-row-height">
                      <td className="px-4 py-2 font-mono-data">OT-2023-885</td>
                      <td className="px-4 py-2">Transfert</td>
                      <td className="px-4 py-2">L. Petit</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">Terminé</span>
                      </td>
                      <td className="px-4 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warehouse Capacity Chart (Cols 9-12, bottom row) */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col items-center justify-center relative min-h-[300px]">
              <h4 className="font-title-sm text-title-sm text-on-surface absolute top-4 left-4 w-full text-left">Capacity</h4>
              {/* CSS Donut Chart Representation */}
              <div className="relative w-48 h-48 rounded-full flex items-center justify-center mt-6" style={{ background: 'conic-gradient(#EF4444 0% 85%, #e1e2ec 85% 100%)' }}>
                <div className="absolute inset-0 m-4 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="font-display-lg text-display-lg text-on-surface">85%</span>
                  <span className="font-label-caps text-label-caps text-secondary">Utilisé</span>
                </div>
              </div>
              <div className="mt-6 w-full flex justify-around text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary"></div>
                  <span className="text-on-surface-variant font-body-sm">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-surface-container-highest"></div>
                  <span className="text-on-surface-variant font-body-sm">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
