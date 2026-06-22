// src/app/(app)/master-data/tiers/page.tsx - Master Data Tiers - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function MasterDataTiers() {
  const [sidePanelOpen, setSidePanelOpen] = useState(true)

  const toggleSidePanel = (show: boolean) => {
    setSidePanelOpen(show)
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-left: 1px solid #c2c6d6;
        }
      `}</style>
      <div className="bg-background text-on-surface font-body-base antialiased flex overflow-hidden h-screen selection:bg-[#D1FAE5] selection:text-[#047857]">
        {/* SideNavBar */}
        <nav className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col h-screen p-[1.5rem] z-50">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md font-bold">K</div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
              <p className="font-label-caps text-label-caps text-secondary">Port Operations</p>
            </div>
          </div>
          {/* CTA */}
          <button className="bg-[#10B981] text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 mb-8 font-title-sm text-title-sm hover:bg-[#047857] transition-colors active:scale-95 duration-150 shadow-sm w-full">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nouvelle Opération
          </button>
          {/* Navigation Tabs */}
          <div className="flex-1 space-y-1">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="/dashboard/global">
              <span className="material-symbols-outlined">dashboard</span>
              Tableau de bord
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="/transport/control">
              <span className="material-symbols-outlined">local_shipping</span>
              Transport
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="/finance/overview">
              <span className="material-symbols-outlined">payments</span>
              Finances
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="/parc/overview">
              <span className="material-symbols-outlined">minor_crash</span>
              Parc Automobile
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary bg-secondary-container font-bold hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="#">
              <span className="material-symbols-outlined icon-fill">group</span>
              Tiers
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="/settings/system/audit-health">
              <span className="material-symbols-outlined">settings</span>
              Paramètres
            </a>
          </div>
          {/* Footer Tabs */}
          <div className="mt-auto pt-4 border-t border-outline-variant space-y-1">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="/support">
              <span className="material-symbols-outlined">help_outline</span>
              Support
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 font-title-sm text-title-sm" href="/login">
              <span className="material-symbols-outlined">logout</span>
              Déconnexion
            </a>
          </div>
        </nav>
        {/* Main Content Canvas */}
        <div className="ml-[260px] flex-1 flex flex-col h-full bg-surface-container-lowest">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-[1.5rem] shrink-0">
            {/* Nav Links */}
            <nav className="flex h-full gap-6">
              <a className="flex items-center font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Articles</a>
              <a className="flex items-center font-body-base text-body-base text-primary border-b-2 border-primary pb-1 hover:text-primary transition-all font-semibold" href="#">Clients</a>
              <a className="flex items-center font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Stocks</a>
              <a className="flex items-center font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all" href="#">Rapports</a>
            </nav>
            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative group focus-within:ring-2 focus-within:ring-primary rounded-lg overflow-hidden border border-outline-variant bg-surface-container-lowest flex items-center h-9">
                <span className="material-symbols-outlined text-on-surface-variant ml-2 text-[20px]">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm w-48 font-mono-data placeholder:font-body-base" placeholder="Rechercher T-Code" type="text"/>
                <div className="hidden group-focus-within:flex absolute top-full left-0 w-full bg-surface-container-lowest border border-outline-variant mt-1 rounded-lg shadow-lg z-50 flex-col">
                  <div className="p-2 text-xs text-on-surface-variant border-b border-outline-variant">Quick Jump (T-Code)</div>
                  <a className="px-3 py-2 text-sm hover:bg-surface-container-high flex justify-between" href="#"><span className="font-mono-data text-[#10B981]">TR01</span><span>Create Tier</span></a>
                  <a className="px-3 py-2 text-sm hover:bg-surface-container-high flex justify-between" href="#"><span className="font-mono-data text-[#10B981]">TR02</span><span>Edit Tier</span></a>
                </div>
              </div>
              {/* Icon Actions */}
              <div className="flex items-center gap-2 text-on-surface-variant">
                <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#10B981] rounded-full border border-surface-container-lowest"></span>
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined">verified_user</span>
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[28px]">account_circle</span>
                </button>
              </div>
            </div>
          </header>
          {/* Main Workspace */}
          <main className="flex-1 overflow-hidden flex relative bg-[#F8FAFC]">
            {/* Left Data Section */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden p-[2rem] transition-all duration-300 ${sidePanelOpen ? 'pr-[420px]' : ''}`}>
              {/* Header & Actions */}
              <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                  <h2 className="font-display-lg text-display-lg text-on-surface">Master Data: Tiers</h2>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-1">Gérez vos clients, fournisseurs et partenaires.</p>
                </div>
                <button className="bg-[#10B981] text-white font-title-sm text-title-sm px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#047857] transition-colors shadow-sm">
                  <span className="material-symbols-outlined">add_business</span>
                  Ajouter un Tier
                </button>
              </div>
              {/* Filters & Search Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm mb-6 shrink-0 flex gap-4 items-center">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] font-body-base text-body-base text-on-surface transition-all" placeholder="Rechercher par nom, ID ou catégorie..." type="text"/>
                </div>
                <div className="h-8 w-px bg-outline-variant mx-2"></div>
                <div className="flex gap-2">
                  <select className="border border-outline-variant rounded-lg bg-surface-bright px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-[#10B981] cursor-pointer">
                    <option>Toutes Catégories</option>
                    <option>Corporate</option>
                    <option>Logistics</option>
                    <option>Supplier</option>
                  </select>
                  <select className="border border-outline-variant rounded-lg bg-surface-bright px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-[#10B981] cursor-pointer">
                    <option>Tous Statuts</option>
                    <option>Actif</option>
                    <option>Inactif</option>
                  </select>
                  <button className="border border-outline-variant rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-2 font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Plus
                  </button>
                </div>
              </div>
              {/* Data Table Container */}
              <div className="flex-1 bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1 relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-bright border-b border-outline-variant z-10">
                      <tr>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider w-12 text-center">
                          <input className="rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]" type="checkbox"/>
                        </th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Tier ID</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Nom</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Catégorie</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Limite de Crédit</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">Statut</th>
                        <th className="py-3 px-4 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {/* Row 1 - Active, Selected */}
                      <tr className="bg-[#D1FAE5]/20 hover:bg-surface-container cursor-pointer group" onClick={() => toggleSidePanel(true)}>
                        <td className="py-3 px-4 text-center">
                          <input checked className="rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]" type="checkbox"/>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-8492</td>
                        <td className="py-3 px-4">
                          <div className="font-title-sm text-title-sm text-on-surface">Global Shipping Inc.</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Dakar, Senegal</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Logistics</span>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">€ 250,000</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-caps text-[10px] gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                            <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 2 */}
                      <tr className="hover:bg-surface-container cursor-pointer group">
                        <td className="py-3 px-4 text-center">
                          <input className="rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]" type="checkbox"/>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-9103</td>
                        <td className="py-3 px-4">
                          <div className="font-title-sm text-title-sm text-on-surface">Maersk Line Operations</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Copenhagen, Denmark</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Corporate</span>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">€ 1,500,000</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-caps text-[10px] gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                            <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 3 - Inactive */}
                      <tr className="bg-surface-bright hover:bg-surface-container cursor-pointer group opacity-75">
                        <td className="py-3 px-4 text-center">
                          <input className="rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]" type="checkbox"/>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface-variant">S-2201</td>
                        <td className="py-3 px-4">
                          <div className="font-title-sm text-title-sm text-on-surface-variant">Local Port Services Ltd.</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Abidjan, CIV</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-caps text-[10px]">Supplier</span>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface-variant text-right">€ 50,000</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-caps text-[10px] gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Inactive
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                            <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                          </div>
                        </td>
                      </tr>
                      {/* Additional rows */}
                      <tr className="hover:bg-surface-container cursor-pointer group"><td className="py-3 px-4 text-center"><input className="rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]" type="checkbox"/></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-3349</td><td className="py-3 px-4"><div className="font-title-sm text-title-sm text-on-surface">West Africa Logistics</div><div className="font-body-sm text-body-sm text-on-surface-variant">Lagos, Nigeria</div></td><td className="py-3 px-4"><span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Logistics</span></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">€ 420,000</td><td className="py-3 px-4 text-center"><span className="inline-flex items-center px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-caps text-[10px] gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active</span></td><td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button></div></td></tr>
                      <tr className="bg-surface-bright hover:bg-surface-container cursor-pointer group"><td className="py-3 px-4 text-center"><input className="rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]" type="checkbox"/></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-5582</td><td className="py-3 px-4"><div className="font-title-sm text-title-sm text-on-surface">TransSahara Freight</div><div className="font-body-sm text-body-sm text-on-surface-variant">Bamako, Mali</div></td><td className="py-3 px-4"><span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Logistics</span></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">€ 180,000</td><td className="py-3 px-4 text-center"><span className="inline-flex items-center px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-caps text-[10px] gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active</span></td><td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button></div></td></tr>
                    </tbody>
                  </table>
                </div>
                {/* Pagination Footer */}
                <div className="border-t border-outline-variant bg-surface px-4 py-3 flex items-center justify-between shrink-0">
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Affichage 1-5 sur 124 Tiers</div>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50" disabled><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                    <button className="w-8 h-8 rounded border border-[#10B981] bg-[#D1FAE5] text-[#047857] flex items-center justify-center font-mono-data text-sm">1</button>
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high font-mono-data text-sm">2</button>
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high font-mono-data text-sm">3</button>
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Side Panel (Quick View) */}
            <div className={`w-[400px] h-full glass-panel shadow-[-4px_0_24px_rgba(0,0,0,0.05)] transform transition-transform duration-300 ease-in-out z-30 ${sidePanelOpen ? 'translate-x-0' : 'translate-x-full'} absolute right-0 top-0 flex flex-col bg-white/95`}>
              {/* Panel Header */}
              <div className="p-6 border-b border-outline-variant flex justify-between items-start shrink-0 bg-surface-container-lowest">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono-data text-mono-data text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded">C-8492</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Logistics</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-2">Global Shipping Inc.</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> Dakar, Senegal
                  </p>
                </div>
                <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors" onClick={() => toggleSidePanel(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {/* Panel Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Bento Grid: Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-bright border border-outline-variant rounded-xl p-4 flex flex-col justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">Statut</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                      <span className="font-title-sm text-title-sm text-on-surface">Actif</span>
                    </div>
                  </div>
                  <div className="bg-surface-bright border border-outline-variant rounded-xl p-4 flex flex-col justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">Limite Crédit</span>
                    <span className="font-mono-data text-title-sm text-on-surface">€ 250k</span>
                  </div>
                </div>
                {/* Contact Details */}
                <div>
                  <h4 className="font-title-sm text-title-sm text-on-surface mb-3 flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span className="material-symbols-outlined text-[18px] text-[#10B981]">contact_mail</span> Contacts Principaux
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-title-sm font-bold shrink-0">AD</div>
                      <div>
                        <p className="font-body-base text-body-base font-semibold text-on-surface">Amadou Diallo</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Directeur Logistique</p>
                        <a className="font-body-sm text-body-sm text-[#10B981] hover:underline mt-1 block" href="mailto:a.diallo@globalship.sn">a.diallo@globalship.sn</a>
                        <p className="font-mono-data text-[12px] text-on-surface-variant mt-0.5">+221 77 123 45 67</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Active Contracts List */}
                <div>
                  <h4 className="font-title-sm text-title-sm text-on-surface mb-3 flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span className="material-symbols-outlined text-[18px] text-[#10B981]">description</span> Contrats Actifs
                  </h4>
                  <div className="space-y-3">
                    <div className="border border-outline-variant rounded-lg p-3 hover:border-[#10B981] transition-colors cursor-pointer group bg-surface-container-lowest">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono-data text-mono-data text-on-surface group-hover:text-[#10B981] transition-colors">CTR-2023-089</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-caps text-[10px]">Fret Maritime</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-1">
                        <div className="bg-[#10B981] h-1.5 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
                        <span>Début: Jan 2023</span>
                        <span>Fin: Dec 2026</span>
                      </div>
                    </div>
                    <div className="border border-outline-variant rounded-lg p-3 hover:border-[#10B981] transition-colors cursor-pointer group bg-surface-container-lowest">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono-data text-mono-data text-on-surface group-hover:text-[#10B981] transition-colors">CTR-2026-012</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-caps text-[10px]">Manutention</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-1">
                        <div className="bg-[#10B981] h-1.5 rounded-full" style={{width: '20%'}}></div>
                      </div>
                      <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
                        <span>Début: Mar 2026</span>
                        <span>Fin: Mar 2025</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 border border-outline-variant border-dashed rounded-lg text-on-surface-variant font-body-sm hover:bg-surface-container transition-colors text-center">
                    Voir tous les contrats
                  </button>
                </div>
              </div>
              {/* Panel Footer Actions */}
              <div className="p-4 border-t border-outline-variant bg-surface-container-lowest shrink-0 flex gap-3">
                <button className="flex-1 py-2 px-4 border border-outline-variant rounded-lg font-title-sm text-title-sm text-on-surface hover:bg-surface-container transition-colors">Modifier</button>
                <button className="flex-1 py-2 px-4 bg-[#10B981] text-white rounded-lg font-title-sm text-title-sm hover:bg-[#047857] transition-colors shadow-sm">Nouveau Contrat</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
