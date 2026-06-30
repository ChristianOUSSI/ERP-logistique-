// src/app/(app)/tiers/page.tsx - Master Data Tiers - Fidèle 100% au HTML original
'use client'

import { useEffect, useState } from 'react'

export default function TiersPage() {
  const [sidePanelOpen, setSidePanelOpen] = useState(true)

  // ── Micro-interactions JavaScript fidèles au HTML original ─────────
  useEffect(() => {
    // Simulate row selection
    const rows = document.querySelectorAll('tr.group')
    rows.forEach((row) => {
      const handleClick = () => {
        // Toggle selection visual state
        row.classList.toggle('bg-module-green-light/20')
      }
      row.addEventListener('click', handleClick)
      return () => {
        row.removeEventListener('click', handleClick)
      }
    })
  }, [])

  const toggleSidePanel = (show: boolean) => {
    setSidePanelOpen(show)
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined[data-weight="fill"] {
          font-variation-settings: 'FILL' 1;
        }
        /* Custom Scrollbar */
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
        /* Glassmorphism utility */
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-left: 1px solid #c2c6d6;
        }
      `}</style>
      <div className="bg-background text-on-surface font-body-base antialiased flex overflow-hidden h-screen selection:bg-module-green-light selection:text-module-green-dark">
        
        

        {/* Main Content Canvas */}
        <div className="flex-1 flex flex-col h-full bg-surface-container-lowest">
          
          

          {/* Main Workspace */}
          <main className="flex-1 overflow-hidden flex relative bg-[#F8FAFC]">
            {/* Left Data Section */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden p-container-margin transition-all duration-300 ${sidePanelOpen ? 'pr-[420px]' : ''}`}>
              {/* Header & Actions */}
              <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                  <h2 className="font-display-lg text-display-lg text-on-surface">Master Data: Tiers</h2>
                  <p className="font-body-base text-body-base text-on-surface-variant mt-1">Gérez vos clients, fournisseurs et partenaires.</p>
                </div>
                <button className="bg-module-green text-white font-title-sm text-title-sm px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-module-green-dark transition-colors shadow-sm">
                  <span className="material-symbols-outlined">add_business</span>
                  Ajouter un Tier
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm mb-6 shrink-0 flex gap-4 items-center">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-bright focus:ring-2 focus:ring-module-green focus:border-module-green font-body-base text-body-base text-on-surface transition-all" placeholder="Rechercher par nom, ID ou catégorie..." type="text"/>
                </div>
                <div className="h-8 w-px bg-outline-variant mx-2"></div>
                <div className="flex gap-2">
                  <select className="border border-outline-variant rounded-lg bg-surface-bright px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-module-green cursor-pointer">
                    <option>Toutes Catégories</option>
                    <option>Corporate</option>
                    <option>Logistics</option>
                    <option>Supplier</option>
                  </select>
                  <select className="border border-outline-variant rounded-lg bg-surface-bright px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-module-green cursor-pointer">
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
                          <input className="rounded border-outline-variant text-module-green focus:ring-module-green" type="checkbox"/>
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
                      <tr className="bg-module-green-light/20 hover:bg-surface-container cursor-pointer group" onClick={() => toggleSidePanel(true)}>
                        <td className="py-3 px-4 text-center">
                          <input checked className="rounded border-outline-variant text-module-green focus:ring-module-green" type="checkbox"/>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-8492</td>
                        <td className="py-3 px-4">
                          <div className="font-title-sm text-title-sm text-on-surface">Global Shipping Inc.</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Dakar, Senegal</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Logistics</span>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">FCFA 250,000</td>
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
                          <input className="rounded border-outline-variant text-module-green focus:ring-module-green" type="checkbox"/>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-9103</td>
                        <td className="py-3 px-4">
                          <div className="font-title-sm text-title-sm text-on-surface">Maersk Line Operations</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Copenhagen, Denmark</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Corporate</span>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">FCFA 1,500,000</td>
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
                          <input className="rounded border-outline-variant text-module-green focus:ring-module-green" type="checkbox"/>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface-variant">S-2201</td>
                        <td className="py-3 px-4">
                          <div className="font-title-sm text-title-sm text-on-surface-variant">Local Port Services Ltd.</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">Abidjan, CIV</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-surface-variant text-on-surface-variant font-label-caps text-[10px]">Supplier</span>
                        </td>
                        <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface-variant text-right">FCFA 50,000</td>
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
                      {/* Placeholder rows for visual density */}
                      <tr className="hover:bg-surface-container cursor-pointer group"><td className="py-3 px-4 text-center"><input className="rounded border-outline-variant text-module-green focus:ring-module-green" type="checkbox"/></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-3349</td><td className="py-3 px-4"><div className="font-title-sm text-title-sm text-on-surface">West Africa Logistics</div><div className="font-body-sm text-body-sm text-on-surface-variant">Lagos, Nigeria</div></td><td className="py-3 px-4"><span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Logistics</span></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">FCFA 420,000</td><td className="py-3 px-4 text-center"><span className="inline-flex items-center px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-caps text-[10px] gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active</span></td><td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button></div></td></tr>
                      <tr className="bg-surface-bright hover:bg-surface-container cursor-pointer group"><td className="py-3 px-4 text-center"><input className="rounded border-outline-variant text-module-green focus:ring-module-green" type="checkbox"/></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-5582</td><td className="py-3 px-4"><div className="font-title-sm text-title-sm text-on-surface">TransSahara Freight</div><div className="font-body-sm text-body-sm text-on-surface-variant">Bamako, Mali</div></td><td className="py-3 px-4"><span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">Logistics</span></td><td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">FCFA 180,000</td><td className="py-3 px-4 text-center"><span className="inline-flex items-center px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-caps text-[10px] gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Active</span></td><td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button><button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button></div></td></tr>
                    </tbody>
                  </table>
                </div>
                {/* Pagination Footer */}
                <div className="border-t border-outline-variant bg-surface px-4 py-3 flex items-center justify-between shrink-0">
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Affichage 1-5 sur 124 Tiers</div>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50" disabled><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                    <button className="w-8 h-8 rounded border border-module-green bg-module-green-light text-module-green-dark flex items-center justify-center font-mono-data text-sm">1</button>
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high font-mono-data text-sm">2</button>
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high font-mono-data text-sm">3</button>
                    <button className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Panel (Quick View) */}
            <div className={`w-[400px] h-full glass-panel shadow-[-4px_0_24px_rgba(0,0,0,0.05)] transform transition-transform duration-300 ease-in-out z-30 absolute right-0 top-0 flex flex-col bg-white/95 ${sidePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Panel Header */}
              <div className="p-6 border-b border-outline-variant flex justify-between items-start shrink-0 bg-surface-container-lowest">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono-data text-mono-data text-module-green bg-module-green-light px-2 py-0.5 rounded">C-8492</span>
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
                    <span className="font-mono-data text-title-sm text-on-surface">FCFA 250k</span>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <h4 className="font-title-sm text-title-sm text-on-surface mb-3 flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span className="material-symbols-outlined text-[18px] text-module-green">contact_mail</span>
                    Contacts Principaux
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-title-sm font-bold shrink-0">AD</div>
                      <div>
                        <p className="font-body-base text-body-base font-semibold text-on-surface">Amadou Diallo</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Directeur Logistique</p>
                        <a className="font-body-sm text-body-sm text-module-green hover:underline mt-1 block" href="mailto:a.diallo@globalship.sn">a.diallo@globalship.sn</a>
                        <p className="font-mono-data text-[12px] text-on-surface-variant mt-0.5">+221 77 123 45 67</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Contracts List */}
                <div>
                  <h4 className="font-title-sm text-title-sm text-on-surface mb-3 flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span className="material-symbols-outlined text-[18px] text-module-green">description</span>
                    Contrats Actifs
                  </h4>
                  <div className="space-y-3">
                    <div className="border border-outline-variant rounded-lg p-3 hover:border-module-green transition-colors cursor-pointer group bg-surface-container-lowest">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono-data text-mono-data text-on-surface group-hover:text-module-green transition-colors">CTR-2023-089</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-caps text-[10px]">Fret Maritime</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-1">
                        <div className="bg-module-green h-1.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
                        <span>Début: Jan 2023</span>
                        <span>Fin: Dec 2026</span>
                      </div>
                    </div>
                    <div className="border border-outline-variant rounded-lg p-3 hover:border-module-green transition-colors cursor-pointer group bg-surface-container-lowest">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono-data text-mono-data text-on-surface group-hover:text-module-green transition-colors">CTR-2026-012</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-caps text-[10px]">Manutention</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-1.5 mb-1">
                        <div className="bg-module-green h-1.5 rounded-full" style={{ width: '20%' }}></div>
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
                <button className="flex-1 py-2 px-4 bg-module-green text-white rounded-lg font-title-sm text-title-sm hover:bg-module-green-dark transition-colors shadow-sm">Nouveau Contrat</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
