// src/app/(app)/magasin/history/page.tsx - K-Magasin Stock Movement History - De-hardcoded
'use client'

import { useState, useEffect } from 'react'
import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { magasinAPI } from '@/lib/api-client'
import { useRouter } from 'next/navigation'

export default function KMagasinStockMovementHistory() {
  const router = useRouter()
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const data = await magasinAPI.getHistory()
      setHistory(data)
    } catch (error) {
      console.error('Failed to load history', error)
      setHistory([])
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'reception': return 'bg-secondary-container text-on-secondary-container'
      case 'expédition': return 'bg-primary-container text-on-primary-container'
      case 'ajustement': return 'bg-error-container text-on-error-container'
      default: return 'bg-surface-container text-on-surface-variant'
    }
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
        
        
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* TopNavBar (Shared Component) */}
          
          
          
          <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
            {/* Breadcrumbs */}
            
            
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
                <button onClick={() => router.push('/magasin/mouvement-de-stock-manuel')} className="flex items-center gap-2 px-3 py-1.5 bg-error text-on-error rounded font-title-md text-title-md shadow-sm hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Mouvement Manuel
                </button>
              </div>
            </div>
            
            {/* Filter Grid (Bento Style) */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-end relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Code Article / Description</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-sm">qr_code_2</span>
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-outline-variant rounded bg-surface font-body-sm text-body-sm focus:border-error focus:ring-1 focus:ring-error transition-all outline-none" placeholder="Ex: ART-90210" type="text"/>
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
                    <input defaultChecked className="peer sr-only" type="checkbox"/>
                    <div className="text-center py-1 rounded font-label-md text-label-md peer-checked:bg-secondary-container peer-checked:text-on-secondary-container text-on-surface-variant transition-colors">Réception</div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input defaultChecked className="peer sr-only" type="checkbox"/>
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
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-error"></div>
                        </td>
                      </tr>
                    ) : history.length > 0 ? (
                      history.filter(item => 
                        !searchTerm || 
                        item.code_article?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((item, i) => (
                        <tr key={item.id || i} className="table-row-dense even:bg-surface-bright odd:bg-surface-container-lowest hover:bg-surface-container-high transition-colors border-b border-outline-variant/50 last:border-0">
                          <td className="px-4 text-center"><input className="rounded border-outline-variant text-error focus:ring-error" type="checkbox"/></td>
                          <td className="px-3 text-on-surface-variant">{item.date_mouvement || new Date().toLocaleString()}</td>
                          <td className="px-3 font-medium">{item.code_article || 'N/A'}</td>
                          <td className="px-3 truncate max-w-[200px]">{item.description || 'N/A'}</td>
                          <td className="px-3">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm font-label-sm text-[10px] uppercase ${getTypeStyle(item.type_mouvement)}`}>
                              {item.type_mouvement || 'Mouvement'}
                            </span>
                          </td>
                          <td className={`px-3 text-right font-medium ${Number(item.quantite) > 0 ? 'text-secondary' : 'text-error'}`}>
                            {Number(item.quantite) > 0 ? '+' : ''}{item.quantite || 0}
                          </td>
                          <td className="px-3">{item.emplacement || 'N/A'}</td>
                          <td className="px-3 text-primary hover:underline cursor-pointer">{item.reference_document || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-on-surface-variant">
                          Aucun mouvement trouvé pour les critères sélectionnés.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Footer */}
              <div className="bg-surface border-t border-outline-variant p-2 flex items-center justify-between">
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">Affichage de {history.length > 0 ? 1 : 0}-{history.length} sur {history.length} résultats</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded disabled:opacity-50" disabled><span className="material-symbols-outlined text-sm">first_page</span></button>
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded disabled:opacity-50" disabled><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                  <span className="font-label-md text-label-md px-2">Page 1</span>
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded" disabled><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                  <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded" disabled><span className="material-symbols-outlined text-sm">last_page</span></button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
