// src/app/(app)/magasin/capacity/page.tsx - K-Magasin Capacity Map - Fidèle 100% au HTML original
'use client'

export default function MagasinCapacityPage() {
  return (
    <>
      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; background-color: #f0f3ff; }
        .material-symbols-outlined { font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24'; }
        .material-symbols-outlined.filled { font-variation-settings: 'FILL 1'; }
        /* Custom scrollbar for high-density areas */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #727785; }
      `}</style>
      <div className="text-on-background flex h-screen overflow-hidden">
        {/* SideNavBar */}
        <nav className="bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col h-screen p-stack-md fixed left-0 top-0 h-full w-[260px] z-50">
          {/* Header */}
          <div className="px-md py-lg mb-md">
            <div className="flex items-center gap-xs mb-xs">
              <img alt="KAMLOG Company Logo" className="w-8 h-8 rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0x4oRnQhZbBGE-oHDiwSSrbuIz0zEQiq1HxK-J9AhX8LkAwuOcKBMgc5o5w1eUjkuCU58hGIzrEUpBjVEIFbWWkyLTDJgseg66LL0jRH2_l-t5HUisqO9LMk9kVCpwW9cVMAYEHCqJEihoYsNwmfbGTWR78EpbHcVcRsluXcADFsGYo-0aybixVtBoy6ALAdhOqSkyCndErffHLzrqZjgYKpB5G_KJebYXcowYIfdu8l7Vpn3eZN_huvj3gg3h-yFGRdtga4is6I"/>
              <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Port Operations</p>
          </div>
          {/* CTA */}
          <div className="px-md mb-lg">
            <button className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-title-sm text-title-sm py-xs px-md rounded flex justify-center items-center gap-xs transition-colors shadow-sm">
              <span className="material-symbols-outlined">add</span>
              Nouvelle Opération
            </button>
          </div>
          {/* Main Nav */}
          <div className="flex-1 overflow-y-auto px-xs space-y-xxs font-label-caps text-label-caps">
            <a className="flex items-center gap-sm px-md py-sm rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              Tableau de bord
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">local_shipping</span>
              Transport
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">payments</span>
              Finances
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">minor_crash</span>
              Parc Automobile
            </a>
            {/* K-Magasin (Active, mapped from intent) */}
            <a className="flex items-center gap-sm px-md py-sm rounded text-primary bg-secondary-container font-bold active:scale-95 duration-150 relative" href="#">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-km-red rounded-l"></div>
              <span className="material-symbols-outlined" style={{ color: '#EF4444' }}>warehouse</span>
              <span style={{ color: '#EF4444' }}>Magasin (KM)</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">settings</span>
              Paramètres
            </a>
          </div>
          {/* Footer Nav */}
          <div className="mt-auto px-xs pb-md pt-sm border-t border-outline-variant space-y-xxs font-label-caps text-label-caps">
            <a className="flex items-center gap-sm px-md py-sm rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">help_outline</span>
              Support
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="#">
              <span className="material-symbols-outlined">logout</span>
              Déconnexion
            </a>
          </div>
        </nav>

        {/* Main Content Wrapper */}
        <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 flex justify-between items-center h-[64px] px-gutter border-b border-outline-variant">
            <div className="flex items-center gap-lg">
              <div className="font-title-sm text-title-sm text-on-surface font-black">
                KAMLOG EM-ERP
              </div>
              <nav className="hidden md:flex gap-md font-body-base text-body-base h-full items-center">
                <a className="text-on-surface-variant hover:text-primary transition-all h-full flex items-center px-xs" href="#">Articles</a>
                <a className="text-on-surface-variant hover:text-primary transition-all h-full flex items-center px-xs" href="#">Clients</a>
                <a className="text-primary border-b-2 border-primary pb-1 h-full flex items-center px-xs font-medium" href="#">Stocks</a>
                <a className="text-on-surface-variant hover:text-primary transition-all h-full flex items-center px-xs" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-md">
              {/* Search Bar (on_right) */}
              <div className="relative flex items-center focus-within:ring-2 focus-within:ring-primary rounded bg-surface-container-low border border-outline-variant h-8 w-64">
                <span className="material-symbols-outlined absolute left-2 text-outline text-[18px]">search</span>
                <input className="w-full h-full pl-8 pr-2 bg-transparent border-none text-body-sm font-body-sm focus:ring-0 text-on-surface" placeholder="Rechercher T-Code" type="text"/>
                <div className="absolute right-1 px-1 bg-surface-variant text-on-surface-variant rounded text-[10px] font-mono">⌘K</div>
              </div>
              {/* Trailing Icons */}
              <div className="flex items-center gap-xs text-on-surface-variant">
                <button className="p-xs hover:bg-surface-container-high rounded transition-colors relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </button>
                <button className="p-xs hover:bg-surface-container-high rounded transition-colors">
                  <span className="material-symbols-outlined">verified_user</span>
                </button>
                <button className="p-xs hover:bg-surface-container-high rounded transition-colors">
                  <span className="material-symbols-outlined">account_circle</span>
                </button>
              </div>
            </div>
          </header>

          {/* Canvas */}
          <main className="flex-1 overflow-auto p-gutter bg-surface-container-low">
            {/* Breadcrumbs & Header */}
            <div className="mb-lg">
              <div className="flex items-center text-label-sm font-label-sm text-outline mb-xxs">
                <span>K-Magasin</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span>T-Code: KM32</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[28px] text-km-red">warehouse</span>
                    Taux d'Occupation
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Vue d'ensemble des silos et sections de stockage.</p>
                </div>
                <div className="flex gap-sm">
                  <button className="bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm py-xs px-md rounded flex items-center gap-xs transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filtrer
                  </button>
                  <button className="bg-km-red hover:bg-[#DC2626] text-white font-title-sm text-title-sm py-xs px-md rounded flex items-center gap-xs transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Rapport
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-gutter max-w-[1600px] mx-auto">
              {/* KPI Row */}
              <div className="col-span-12 grid grid-cols-4 gap-gutter mb-xs">
                <div className="bg-surface-container-lowest rounded border border-outline-variant p-md shadow-sm">
                  <div className="text-label-md font-label-md text-on-surface-variant mb-1">Capacité Totale (T)</div>
                  <div className="font-headline-md text-headline-md text-on-surface">125,000</div>
                </div>
                <div className="bg-surface-container-lowest rounded border border-outline-variant p-md shadow-sm">
                  <div className="text-label-md font-label-md text-on-surface-variant mb-1">Volume Actuel (T)</div>
                  <div className="font-headline-md text-headline-md text-on-surface">89,450</div>
                </div>
                <div className="bg-surface-container-lowest rounded border border-outline-variant p-md shadow-sm border-l-4" style={{ borderLeftColor: '#EF4444' }}>
                  <div className="text-label-md font-label-md text-on-surface-variant mb-1">Taux Global</div>
                  <div className="font-headline-md text-headline-md text-km-red flex items-baseline gap-xs">
                    71.5%
                    <span className="material-symbols-outlined text-[16px] text-km-red">trending_up</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest rounded border border-outline-variant p-md shadow-sm">
                  <div className="text-label-md font-label-md text-on-surface-variant mb-1">Alertes Saturation</div>
                  <div className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
                    2
                    <span className="px-2 py-0.5 bg-km-red-light text-km-red text-[10px] rounded uppercase font-bold">Critique</span>
                  </div>
                </div>
              </div>

              {/* Silo Visualizations (Bento Grid Style) */}
              <div className="col-span-8 space-y-gutter">
                {/* Silo Group A */}
                <div className="bg-surface-container-lowest rounded border border-outline-variant p-md shadow-sm">
                  <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
                    <h3 className="font-title-lg text-title-lg text-on-surface">Secteur Nord (Vrac)</h3>
                    <span className="text-label-md font-label-md text-on-surface-variant">4 Silos</span>
                  </div>
                  <div className="grid grid-cols-4 gap-md h-[240px]">
                    {/* Silo 1 */}
                    <div className="flex flex-col h-full group relative cursor-pointer">
                      <div className="text-center font-label-sm text-label-sm text-on-surface-variant mb-xs">N-01</div>
                      <div className="flex-1 bg-surface-container border border-outline-variant rounded-t-lg relative overflow-hidden flex flex-col justify-end">
                        <div className="absolute inset-x-0 bottom-0 bg-km-red transition-all duration-500 ease-in-out opacity-90 group-hover:opacity-100" style={{ height: '85%' }}>
                          {/* Animated subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="font-data-tabular text-data-tabular text-white font-bold bg-black/30 px-2 py-1 rounded backdrop-blur-sm z-10">85%</span>
                        </div>
                      </div>
                      <div className="bg-surface border-x border-b border-outline-variant p-xs text-center">
                        <div className="text-[10px] text-on-surface-variant truncate">Blé Dur</div>
                      </div>
                      {/* Tooltip (Hover) */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-inverse-surface text-inverse-on-surface p-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none text-body-sm font-body-sm hidden md:block">
                        <div className="font-bold border-b border-outline/30 pb-1 mb-1">Silo N-01</div>
                        <div className="flex justify-between"><span>Capacité:</span> <span>10,000 T</span></div>
                        <div className="flex justify-between"><span>Occupé:</span> <span>8,500 T</span></div>
                        <div className="flex justify-between text-km-red"><span>Statut:</span> <span>Saturé</span></div>
                      </div>
                    </div>
                    {/* Silo 2 */}
                    <div className="flex flex-col h-full group relative cursor-pointer">
                      <div className="text-center font-label-sm text-label-sm text-on-surface-variant mb-xs">N-02</div>
                      <div className="flex-1 bg-surface-container border border-outline-variant rounded-t-lg relative overflow-hidden flex flex-col justify-end">
                        <div className="absolute inset-x-0 bottom-0 bg-km-red transition-all duration-500 ease-in-out opacity-60 group-hover:opacity-80" style={{ height: '42%' }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="font-data-tabular text-data-tabular text-on-surface font-bold">42%</span>
                        </div>
                      </div>
                      <div className="bg-surface border-x border-b border-outline-variant p-xs text-center">
                        <div className="text-[10px] text-on-surface-variant truncate">Maïs</div>
                      </div>
                    </div>
                    {/* Silo 3 */}
                    <div className="flex flex-col h-full group relative cursor-pointer">
                      <div className="text-center font-label-sm text-label-sm text-on-surface-variant mb-xs">N-03</div>
                      <div className="flex-1 bg-surface-container border border-outline-variant rounded-t-lg relative overflow-hidden flex flex-col justify-end">
                        <div className="absolute inset-x-0 bottom-0 bg-km-red transition-all duration-500 ease-in-out opacity-90 group-hover:opacity-100" style={{ height: '92%' }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="font-data-tabular text-data-tabular text-white font-bold bg-black/30 px-2 py-1 rounded backdrop-blur-sm z-10">92%</span>
                        </div>
                      </div>
                      <div className="bg-surface border-x border-b border-outline-variant p-xs text-center">
                        <div className="text-[10px] text-km-red font-bold flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">warning</span>
                          Orge
                        </div>
                      </div>
                    </div>
                    {/* Silo 4 */}
                    <div className="flex flex-col h-full group relative cursor-pointer">
                      <div className="text-center font-label-sm text-label-sm text-on-surface-variant mb-xs">N-04</div>
                      <div className="flex-1 bg-surface-container border border-outline-variant rounded-t-lg relative overflow-hidden flex flex-col justify-end">
                        <div className="absolute inset-x-0 bottom-0 bg-outline-variant transition-all duration-500 ease-in-out opacity-50" style={{ height: '5%' }}>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="font-data-tabular text-data-tabular text-on-surface-variant">Vide</span>
                        </div>
                      </div>
                      <div className="bg-surface border-x border-b border-outline-variant p-xs text-center">
                        <div className="text-[10px] text-on-surface-variant truncate">-</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Rail: Details & List */}
              <div className="col-span-4 space-y-gutter">
                {/* Table summary */}
                <div className="bg-surface-container-lowest rounded border border-outline-variant shadow-sm flex flex-col h-[340px]">
                  <div className="p-md border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-title-md text-title-md text-on-surface">Top Occupations</h3>
                    <button className="text-km-red text-label-sm font-label-sm hover:underline">Voir Tout</button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left font-data-tabular text-data-tabular">
                      <thead className="sticky top-0 bg-surface-container-low text-on-surface-variant">
                        <tr>
                          <th className="py-2 px-3 font-medium">Empl.</th>
                          <th className="py-2 px-3 font-medium">Produit</th>
                          <th className="py-2 px-3 font-medium text-right">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low cursor-pointer">
                          <td className="py-2 px-3">N-03</td>
                          <td className="py-2 px-3">Orge</td>
                          <td className="py-2 px-3 text-right font-bold text-km-red">92%</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low cursor-pointer">
                          <td className="py-2 px-3">N-01</td>
                          <td className="py-2 px-3">Blé Dur</td>
                          <td className="py-2 px-3 text-right text-on-surface">85%</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low cursor-pointer">
                          <td className="py-2 px-3">S-04</td>
                          <td className="py-2 px-3">Soja</td>
                          <td className="py-2 px-3 text-right text-on-surface">78%</td>
                        </tr>
                        <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low cursor-pointer bg-km-red-light/30">
                          <td className="py-2 px-3">E-12</td>
                          <td className="py-2 px-3 text-km-red">Ciment</td>
                          <td className="py-2 px-3 text-right text-km-red font-bold">98%</td>
                        </tr>
                      </tbody>
                    </table>
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
