// src/app/(app)/finance/overview/page.tsx - K-Finance Overview ERP Design - Fidèle au HTML original
'use client'

export default function KFinanceOverview() {
  return (
    <div className="bg-background text-on-background font-body-base antialiased min-h-screen flex">
      {/* SideNavBar */}
      <aside className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack-md z-50">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">
            K
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
            <p className="font-label-caps text-label-caps text-secondary">Port Operations</p>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full bg-primary text-on-primary py-2 px-4 rounded-lg font-title-sm text-title-sm mb-6 hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nouvelle Opération
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Tableau de bord
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            Transport
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-primary bg-secondary-container font-bold" href="#">
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Finances
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">minor_crash</span>
            Parc Automobile
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Paramètres
          </a>
        </nav>

        {/* Footer Links */}
        <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4">
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            Support
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md font-label-caps text-label-caps text-secondary hover:bg-surface-container-high transition-colors text-error" href="#">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Déconnexion
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* TopNavBar */}
        <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter">
          <div className="flex items-center gap-6">
            <h2 className="font-title-sm text-title-sm text-on-surface font-black tracking-tight">KAMLOG EM-ERP</h2>
            <nav className="hidden md:flex gap-6">
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Articles</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Clients</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Stocks</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Rapports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
              <input 
                className="pl-10 pr-4 py-2 border border-outline-variant rounded-md text-sm w-64 bg-surface-container-lowest focus:outline-none font-mono-data text-mono-data" 
                placeholder="Rechercher T-Code" 
                type="text"
              />
            </div>
            {/* Trailing Icons */}
            <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
              <button className="text-secondary hover:text-primary transition-colors p-1 relative">
                <span className="material-symbols-outlined text-[20px]">payments</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="text-secondary hover:text-primary transition-colors p-1">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
              <button className="text-secondary hover:text-primary transition-colors p-1">
                <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center text-xs font-bold text-primary">
                  JD
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 p-container-margin overflow-y-auto bg-background">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface mb-2">K-Finance Overview</h2>
              <p className="font-body-base text-body-base text-secondary">Aperçu global de la santé financière et des opérations en cours.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Exporter
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm shadow-sm hover:bg-primary-container flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Créer Facture
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* KPIs (Bento style) */}
            <div className="col-span-12 grid grid-cols-4 gap-6 mb-2">
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant card-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-caps text-label-caps text-secondary">Chiffre d'Affaires (Mois)</span>
                  <div className="text-primary bg-primary-fixed p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">trending_up</span>
                  </div>
                </div>
                <div>
                  <div className="font-display-lg text-[28px] font-bold text-on-surface">124.5M FCFA</div>
                  <div className="font-body-sm text-body-sm text-emerald-600 flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span> +12% vs mois prec.
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant card-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-caps text-label-caps text-secondary">Dépenses Opérationnelles</span>
                  <div className="text-secondary bg-surface-container p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  </div>
                </div>
                <div>
                  <div className="font-display-lg text-[28px] font-bold text-on-surface">42.8M FCFA</div>
                  <div className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span> +5% vs mois prec.
                  </div>
                </div>
              </div>

              <div className="bg-error-container rounded-xl p-5 border border-[rgba(255,0,0,0.1)] card-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-caps text-label-caps text-on-error-container">Paiements en Retard</span>
                  <div className="text-error bg-surface-container-lowest p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                  </div>
                </div>
                <div>
                  <div className="font-display-lg text-[28px] font-bold text-on-error-container">18.2M FCFA</div>
                  <div className="font-body-sm text-body-sm text-error flex items-center gap-1 mt-1">
                    5 factures échues. Action requise.
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant card-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-caps text-label-caps text-secondary">Trésorerie Disponible</span>
                  <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">savings</span>
                  </div>
                </div>
                <div>
                  <div className="font-display-lg text-[28px] font-bold text-on-surface">86.3M FCFA</div>
                  <div className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mt-1">
                    Solde consolidé.
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Left Column */}
            <div className="col-span-8 flex flex-col gap-6">
              {/* Chart Section */}
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant card-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Revenue vs Dépenses (Q3)</h3>
                  <select className="border-outline-variant rounded-md text-sm py-1 bg-surface-container-lowest">
                    <option>Ce Trimestre</option>
                    <option>Trimestre Précédent</option>
                    <option>Année en cours</option>
                  </select>
                </div>
                {/* Placeholder for Chart */}
                <div className="w-full h-64 bg-surface-container-low rounded-lg border border-outline-variant flex items-center justify-center relative overflow-hidden">
                  {/* Faux Chart Bars */}
                  <div className="flex items-end gap-8 h-48 w-full px-8 opacity-80">
                    <div className="flex flex-col justify-end gap-1 w-12 h-full">
                      <div className="bg-primary rounded-t-sm w-full" style={{ height: '60%' }}></div>
                      <div className="bg-surface-variant rounded-t-sm w-full" style={{ height: '30%' }}></div>
                      <span className="text-xs text-center text-secondary mt-2">Juil</span>
                    </div>
                    <div className="flex flex-col justify-end gap-1 w-12 h-full">
                      <div className="bg-primary rounded-t-sm w-full" style={{ height: '85%' }}></div>
                      <div className="bg-surface-variant rounded-t-sm w-full" style={{ height: '40%' }}></div>
                      <span className="text-xs text-center text-secondary mt-2">Aout</span>
                    </div>
                    <div className="flex flex-col justify-end gap-1 w-12 h-full">
                      <div className="bg-primary rounded-t-sm w-full" style={{ height: '45%' }}></div>
                      <div className="bg-surface-variant rounded-t-sm w-full" style={{ height: '50%' }}></div>
                      <span className="text-xs text-center text-secondary mt-2">Sept</span>
                    </div>
                    <div className="flex flex-col justify-end gap-1 w-12 h-full">
                      <div className="bg-primary-fixed-dim rounded-t-sm w-full border border-dashed border-primary" style={{ height: '70%' }}></div>
                      <div className="bg-surface-variant rounded-t-sm w-full border border-dashed border-outline" style={{ height: '35%' }}></div>
                      <span className="text-xs text-center text-secondary mt-2">Oct (Proj)</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <div className="w-3 h-3 bg-primary rounded-sm"></div> Revenus
                    </div>
                    <div className="flex items-center gap-2 text-xs text-secondary">
                      <div className="w-3 h-3 bg-surface-variant rounded-sm"></div> Dépenses
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Invoices Table */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
                <div className="p-5 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-title-sm text-title-sm text-on-surface">Factures Récentes</h3>
                  <button className="text-primary text-sm font-medium hover:underline">Voir tout</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-lowest border-b border-outline-variant">
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Facture #</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Client</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Montant</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Échéance</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0">Statut</th>
                        <th className="p-3 font-label-caps text-label-caps text-secondary sticky top-0 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                        <td className="p-3 font-mono-data text-mono-data text-primary">INV-2409-001</td>
                        <td className="p-3 font-body-sm text-body-sm text-on-surface font-medium">Bolloré Logistics</td>
                        <td className="p-3 font-mono-data text-mono-data text-on-surface">12,500,000 XAF</td>
                        <td className="p-3 font-body-sm text-body-sm text-secondary">15 Oct 2026</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]">Payé</span>
                        </td>
                        <td className="p-3 text-right">
                          <button className="opacity-0 group-hover:opacity-100 text-secondary hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                        <td className="p-3 font-mono-data text-mono-data text-primary">INV-2409-002</td>
                        <td className="p-3 font-body-sm text-body-sm text-on-surface font-medium">Maersk Cameroon</td>
                        <td className="p-3 font-mono-data text-mono-data text-on-surface">8,250,000 XAF</td>
                        <td className="p-3 font-body-sm text-body-sm text-secondary">10 Oct 2026</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">En Attente</span>
                        </td>
                        <td className="p-3 text-right">
                          <button className="opacity-0 group-hover:opacity-100 text-secondary hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                        <td className="p-3 font-mono-data text-mono-data text-primary">INV-2408-045</td>
                        <td className="p-3 font-body-sm text-body-sm text-on-surface font-medium">CMA CGM</td>
                        <td className="p-3 font-mono-data text-mono-data text-on-surface">4,100,000 XAF</td>
                        <td className="p-3 font-body-sm text-body-sm text-error font-medium">28 Sep 2026</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-error-container text-error border border-[#fecaca]">En Retard</span>
                        </td>
                        <td className="p-3 text-right">
                          <button className="opacity-0 group-hover:opacity-100 text-secondary hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                        <td className="p-3 font-mono-data text-mono-data text-primary">INV-2409-004</td>
                        <td className="p-3 font-body-sm text-body-sm text-on-surface font-medium">SABC</td>
                        <td className="p-3 font-mono-data text-mono-data text-on-surface">1,850,000 XAF</td>
                        <td className="p-3 font-body-sm text-body-sm text-secondary">20 Oct 2026</td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]">En Attente</span>
                        </td>
                        <td className="p-3 text-right">
                          <button className="opacity-0 group-hover:opacity-100 text-secondary hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (Notifications & Alerts) */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* Gateway Notifications */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow overflow-hidden">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">sync_alt</span>
                  <h3 className="font-title-sm text-title-sm text-on-surface">Gateway Inter-Module</h3>
                </div>
                <div className="p-2">
                  {/* Notification Item */}
                  <div className="p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant mb-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-label-caps text-[10px] text-secondary tracking-wider">K-MAGASIN • IL Y A 10 MIN</span>
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface font-medium leading-tight mb-1">Nouvelle commande à facturer (COMMANDE_FACTURE)</p>
                        <p className="font-mono-data text-[11px] text-secondary">REF: CMD-8892 • Olam Agri</p>
                      </div>
                    </div>
                  </div>
                  {/* Notification Item */}
                  <div className="p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant mb-2 opacity-70">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-secondary flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-label-caps text-[10px] text-secondary tracking-wider">TRANSPORT • IL Y A 2H</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface font-medium leading-tight mb-1">Bon de livraison validé, prêt pour facturation.</p>
                        <p className="font-mono-data text-[11px] text-secondary">REF: BL-1044 • SABC</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-outline-variant text-center bg-surface-container-lowest">
                  <a className="font-body-sm text-body-sm text-primary font-medium hover:underline" href="#">Voir le journal du Gateway</a>
                </div>
              </div>

              {/* Pending Actions / Alerts */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant card-shadow p-5">
                <h3 className="font-title-sm text-title-sm text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">assignment_late</span>
                  Tâches en attente
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="border border-outline-variant rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">Rapprochement Bancaire</p>
                      <p className="font-body-sm text-[12px] text-secondary">Compte: UBA (Fin Sep)</p>
                    </div>
                    <button className="px-3 py-1 bg-surface-container-high text-on-surface text-xs rounded hover:bg-surface-variant">Traiter</button>
                  </div>
                  <div className="border border-outline-variant rounded-lg p-3 flex justify-between items-center border-l-4 border-l-error">
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">Relance Impayés</p>
                      <p className="font-body-sm text-[12px] text-secondary">3 Clients critiques</p>
                    </div>
                    <button className="px-3 py-1 bg-error-container text-on-error-container text-xs rounded hover:bg-[#ffc1c1] font-medium">Relancer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
