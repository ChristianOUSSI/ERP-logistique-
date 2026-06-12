// src/app/(app)/parc/overview/page.tsx - K-Parc Fleet Management Overview ERP Design - Fidèle au HTML original
'use client'

export default function KParcFleetManagementOverview() {
  return (
    <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen overflow-x-hidden antialiased">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50 flex flex-col p-md">
        {/* Brand / Header */}
        <div className="flex items-center gap-sm mb-xl px-xs">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-[20px]">directions_boat</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">KAMLOG ERP</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Port Operations</p>
          </div>
        </div>

        {/* Primary CTA */}
        <button className="w-full mb-lg bg-primary text-on-primary rounded-lg py-sm px-md flex items-center justify-center gap-xs font-title-sm hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Nouvelle Opération
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-xs overflow-y-auto scrollbar-hide">
          <a className="flex items-center gap-sm px-md py-sm rounded-lg font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors group" href="#">
            <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">dashboard</span>
            <span className="flex-1">Tableau de bord</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors group" href="#">
            <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">local_shipping</span>
            <span className="flex-1">Transport</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors group" href="#">
            <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">payments</span>
            <span className="flex-1">Finances</span>
          </a>
          {/* ACTIVE TAB: Parc Automobile */}
          <a className="flex items-center gap-sm px-md py-sm rounded-lg font-label-caps text-label-caps text-primary bg-secondary-container font-bold relative overflow-hidden group" href="#">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <span className="material-symbols-outlined text-primary text-[20px]">minor_crash</span>
            <span className="flex-1">Parc Automobile</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors group mt-auto" href="#">
            <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[20px]">settings</span>
            <span className="flex-1">Paramètres</span>
          </a>
        </nav>

        {/* Footer Links */}
        <div className="mt-md pt-md border-t border-outline-variant flex flex-col gap-xs">
          <a className="flex items-center gap-sm px-md py-sm rounded-lg font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            <span>Support</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg font-label-caps text-label-caps text-error hover:bg-error-container transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Déconnexion</span>
          </a>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="sticky top-0 w-full z-40 bg-surface flex justify-between items-center h-[64px] px-gutter ml-[260px] border-b border-outline-variant w-[calc(100%-260px)]">
        {/* Left / Brand (Hidden on Desktop if side nav is present, but requested by JSON) */}
        <div className="flex items-center gap-md hidden">
          <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
        </div>

        {/* Center / Navigation Links (Contextual Sub-Nav) */}
        <nav className="flex items-center gap-lg h-full">
          <a className="h-full flex items-center font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all relative" href="#">
            Articles
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent transition-colors"></div>
          </a>
          <a className="h-full flex items-center font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all relative" href="#">
            Clients
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent transition-colors"></div>
          </a>
          {/* ACTIVE SUB-TAB mapping to context (Assuming Stocks/Assets for Parc) */}
          <a className="h-full flex items-center font-body-base text-body-base text-primary border-b-2 border-primary pb-1 relative" href="#">
            Stocks
          </a>
          <a className="h-full flex items-center font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all relative" href="#">
            Rapports
          </a>
        </nav>

        {/* Right / Search & Actions */}
        <div className="flex items-center gap-md">
          {/* Search Bar */}
          <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-lg">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
            <input 
              className="pl-xl pr-sm py-1.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none w-64 placeholder-on-surface-variant" 
              placeholder="Rechercher T-Code" 
              type="text"
            />
          </div>

          {/* Icon Actions */}
          <div className="flex items-center gap-sm">
            <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant">
              <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center text-xs font-bold text-primary">JD</div>
            </button>
          </div>

          {/* Profile */}
          <div className="w-10 h-10 rounded-full bg-primary-container border-2 border-surface overflow-hidden shrink-0 cursor-pointer">
            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">JD</div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-[260px] p-gutter max-w-max-width mx-auto">
        {/* Breadcrumbs & Header */}
        <div className="mb-md">
          <nav className="flex items-center gap-xs text-sm text-on-surface-variant mb-xs">
            <a className="hover:text-primary transition-colors font-label-md" href="#">KAMLOG ERP</a>
            <ChevronRight size={16} />
            <a className="hover:text-primary transition-colors font-label-md" href="#">Parc Automobile</a>
            <ChevronRight size={16} />
            <span className="text-on-surface font-label-md font-medium">Tableau de Bord</span>
          </nav>
          <div className="flex justify-between items-end">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Gestion de Flotte</h2>
            <div className="flex gap-sm">
              <button className="px-md py-sm bg-surface rounded-lg border border-outline-variant flex items-center gap-xs hover:bg-surface-container transition-colors text-sm font-medium text-on-surface-variant">
                <Download size={16} />
                Exporter
              </button>
              <button className="px-md py-sm bg-primary text-on-primary rounded-lg flex items-center gap-xs hover:bg-primary-container transition-colors text-sm font-medium">
                <Add size={16} />
                Nouveau Véhicule
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-md">
          {/* Fleet Health Summary Cards (Row 1, Cols 1-12) */}
          <div className="col-span-12 grid grid-cols-4 gap-md">
            {/* Total Vehicles */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-sm opacity-10">
                <LocalShipping size={48} />
              </div>
              <div className="flex items-center justify-between mb-sm relative z-10">
                <span className="font-title-sm text-on-surface-variant">Total Flotte</span>
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                  <Dataset className="text-primary" size={16} />
                </div>
              </div>
              <div className="relative z-10">
                <span className="font-headline-lg text-on-surface">142</span>
                <span className="text-sm text-on-surface-variant ml-xs">Unités</span>
              </div>
            </div>

            {/* Active */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
              <div className="flex items-center justify-between mb-sm relative z-10">
                <span className="font-title-sm text-on-surface-variant">En Mission</span>
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                  <Route className="text-secondary" size={16} />
                </div>
              </div>
              <div className="relative z-10 flex items-end gap-sm">
                <span className="font-headline-lg text-on-surface">89</span>
                <span className="text-sm text-secondary font-medium mb-1 bg-secondary/10 px-xs py-0.5 rounded flex items-center gap-0.5">
                  <CheckCircle size={14} /> 12%
                </span>
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
              <div className="flex items-center justify-between mb-sm relative z-10">
                <span className="font-title-sm text-on-surface-variant">En Maintenance</span>
                <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
                  <Build className="text-tertiary" size={16} />
                </div>
              </div>
              <div className="relative z-10">
                <span className="font-headline-lg text-on-surface">14</span>
                <span className="text-sm text-on-surface-variant ml-xs">Atelier K-Parc</span>
              </div>
            </div>

            {/* Idle / Available */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline"></div>
              <div className="flex items-center justify-between mb-sm relative z-10">
                <span className="font-title-sm text-on-surface-variant">Disponibles (Parc)</span>
                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center">
                  <LocalParking className="text-on-surface-variant" size={16} />
                </div>
              </div>
              <div className="relative z-10 flex items-end gap-sm">
                <span className="font-headline-lg text-on-surface">39</span>
              </div>
            </div>
          </div>

          {/* Map Module (Row 2, Cols 1-8) */}
          <div className="col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm h-[500px] flex flex-col overflow-hidden relative">
            <div className="px-md py-sm border-b border-outline-variant flex justify-between items-center bg-surface-bright z-10">
              <h3 className="font-title-md text-on-surface flex items-center gap-sm">
                <Map className="text-primary" size={16} />
                Localisation en Temps Réel
              </h3>
              <div className="flex gap-xs">
                <button className="p-xs bg-surface-container rounded hover:bg-surface-variant transition-colors text-on-surface-variant">
                  <FilterAlt size={16} />
                </button>
                <button className="p-xs bg-surface-container rounded hover:bg-surface-variant transition-colors text-on-surface-variant">
                  <ZoomInMap size={16} />
                </button>
              </div>
            </div>

            {/* Map Placeholder / Background */}
            <div className="flex-1 bg-surface-variant relative overflow-hidden">
              {/* Abstract representation of a map since we can't load real maps directly without iframe/api */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="absolute inset-0 w-full h-full bg-surface-variant opacity-30"></div>

              {/* Map Markers */}
              <div className="absolute top-[30%] left-[40%] flex flex-col items-center group cursor-pointer">
                <div className="bg-secondary text-on-secondary px-xs py-0.5 rounded text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">T-8492 (En route)</div>
                <div className="w-6 h-6 bg-secondary rounded-full border-2 border-surface flex items-center justify-center shadow-sm relative">
                  <LocalShipping size={12} />
                  <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-30"></div>
                </div>
              </div>

              <div className="absolute top-[60%] left-[20%] flex flex-col items-center group cursor-pointer">
                <div className="bg-tertiary text-on-tertiary px-xs py-0.5 rounded text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">T-1102 (Panne)</div>
                <div className="w-6 h-6 bg-tertiary rounded-full border-2 border-surface flex items-center justify-center shadow-sm">
                  <Warning size={12} />
                </div>
              </div>

              <div className="absolute top-[45%] left-[70%] flex flex-col items-center group cursor-pointer">
                <div className="bg-secondary text-on-secondary px-xs py-0.5 rounded text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">T-9931 (Déchargement)</div>
                <div className="w-6 h-6 bg-secondary rounded-full border-2 border-surface flex items-center justify-center shadow-sm">
                  <LocalShipping size={12} />
                </div>
              </div>

              {/* Map Controls overlay */}
              <div className="absolute bottom-md right-md flex flex-col gap-xs bg-surface-container-lowest p-xs rounded-lg shadow-sm border border-outline-variant">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded text-on-surface-variant">
                  <Add size={16} />
                </button>
                <div className="h-px bg-outline-variant w-full"></div>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded text-on-surface-variant">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance Alerts & Quick Actions (Row 2, Cols 9-12) */}
          <div className="col-span-4 flex flex-col gap-md">
            {/* Critical Alerts */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md flex-1">
              <h3 className="font-title-md text-on-surface flex items-center gap-sm mb-md pb-xs border-b border-outline-variant">
                <Error className="text-error" size={16} />
                Alertes Critiques
              </h3>
              <ul className="flex flex-col gap-sm">
                <li className="bg-error-container/20 border border-error-container p-sm rounded-lg flex items-start gap-sm">
                  <OilBarrel className="text-error" size={18} />
                  <div>
                    <h4 className="font-label-md text-on-surface">T-1102 - Niveau d'huile critique</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Immobilisé Z.I. Nord. Équipe prévenue.</p>
                    <span className="text-[10px] text-error font-medium mt-1 inline-block">Il y a 15 min</span>
                  </div>
                </li>
                <li className="bg-tertiary-container/10 border border-tertiary-container/30 p-sm rounded-lg flex items-start gap-sm">
                  <TireRepair className="text-tertiary" size={18} />
                  <div>
                    <h4 className="font-label-md text-on-surface">T-8492 - Pression Pneu Anormale</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Essieu arrière gauche. En route.</p>
                    <span className="text-[10px] text-tertiary font-medium mt-1 inline-block">Il y a 1h</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Driver Assignment Snapshot */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md flex-1">
              <div className="flex justify-between items-center mb-md pb-xs border-b border-outline-variant">
                <h3 className="font-title-md text-on-surface flex items-center gap-sm">
                  <Badge className="text-primary" size={16} />
                  Chauffeurs Actifs
                </h3>
                <a className="text-[12px] text-primary hover:underline" href="#">Voir tout</a>
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden flex items-center justify-center text-xs font-bold text-primary">MD</div>
                    <div>
                      <h4 className="font-label-md text-on-surface">Moussa Diop</h4>
                      <p className="text-[11px] text-on-surface-variant">T-8492 • En mission</p>
                    </div>
                  </div>
                  <CheckCircle className="text-secondary" size={16} />
                </div>
                <div className="flex items-center justify-between p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden flex items-center justify-center text-xs font-bold text-primary">AS</div>
                    <div>
                      <h4 className="font-label-md text-on-surface">Abdoulaye Sy</h4>
                      <p className="text-[11px] text-on-surface-variant">T-9931 • Sur site</p>
                    </div>
                  </div>
                  <CheckCircle className="text-secondary" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Vehicle List (Row 3, Cols 1-12) */}
          <div className="col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            <div className="px-md py-sm border-b border-outline-variant bg-surface flex justify-between items-center">
              <h3 className="font-title-md text-on-surface flex items-center gap-sm">
                <ViewList className="text-primary" size={16} />
                Registre des Véhicules
              </h3>
              <div className="flex items-center gap-sm">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-outline" size={16} />
                  <input 
                    className="pl-8 pr-3 py-1 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:outline-none focus:border-primary w-48 text-[12px]" 
                    placeholder="Filtrer par ID, Statut..." 
                    type="text"
                  />
                </div>
                <button className="p-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors">
                  <FilterList size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low font-label-md text-on-surface-variant border-b border-outline-variant">
                    <th className="py-2 px-4 font-medium">ID Véhicule</th>
                    <th className="py-2 px-4 font-medium">Modèle / Type</th>
                    <th className="py-2 px-4 font-medium">Statut</th>
                    <th className="py-2 px-4 font-medium">Odomètre (km)</th>
                    <th className="py-2 px-4 font-medium">Niveau Carburant</th>
                    <th className="py-2 px-4 font-medium">Chauffeur Assigné</th>
                    <th className="py-2 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-data-tabular text-on-surface divide-y divide-outline-variant">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-lowest transition-colors bg-white">
                    <td className="py-3 px-4 font-medium">T-8492</td>
                    <td className="py-3 px-4">Volvo FH16 (Tracteur)</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Actif
                      </span>
                    </td>
                    <td className="py-3 px-4">124,500</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[75%]"></div>
                        </div>
                        <span className="text-[11px] text-on-surface-variant">75%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-surface-container overflow-hidden flex items-center justify-center text-xs font-bold text-primary">MD</div>
                      Moussa Diop
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <MoreVert size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-lowest transition-colors bg-surface-bright">
                    <td className="py-3 px-4 font-medium">T-1102</td>
                    <td className="py-3 px-4">Renault Trucks T (Tracteur)</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Maintenance
                      </span>
                    </td>
                    <td className="py-3 px-4">245,120</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-error w-[15%]"></div>
                        </div>
                        <span className="text-[11px] text-error font-medium">15%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant text-[12px] italic">Non assigné</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <MoreVert size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-lowest transition-colors bg-white">
                    <td className="py-3 px-4 font-medium">T-9931</td>
                    <td className="py-3 px-4">Mercedes Actros (Porteur)</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Actif
                      </span>
                    </td>
                    <td className="py-3 px-4">89,340</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-secondary w-[90%]"></div>
                        </div>
                        <span className="text-[11px] text-on-surface-variant">90%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-surface-container overflow-hidden flex items-center justify-center text-xs font-bold text-primary">AS</div>
                      Abdoulaye Sy
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <MoreVert size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-surface-container-lowest transition-colors bg-surface-bright">
                    <td className="py-3 px-4 font-medium">L-0442</td>
                    <td className="py-3 px-4">Peugeot Partner (Léger)</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-outline-variant/30 text-on-surface-variant text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Disponible
                      </span>
                    </td>
                    <td className="py-3 px-4">42,800</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[50%]"></div>
                        </div>
                        <span className="text-[11px] text-on-surface-variant">50%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant text-[12px] italic">Parc Central</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <MoreVert size={18} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-md py-sm border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <span className="text-[12px] text-on-surface-variant">Affichage 1-4 sur 142 véhicules</span>
              <div className="flex gap-1">
                <button className="p-1 rounded border border-outline-variant text-outline disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 rounded border border-outline-variant text-on-surface hover:bg-surface-container">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
