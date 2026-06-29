'use client'

import { useState } from 'react'

interface BankTransaction {
  date: string
  label: string
  debit: string
  credit: string
  status: 'matched' | 'pending'
}

export default function SaisieTransactionBancairePage() {
  const [selectedAccount, setSelectedAccount] = useState('Compte Principal - BNA (DZ)')
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(2)
  const [formData, setFormData] = useState({
    dateValeur: '2023-10-13',
    dateComptable: '2023-10-13',
    libelle: 'FRAIS TENUE DE COMPTE OCT',
    montant: '1 250.00',
    compteGeneral: '627800',
    compteGeneralLabel: 'Frais bancaires divers',
    centreCout: '',
    codeTaxe: 't2'
  })

  const [transactions] = useState<BankTransaction[]>([
    {
      date: '12/10/2023',
      label: 'VIR RECU PORT AUTHO REF: 99823',
      debit: '',
      credit: '+ 450,000.00',
      status: 'matched'
    },
    {
      date: '12/10/2023',
      label: 'PRELEV FOURNISSEUR CMA CGM',
      debit: '12,500.00',
      credit: '',
      status: 'matched'
    },
    {
      date: '13/10/2023',
      label: 'FRAIS TENUE DE COMPTE OCT',
      debit: '1,250.00',
      credit: '',
      status: 'pending'
    },
    {
      date: '14/10/2023',
      label: 'REMISE CHQ N 8872635',
      debit: '',
      credit: '+ 85,200.00',
      status: 'pending'
    }
  ])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
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
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f3ff;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface flex flex-col">
        
        

        {/* Main Content Area */}
        <main className="ml-[240px] flex-1 flex flex-col h-full bg-surface-container-low">
          {/* TopAppBar */}
          

          {/* Content Canvas */}
          <div className="flex-1 overflow-hidden p-gutter flex gap-gutter max-w-max-width mx-auto w-full">
            {/* Left Pane: Bank Statement View */}
            <div className="w-1/2 flex flex-col bg-surface border border-outline-variant rounded shadow-sm overflow-hidden">
              <div className="bg-surface-container-highest p-sm border-b border-outline-variant flex justify-between items-center">
                <h2 className="font-title-md text-title-md text-on-surface">Extrait de Compte Bancaire</h2>
                <div className="flex items-center space-x-sm">
                  <select 
                    className="font-body-sm text-body-sm bg-surface border border-outline-variant rounded px-2 py-1 text-on-surface"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    <option>Compte Principal - BNA (DZ)</option>
                    <option>Compte Devises - SG</option>
                  </select>
                  <button className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-surface">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-high shadow-sm z-10">
                    <tr>
                      <th className="p-sm font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant w-24">Date</th>
                      <th className="p-sm font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant">Libellé / Référence</th>
                      <th className="p-sm font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant text-right w-28">Débit</th>
                      <th className="p-sm font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant text-right w-28">Crédit</th>
                      <th className="p-sm font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant text-center w-12">État</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular">
                    {transactions.map((tx, index) => (
                      <tr 
                        key={index}
                        className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-bright'} ${selectedTransaction === index ? 'border-l-4 border-l-primary bg-primary-fixed bg-opacity-20 relative' : ''}`}
                        onClick={() => setSelectedTransaction(index)}
                      >
                        {selectedTransaction === index && <td className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></td>}
                        <td className="p-sm text-on-surface">{tx.date}</td>
                        <td className={`p-sm text-on-surface ${selectedTransaction === index ? 'font-bold' : 'font-medium'}`}>{tx.label}</td>
                        <td className={`p-sm text-on-surface text-right ${selectedTransaction === index ? 'font-bold' : ''}`}>{tx.debit}</td>
                        <td className={`p-sm text-secondary text-right ${selectedTransaction === index ? 'font-bold' : 'font-medium'}`}>{tx.credit}</td>
                        <td className="p-sm text-center">
                          <span className="material-symbols-outlined text-[16px]">
                            {tx.status === 'matched' ? (
                              <span className="text-secondary">check_circle</span>
                            ) : (
                              <span className="text-outline">pending</span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Pane: Manual Entry Form */}
            <div className="w-1/2 flex flex-col bg-surface border border-outline-variant rounded shadow-sm">
              <div className="bg-surface-container-highest p-sm border-b border-outline-variant">
                <h2 className="font-title-md text-title-md text-on-surface flex items-center">
                  <span className="material-symbols-outlined mr-xs text-[20px] text-primary">edit_document</span>
                  Saisie Manuelle - Ligne Non Rapprochée
                </h2>
              </div>
              <div className="p-md flex-1 overflow-y-auto">
                <form className="space-y-md">
                  {/* Alert Context */}
                  <div className="bg-surface-container p-sm rounded border border-outline-variant flex items-start space-x-sm">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface">Saisie d'une écriture comptable pour la transaction bancaire sélectionnée :</p>
                      <p className="font-label-md text-label-md font-bold text-on-surface mt-1">
                        {selectedTransaction !== null ? transactions[selectedTransaction].label : 'Aucune transaction sélectionnée'} - {selectedTransaction !== null ? (transactions[selectedTransaction]?.debit || transactions[selectedTransaction]?.credit) : ''}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Date de valeur</label>
                      <input 
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                        type="date" 
                        value={formData.dateValeur}
                        onChange={(e) => handleInputChange('dateValeur', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Date comptable</label>
                      <input 
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                        type="date" 
                        value={formData.dateComptable}
                        onChange={(e) => handleInputChange('dateComptable', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Libellé de l'écriture</label>
                    <input 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                      type="text" 
                      value={formData.libelle}
                      onChange={(e) => handleInputChange('libelle', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Montant (DZD)</label>
                      <input 
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none text-right" 
                        readOnly 
                        type="text" 
                        value={formData.montant}
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Sens</label>
                      <div className="flex items-center space-x-2 mt-2">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input 
                            checked={formData.montant !== ''} 
                            className="text-primary focus:ring-primary" 
                            disabled 
                            name="sens" 
                            type="radio" 
                            value="debit"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface">Débit</span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input 
                            className="text-primary focus:ring-primary" 
                            disabled 
                            name="sens" 
                            type="radio" 
                            value="credit"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Crédit</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-md mt-md">
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-sm">Imputation Comptable (Compte de Contrepartie)</h3>
                    <div className="space-y-sm">
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Compte Général (G/L Account)</label>
                        <div className="flex space-x-2">
                          <input 
                            className="w-1/3 bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                            placeholder="Ex: 627" 
                            type="text" 
                            value={formData.compteGeneral}
                            onChange={(e) => handleInputChange('compteGeneral', e.target.value)}
                          />
                          <input 
                            className="flex-1 bg-surface-container-low border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface-variant outline-none" 
                            readOnly 
                            type="text" 
                            value={formData.compteGeneralLabel}
                          />
                          <button className="px-3 border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center" type="button">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-sm">
                        <div>
                          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Centre de Coût (Optionnel)</label>
                          <select 
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            value={formData.centreCout}
                            onChange={(e) => handleInputChange('centreCout', e.target.value)}
                          >
                            <option value="">Sélectionner...</option>
                            <option value="cc1">CC-FIN (Département Finance)</option>
                            <option value="cc2">CC-DIR (Direction Générale)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Code Taxe</label>
                          <select 
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            value={formData.codeTaxe}
                            onChange={(e) => handleInputChange('codeTaxe', e.target.value)}
                          >
                            <option value="t0">T0 - Exonéré</option>
                            <option value="t1">T1 - TVA 9%</option>
                            <option value="t2">T2 - TVA 19%</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-sm border-t border-outline-variant bg-surface-container-highest flex justify-end space-x-sm">
                <button className="px-4 py-2 border border-outline rounded text-on-surface hover:bg-surface-variant transition-colors font-label-md text-label-md">
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-md text-label-md shadow-sm flex items-center"
                  onClick={handleSubmit}
                >
                  <span className="material-symbols-outlined text-[18px] mr-1">save</span>
                  Comptabiliser & Rapprocher
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
