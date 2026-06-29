// src/app/(app)/magasin/inventory/physical/page.tsx - KM01 Saisie Inventaire Physique K-Magasin - De-hardcoded
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { magasinAPI } from '@/lib/api-client'
import { TCodeSearch } from '@/components/ui/TCodeSearch'

export default function PhysicalInventory() {
  const router = useRouter()
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStocks()
  }, [])

  const loadStocks = async () => {
    try {
      const response = await magasinAPI.getStocks()
      // Map API response to UI model
      const mappedItems = (response.data || []).map((stock: any, index: number) => ({
        id: stock.id || index + 1,
        status: 'pending',
        empl: `A-12-0${(index % 9) + 1}`, // Mock emplacement for UI
        code: stock.article?.code_article || 'N/A',
        description: stock.article?.nom || 'Article Inconnu',
        uom: stock.article?.unite_mesure || 'UDB',
        qtySys: stock.quantite_disponible || 0,
        qtyReal: '',
        ecart: '--'
      }))
      setInventoryItems(mappedItems)
    } catch (error) {
      console.error('Failed to load stocks', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleValidate = () => {
    // Validate discrepancies - in a real app this would call an API to update stocks
    // For now we just return to the inventory dashboard
    router.push('/magasin')
  }

  const handleQtyChange = (id: number, value: string) => {
    setInventoryItems(items => items.map(item => {
      if (item.id === id) {
        const qtyReal = value
        let status = 'pending'
        let ecart = '--'
        
        if (qtyReal !== '') {
          const sys = Number(item.qtySys)
          const real = Number(qtyReal)
          const diff = real - sys
          
          if (diff === 0) {
            status = 'match'
            ecart = '0.00'
          } else if (diff > 0) {
            status = 'overage'
            ecart = `+${diff.toFixed(2)}`
          } else {
            status = 'shortage'
            ecart = diff.toFixed(2)
          }
        }
        
        return { ...item, qtyReal, status, ecart }
      }
      return item
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match': return <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
      case 'shortage': return <span className="material-symbols-outlined text-error text-base" style={{fontVariationSettings: 'FILL 1'}}>warning</span>
      case 'overage': return <span className="material-symbols-outlined text-blue-500 text-base" style={{fontVariationSettings: 'FILL 1'}}>info</span>
      default: return <span className="material-symbols-outlined text-outline text-base">radio_button_unchecked</span>
    }
  }

  const getRowBg = (status: string) => {
    switch (status) {
      case 'shortage': return 'bg-red-50/10'
      case 'overage': return ''
      default: return ''
    }
  }

  const getQtyInputClass = (status: string) => {
    switch (status) {
      case 'shortage': return 'border border-error rounded font-mono font-bold text-error'
      case 'overage': return 'border border-blue-400 rounded font-mono font-bold text-blue-700'
      default: return 'border border-outline-variant rounded font-mono'
    }
  }

  const getEcartClass = (status: string) => {
    switch (status) {
      case 'shortage': return 'font-mono text-error font-bold bg-error-container/30'
      case 'overage': return 'font-mono text-blue-700 font-bold bg-blue-50'
      default: return 'font-mono text-on-surface-variant'
    }
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-lg antialiased">
        
        
        
        
        <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest text-primary font-label-caps text-label-caps border-r border-outline-variant shadow-sm flex flex-col h-screen p-[1rem] z-50">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">K</div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
              <p className="text-xs text-secondary">Port Operations</p>
            </div>
          </div>
          <button onClick={() => router.push('/magasin')} className="w-full bg-primary text-on-primary py-2 rounded mb-6 font-bold flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span> Nouvelle Opération
          </button>
          
        </aside>
        
        {/* Main Content Stage */}
        <main className="ml-[260px] p-[1rem] max-w-[1600px] mx-auto">
          {/* Context Header */}
          <div className="mb-6 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-1">
                <span className="material-symbols-outlined text-xs">home</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span>K-Magasin</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="font-medium text-error">Inventaire</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-error rounded-full"></div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Saisie Inventaire Physique</h2>
                <span className="bg-error-container text-on-error-container text-xs px-2 py-0.5 rounded font-mono ml-2 border border-red-200">T-CODE: KM01</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handlePrint} className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded flex items-center gap-2 hover:bg-surface-variant transition-colors text-sm font-medium">
                <span className="material-symbols-outlined text-sm">print</span> Imprimer Fiche
              </button>
              <button onClick={handleValidate} className="px-4 py-2 bg-error text-white rounded flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm text-sm font-bold">
                <span className="material-symbols-outlined text-sm">save</span> Valider Écarts
              </button>
            </div>
          </div>
          {/* Meta Data Form */}
          <div className="bg-surface border border-outline-variant rounded p-4 mb-6 shadow-sm flex gap-6 items-center flex-wrap">
            <div className="flex flex-col gap-1 w-48">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Magasin</label>
              <select className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error">
                <option>WH-A (Terminal 1)</option>
                <option>WH-B (Terminal 2)</option>
                <option>Zone Quarantaine</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Allée/Zone</label>
              <select className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error">
                <option>Zone A-12</option>
                <option>Zone B-04</option>
                <option>Toutes</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-40">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Date Inventaire</label>
              <input className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error text-on-surface" type="date" value={new Date().toISOString().split('T')[0]} readOnly/>
            </div>
            <div className="flex flex-col gap-1 w-40">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Responsable</label>
              <input className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error text-on-surface" readOnly type="text" value="Opérateur KAMLOG"/>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-green-700">En cours de saisie</span>
            </div>
          </div>
          {/* High-Density Data Table */}
          <div className="bg-surface border border-outline-variant rounded shadow-sm overflow-hidden min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-error"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-data-tabular text-data-tabular">
                    <thead className="bg-surface-container-high border-b border-outline-variant sticky top-0">
                      <tr>
                        <th className="py-2 px-3 font-semibold text-on-surface-variant w-12">Statut</th>
                        <th className="py-2 px-3 font-semibold text-on-surface-variant w-24">Empl.</th>
                        <th className="py-2 px-3 font-semibold text-on-surface-variant w-32">Code Article</th>
                        <th className="py-2 px-3 font-semibold text-on-surface-variant">Description</th>
                        <th className="py-2 px-3 font-semibold text-on-surface-variant w-20 text-center">UoM</th>
                        <th className="py-2 px-3 font-semibold text-on-surface-variant w-24 text-right bg-surface-dim">Qté Sys.</th>
                        <th className="py-2 px-3 font-semibold text-error w-32 text-center border-x border-red-200 bg-red-50">Qté Réelle</th>
                        <th className="py-2 px-3 font-semibold text-on-surface-variant w-24 text-right">Écart</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {inventoryItems.map((item) => (
                        <tr key={item.id} className={`hover:bg-surface-container-low transition-colors group ${getRowBg(item.status)}`}>
                          <td className="py-2 px-3 text-center">{getStatusIcon(item.status)}</td>
                          <td className="py-2 px-3 font-mono text-xs">{item.empl}</td>
                          <td className="py-2 px-3 font-mono text-primary font-medium">{item.code}</td>
                          <td className="py-2 px-3 truncate max-w-[200px]" title={item.description}>{item.description}</td>
                          <td className="py-2 px-3 text-center text-on-surface-variant">{item.uom}</td>
                          <td className="py-2 px-3 text-right text-on-surface-variant bg-surface-container-lowest">{Number(item.qtySys).toFixed(2)}</td>
                          <td className="py-1 px-3 border-x border-red-100 bg-red-50/30">
                            <input 
                              className={`w-full text-center py-1 px-2 text-sm focus:border-error focus:ring-1 focus:ring-error bg-white font-mono ${getQtyInputClass(item.status)}`} 
                              type="number" 
                              value={item.qtyReal}
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                              placeholder="..."
                            />
                          </td>
                          <td className={`py-2 px-3 text-right ${getEcartClass(item.status)}`}>{item.ecart}</td>
                        </tr>
                      ))}
                      {inventoryItems.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-on-surface-variant">Aucun article trouvé en stock pour cet inventaire.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-surface-container p-3 flex justify-between items-center text-sm border-t border-outline-variant">
                  <span className="text-on-surface-variant">Affichage {inventoryItems.length > 0 ? '1' : '0'}-{inventoryItems.length} sur {inventoryItems.length} articles</span>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50" disabled><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-error text-white font-medium">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
