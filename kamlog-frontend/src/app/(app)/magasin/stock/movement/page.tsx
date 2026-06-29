// src/app/(app)/magasin/stock/movement/page.tsx - KM12 Mouvement de Stock Manuel K-Magasin - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StockMovement() {
  const router = useRouter()
  const [movementType, setMovementType] = useState('adjustment')
  const [articleCode, setArticleCode] = useState('ART-99201 - Filtre Huile Lourd')
  const [quantity, setQuantity] = useState('-2')
  const [unit, setUnit] = useState('PC')
  const [zoneSource, setZoneSource] = useState('Z-A')
  const [rackSource, setRackSource] = useState('R42-B12')
  const [justification, setJustification] = useState('')

  const handlePrintBarcode = () => {
    // Print barcode - will be connected to backend
  }

  const handleCancel = () => {
    router.push('/magasin/stock')
  }

  const handleValidate = () => {
    // Validate movement - will be connected to backend
    router.push('/magasin/stock')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .magasin-main { color: #ef4444; }
        .magasin-bg { background-color: #fee2e2; }
        .magasin-active { color: #ef4444; background-color: #fee2e2; border-left-color: #ef4444; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex">
        {/* TopNavBar (Mobile Only) */}
        
        {/* SideNavBar (Desktop) */}
        
        {/* Contextual Pane (Sub-module Nav) */}
        <aside className="hidden xl:flex flex-col fixed left-[240px] top-0 h-full w-[200px] flex-shrink-0 z-30 bg-surface border-r border-outline-variant pt-[1.5rem] px-[1rem]">
          <h2 className="font-title-md text-title-md font-bold text-on-surface mb-[1rem]">Magasin Ops</h2>
          <div className="flex flex-col gap-[0.25rem]">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-[0.25rem] mt-[0.5rem]">Transactions</div>
            <a onClick={() => router.push('/magasin/reception')} className="font-body-sm text-body-sm text-on-surface hover:text-magasin-main transition-colors py-1 px-2 rounded hover:bg-surface-container-low cursor-pointer">MIGO - Réception</a>
            <a onClick={() => router.push('/magasin/invoicing')} className="font-body-sm text-body-sm text-on-surface hover:text-magasin-main transition-colors py-1 px-2 rounded hover:bg-surface-container-low cursor-pointer">MIRO - Facturation</a>
            <a onClick={() => router.push('/magasin/stock/movement')} className="font-body-sm text-body-sm text-magasin-main font-semibold magasin-bg py-1 px-2 rounded border-l-2 border-magasin-main cursor-pointer">MB1A - Mvt Stock</a>
            <a onClick={() => router.push('/magasin/stock/status')} className="font-body-sm text-body-sm text-on-surface hover:text-magasin-main transition-colors py-1 px-2 rounded hover:bg-surface-container-low cursor-pointer">MB52 - État Stock</a>
          </div>
        </aside>
        {/* Main Content Stage */}
        <main className="flex-1 ml-0 md:ml-[240px] xl:ml-[440px] mt-16 md:mt-0 p-[1rem] md:p-[1.5rem] lg:p-[2rem] max-w-[1200px] w-full">
          {/* Breadcrumbs & Header */}
          <div className="mb-[1.5rem]">
            
            <div className="flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Ajustement Manuel</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Transaction T-Code: MB1A</p>
              </div>
              <div className="flex gap-[0.5rem]">
                <button onClick={handlePrintBarcode} className="px-[1rem] py-[0.5rem] border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface font-medium flex items-center gap-[0.25rem]">
                  <span className="material-symbols-outlined" style={{fontSize: '16px'}}>print</span>
                  Imprimer Code-Barres
                </button>
              </div>
            </div>
          </div>
          {/* Form Container */}
          <div className="bg-surface rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            {/* Context Header */}
            <div className="bg-surface-container-low px-[1.5rem] py-[1rem] border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-[1rem]">
                <div className="w-8 h-8 rounded magasin-bg text-magasin-main flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: 'FILL 1', fontSize: '18px'}}>edit_document</span>
                </div>
                <div>
                  <h2 className="font-title-md text-title-md font-medium text-on-surface">Détails du Mouvement</h2>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Veuillez renseigner les informations obligatoires (*)</div>
                </div>
              </div>
              <div className="flex items-center gap-[0.5rem]">
                <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-data-tabular text-data-tabular rounded">Date: 24 Oct 2023</span>
                <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-data-tabular text-data-tabular rounded">Opérateur: 1042A</span>
              </div>
            </div>
            {/* Form Body */}
            <form className="p-[1.5rem] flex flex-col gap-[1.5rem]">
              {/* Section 1: Article & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] border-b border-outline-variant pb-[1.5rem]">
                {/* Article Selection */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem] font-medium">Code Article / Description <span className="magasin-main">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{fontSize: '18px'}}>qr_code_scanner</span>
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded py-[0.5rem] pl-10 pr-3 font-body-md text-body-md focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all" 
                      placeholder="Rechercher un article..." 
                      type="text" 
                      value={articleCode}
                      onChange={(e) => setArticleCode(e.target.value)}
                    />
                  </div>
                </div>
                {/* Type de Mouvement */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem] font-medium">Type de Mouvement <span className="magasin-main">*</span></label>
                  <select 
                    className="w-full bg-surface border border-outline-variant rounded py-[0.5rem] px-3 font-body-md text-body-md focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all appearance-none cursor-pointer"
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value)}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="entry">Entrée (101)</option>
                    <option value="exit">Sortie (201)</option>
                    <option value="transfer">Transfert (301)</option>
                    <option value="adjustment">Ajustement d'Inventaire (701)</option>
                  </select>
                </div>
              </div>
              {/* Section 2: Quantities & Locations */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-[1rem]">
                {/* Quantity */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem] font-medium">Quantité <span className="magasin-main">*</span></label>
                  <div className="flex">
                    <input 
                      className="w-full bg-surface border border-outline-variant border-r-0 rounded-l py-[0.5rem] px-3 font-data-tabular text-data-tabular focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all z-10" 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <select 
                      className="bg-surface-container-low border border-outline-variant rounded-r py-[0.5rem] px-2 font-label-md text-label-md focus:border-magasin-main outline-none z-0 border-l-0 w-20"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option>UDB</option>
                      <option>PC</option>
                      <option>KG</option>
                      <option>PAL</option>
                    </select>
                  </div>
                </div>
                {/* Emplacement Source */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-[1rem] bg-surface-container-low p-[1rem] rounded border border-outline-variant">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]">Emplacement Source</label>
                    <div className="flex gap-2">
                      <input 
                        className="w-1/3 bg-surface border border-outline-variant rounded py-[0.5rem] px-2 font-data-tabular text-data-tabular focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none uppercase" 
                        placeholder="Zone" 
                        type="text" 
                        value={zoneSource}
                        onChange={(e) => setZoneSource(e.target.value)}
                      />
                      <input 
                        className="w-2/3 bg-surface border border-outline-variant rounded py-[0.5rem] px-2 font-data-tabular text-data-tabular focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none uppercase" 
                        placeholder="Allée/Rack" 
                        type="text" 
                        value={rackSource}
                        onChange={(e) => setRackSource(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Emplacement Destination (Disabled for Adjustment) */}
                  <div className="opacity-50">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]">Emplacement Destination</label>
                    <div className="flex gap-2">
                      <input className="w-1/3 bg-surface-container border border-outline-variant rounded py-[0.5rem] px-2 font-data-tabular text-data-tabular cursor-not-allowed" disabled placeholder="Zone" type="text"/>
                      <input className="w-2/3 bg-surface-container border border-outline-variant rounded py-[0.5rem] px-2 font-data-tabular text-data-tabular cursor-not-allowed" disabled placeholder="Allée/Rack" type="text"/>
                    </div>
                  </div>
                </div>
              </div>
              {/* Section 3: Justification */}
              <div className="border-t border-outline-variant pt-[1.5rem]">
                <label className="block font-label-md text-label-md text-on-surface mb-[0.5rem] font-medium">Motif de l'Ajustement <span className="magasin-main">*</span></label>
                <textarea
                  className="w-full bg-surface border border-outline-variant rounded py-[0.5rem] px-3 font-body-md text-body-md focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all resize-none"
                  placeholder="Ex: Écart constaté lors de l'inventaire tournant, pièce endommagée..."
                  rows={3}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                ></textarea>
              </div>
              {/* Footer Actions */}
              <div className="flex justify-end gap-[1rem] pt-[1rem] mt-[0.5rem]">
                <button onClick={handleCancel} className="px-[2rem] py-[0.5rem] border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface font-medium" type="button">
                  Annuler
                </button>
                <button onClick={handleValidate} className="px-[2rem] py-[0.5rem] rounded magasin-main hover:bg-red-600 transition-colors font-label-md text-label-md text-white font-medium shadow-sm flex items-center gap-[0.25rem]" type="button">
                  <span className="material-symbols-outlined" style={{fontSize: '18px'}}>save</span>
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>
          {/* Recent Stock Table Info */}
          <div className="mt-[1.5rem]">
            <h3 className="font-title-md text-title-md font-medium text-on-surface mb-[0.5rem]">Situation du Stock (ART-99201)</h3>
            <div className="bg-surface rounded border border-outline-variant overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant uppercase">
                    <th className="py-[0.5rem] px-[1rem] font-medium">Magasin</th>
                    <th className="py-[0.5rem] px-[1rem] font-medium">Zone</th>
                    <th className="py-[0.5rem] px-[1rem] font-medium">Rack</th>
                    <th className="py-[0.5rem] px-[1rem] font-medium text-right">Stock Actuel</th>
                    <th className="py-[0.5rem] px-[1rem] font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="font-data-tabular text-data-tabular text-on-surface">
                  <tr className="border-b border-outline-variant hover:bg-surface-container-lowest">
                    <td className="py-[0.5rem] px-[1rem]">M-PRINCIPAL</td>
                    <td className="py-[0.5rem] px-[1rem]">Z-A</td>
                    <td className="py-[0.5rem] px-[1rem]">R42-B12</td>
                    <td className="py-[0.5rem] px-[1rem] text-right font-medium">45 PC</td>
                    <td className="py-[0.5rem] px-[1rem]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-800">Disponible</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest">
                    <td className="py-[0.5rem] px-[1rem]">M-QUARANTAINE</td>
                    <td className="py-[0.5rem] px-[1rem]">Z-Q</td>
                    <td className="py-[0.5rem] px-[1rem]">Q01-A01</td>
                    <td className="py-[0.5rem] px-[1rem] text-right font-medium">2 PC</td>
                    <td className="py-[0.5rem] px-[1rem]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-100 text-yellow-800">Bloqué CQ</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
