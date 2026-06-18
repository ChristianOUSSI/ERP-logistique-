'use client'

import { useState } from 'react'

export default function MouvementDeStockManuelPage() {
  const [articleCode, setArticleCode] = useState('ART-99201 - Filtre Huile Lourd')
  const [movementType, setMovementType] = useState('adjustment')
  const [quantity, setQuantity] = useState('-2')
  const [unit, setUnit] = useState('PC')
  const [sourceZone, setSourceZone] = useState('Z-A')
  const [sourceRack, setSourceRack] = useState('R42-B12')
  const [justification, setJustification] = useState('')

  const handleSubmit = () => {
    console.log('Movement submitted:', {
      articleCode,
      movementType,
      quantity,
      unit,
      sourceZone,
      sourceRack,
      justification
    })
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
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex">
        {/* TopNavBar (Mobile Only) */}
        <header className="md:hidden flex items-center justify-between px-margin-desktop w-full h-16 bg-surface border-b border-outline-variant fixed top-0 z-50">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-magasin-main">inventory_2</span>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Magasin</h1>
          </div>
          <div className="flex items-center gap-sm text-on-surface-variant">
            <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-1 rounded transition-colors">search</span>
            <span className="material-symbols-outlined cursor-pointer hover:bg-surface-container-high p-1 rounded transition-colors">menu</span>
          </div>
        </header>

        {/* SideNavBar (Desktop) */}
        <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full flex-shrink-0 z-40 bg-surface-container-low border-r border-outline-variant w-[240px] transition-all duration-200 ease-in-out">
          {/* Header */}
          <div className="p-lg border-b border-outline-variant mb-md flex items-center gap-md">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container font-title-lg font-bold">
              PA
            </div>
            <div>
              <div className="font-title-lg text-title-lg font-bold text-on-surface">Port Ops</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">Terminal A1</div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-md mb-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{fontSize: '16px'}}>search</span>
              <input className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT py-xs pl-8 pr-2 font-label-md text-label-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-on-surface-variant" placeholder="T-Code Search" type="text"/>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col gap-xxs px-xs">
            <a className="flex items-center gap-sm px-md py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md" href="#">
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Transport</span>
            </a>
            <a className="flex items-center gap-sm px-md py-xs rounded-lg font-label-md text-label-md magasin-active font-bold border-l-4" href="#">
              <span className="material-symbols-outlined fill">inventory_2</span>
              <span>Magasin</span>
            </a>
            <a className="flex items-center gap-sm px-md py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md" href="#">
              <span className="material-symbols-outlined">payments</span>
              <span>Finance</span>
            </a>
            <a className="flex items-center gap-sm px-md py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md" href="#">
              <span className="material-symbols-outlined">local_parking</span>
              <span>Parc</span>
            </a>
            <a className="flex items-center gap-sm px-md py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md" href="#">
              <span className="material-symbols-outlined">fact_check</span>
              <span>Audit</span>
            </a>
          </div>

          {/* Footer Links */}
          <div className="border-t border-outline-variant p-xs flex flex-col gap-xxs mt-auto">
            <a className="flex items-center gap-sm px-md py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md" href="#">
              <span className="material-symbols-outlined">support_agent</span>
              <span>Support</span>
            </a>
            <a className="flex items-center gap-sm px-md py-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span>Log out</span>
            </a>
          </div>
        </nav>

        {/* Contextual Pane (Sub-module Nav) */}
        <aside className="hidden xl:flex flex-col fixed left-[240px] top-0 h-full w-[200px] flex-shrink-0 z-30 bg-surface border-r border-outline-variant pt-lg px-md">
          <h2 className="font-title-md text-title-md font-bold text-on-surface mb-md">Magasin Ops</h2>
          <div className="flex flex-col gap-xs">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-xxs mt-sm">Transactions</div>
            <a className="font-body-sm text-body-sm text-on-surface hover:text-magasin-main transition-colors py-1 px-2 rounded hover:bg-surface-container-low" href="#">MIGO - Réception</a>
            <a className="font-body-sm text-body-sm text-on-surface hover:text-magasin-main transition-colors py-1 px-2 rounded hover:bg-surface-container-low" href="#">MIRO - Facturation</a>
            <a className="font-body-sm text-body-sm text-magasin-main font-semibold bg-magasin-bg py-1 px-2 rounded border-l-2 border-magasin-main" href="#">MB1A - Mvt Stock</a>
            <a className="font-body-sm text-body-sm text-on-surface hover:text-magasin-main transition-colors py-1 px-2 rounded hover:bg-surface-container-low" href="#">MB52 - État Stock</a>
          </div>
        </aside>

        {/* Main Content Stage */}
        <main className="flex-1 ml-0 md:ml-[240px] xl:ml-[440px] mt-16 md:mt-0 p-md md:p-lg lg:p-xl max-w-[1200px] w-full">
          {/* Breadcrumbs & Header */}
          <div className="mb-lg">
            <nav className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant mb-xs">
              <a className="hover:text-magasin-main transition-colors" href="#">Port Ops</a>
              <span className="material-symbols-outlined" style={{fontSize: '14px'}}>chevron_right</span>
              <a className="hover:text-magasin-main transition-colors" href="#">Magasin</a>
              <span className="material-symbols-outlined" style={{fontSize: '14px'}}>chevron_right</span>
              <span className="text-on-surface">Mouvement de Stock Manuel</span>
            </nav>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Ajustement Manuel</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Transaction T-Code: MB1A</p>
              </div>
              <div className="flex gap-sm">
                <button className="px-md py-xs border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface font-medium flex items-center gap-xs">
                  <span className="material-symbols-outlined" style={{fontSize: '16px'}}>print</span>
                  Imprimer Code-Barres
                </button>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-surface rounded-lg border border-outline-variant shadow-sm overflow-hidden">
            {/* Context Header */}
            <div className="bg-surface-container-low px-lg py-md border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded bg-magasin-bg text-magasin-main flex items-center justify-center">
                  <span className="material-symbols-outlined fill" style={{fontSize: '18px'}}>edit_document</span>
                </div>
                <div>
                  <h2 className="font-title-md text-title-md font-medium text-on-surface">Détails du Mouvement</h2>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Veuillez renseigner les informations obligatoires (*)</div>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-data-tabular text-data-tabular rounded">Date: 24 Oct 2023</span>
                <span className="px-2 py-1 bg-surface-variant text-on-surface-variant font-data-tabular text-data-tabular rounded">Opérateur: 1042A</span>
              </div>
            </div>

            {/* Form Body */}
            <form className="p-lg flex flex-col gap-lg" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {/* Section 1: Article & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md border-b border-outline-variant pb-lg">
                {/* Article Selection */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface mb-xs font-medium">Code Article / Description <span className="text-magasin-main">*</span></label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{fontSize: '18px'}}>qr_code_scanner</span>
                    <input 
                      className="w-full bg-surface border border-outline-variant rounded-DEFAULT py-sm pl-10 pr-3 font-body-md text-body-md focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all" 
                      placeholder="Rechercher un article..." 
                      type="text" 
                      value={articleCode}
                      onChange={(e) => setArticleCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Type de Mouvement */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs font-medium">Type de Mouvement <span className="text-magasin-main">*</span></label>
                  <select 
                    className="w-full bg-surface border border-outline-variant rounded-DEFAULT py-sm px-3 font-body-md text-body-md focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all appearance-none cursor-pointer"
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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-md">
                {/* Quantity */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs font-medium">Quantité <span className="text-magasin-main">*</span></label>
                  <div className="flex">
                    <input 
                      className="w-full bg-surface border border-outline-variant border-r-0 rounded-l-DEFAULT py-sm px-3 font-data-tabular text-data-tabular focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all z-10" 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <select 
                      className="bg-surface-container-low border border-outline-variant rounded-r-DEFAULT py-sm px-2 font-label-md text-label-md focus:border-magasin-main outline-none z-0 border-l-0 w-20"
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
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-md bg-surface-container-low p-md rounded border border-outline-variant">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Emplacement Source</label>
                    <div className="flex gap-2">
                      <input 
                        className="w-1/3 bg-surface border border-outline-variant rounded-DEFAULT py-sm px-2 font-data-tabular text-data-tabular focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none uppercase" 
                        placeholder="Zone" 
                        type="text" 
                        value={sourceZone}
                        onChange={(e) => setSourceZone(e.target.value)}
                      />
                      <input 
                        className="w-2/3 bg-surface border border-outline-variant rounded-DEFAULT py-sm px-2 font-data-tabular text-data-tabular focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none uppercase" 
                        placeholder="Allée/Rack" 
                        type="text" 
                        value={sourceRack}
                        onChange={(e) => setSourceRack(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Emplacement Destination (Disabled for Adjustment) */}
                  <div className="opacity-50">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Emplacement Destination</label>
                    <div className="flex gap-2">
                      <input className="w-1/3 bg-surface-container border border-outline-variant rounded-DEFAULT py-sm px-2 font-data-tabular text-data-tabular cursor-not-allowed" disabled placeholder="Zone" type="text"/>
                      <input className="w-2/3 bg-surface-container border border-outline-variant rounded-DEFAULT py-sm px-2 font-data-tabular text-data-tabular cursor-not-allowed" disabled placeholder="Allée/Rack" type="text"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Justification */}
              <div className="border-t border-outline-variant pt-lg">
                <label className="block font-label-md text-label-md text-on-surface mb-xs font-medium">Motif de l'Ajustement <span className="text-magasin-main">*</span></label>
                <textarea
                  className="w-full bg-surface border border-outline-variant rounded-DEFAULT py-sm px-3 font-body-md text-body-md focus:border-magasin-main focus:ring-1 focus:ring-magasin-main outline-none transition-all resize-none"
                  placeholder="Ex: Écart constaté lors de l'inventaire tournant, pièce endommagée..."
                  rows={3}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-md pt-md mt-sm">
                <button className="px-xl py-sm border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors font-label-md text-label-md text-on-surface font-medium" type="button">
                  Annuler
                </button>
                <button className="px-xl py-sm rounded bg-magasin-main hover:bg-red-600 transition-colors font-label-md text-label-md text-white font-medium shadow-sm flex items-center gap-xs" type="submit">
                  <span className="material-symbols-outlined" style={{fontSize: '18px'}}>save</span>
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>

          {/* Recent Stock Table Info */}
          <div className="mt-lg">
            <h3 className="font-title-md text-title-md font-medium text-on-surface mb-sm">Situation du Stock (ART-99201)</h3>
            <div className="bg-surface rounded border border-outline-variant overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant font-label-sm text-label-sm text-on-surface-variant uppercase">
                    <th className="py-sm px-md font-medium">Magasin</th>
                    <th className="py-sm px-md font-medium">Zone</th>
                    <th className="py-sm px-md font-medium">Rack</th>
                    <th className="py-sm px-md font-medium text-right">Stock Actuel</th>
                    <th className="py-sm px-md font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="font-data-tabular text-data-tabular text-on-surface">
                  <tr className="border-b border-outline-variant hover:bg-surface-container-lowest">
                    <td className="py-xs px-md">M-PRINCIPAL</td>
                    <td className="py-xs px-md">Z-A</td>
                    <td className="py-xs px-md">R42-B12</td>
                    <td className="py-xs px-md text-right font-medium">45 PC</td>
                    <td className="py-xs px-md">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-100 text-green-800">Disponible</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-lowest">
                    <td className="py-xs px-md">M-QUARANTAINE</td>
                    <td className="py-xs px-md">Z-Q</td>
                    <td className="py-xs px-md">Q01-A01</td>
                    <td className="py-xs px-md text-right font-medium">2 PC</td>
                    <td className="py-xs px-md">
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
