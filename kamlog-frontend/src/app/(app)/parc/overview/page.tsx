// src/app/(app)/parc/overview/page.tsx - K-Parc Fleet Management Overview - Fidèle 100% au HTML original
'use client'

export default function KParcFleetManagementOverview() {
  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-filled {
          font-variation-settings: 'FILL 1';
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
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50 flex flex-col p-md">
        {/* Brand / Header */}
        <div className="flex items-center gap-sm mb-xl px-xs">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container icon-filled text-[20px]">directions_boat</span>
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
            <span className="material-symbols-outlined text-primary icon-filled text-[20px]">minor_crash</span>
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
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </button>
          </div>

          {/* Profile */}
          <div className="w-10 h-10 rounded-full bg-primary-container border-2 border-surface overflow-hidden shrink-0 cursor-pointer">
            <img alt="User profile with MFA status" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp_dOAPhd-3cthLhUZW4zVDw7ldWURQZH8NOEYg1OQndfNmd_yrNJUZEByvdnYzL6WjpKHdwBlKI5ZIxKCHqC4eCVHt80_BgoUBpjNNK07cg16WV-bFfDUryIjKpBCSRguFrzPHeiVgKlfDa03tuAe895fo1MWT5GX3jZLfPB-kQjoUnqhqJ-f-XyLU_sWAYRjxh4KHkaZY10NSrGCVM-Nu7AM4qzSPBm80ai4evNyCeeF9xaSVWkvMyBq4nKKyXwQ5Klm8C5QHkE"/>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-[260px] p-gutter max-w-max-width mx-auto">
        {/* Breadcrumbs & Header */}
        <div className="mb-md">
          <nav className="flex items-center gap-xs text-sm text-on-surface-variant mb-xs">
            <a className="hover:text-primary transition-colors font-label-md" href="#">KAMLOG ERP</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <a className="hover:text-primary transition-colors font-label-md" href="#">Parc Automobile</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface font-label-md font-medium">Tableau de Bord</span>
          </nav>
          <div className="flex justify-between items-end">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Gestion de Flotte</h2>
            <div className="flex gap-sm">
              <button className="px-md py-sm bg-surface rounded-lg border border-outline-variant flex items-center gap-xs hover:bg-surface-container transition-colors text-sm font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">download</span>
                Exporter
              </button>
              <button className="px-md py-sm bg-primary text-on-primary rounded-lg flex items-center gap-xs hover:bg-primary-container transition-colors text-sm font-medium">
                <span className="material-symbols-outlined text-sm">add</span>
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
                <span className="material-symbols-outlined text-6xl icon-filled">local_shipping</span>
              </div>
              <div className="flex items-center justify-between mb-sm relative z-10">
                <span className="font-title-sm text-on-surface-variant">Total Flotte</span>
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">dataset</span>
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
                  <span className="material-symbols-outlined text-secondary text-sm">route</span>
                </div>
              </div>
              <div className="relative z-10 flex items-end gap-sm">
                <span className="font-headline-lg text-on-surface">89</span>
                <span className="text-sm text-secondary font-medium mb-1 bg-secondary/10 px-xs py-0.5 rounded flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                </span>
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
              <div className="flex items-center justify-between mb-sm relative z-10">
                <span className="font-title-sm text-on-surface-variant">En Maintenance</span>
                <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-sm">build</span>
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
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">local_parking</span>
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
                <span className="material-symbols-outlined text-primary text-sm">map</span>
                Localisation en Temps Réel
              </h3>
              <div className="flex gap-xs">
                <button className="p-xs bg-surface-container rounded hover:bg-surface-variant transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">filter_alt</span>
                </button>
                <button className="p-xs bg-surface-container rounded hover:bg-surface-variant transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">zoom_in_map</span>
                </button>
              </div>
            </div>

            {/* Map Placeholder / Background */}
            <div className="flex-1 bg-surface-variant relative overflow-hidden">
              {/* Abstract representation of a map since we can't load real maps directly without iframe/api */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <img className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqbRuY_T3lGcs6DvJeJTfabLYXyxRu7FwfSA8uQN1g2VLuQerPWlHtfgx99YfoE3aaXLtd_oAHH2j_4VntpibT1zwBPliXOncFdgOCtdntMFFueUN8zWwvp-yVUZop9SQEUeHHCW9o9Vl91Kgc4ZAtg3CFvN567ssv3JUgrmDvujmFn1w8y_dl78iwUEhTpbouAjud0K08lF3MU-K9sjFRXVPLWdFsIvG35WERDyaC1914u6cvKLku-0rXhvlvSvRCE0lINMzw82I"/>

              {/* Map Markers */}
              <div className="absolute top-[30%] left-[40%] flex flex-col items-center group cursor-pointer">
                <div className="bg-secondary text-on-secondary px-xs py-0.5 rounded text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">T-8492 (En route)</div>
                <div className="w-6 h-6 bg-secondary rounded-full border-2 border-surface flex items-center justify-center shadow-sm relative">
                  <span className="material-symbols-outlined text-[12px] text-on-secondary icon-filled">local_shipping</span>
                  <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-30"></div>
                </div>
              </div>

              <div className="absolute top-[60%] left-[20%] flex flex-col items-center group cursor-pointer">
                <div className="bg-tertiary text-on-tertiary px-xs py-0.5 rounded text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">T-1102 (Panne)</div>
                <div className="w-6 h-6 bg-tertiary rounded-full border-2 border-surface flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[12px] text-on-tertiary icon-filled">warning</span>
                </div>
              </div>

              <div className="absolute top-[45%] left-[70%] flex flex-col items-center group cursor-pointer">
                <div className="bg-secondary text-on-secondary px-xs py-0.5 rounded text-[10px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">T-9931 (Déchargement)</div>
                <div className="w-6 h-6 bg-secondary rounded-full border-2 border-surface flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[12px] text-on-secondary icon-filled">local_shipping</span>
                </div>
              </div>

              {/* Map Controls overlay */}
              <div className="absolute bottom-md right-md flex flex-col gap-xs bg-surface-container-lowest p-xs rounded-lg shadow-sm border border-outline-variant">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
                <div className="h-px bg-outline-variant w-full"></div>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-container rounded text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance Alerts & Quick Actions (Row 2, Cols 9-12) */}
          <div className="col-span-4 flex flex-col gap-md">
            {/* Critical Alerts */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md flex-1">
              <h3 className="font-title-md text-on-surface flex items-center gap-sm mb-md pb-xs border-b border-outline-variant">
                <span className="material-symbols-outlined text-error text-sm icon-filled">error</span>
                Alertes Critiques
              </h3>
              <ul className="flex flex-col gap-sm">
                <li className="bg-error-container/20 border border-error-container p-sm rounded-lg flex items-start gap-sm">
                  <span className="material-symbols-outlined text-error text-[18px] mt-0.5">oil_barrel</span>
                  <div>
                    <h4 className="font-label-md text-on-surface">T-1102 - Niveau d'huile critique</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Immobilisé Z.I. Nord. Équipe prévenue.</p>
                    <span className="text-[10px] text-error font-medium mt-1 inline-block">Il y a 15 min</span>
                  </div>
                </li>
                <li className="bg-tertiary-container/10 border border-tertiary-container/30 p-sm rounded-lg flex items-start gap-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">tire_repair</span>
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
                  <span className="material-symbols-outlined text-primary text-sm">badge</span>
                  Chauffeurs Actifs
                </h3>
                <a className="text-[12px] text-primary hover:underline" href="#">Voir tout</a>
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex items-center justify-between p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                      <img alt="Profile of driver M. Diop" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNL0ocdT4GPQhqST2tit3ivGyRaeVlffvGsJouG4ijkZQhwbk-VfYEOH1HvCOtu3UNJu7b-nPmr-kpvMu7jGEkteKkrT8tHRYLTR15Mhf9edNnmgv1Jwx709QzWJXKjdKZktFG1REQ1l6nDGFZiAsOuiFd9ckaPjioHLhLyekmhijWddyNazmAmPho9p-gLfya-wu9AB7SfVIcUS2MU3TA7wsuzReA_Z4TgXqv40fis8BmWddQ7U_Hpbib4UtuQ1fcQuZ6xbXa8Xg"/>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">Moussa Diop</h4>
                      <p className="text-[11px] text-on-surface-variant">T-8492 • En mission</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                </div>
                <div className="flex items-center justify-between p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                      <img alt="Profile of driver A. Sy" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIxmEXX_F8Icfhvi9gGkGdfxzVy7pbm3Rh5TimVs099SHB9f0lb9nhiYriisCIwGN0hwA5ZQgpH-SiU6KBlBIV91_nsci8ZPaltFfD28fxKGrbYw02JmMXjpi_pPAUiSLVlefyapbLxpoevL-H-XXjVsUwF-GpEkJlCxRhBemWCOpoGHBXuWYSaQ7W1pwi_JIB9EDTjkPzkDiQauYypB3A9x3N0iqegQbZJVvUSZTwEqh7lue-LrSPYUVlOfjtXEnCaoBaH1t0ktY"/>
                    </div>
                    <div>
                      <h4 className="font-label-md text-on-surface">Abdoulaye Sy</h4>
                      <p className="text-[11px] text-on-surface-variant">T-9931 • Sur site</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Vehicle List (Row 3, Cols 1-12) */}
          <div className="col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            <div className="px-md py-sm border-b border-outline-variant bg-surface flex justify-between items-center">
              <h3 className="font-title-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-sm">view_list</span>
                Registre des Véhicules
              </h3>
              <div className="flex items-center gap-sm">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
                  <input 
                    className="pl-8 pr-3 py-1 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:outline-none focus:border-primary w-48 text-[12px]" 
                    placeholder="Filtrer par ID, Statut..." 
                    type="text"
                  />
                </div>
                <button className="p-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">filter_list</span>
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
                      <div className="w-5 h-5 rounded-full bg-surface-container overflow-hidden">
                        <img alt="Avatar driver" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7lgz6EtCKgcuAdIGXT4yCkNNQaL40cuv6YcHic9LWbaO7fcCzsBsS7nh1Ap2dcPP20BbeO4V2U2LmwK7TyNevt5jPpZnA-VcPv0R5mWb0Ix20a_k_VydTxtlS2VWyKXZ6HtSg35dym1sLPj112B4xEJzxNT263ybKjgJHlj_8V4r-GTjwbviaoFw1hoS3XCDwQce_8iiVHtjWuzuezfBfu1JgU8ZfXK1DH3cI6MvAdcXToew0TYbt9c2FEAsfdkSJ6hvekfJQQog"/>
                      </div>
                      Moussa Diop
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
                      <div className="w-5 h-5 rounded-full bg-surface-container overflow-hidden">
                        <img alt="Avatar driver" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBICek52V-OUz5_S2b1u5IPb5VOXzhA3FNCbk80z7lu0sht5y_mgPKNe2nt88yflHPvz-Z-mzCduTlDnSztXQG7s9WjELtFqEo9UsICcoaZKb9sbc_4S-siN-eWG9EpcN74TrXYMlls3ItgickrGIvHRnZvWxXeRfwyAfzJ5WPSFUX2GJ4_vOxqbn6Cn7rKYv37IwoumCIyLUbGSSdlNfgJTWE3uTohvgxRg4oF_JGEP-_Db4PDT7m1J2ETQwmTSy6dnI5dDONOSgI"/>
                      </div>
                      Abdoulaye Sy
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
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
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button className="p-1 rounded border border-outline-variant text-on-surface hover:bg-surface-container">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}
