// src/app/(app)/magasin/history/page.tsx - K-Magasin Stock Movement History - Fidèle 100% au HTML original
'use client'

export default function KMagasinStockMovementHistory() {
  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        .theme-accent {
          @apply bg-error text-on-error;
        }
        .theme-accent-container {
          @apply bg-error-container text-on-error-container;
        }
        .theme-accent-border {
          @apply border-error;
        }
        .theme-accent-text {
          @apply text-error;
        }
        .table-row-dense {
          height: 36px;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface antialiased min-h-screen flex">
        {/* SideNavBar (Shared Component) */}
        <aside className="bg-surface-container-lowest fixed left-0 top-0 h-full w-[260px] border-r border-outline-variant shadow-sm flex flex-col h-screen p-4 z-50">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary-container icon-fill">view_in_ar</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Port Operations</p>
            </div>
          </div>
          {/* CTA */}
          <button className="w-full bg-primary text-on-primary font-title-md text-title-md py-2 px-4 rounded mb-6 flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors">
            <span className="material-symbols-outlined">add</span>
            Nouvelle Opération
          </button>
          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded text-primary bg-secondary-container font-bold active:scale-95 duration-150" href="/dashboard/global">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Tableau de bord</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/transport/control">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Transport</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/finance/overview">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Finances</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/parc/overview">
              <span className="material-symbols-outlined">minor_crash</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Parc Automobile</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/settings/system/audit-health">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Paramètres</span>
            </a>
          </nav>
          {/* Footer */}
          <div className="mt-auto border-t border-outline-variant pt-4 space-y-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors" href="/support">
              <span className="material-symbols-outlined">help_outline</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Support</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors" href="/login">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-md text-label-md uppercase tracking-wider">Déconnexion</span>
            </a>
          </div>
        </aside>
        {/* Main Content Wrapper */}
        <div className="flex-1 ml-[260px] flex flex-col min-w-0">
          {/* TopNavBar (Shared Component) */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter">
            <div className="flex items-center gap-8">
              <div className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</div>
              <nav className="hidden md:flex items-center gap-6 h-full pt-4">
                <a className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base pb-4" href="#">Articles</a>
                <a className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base pb-4" href="#">Clients</a>
                <a className="text-primary border-b-2 border-primary pb-3 font-body-base text-body-base font-medium" href="#">Stocks</a>
                <a className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base pb-4" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative focus-within:ring-2 focus-within:ring-primary rounded hidden md:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input className="pl-9 pr-4 py-1.5 bg-surface-container text-on-surface border-none rounded text-sm w-48 focus:outline-none placeholder-on-surface-variant" placeholder="Rechercher T-Code" type="text"/>
              </div>
              {/* Trailing Actions */}
              <div className="flex items-center gap-2 text-on-surface-variant">
                <button className="p-1.5 hover:bg-surface-container-highest rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                <button className="p-1.5 hover:bg-surface-container-highest rounded-full transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
                <button className="p-1.5 hover:bg-surface-container-highest rounded-full transition-colors"><span className="material-symbols-outlined">account_circle</span></button>
              </div>
            </div>
          </header>
          {/* Main Canvas */}
          <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-4">
              <a className="hover:text-primary transition-colors" href="#">Accueil</a>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <a className="hover:text-primary transition-colors" href="#">Stocks</a>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-on-surface font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error inline-block"></span>
                K-Magasin
              </span>
            </nav>
            {/* Page Header */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-3">
                  Historique des Mouvements
                  <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-2 py-0.5 rounded uppercase tracking-widest border border-error">K-MAG-01</span>
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Consultez et filtrez les entrées, sorties et ajustements d'inventaire.</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-title-md text-title-md text-on-surface hover:bg-surface-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Exporter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-error text-on-error rounded font-title-md text-title-md shadow-sm hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Mouvement Manuel
                </button>
              </div>
            </div>
            {/* Filter Grid (Bento Style) */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-end relative overflow-hidden">
              {/* Decorative subtle red accent for K-Magasin theme */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Code Article / Description</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-sm">qr_code_2</span>
                  <input className="w-full pl-8 pr-3 py-1.5 border border-outline-variant rounded bg-surface font-body-sm text-body-sm focus:border-error focus:ring-1 focus:ring-error transition-all outline-none" placeholder="Ex: ART-90210" type="text"/>
                </div>
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Période</label>
                <div className="flex items-center gap-2">
                  <input className="w-full px-3 py-1.5 border border-outline-variant rounded bg-surface font-body-sm text-body-sm focus:border-error focus:ring-1 focus:ring-error transition-all outline-none text-on-surface" type="date"/>
                  <span className="text-outline-variant">-</span>
                  <input className="w-full px-3 py-1.5 border border-outline-variant rounded bg-surface font-body-sm text-body-sm focus:border-error focus:ring-1 focus:ring-error transition-all outline-none text-on-surface" type="date"/>
                </div>
              </div>
              <div className="flex-1 min-w-[250px]">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Type de Mouvement</label>
                <div className="flex gap-2 p-1 border border-outline-variant rounded bg-surface-container-lowest">
                  <label className="flex-1 cursor-pointer">
                    <input checked className="peer sr-only" type="checkbox"/>
                    <div className="text-center py-1 rounded font-label-md text-label-md peer-checked:bg-secondary-container peer-checked:text-on-secondary-container text-on-surface-variant transition-colors">Réception</div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input checked className="peer sr-only" type="checkbox"/>
                    <div className="text-center py-1 rounded font-label-md text-label-md peer-checked:bg-primary-container peer-checked:text-on-primary-container text-on-surface-variant transition-colors">Expédition</div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input className="peer sr-only" type="checkbox"/>
                    <div className="text-center py-1 rounded font-label-md text-label-md peer-checked:bg-error-container peer-checked:text-on-error-container text-on-surface-variant transition-colors">Ajustement</div>
                  </label>
                </div>
              </div>
            </div>
            {/* High Density Data Table */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface-container text-on-surface border-b border-outline-variant">
                      <th className="font-label-md text-label-md py-2 px-4 font-semibold w-12 text-center">
                        <input className="rounded border-outline-variant text-error focus:ring-error" type="checkbox"/>
                      </th>
                      <th className="font-label-md text-label-md py-2 px-3 font-semibold">Date / Heure</th>
                      <th className="font-label-md text-label-md py-2 px-3 font-semibold">Code Article</th>
                      <th className="font-label-md text-label-md py-2 px-3 font-semibold w-full">Description</th>
                      <th className="font-label-md text-label-md py-2 px-3 font-semibold">Type</th>
                      <th className="font-label-md text-label-md py-2 px-3 font-semibold text-right">Qté</th>
                      <th className="font-label-md text-label-md py-2 px-3 font-semibold">Emplacement</th>
                      <th className="font-label-md text-label-md py-2 px-3 font-semibold">Réf. Document</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular text-on-surface">
                    {/* Row 1 */}
                    <tr className="table-row-dense even:bg-surface-bright odd:bg-surface-container-lowest hover:bg-surface-container-high transition-colors border-b border-outline-variant/50 last:border-0">
                      <td className="px-4 text-center"><input className="rounded border-outline-variant text-error focus:ring-error" type="checkbox"/></td>
                      <td className="px-3 text-on-surface-variant">2023-10-27 14:32</td>
                      <td className="px-3 font-medium">ART-4402</td>
                      <td className="px-3 truncate max-w-[200px]">Palettes Europe 120x80</td>
                      <td className="px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-secondary-container text-on-secondary-container font-label-sm text-[10px] uppercase">
                          Réception
                        </span>
                      </td>
                      <td className="px-3 text-right font-medium text-secondary">+250</td>
                      <td className="px-3">Z1-A12</td>
                      <td className="px-3 text-primary hover:underline cursor-pointer">BL-2023-8991</td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="table-row-dense even:bg-surface-bright odd:bg-surface-container-lowest hover:bg-surface-container-high transition-colors border-b border-outline-variant/50 last:border-0">
                      <td className="px-4 text-center"><input className="rounded border-outline-variant text-error focus:ring-error" type="checkbox"/></td>
                      <td className="px-3 text-on-surface-variant">2023-10-27 11:15</td>
                      <td className="px-3 font-medium">ART-991B</td>
                      <td className="px-3 truncate max-w-[200px]">Moteur Industriel V8-T</td>
                      <td className="px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-primary-container text-on-primary-container font-label-sm text-[10px] uppercase">
                          Expédition
                        </span>
                      </td>
                      <td className="px-3 text-right font-medium">-2</td>
                      <td className="px-3">Z3-C04</td>
                      <td className="px-3 text-primary hover:underline cursor-pointer">EXP-2023-441</td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="table-row-dense even:bg-surface-bright odd:bg-surface-container-lowest hover:bg-surface-container-high transition-colors border-b border-outline-variant/50 last:border-0">
                      <td className="px-4 text-center"><input className="rounded border-outline-variant text-error focus:ring-error" type="checkbox"/></td>
                      <td className="px-3 text-on-surface-variant">2023-10-26 16:45</td>
                      <td className="px-3 font-medium">ART-4402</td>
                      <td className="px-3 truncate max-w-[200px]">Palettes Europe 120x80</td>
                      <td className="px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-error-container text-on-error-container font-label-sm text-[10px] uppercase">
                          Ajustement
                        </span>
                      </td>
                      <td className="px-3 text-right font-medium text-error">-5</td>
                      <td className="px-3">Z1-A12</td>
                      <td className="px-3 text-primary hover:underline cursor-pointer">INV-2023-01</td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="table-row-dense even:bg-surface-bright odd:bg-surface-container-lowest hover:bg-surface-container-high transition-colors border-b border-outline-variant/50 last:border-0">
                      <td className="px-4 text-center"><input className="rounded border-outline-variant text-error focus:ring-error" type="checkbox"/></td>
                      <td className="px-3 text-on-surface-variant">2023-10-26 09:10</td>
                      <td className="px-3 font-medium">ART-772C</td>
                      <td className="px-3 truncate max-w-[200px]">Câble Acier 15mm (Bobine)</td>
                      <td className="px-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-secondary-container text-on-secondary-container font-label-sm text-[10px] uppercase">
                          Réception
                        </span>
                      </td>
                      <td className="px-3 text-right font-medium text-secondary">+12</td>
                      <td className="px-3">Z2-B08</td>
                      <td className="px-3 text-primary hover:underline cursor-pointer">BL-2023-8980</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Pagination Footer */}
              <div className="bg-surface border-t border-outline-variant p-2 flex items-center justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">Affichage de 1-4 sur 1,204 résultats</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded disabled:opacity-50"><span className="material-symbols-outlined text-sm">first_page</span></button>
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded disabled:opacity-50"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                  <span className="font-label-md text-label-md px-2">Page 1</span>
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded"><span className="material-symbols-outlined text-sm">last_page</span></button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
