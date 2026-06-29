'use client'

import { useState } from 'react'

interface InventoryItem {
  status: 'match' | 'shortage' | 'overage' | 'pending'
  location: string
  code: string
  description: string
  uom: string
  systemQty: number
  realQty: number | string
  variance: number | string
}

export default function SaisieInventairePhysiquePage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState('WH-A (Terminal 1)')
  const [selectedZone, setSelectedZone] = useState('Zone A-12')
  const [inventoryDate, setInventoryDate] = useState('2023-10-27')
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      status: 'match',
      location: 'A-12-01',
      code: 'ART-4492-X',
      description: 'Filtre à huile lourd MAN',
      uom: 'PCS',
      systemQty: 45.00,
      realQty: 45,
      variance: 0.00
    },
    {
      status: 'shortage',
      location: 'A-12-02',
      code: 'ART-1102-Y',
      description: 'Plaquettes de frein remorque',
      uom: 'SET',
      systemQty: 12.00,
      realQty: 10,
      variance: -2.00
    },
    {
      status: 'overage',
      location: 'A-12-03',
      code: 'ART-8831-Z',
      description: 'Lubrifiant synthétique 5L',
      uom: 'BID',
      systemQty: 100.00,
      realQty: 105,
      variance: 5.00
    },
    {
      status: 'pending',
      location: 'A-12-04',
      code: 'ART-5510-A',
      description: 'Courroie de distribution renforcée',
      uom: 'PCS',
      systemQty: 8.00,
      realQty: '',
      variance: '--'
    },
    {
      status: 'pending',
      location: 'A-12-05',
      code: 'ART-9921-B',
      description: 'Joint torique industriel (Lot 100)',
      uom: 'LOT',
      systemQty: 22.00,
      realQty: '',
      variance: '--'
    }
  ])

  const handleRealQtyChange = (index: number, value: string) => {
    const newItems = [...inventoryItems]
    const realQty = value === '' ? '' : parseFloat(value)
    newItems[index].realQty = realQty
    
    if (realQty !== '' && typeof realQty === 'number') {
      const variance = realQty - newItems[index].systemQty
      newItems[index].variance = variance
      
      if (variance === 0) {
        newItems[index].status = 'match'
      } else if (variance < 0) {
        newItems[index].status = 'shortage'
      } else {
        newItems[index].status = 'overage'
      }
    } else {
      newItems[index].status = 'pending'
      newItems[index].variance = '--'
    }
    
    setInventoryItems(newItems)
  }

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'match':
        return <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
      case 'shortage':
        return <span className="material-symbols-outlined text-error text-base fill">warning</span>
      case 'overage':
        return <span className="material-symbols-outlined text-blue-500 text-base fill">info</span>
      case 'pending':
        return <span className="material-symbols-outlined text-outline text-base">radio_button_unchecked</span>
    }
  }

  const getRowBgClass = (status: InventoryItem['status']) => {
    switch (status) {
      case 'shortage':
        return 'bg-red-50/10'
      default:
        return ''
    }
  }

  const getVarianceClass = (status: InventoryItem['status']) => {
    switch (status) {
      case 'shortage':
        return 'text-error font-bold bg-error-container/30'
      case 'overage':
        return 'text-blue-700 font-bold bg-blue-50'
      default:
        return 'text-on-surface-variant'
    }
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1';
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-lg antialiased">
        
        

        
        <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest text-primary font-label-caps text-label-caps border-r border-outline-variant shadow-sm flex flex-col h-screen p-md z-50">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">K</div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
              <p className="text-xs text-secondary">Port Operations</p>
            </div>
          </div>
          <button className="w-full bg-primary text-on-primary py-2 rounded mb-6 font-bold flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span> Nouvelle Opération
          </button>
          
          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant">
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors" href="/support">
              <span className="material-symbols-outlined">help_outline</span> Support
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors" href="/login">
              <span className="material-symbols-outlined">logout</span> Déconnexion
            </a>
          </div>
        </aside>

        {/* Main Content Stage */}
        <main className="ml-[260px] p-gutter max-w-max-width mx-auto">
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
              <button className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded flex items-center gap-2 hover:bg-surface-variant transition-colors text-sm font-medium">
                <span className="material-symbols-outlined text-sm">print</span> Imprimer Fiche
              </button>
              <button className="px-4 py-2 bg-error text-white rounded flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm text-sm font-bold">
                <span className="material-symbols-outlined text-sm">save</span> Valider Écarts
              </button>
            </div>
          </div>

          {/* Meta Data Form */}
          <div className="bg-surface border border-outline-variant rounded p-4 mb-6 shadow-sm flex gap-6 items-center flex-wrap">
            <div className="flex flex-col gap-1 w-48">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Magasin</label>
              <select 
                className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error"
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                <option>WH-A (Terminal 1)</option>
                <option>WH-B (Terminal 2)</option>
                <option>Zone Quarantaine</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Allée/Zone</label>
              <select 
                className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                <option>Zone A-12</option>
                <option>Zone B-04</option>
                <option>Toutes</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-40">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Date Inventaire</label>
              <input 
                className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error text-on-surface" 
                type="date" 
                value={inventoryDate}
                onChange={(e) => setInventoryDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 w-40">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Responsable</label>
              <input className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error text-on-surface" readOnly type="text" value="J. Dupont"/>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-green-700">En cours de saisie</span>
            </div>
          </div>

          {/* High-Density Data Table */}
          <div className="bg-surface border border-outline-variant rounded shadow-sm overflow-hidden">
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
                  {inventoryItems.map((item, index) => (
                    <tr key={index} className={`hover:bg-surface-container-low transition-colors group ${getRowBgClass(item.status)}`}>
                      <td className="py-2 px-3 text-center">{getStatusIcon(item.status)}</td>
                      <td className="py-2 px-3 font-mono text-xs">{item.location}</td>
                      <td className="py-2 px-3 font-mono text-primary font-medium">{item.code}</td>
                      <td className="py-2 px-3 truncate max-w-[200px]" title={item.description}>{item.description}</td>
                      <td className="py-2 px-3 text-center text-on-surface-variant">{item.uom}</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant bg-surface-container-lowest">{item.systemQty.toFixed(2)}</td>
                      <td className="py-1 px-3 border-x border-red-100 bg-red-50/30">
                        <input 
                          className={`w-full text-center border rounded py-1 px-2 text-sm focus:border-error focus:ring-1 focus:ring-error bg-white font-mono font-medium ${
                            item.status === 'shortage' ? 'border-error text-error' :
                            item.status === 'overage' ? 'border-blue-400 text-blue-700' :
                            'border-outline-variant'
                          }`}
                          type="number" 
                          value={item.realQty}
                          onChange={(e) => handleRealQtyChange(index, e.target.value)}
                          placeholder="..."
                        />
                      </td>
                      <td className={`py-2 px-3 text-right font-mono ${getVarianceClass(item.status)}`}>
                        {typeof item.variance === 'number' ? (item.variance > 0 ? '+' : '') + item.variance.toFixed(2) : item.variance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-surface-container p-3 flex justify-between items-center text-sm border-t border-outline-variant">
              <span className="text-on-surface-variant">Affichage 1-5 sur 142 articles</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-error text-white font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface font-medium">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
