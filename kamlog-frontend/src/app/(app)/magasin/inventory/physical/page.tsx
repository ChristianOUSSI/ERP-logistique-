// src/app/(app)/magasin/inventory/physical/page.tsx - KM01 Saisie Inventaire Physique K-Magasin - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PhysicalInventory() {
  const router = useRouter()
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, status: 'match', empl: 'A-12-01', code: 'ART-4492-X', description: 'Filtre à huile lourd MAN', uom: 'PCS', qtySys: '45.00', qtyReal: '45', ecart: '0.00' },
    { id: 2, status: 'shortage', empl: 'A-12-02', code: 'ART-1102-Y', description: 'Plaquettes de frein remorque', uom: 'SET', qtySys: '12.00', qtyReal: '10', ecart: '-2.00' },
    { id: 3, status: 'overage', empl: 'A-12-03', code: 'ART-8831-Z', description: 'Lubrifiant synthétique 5L', uom: 'BID', qtySys: '100.00', qtyReal: '105', ecart: '+5.00' },
    { id: 4, status: 'pending', empl: 'A-12-04', code: 'ART-5510-A', description: 'Courroie de distribution renforcée', uom: 'PCS', qtySys: '8.00', qtyReal: '', ecart: '--' },
    { id: 5, status: 'pending', empl: 'A-12-05', code: 'ART-9921-B', description: 'Joint torique industriel (Lot 100)', uom: 'LOT', qtySys: '22.00', qtyReal: '', ecart: '--' }
  ])

  const handlePrint = () => {
    // Print inventory sheet - will be connected to backend
  }

  const handleValidate = () => {
    // Validate discrepancies - will be connected to backend
    router.push('/magasin/inventory')
  }

  const handleQtyChange = (id: number, value: string) => {
    // Update quantity - will be connected to backend
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
        {/* TopNavBar */}
        <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem] ml-[260px] max-w-[calc(100%-260px)]">
          <div className="flex items-center gap-4">
            <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
          </div>
          <nav className="flex gap-6 h-full items-center">
            <a onClick={() => router.push('/master-data/articles')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all h-full flex items-center cursor-pointer">Articles</a>
            <a onClick={() => router.push('/master-data/tiers')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all h-full flex items-center cursor-pointer">Clients</a>
            <a onClick={() => router.push('/magasin/inventory')} className="font-body-base text-body-base text-primary border-b-2 border-primary pb-1 h-full flex items-center cursor-pointer">Stocks</a>
            <a onClick={() => router.push('/reports')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all h-full flex items-center cursor-pointer">Rapports</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative focus-within:ring-2 focus-within:ring-primary rounded">
              <input className="pl-8 pr-3 py-1.5 bg-surface-variant text-on-surface-variant text-sm rounded border-none focus:ring-0" placeholder="Rechercher T-Code" type="text"/>
              <span className="material-symbols-outlined absolute left-2 top-2 text-on-surface-variant text-sm">search</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-on-surface-variant hover:text-primary transition-all"><span className="material-symbols-outlined">notifications</span></button>
              <button onClick={() => router.push('/security')} className="text-on-surface-variant hover:text-primary transition-all"><span className="material-symbols-outlined">verified_user</span></button>
              <button onClick={() => router.push('/profile')} className="text-on-surface-variant hover:text-primary transition-all"><span className="material-symbols-outlined">account_circle</span></button>
            </div>
          </div>
        </header>
        {/* SideNavBar */}
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
          <nav className="flex-1 flex flex-col gap-2">
            <a onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">dashboard</span> Tableau de bord
            </a>
            <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">local_shipping</span> Transport
            </a>
            <a onClick={() => router.push('/finance')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">payments</span> Finances
            </a>
            <a onClick={() => router.push('/magasin')} className="flex items-center gap-3 px-3 py-2 rounded text-primary bg-secondary-container font-bold relative active:scale-95 duration-150 cursor-pointer">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-error rounded-r"></div>
              <span className="material-symbols-outlined" style={{fontVariationSettings: 'FILL 1'}}>minor_crash</span> Parc Automobile
            </a>
            <a onClick={() => router.push('/settings')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
              <span className="material-symbols-outlined">settings</span> Paramètres
            </a>
          </nav>
          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant">
            <a onClick={() => router.push('/support')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined">help_outline</span> Support
            </a>
            <a onClick={() => router.push('/logout')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:bg-surface-container-high transition-colors cursor-pointer">
              <span className="material-symbols-outlined">logout</span> Déconnexion
            </a>
          </div>
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
              <input className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-sm focus:border-error focus:ring-1 focus:ring-error text-on-surface" type="date" value="2023-10-27"/>
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
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className={`hover:bg-surface-container-low transition-colors group ${getRowBg(item.status)}`}>
                      <td className="py-2 px-3 text-center">{getStatusIcon(item.status)}</td>
                      <td className="py-2 px-3 font-mono text-xs">{item.empl}</td>
                      <td className="py-2 px-3 font-mono text-primary font-medium">{item.code}</td>
                      <td className="py-2 px-3 truncate max-w-[200px]" title={item.description}>{item.description}</td>
                      <td className="py-2 px-3 text-center text-on-surface-variant">{item.uom}</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant bg-surface-container-lowest">{item.qtySys}</td>
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
                </tbody>
              </table>
            </div>
            <div className="bg-surface-container p-3 flex justify-between items-center text-sm border-t border-outline-variant">
              <span className="text-on-surface-variant">Affichage 1-5 sur 142 articles</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface disabled:opacity-50" disabled><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-error text-white font-medium">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface font-medium">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface font-medium">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
