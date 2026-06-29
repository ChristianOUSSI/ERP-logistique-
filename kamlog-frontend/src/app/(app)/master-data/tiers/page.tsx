// src/app/(app)/master-data/tiers/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { tiersAPI } from '@/lib/api-client'
import type { Tier } from '@/lib/api/master-data'
import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useAuth } from '@/components/layout/AuthProvider'

export default function MasterDataTiers() {
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const { logout } = useAuth()

  useEffect(() => {
    async function fetchTiers() {
      try {
        const res = await tiersAPI.getTiers()
        setTiers(res.data || [])
      } catch (err) {
        console.error('Error fetching tiers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTiers()
  }, [])

  const handleRowClick = (tier: Tier) => {
    setSelectedTier(tier)
    setSidePanelOpen(true)
  }

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
        
        
        {/* Main Content Canvas */}
        <div className="ml-[260px] flex-1 flex flex-col h-full bg-surface-container-lowest">
          
          
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
                    <option>Client</option>
                    <option>Supplier</option>
                    <option>Partner</option>
                  </select>
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
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-on-surface-variant">Chargement des données...</td>
                        </tr>
                      ) : tiers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-on-surface-variant">Aucun tier trouvé.</td>
                        </tr>
                      ) : (
                        tiers.map((tier) => (
                          <tr key={tier.id} className="hover:bg-surface-container cursor-pointer group" onClick={() => handleRowClick(tier)}>
                            <td className="py-3 px-4 text-center">
                              <input className="rounded border-outline-variant text-[#10B981] focus:ring-[#10B981]" type="checkbox"/>
                            </td>
                            <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface">C-{String(tier.id).padStart(4, '0')}</td>
                            <td className="py-3 px-4">
                              <div className="font-title-sm text-title-sm text-on-surface">{tier.name || 'Tier ' + tier.id}</div>
                              <div className="font-body-sm text-body-sm text-on-surface-variant">{tier.city || 'Non renseigné'}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px] uppercase">
                                {tier.type || 'N/A'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono-data text-mono-data text-on-surface text-right">FCFA {(tier.creditLimit || 0).toLocaleString()}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-caps text-[10px] gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Actif
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="View Details"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                                <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Footer */}
                <div className="border-t border-outline-variant bg-surface px-4 py-3 flex items-center justify-between shrink-0">
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Affichage {tiers.length} Tiers</div>
                </div>
              </div>
            </div>
            {/* Right Side Panel (Quick View) */}
            <div className={`w-[400px] h-full glass-panel shadow-[-4px_0_24px_rgba(0,0,0,0.05)] transform transition-transform duration-300 ease-in-out z-30 ${sidePanelOpen ? 'translate-x-0' : 'translate-x-full'} absolute right-0 top-0 flex flex-col bg-white/95`}>
              {selectedTier && (
                <>
                  <div className="p-6 border-b border-outline-variant flex justify-between items-start shrink-0 bg-surface-container-lowest">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-data text-mono-data text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded">C-{String(selectedTier.id).padStart(4, '0')}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-caps text-[10px] uppercase">{selectedTier.type}</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-on-surface mt-2">{selectedTier.name}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span> {selectedTier.city}, {selectedTier.region}
                      </p>
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors" onClick={() => toggleSidePanel(false)}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-bright border border-outline-variant rounded-xl p-4 flex flex-col justify-between">
                        <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">Email</span>
                        <span className="font-title-sm text-title-sm text-on-surface overflow-hidden text-ellipsis" title={selectedTier.email}>{selectedTier.email || 'N/A'}</span>
                      </div>
                      <div className="bg-surface-bright border border-outline-variant rounded-xl p-4 flex flex-col justify-between">
                        <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">Limite Crédit</span>
                        <span className="font-mono-data text-title-sm text-on-surface">FCFA {selectedTier.creditLimit?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-title-sm text-title-sm text-on-surface mb-3 flex items-center gap-2 border-b border-outline-variant pb-2">
                        <span className="material-symbols-outlined text-[18px] text-[#10B981]">contact_mail</span> Informations Lgales
                      </h4>
                      <div className="space-y-2">
                        <p className="font-body-sm text-on-surface-variant"><strong>NIU:</strong> {selectedTier.niu || 'N/A'}</p>
                        <p className="font-body-sm text-on-surface-variant"><strong>RCCM:</strong> {selectedTier.rccm || 'N/A'}</p>
                        <p className="font-body-sm text-on-surface-variant"><strong>Téléphone:</strong> {selectedTier.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-outline-variant bg-surface-container-lowest shrink-0 flex gap-3">
                    <button className="flex-1 py-2 px-4 border border-outline-variant rounded-lg font-title-sm text-title-sm text-on-surface hover:bg-surface-container transition-colors">Modifier</button>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
