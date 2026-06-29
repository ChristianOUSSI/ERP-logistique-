// src/app/(app)/finance/invoicing/create/page.tsx - K-Finance Mission de Facture Client - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InvoiceCreation() {
  const router = useRouter()
  const [invoiceLines, setInvoiceLines] = useState([
    { pos: '0010', article: 'Manutention TC 20\' Plein', ref: 'Ref Commande: 450098221', qty: 12, um: 'UN', price: '45 000', tva: 'V1 (19.25%)', net: '540 000' },
    { pos: '0020', article: 'Frais de magasinage (Jours 1-5)', ref: 'Lot: L-88392', qty: 5, um: 'JR', price: '12 500', tva: 'V1 (19.25%)', net: '62 500' }
  ])

  const handleSaveDraft = () => {
    // Save draft - will be connected to backend
  }

  const handlePost = () => {
    // Post invoice - will be connected to backend
    router.push('/finance/invoicing')
  }

  const handleAddLine = () => {
    // Add new line - will be connected to backend
  }

  const handleImportOrder = () => {
    // Import from order - will be connected to backend
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
        .k-finance-accent { background-color: #8B5CF6; }
        .k-finance-text { color: #8B5CF6; }
        .k-finance-border { border-color: #8B5CF6; }
        .bg-finance-surface { background-color: #faf5ff; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md antialiased h-screen overflow-hidden flex">
        {/* SideNavBar */}
        <nav className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col p-[1rem] z-50">
          {/* Header */}
          <div className="px-[0.5rem] py-[1.5rem] mb-4 flex items-center gap-[0.5rem] border-b border-surface-variant">
            <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md font-bold k-finance-accent text-white">
              K
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Port Operations</p>
            </div>
          </div>
          {/* Main Tabs */}
          <div className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-[0.25rem]">
              <li>
                <a onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-[0.5rem] py-2 rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  Tableau de bord
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-[0.5rem] py-2 rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  Transport
                </a>
              </li>
              {/* ACTIVE TAB: Finances */}
              <li className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full k-finance-accent"></div>
                <a onClick={() => router.push('/finance')} className="flex items-center gap-3 px-[0.5rem] py-2 ml-1 rounded-lg font-label-md text-label-md text-primary bg-secondary-container font-bold active:scale-95 duration-150 k-finance-text bg-purple-100 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px] fill">payments</span>
                  Finances
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/parc')} className="flex items-center gap-3 px-[0.5rem] py-2 rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">minor_crash</span>
                  Parc Automobile
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/settings')} className="flex items-center gap-3 px-[0.5rem] py-2 rounded-lg font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                  Paramètres
                </a>
              </li>
            </ul>
            {/* Contextual Pane (Sub-module) */}
            <div className="mt-8 px-[0.5rem]">
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-3">T-Codes Finance</p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-3 py-2 bg-surface-container-low rounded border border-outline-variant hover:border-primary transition-colors text-left group">
                  <span className="font-data-tabular text-data-tabular text-on-surface group-hover:text-primary">F-01</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-primary-container text-on-primary-container rounded border border-primary text-left k-finance-accent k-finance-border text-white">
                  <span className="font-data-tabular text-data-tabular font-semibold">VF01</span>
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-surface-container-low rounded border border-outline-variant hover:border-primary transition-colors text-left group">
                  <span className="font-data-tabular text-data-tabular text-on-surface group-hover:text-primary">FBL5N</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          {/* Footer CTA & Links */}
          <div className="mt-auto px-[0.5rem] py-4 border-t border-surface-variant">
            <button onClick={handleAddLine} className="w-full mb-4 py-2 px-4 bg-primary text-on-primary font-title-md text-title-md rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex justify-center items-center gap-2 k-finance-accent">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Nouvelle Opération
            </button>
            <ul className="space-y-2">
              <li>
                <a onClick={() => router.push('/support')} className="flex items-center gap-3 px-2 py-1.5 rounded font-label-md text-label-md text-secondary hover:bg-surface-container-high transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">help_outline</span>
                  Support
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/logout')} className="flex items-center gap-3 px-2 py-1.5 rounded font-label-md text-label-md text-error hover:bg-error-container transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </nav>
        {/* Main Content Wrapper */}
        <div className="flex-1 ml-[260px] flex flex-col h-full bg-finance-surface">
          {/* TopNavBar */}
          <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem]">
            {/* Left: Breadcrumbs & Context */}
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-on-surface-variant">
                <span onClick={() => router.push('/finance')} className="hover:text-primary cursor-pointer font-label-md text-label-md">K-Finance</span>
                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                <span onClick={() => router.push('/finance/invoicing')} className="hover:text-primary cursor-pointer font-label-md text-label-md">Facturation</span>
                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold k-finance-text">Création Facture Client (VF01)</span>
              </div>
            </div>
            {/* Right: Search & Actions */}
            <div className="flex items-center gap-4">
              {/* T-Code Search */}
              <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-lg k-finance-border">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input className="pl-10 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface w-48 focus:outline-none focus:border-primary k-finance-border" placeholder="Rechercher T-Code" type="text"/>
              </div>
              <div className="h-6 w-px bg-outline-variant mx-2"></div>
              {/* Icon Actions */}
              <button className="text-on-surface-variant hover:text-primary transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button onClick={() => router.push('/security')} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">verified_user</span>
              </button>
              {/* Profile */}
              <button onClick={() => router.push('/profile')} className="ml-2 w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
                <img alt="User profile with MFA status" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2m3t74ULBJxvSrslZkQ6Y_0P8lKGAmW9nIpVm59EY2FlR-Uk9R2KqOrMJYLGhIWyCYrAn9DeR6ntDqND65I-BWYuiBa0GeUE1TdZgLR9WLDXWAzRPkh3IEPGEr2DVzw4F7j1H0RTDhTjeWP1bQMM9c_L7msvIhsm18xRIYQ_Bi9YFU640lqJwo-NK8uBc2neHrAQJwZsbWj5QxbOBhbqRXsnvVfi7kIXbFjb7z6fzFQQ_BvVI-zt1WDjiRSMphW1BE1HBuUYtaKo"/>
              </button>
            </div>
          </header>
          {/* Main Canvas */}
          <main className="flex-1 overflow-y-auto p-[1rem] relative">
            <div className="max-w-[1200px] mx-auto space-y-[1rem] pb-[2rem]">
              {/* Page Header */}
              <div className="flex justify-between items-end mb-[1.5rem]">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Nouvelle Facture</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Transaction: VF01 • Date comptable: 24 Oct 2023</p>
                </div>
                <div className="flex gap-[0.5rem]">
                  <button onClick={handleSaveDraft} className="px-4 py-2 bg-surface border border-outline-variant rounded font-title-md text-title-md text-on-surface hover:bg-surface-container-low transition-colors shadow-sm">
                    Sauvegarder Brouillon
                  </button>
                  <button onClick={handlePost} className="px-4 py-2 bg-primary text-on-primary rounded font-title-md text-title-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm flex items-center gap-2 k-finance-accent">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Comptabiliser
                  </button>
                </div>
              </div>
              {/* Bento Grid Layout for Form */}
              <div className="grid grid-cols-12 gap-[1rem]">
                {/* Top Left: Client Selection (En-tête) */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-[1rem] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary k-finance-accent"></div>
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">domain</span>
                    Données Client
                  </h3>
                  <div className="grid grid-cols-2 gap-[1rem]">
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface-variant">Code Client (Soldeur)</label>
                      <div className="relative">
                        <input className="w-full px-3 py-2 bg-surface-bright border border-outline-variant rounded font-data-tabular text-data-tabular text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary k-finance-border" type="text" value="C-49201"/>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                          <span className="material-symbols-outlined text-[18px]">search</span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface-variant">Nom / Raison Sociale</label>
                      <input className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-body-sm text-body-sm text-on-surface-variant cursor-not-allowed" readOnly type="text" value="MAERSK LINE CAMEROUN SA"/>
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface-variant">N° Contribuable</label>
                      <input className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded font-data-tabular text-data-tabular text-on-surface-variant cursor-not-allowed" readOnly type="text" value="M049300012344B"/>
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface-variant">Conditions de paiement</label>
                      <select className="w-full px-3 py-2 bg-surface-bright border border-outline-variant rounded font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary k-finance-border">
                        <option>Z030 - 30 Jours Net</option>
                        <option>Z015 - 15 Jours Net</option>
                        <option>Z000 - Comptant</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Top Right: Invoice Details */}
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-[1rem]">
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">receipt_long</span>
                    Détails Facture
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-surface-variant">
                      <span className="font-label-md text-label-md text-on-surface-variant">Type de document</span>
                      <span className="font-body-sm text-body-sm font-semibold bg-surface-container px-2 py-1 rounded">F2 - Facture Standard</span>
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface-variant">Date de facturation</label>
                      <input className="w-full px-3 py-1.5 bg-surface-bright border border-outline-variant rounded font-data-tabular text-data-tabular text-on-surface focus:outline-none focus:border-primary k-finance-border" type="date" value="2023-10-24"/>
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-md text-label-md text-on-surface-variant">Devise</label>
                      <select className="w-full px-3 py-1.5 bg-surface-bright border border-outline-variant rounded font-data-tabular text-data-tabular text-on-surface focus:outline-none focus:border-primary k-finance-border">
                        <option>FCFA - Franc CFA</option>
                        <option>FCFA - Euro</option>
                        <option>FCFA - US Dollar</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-label-md text-label-md text-on-surface-variant">Statut</span>
                      <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface px-2 py-1 rounded border border-outline-variant">Non Comptabilisée</span>
                    </div>
                  </div>
                </div>
                {/* Middle: Passerelle / Lignes de commande */}
                <div className="col-span-12 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
                  {/* Table Toolbar */}
                  <div className="px-[1rem] py-[0.5rem] bg-surface-container border-b border-outline-variant flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">Lignes d'articles</h3>
                      <button onClick={handleImportOrder} className="flex items-center gap-1 text-primary text-sm hover:underline font-label-md k-finance-text">
                        <span className="material-symbols-outlined text-[16px]">cable</span>
                        Importer via Commande (VL02N)
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddLine} className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Ajouter une ligne">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
                      <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Supprimer la sélection">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                  {/* Dense Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-10 text-center"><input className="rounded border-outline-variant text-primary focus:ring-primary k-finance-accent" type="checkbox"/></th>
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-16">Pos</th>
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Article / Prestation</th>
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-24">Qte</th>
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-20">UM</th>
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase text-right">Prix Unitaire</th>
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-24">Code TVA</th>
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase text-right">Montant Net</th>
                        </tr>
                      </thead>
                      <tbody className="font-data-tabular text-data-tabular">
                        {invoiceLines.map((line, index) => (
                          <tr key={index} className={`border-b border-surface-variant hover:bg-surface-bright transition-colors ${index % 2 === 1 ? 'bg-[#F9FAFB]' : ''}`}>
                            <td className="py-2 px-3 text-center"><input className="rounded border-outline-variant text-primary focus:ring-primary k-finance-accent" type="checkbox"/></td>
                            <td className="py-2 px-3 text-on-surface-variant">{line.pos}</td>
                            <td className="py-2 px-3">
                              <div className="font-medium text-on-surface">{line.article}</div>
                              <div className="text-xs text-on-surface-variant mt-0.5">{line.ref}</div>
                            </td>
                            <td className="py-2 px-3"><input className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-outline-variant focus:bg-surface-bright focus:border-primary rounded text-right" type="number" value={line.qty}/></td>
                            <td className="py-2 px-3 text-on-surface-variant">{line.um}</td>
                            <td className="py-2 px-3 text-right"><input className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-outline-variant focus:bg-surface-bright focus:border-primary rounded text-right" type="text" value={line.price}/></td>
                            <td className="py-2 px-3">
                              <select className="w-full px-1 py-1 bg-transparent border border-transparent hover:border-outline-variant focus:bg-surface-bright focus:border-primary rounded text-sm">
                                <option selected>{line.tva}</option>
                                <option>V0 (0%)</option>
                              </select>
                            </td>
                            <td className="py-2 px-3 text-right font-medium">{line.net}</td>
                          </tr>
                        ))}
                        <tr className="border-b border-surface-variant hover:bg-surface-bright transition-colors">
                          <td className="py-2 px-3 text-center"><input className="rounded border-outline-variant text-primary focus:ring-primary k-finance-accent" type="checkbox"/></td>
                          <td className="py-2 px-3 text-on-surface-variant">0030</td>
                          <td className="py-2 px-3">
                            <div className="font-medium text-on-surface text-on-surface-variant italic">Nouvelle ligne...</div>
                          </td>
                          <td className="py-2 px-3"></td>
                          <td className="py-2 px-3"></td>
                          <td className="py-2 px-3"></td>
                          <td className="py-2 px-3"></td>
                          <td className="py-2 px-3"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Bottom Left: Notes & Conditions */}
                <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-[1rem]">
                  <h3 className="font-title-md text-title-md text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit_note</span>
                    Textes d'en-tête
                  </h3>
                  <textarea className="w-full h-32 px-3 py-2 bg-surface-bright border border-outline-variant rounded font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary k-finance-border resize-none" placeholder="Saisir les observations sur la facture..."></textarea>
                </div>
                {/* Bottom Right: Synthèse Financière (Calculation) */}
                <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-[1rem] flex flex-col justify-between relative overflow-hidden">
                  {/* Atmospheric gradient representing K-Finance */}
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                  <h3 className="font-title-md text-title-md text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calculate</span>
                    Synthèse Financière (FCFA)
                  </h3>
                  <div className="space-y-2 font-data-tabular text-data-tabular">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">Total Brut HT</span>
                      <span>602 500</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">Remises (0%)</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-t border-surface-variant mt-1 pt-2">
                      <span className="font-medium text-on-surface">Base Imposable Net HT</span>
                      <span className="font-medium text-on-surface">602 500</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">TVA (V1 - 19.25%)</span>
                      <span>115 981</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">Centimes Additionnels (0%)</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t-2 border-primary mt-2 k-finance-border">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold k-finance-text">Montant Total TTC</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold k-finance-text">718 481</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
