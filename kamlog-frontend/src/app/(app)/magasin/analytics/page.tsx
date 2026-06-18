// src/app/(app)/magasin/analytics/page.tsx - K-Magasin Inventory Analytics - Fidèle 100% au HTML original
'use client'

export default function MagasinAnalyticsPage() {
  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        /* Custom scrollbar for high-density tables */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f3ff;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex overflow-hidden">
        {/* SideNavBar */}
        <nav className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-md z-50">
          <div className="flex items-center gap-sm mb-lg">
            <img alt="KAMLOG Company Logo" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW0GP3VedDFwGPDgLKO7sEG8n5FDtqgeWlGXY-CjavhTH98wTNlf8CV8_bDL1UejFBIfqNubK_5x5Ml_1Em31ArDWVEHKauY8aFwnBuA44uWQZlKooRT2bCmwaY5htQjYtZbuHpJRyFQjeZDTlkVF0zN6a0B9Pqlu6-rW8q7QQL7VwfSifEO9U0cfzOVZnIeu_mahfowBtsirHaFgfOF2eAloY5qsA8QwaiOH1Ldkh4CRcOXRmXBz16dk-GKVOnKHcze5GA9q8FAA"/>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Port Operations</p>
            </div>
          </div>
          <button className="w-full bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-title-md text-title-md py-sm px-md rounded flex items-center justify-center gap-xs mb-lg transition-colors active:scale-95 duration-150">
            <span className="material-symbols-outlined icon-fill">add</span>
            Nouvelle Opération
          </button>
          <div className="flex-1 flex flex-col gap-xs">
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-caps text-label-caps">Tableau de bord</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="#">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-label-caps text-label-caps">Transport</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="#">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-caps text-label-caps">Finances</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="#">
              <span className="material-symbols-outlined">minor_crash</span>
              <span className="font-label-caps text-label-caps">Parc Automobile</span>
            </a>
            {/* Active State mapping for K-Magasin */}
            <a className="flex items-center gap-sm px-sm py-xs rounded text-primary bg-secondary-container font-bold relative overflow-hidden group" href="#">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-module-red"></div>
              <span className="material-symbols-outlined text-module-red">warehouse</span>
              <span className="font-label-caps text-label-caps text-module-red">K-Magasin (KM32)</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-caps text-label-caps">Paramètres</span>
            </a>
          </div>
          <div className="mt-auto border-t border-outline-variant pt-sm flex flex-col gap-xs">
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="#">
              <span className="material-symbols-outlined">help_outline</span>
              <span className="font-label-caps text-label-caps">Support</span>
            </a>
            <a className="flex items-center gap-sm px-sm py-xs rounded hover:bg-surface-container-high transition-colors text-secondary" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-caps text-label-caps">Déconnexion</span>
            </a>
          </div>
        </nav>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col ml-[260px] h-screen overflow-hidden">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter shrink-0">
            <div className="flex items-center gap-md">
              <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
              <nav className="hidden md:flex gap-sm ml-md">
                <a className="text-primary border-b-2 border-primary pb-1 font-body-base text-body-base hover:text-primary transition-all" href="#">Articles</a>
                <a className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all" href="#">Clients</a>
                <a className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all" href="#">Stocks</a>
                <a className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-sm">
              {/* T-Code Search */}
              <div className="relative focus-within:ring-2 focus-within:ring-module-red rounded bg-surface-container h-8 flex items-center px-xs w-64 border border-outline-variant">
                <span className="material-symbols-outlined text-outline text-[18px] mr-xs">search</span>
                <input className="bg-transparent border-none outline-none text-body-sm font-body-sm text-on-surface w-full p-0 h-full placeholder:text-outline" placeholder="Rechercher T-Code..." type="text"/>
                <div className="bg-module-red text-white text-[10px] font-bold px-1 rounded ml-xs shrink-0">KM32</div>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant border-l border-outline-variant pl-sm ml-xs">
                <button className="p-xs hover:bg-surface-variant rounded-full transition-colors relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-module-red rounded-full"></span>
                </button>
                <button className="p-xs hover:bg-surface-variant rounded-full transition-colors">
                  <span className="material-symbols-outlined">verified_user</span>
                </button>
                <img alt="User profile with MFA status" className="w-8 h-8 rounded-full ml-xs border border-outline-variant cursor-pointer hover:ring-2 ring-primary transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSJKUOF26xssQOOz4ako_9m6QFiPfRJIKkYCteaKKyzUYrSWSsiAakZudPzDhs2DMq5OnswjTHt8-I5xfIjKPQqO_V1OOR7mjFG2EyqH4p0kf6k3QvgJFxrmHXWmh3Z7LB5oUivjveuSQZiEx8lKeKPS0uypT-oZK4kLJcxENu06q1yig4rZEPpLKu4DBztZJl_IEb5zXV01Kon6QoRUwIH4t3X_uslEg-wy2nxIaWOqHkU7GXJXVT7V2QjxjY_jV9eXpKo8hq0g4"/>
              </div>
            </div>
          </header>

          {/* Main Stage Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-md bg-surface-container-low">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-sm">
              {/* Breadcrumbs & Header */}
              <div className="flex flex-col mb-xs">
                <div className="flex items-center gap-xs text-label-sm font-label-sm text-outline mb-1">
                  <span>ERP</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span>Logistique</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span className="text-module-red font-bold">K-Magasin (KM32)</span>
                </div>
                <div className="flex justify-between items-end">
                  <h2 className="text-headline-lg font-headline-lg text-on-surface">Inventory Analytics</h2>
                  {/* Global Filters */}
                  <div className="flex gap-sm">
                    <div className="bg-white border border-outline-variant rounded p-xs flex items-center gap-xs shadow-sm cursor-pointer hover:border-module-red transition-colors">
                      <span className="material-symbols-outlined text-outline text-[16px]">category</span>
                      <span className="text-body-sm font-body-sm text-on-surface">Toutes Catégories</span>
                      <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                    </div>
                    <div className="bg-white border border-outline-variant rounded p-xs flex items-center gap-xs shadow-sm cursor-pointer hover:border-module-red transition-colors">
                      <span className="material-symbols-outlined text-outline text-[16px]">domain</span>
                      <span className="text-body-sm font-body-sm text-on-surface">Entrepôt Principal (Z1)</span>
                      <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                    </div>
                    <button className="bg-surface-variant hover:bg-outline-variant text-on-surface p-xs rounded shadow-sm transition-colors">
                      <span className="material-symbols-outlined text-[20px]">filter_list</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-12 gap-md">
                {/* KPI Cards (Row 1, span 3 each) */}
                <div className="col-span-3 bg-white border border-outline-variant rounded shadow-sm p-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Taux d'Occupation</span>
                    <span className="material-symbols-outlined text-module-red text-[20px]">dataset</span>
                  </div>
                  <div className="flex items-end gap-xs">
                    <span className="text-headline-lg font-headline-lg text-on-surface">87.4%</span>
                    <span className="text-label-sm font-label-sm text-module-red flex items-center mb-1 bg-module-red-light px-1 rounded">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> +2.1%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-1 mt-xs rounded-full overflow-hidden">
                    <div className="bg-module-red h-full" style={{ width: '87.4%' }}></div>
                  </div>
                </div>
                <div className="col-span-3 bg-white border border-outline-variant rounded shadow-sm p-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Articles Lents (30j+)</span>
                    <span className="material-symbols-outlined text-tertiary-container text-[20px]">hourglass_bottom</span>
                  </div>
                  <div className="flex items-end gap-xs">
                    <span className="text-headline-lg font-headline-lg text-on-surface">1,432</span>
                    <span className="text-label-sm font-label-sm text-tertiary-container flex items-center mb-1">
                      12% du total
                    </span>
                  </div>
                </div>
                <div className="col-span-3 bg-white border border-outline-variant rounded shadow-sm p-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Mouvements J-0</span>
                    <span className="material-symbols-outlined text-primary text-[20px]">swap_horiz</span>
                  </div>
                  <div className="flex items-end gap-xs">
                    <span className="text-headline-lg font-headline-lg text-on-surface">8,904</span>
                    <span className="text-label-sm font-label-sm text-primary flex items-center mb-1 bg-surface-container px-1 rounded">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span> +450
                    </span>
                  </div>
                </div>
                <div className="col-span-3 bg-white border border-outline-variant rounded shadow-sm p-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Valeur Stock (M€)</span>
                    <span className="material-symbols-outlined text-secondary text-[20px]">euro_symbol</span>
                  </div>
                  <div className="flex items-end gap-xs">
                    <span className="text-headline-lg font-headline-lg text-on-surface">42.8</span>
                    <span className="text-label-sm font-label-sm text-secondary flex items-center mb-1">
                      stable
                    </span>
                  </div>
                </div>

                {/* Left Column: Data Table (Span 8) */}
                <div className="col-span-8 bg-white border border-outline-variant rounded shadow-sm flex flex-col h-[500px]">
                  <div className="p-sm border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                    <h3 className="text-title-md font-title-md text-on-surface flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[18px] text-module-red">warning</span>
                      Alertes Articles à Rotation Lente
                    </h3>
                    <button className="text-body-sm font-body-sm text-module-red hover:underline">Voir tout</button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_#E5E7EB]">
                        <tr>
                          <th className="py-xs px-sm text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">SKU / Code</th>
                          <th className="py-xs px-sm text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Description</th>
                          <th className="py-xs px-sm text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold text-right">Qte.</th>
                          <th className="py-xs px-sm text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold text-right">Jours Immo.</th>
                          <th className="py-xs px-sm text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Zone</th>
                          <th className="py-xs px-sm text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="text-data-tabular font-data-tabular text-on-surface divide-y divide-outline-variant">
                        {/* Row 1 */}
                        <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-xs px-sm font-mono text-module-red group-hover:underline">P-9902-X</td>
                          <td className="py-xs px-sm truncate max-w-[200px]">Moteur Diesel Heavy Duty 400HP</td>
                          <td className="py-xs px-sm text-right">14</td>
                          <td className="py-xs px-sm text-right text-error font-semibold">184</td>
                          <td className="py-xs px-sm font-mono text-[11px]">Z1-A4-E2</td>
                          <td className="py-xs px-sm">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">CRITIQUE</span>
                          </td>
                        </tr>
                        {/* Row 2 */}
                        <tr className="bg-[#F9FAFB] hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-xs px-sm font-mono text-primary group-hover:underline">C-1104-B</td>
                          <td className="py-xs px-sm truncate max-w-[200px]">Câble Acier Tressé 50m Bobine</td>
                          <td className="py-xs px-sm text-right">240</td>
                          <td className="py-xs px-sm text-right text-tertiary-container font-semibold">92</td>
                          <td className="py-xs px-sm font-mono text-[11px]">Z2-C1-E1</td>
                          <td className="py-xs px-sm">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">ATTENTION</span>
                          </td>
                        </tr>
                        {/* Row 3 */}
                        <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-xs px-sm font-mono text-primary group-hover:underline">F-3301-A</td>
                          <td className="py-xs px-sm truncate max-w-[200px]">Filtre à Huile Industriel X7</td>
                          <td className="py-xs px-sm text-right">1,200</td>
                          <td className="py-xs px-sm text-right text-tertiary-container font-semibold">65</td>
                          <td className="py-xs px-sm font-mono text-[11px]">Z1-B2-E4</td>
                          <td className="py-xs px-sm">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">ATTENTION</span>
                          </td>
                        </tr>
                        {/* Row 4 */}
                        <tr className="bg-[#F9FAFB] hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-xs px-sm font-mono text-primary group-hover:underline">V-5509-L</td>
                          <td className="py-xs px-sm truncate max-w-[200px]">Vanne Papillon DN150 Inox</td>
                          <td className="py-xs px-sm text-right">85</td>
                          <td className="py-xs px-sm text-right text-error font-semibold">145</td>
                          <td className="py-xs px-sm font-mono text-[11px]">Z3-A1-E3</td>
                          <td className="py-xs px-sm">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">CRITIQUE</span>
                          </td>
                        </tr>
                        {/* Row 5 */}
                        <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-xs px-sm font-mono text-primary group-hover:underline">E-2208-K</td>
                          <td className="py-xs px-sm truncate max-w-[200px]">Engrenage Planétaire D-40</td>
                          <td className="py-xs px-sm text-right">12</td>
                          <td className="py-xs px-sm text-right text-tertiary-container font-semibold">88</td>
                          <td className="py-xs px-sm font-mono text-[11px]">Z1-D4-E1</td>
                          <td className="py-xs px-sm">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">ATTENTION</span>
                          </td>
                        </tr>
                        {/* Row 6 */}
                        <tr className="bg-[#F9FAFB] hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-xs px-sm font-mono text-primary group-hover:underline">P-1102-X</td>
                          <td className="py-xs px-sm truncate max-w-[200px]">Pompe Hydraulique Haute Pression</td>
                          <td className="py-xs px-sm text-right">4</td>
                          <td className="py-xs px-sm text-right text-error font-semibold">210</td>
                          <td className="py-xs px-sm font-mono text-[11px]">Z2-B1-E2</td>
                          <td className="py-xs px-sm">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">CRITIQUE</span>
                          </td>
                        </tr>
                        {/* Row 7 */}
                        <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                          <td className="py-xs px-sm font-mono text-primary group-hover:underline">R-8804-M</td>
                          <td className="py-xs px-sm truncate max-w-[200px]">Roulement à Billes Céramique</td>
                          <td className="py-xs px-sm text-right">450</td>
                          <td className="py-xs px-sm text-right text-tertiary-container font-semibold">55</td>
                          <td className="py-xs px-sm font-mono text-[11px]">Z1-A2-E5</td>
                          <td className="py-xs px-sm">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">ATTENTION</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Heat Map & Composition (Span 4) */}
                <div className="col-span-4 flex flex-col gap-md h-[500px]">
                  {/* Heat Map Card */}
                  <div className="bg-white border border-outline-variant rounded shadow-sm p-sm flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-sm">
                      <h3 className="text-title-md font-title-md text-on-surface flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px] text-primary">map</span>
                        Occupation Entrepôt Z1
                      </h3>
                      <span className="material-symbols-outlined text-outline text-[16px] cursor-help" title="Densité de stockage par allée">info</span>
                    </div>
                    {/* Simplified CSS Grid Heatmap */}
                    <div className="flex-1 bg-surface-container-low rounded border border-outline-variant p-2 grid grid-cols-5 gap-1">
                      {/* Col 1 */}
                      <div className="bg-module-red opacity-90 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée A1: 95%</div></div>
                      <div className="bg-module-red opacity-80 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée A2: 85%</div></div>
                      <div className="bg-module-red opacity-100 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée A3: 100%</div></div>
                      <div className="bg-module-red opacity-40 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée A4: 40%</div></div>
                      <div className="bg-module-red opacity-20 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée A5: 20%</div></div>
                      {/* Col 2 */}
                      <div className="bg-module-red opacity-70 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée B1: 70%</div></div>
                      <div className="bg-module-red opacity-60 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée B2: 60%</div></div>
                      <div className="bg-module-red opacity-90 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée B3: 90%</div></div>
                      <div className="bg-module-red opacity-30 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée B4: 30%</div></div>
                      <div className="bg-surface-container-high rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée B5: 0%</div></div>
                      {/* Col 3 (Aisle) */}
                      <div className="col-span-5 flex items-center justify-center text-[10px] text-outline tracking-widest font-bold">ALLÉE CENTRALE</div>
                      {/* Col 4 */}
                      <div className="bg-module-red opacity-80 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée C1: 80%</div></div>
                      <div className="bg-module-red opacity-70 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée C2: 70%</div></div>
                      <div className="bg-module-red opacity-50 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée C3: 50%</div></div>
                      <div className="bg-module-red opacity-40 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée C4: 40%</div></div>
                      <div className="bg-module-red opacity-60 rounded relative group"><div className="hidden group-hover:block absolute -top-6 left-0 bg-on-surface text-white text-[10px] px-1 rounded whitespace-nowrap z-20">Allée C5: 60%</div></div>
                    </div>
                    <div className="flex justify-between items-center mt-xs text-[10px] font-label-md text-outline">
                      <span>Vide</span>
                      <div className="flex-1 mx-2 h-1 bg-gradient-to-r from-surface-container-high to-module-red rounded-full"></div>
                      <span>Saturé</span>
                    </div>
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
