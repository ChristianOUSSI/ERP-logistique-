'use client'


import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useState } from 'react'

interface InvoiceLine {
  position: string
  article: string
  reference: string
  quantity: number
  unit: string
  unitPrice: string
  vatCode: string
  netAmount: string
}

export default function MissionDeFactureClientPage() {
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([
    {
      position: '0010',
      article: 'Manutention TC 20\' Plein',
      reference: 'Ref Commande: 450098221',
      quantity: 12,
      unit: 'UN',
      unitPrice: '45 000',
      vatCode: 'V1 (19.25%)',
      netAmount: '540 000'
    },
    {
      position: '0020',
      article: 'Frais de magasinage (Jours 1-5)',
      reference: 'Lot: L-88392',
      quantity: 5,
      unit: 'JR',
      unitPrice: '12 500',
      vatCode: 'V1 (19.25%)',
      netAmount: '62 500'
    }
  ])

  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set())

  const toggleLineSelection = (index: number) => {
    const newSelected = new Set(selectedLines)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedLines(newSelected)
  }

  const toggleAllLines = () => {
    if (selectedLines.size === invoiceLines.length) {
      setSelectedLines(new Set())
    } else {
      setSelectedLines(new Set(invoiceLines.map((_, i) => i)))
    }
  }

  const calculateTotals = () => {
    const totalBrutHT = invoiceLines.reduce((sum, line) => sum + parseInt(line.netAmount.replace(/\s/g, '')), 0)
    const tva = Math.round(totalBrutHT * 0.1925)
    const totalTTC = totalBrutHT + tva
    return { totalBrutHT, tva, totalTTC }
  }

  const totals = calculateTotals()

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1';
        }
        .k-finance-accent {
          background-color: #8B5CF6;
        }
        .k-finance-text {
          color: #8B5CF6;
        }
        .k-finance-border {
          border-color: #8B5CF6;
        }
        .bg-finance-surface {
          background-color: #faf5ff;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md antialiased flex">
        
        

        
        <div className="flex-1 flex flex-col h-full bg-finance-surface">
          
          

          
          <main className="flex-1 overflow-y-auto p-gutter relative">
            <div className="max-w-[1200px] mx-auto space-y-md pb-xl">
              {/* Page Header */}
              <div className="flex justify-between items-end mb-lg">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Nouvelle Facture</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Transaction: VF01 • Date comptable: 24 Oct 2023</p>
                </div>
                <div className="flex gap-sm">
                  <button className="px-4 py-2 bg-surface border border-outline-variant rounded font-title-md text-title-md text-on-surface hover:bg-surface-container-low transition-colors shadow-sm">
                    Sauvegarder Brouillon
                  </button>
                  <button className="px-4 py-2 bg-primary text-on-primary rounded font-title-md text-title-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm flex items-center gap-2 k-finance-accent">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Comptabiliser
                  </button>
                </div>
              </div>

              {/* Bento Grid Layout for Form */}
              <div className="grid grid-cols-12 gap-md">
                {/* Top Left: Client Selection (En-tête) */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary k-finance-accent"></div>
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">domain</span>
                    Données Client
                  </h3>
                  <div className="grid grid-cols-2 gap-md">
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
                <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-md">
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
                  <div className="px-md py-sm bg-surface-container border-b border-outline-variant flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <h3 className="font-title-md text-title-md text-on-surface font-semibold">Lignes d'articles</h3>
                      <button className="flex items-center gap-1 text-primary text-sm hover:underline font-label-md k-finance-text">
                        <span className="material-symbols-outlined text-[16px]">cable</span>
                        Importer via Commande (VL02N)
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Ajouter une ligne">
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
                          <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-10 text-center">
                            <input 
                              className="rounded border-outline-variant text-primary focus:ring-primary k-finance-accent" 
                              type="checkbox"
                              checked={selectedLines.size === invoiceLines.length}
                              onChange={toggleAllLines}
                            />
                          </th>
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
                            <td className="py-2 px-3 text-center">
                              <input 
                                className="rounded border-outline-variant text-primary focus:ring-primary k-finance-accent" 
                                type="checkbox"
                                checked={selectedLines.has(index)}
                                onChange={() => toggleLineSelection(index)}
                              />
                            </td>
                            <td className="py-2 px-3 text-on-surface-variant">{line.position}</td>
                            <td className="py-2 px-3">
                              <div className="font-medium text-on-surface">{line.article}</div>
                              <div className="text-xs text-on-surface-variant mt-0.5">{line.reference}</div>
                            </td>
                            <td className="py-2 px-3">
                              <input className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-outline-variant focus:bg-surface-bright focus:border-primary rounded text-right" type="number" value={line.quantity}/>
                            </td>
                            <td className="py-2 px-3 text-on-surface-variant">{line.unit}</td>
                            <td className="py-2 px-3 text-right">
                              <input className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-outline-variant focus:bg-surface-bright focus:border-primary rounded text-right" type="text" value={line.unitPrice}/>
                            </td>
                            <td className="py-2 px-3">
                              <select className="w-full px-1 py-1 bg-transparent border border-transparent hover:border-outline-variant focus:bg-surface-bright focus:border-primary rounded text-sm">
                                <option selected>{line.vatCode}</option>
                                <option>V0 (0%)</option>
                              </select>
                            </td>
                            <td className="py-2 px-3 text-right font-medium">{line.netAmount}</td>
                          </tr>
                        ))}
                        <tr className="border-b border-surface-variant hover:bg-surface-bright transition-colors">
                          <td className="py-2 px-3 text-center">
                            <input className="rounded border-outline-variant text-primary focus:ring-primary k-finance-accent" type="checkbox"/>
                          </td>
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
                <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-md">
                  <h3 className="font-title-md text-title-md text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit_note</span>
                    Textes d'en-tête
                  </h3>
                  <textarea className="w-full h-32 px-3 py-2 bg-surface-bright border border-outline-variant rounded font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary k-finance-border resize-none" placeholder="Saisir les observations sur la facture..."></textarea>
                </div>

                {/* Bottom Right: Synthèse Financière (Calculation) */}
                <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-md flex flex-col justify-between relative overflow-hidden">
                  {/* Atmospheric gradient representing K-Finance */}
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                  <h3 className="font-title-md text-title-md text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calculate</span>
                    Synthèse Financière (FCFA)
                  </h3>
                  <div className="space-y-2 font-data-tabular text-data-tabular">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">Total Brut HT</span>
                      <span>{totals.totalBrutHT.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">Remises (0%)</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-t border-surface-variant mt-1 pt-2">
                      <span className="font-medium text-on-surface">Base Imposable Net HT</span>
                      <span className="font-medium text-on-surface">{totals.totalBrutHT.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">TVA (V1 - 19.25%)</span>
                      <span>{totals.tva.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-on-surface-variant">Centimes Additionnels (0%)</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-t-2 border-primary mt-2 k-finance-border">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold k-finance-text">Montant Total TTC</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold k-finance-text">{totals.totalTTC.toLocaleString('fr-FR')}</span>
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
