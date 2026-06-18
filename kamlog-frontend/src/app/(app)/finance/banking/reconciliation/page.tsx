// src/app/(app)/finance/banking/reconciliation/page.tsx - KF08 Saisie Transaction Bancaire K-Finance - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BankReconciliation() {
  const router = useRouter()
  const [selectedTransaction, setSelectedTransaction] = useState(2)

  const bankTransactions = [
    { id: 1, date: '12/10/2023', libelle: 'VIR RECU PORT AUTHO REF: 99823', debit: '', credit: '+ 450,000.00', status: 'matched' },
    { id: 2, date: '12/10/2023', libelle: 'PRELEV FOURNISSEUR CMA CGM', debit: '12,500.00', credit: '', status: 'matched' },
    { id: 3, date: '13/10/2023', libelle: 'FRAIS TENUE DE COMPTE OCT', debit: '1,250.00', credit: '', status: 'pending' },
    { id: 4, date: '14/10/2023', libelle: 'REMISE CHQ N 8872635', debit: '', credit: '+ 85,200.00', status: 'pending' }
  ]

  const handleCancel = () => {
    router.push('/finance/banking')
  }

  const handleSave = () => {
    // Save and reconcile - will be connected to backend
    router.push('/finance/banking')
  }

  const handleRefresh = () => {
    // Refresh bank statement - will be connected to backend
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
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f0f3ff; }
        ::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #727785; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface flex h-screen overflow-hidden">
        {/* SideNavBar */}
        <nav className="bg-surface-container-low border-r border-outline-variant w-[240px] h-screen flex-shrink-0 flex flex-col z-40 fixed left-0 top-0 transition-all duration-200 ease-in-out">
          <div className="p-[1rem] flex items-center space-x-[0.5rem] border-b border-outline-variant">
            <div className="w-10 h-10 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">PA</div>
            <div>
              <h1 className="font-title-lg text-title-lg font-bold text-on-surface">Port Ops</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Terminal A1</p>
            </div>
          </div>
          <div className="p-[1rem]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-2 text-on-surface-variant text-[18px]">search</span>
              <input className="w-full bg-surface-container-highest text-on-surface font-body-sm text-body-sm rounded pl-8 pr-3 py-2 border-none focus:ring-2 focus:ring-primary" placeholder="T-Code Search" type="text"/>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-[0.5rem]">
            <ul className="space-y-[0.25rem]">
              <li>
                <a onClick={() => router.push('/transport')} className="flex items-center px-[1rem] py-[0.5rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined mr-[0.5rem] text-[20px]">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/magasin')} className="flex items-center px-[1rem] py-[0.5rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined mr-[0.5rem] text-[20px]">inventory_2</span>
                  Magasin
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/finance')} className="flex items-center px-[1rem] py-[0.5rem] text-primary bg-surface-container-highest border-l-4 border-primary font-bold font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined mr-[0.5rem] text-[20px] fill">payments</span>
                  Finance
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/parc')} className="flex items-center px-[1rem] py-[0.5rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined mr-[0.5rem] text-[20px]">local_parking</span>
                  Parc
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/audit')} className="flex items-center px-[1rem] py-[0.5rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined mr-[0.5rem] text-[20px]">fact_check</span>
                  Audit
                </a>
              </li>
            </ul>
          </div>
          <div className="p-[0.5rem] border-t border-outline-variant">
            <ul className="space-y-[0.25rem]">
              <li>
                <a onClick={() => router.push('/support')} className="flex items-center px-[1rem] py-[0.5rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined mr-[0.5rem] text-[20px]">support_agent</span>
                  Support
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/logout')} className="flex items-center px-[1rem] py-[0.5rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all font-label-md text-label-md cursor-pointer">
                  <span className="material-symbols-outlined mr-[0.5rem] text-[20px]">logout</span>
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </nav>
        {/* Main Content Area */}
        <main className="ml-[240px] flex-1 flex flex-col h-full bg-surface-container-low">
          {/* TopAppBar */}
          <header className="bg-surface border-b border-outline-variant h-16 flex items-center justify-between px-[1.5rem] flex-shrink-0 shadow-sm z-30">
            <div className="flex items-center space-x-[1rem]">
              <div className="flex items-center text-primary">
                <span className="material-symbols-outlined text-[24px] mr-[0.25rem]">account_balance</span>
                <span className="font-title-lg text-title-lg font-bold">K-Finance</span>
              </div>
              <div className="h-6 w-px bg-outline-variant mx-[0.5rem]"></div>
              <div className="flex items-center text-on-surface-variant font-body-sm text-body-sm">
                <span>FIN-402</span>
                <span className="material-symbols-outlined text-[16px] mx-[0.25rem]">chevron_right</span>
                <span className="font-medium text-on-surface">Rapprochement Bancaire - Saisie Manuelle</span>
              </div>
            </div>
            <div className="flex items-center space-x-[0.5rem]">
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <div onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm font-bold cursor-pointer">
                JD
              </div>
            </div>
          </header>
          {/* Content Canvas */}
          <div className="flex-1 overflow-hidden p-[1rem] flex gap-[1rem] max-w-[1600px] mx-auto w-full">
            {/* Left Pane: Bank Statement View */}
            <div className="w-1/2 flex flex-col bg-surface border border-outline-variant rounded shadow-sm overflow-hidden">
              <div className="bg-surface-container-highest p-[0.5rem] border-b border-outline-variant flex justify-between items-center">
                <h2 className="font-title-md text-title-md text-on-surface">Extrait de Compte Bancaire</h2>
                <div className="flex items-center space-x-[0.5rem]">
                  <select className="font-body-sm text-body-sm bg-surface border border-outline-variant rounded px-2 py-1 text-on-surface">
                    <option>Compte Principal - BNA (DZ)</option>
                    <option>Compte Devises - SG</option>
                  </select>
                  <button onClick={handleRefresh} className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-surface">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-high shadow-sm z-10">
                    <tr>
                      <th className="p-[0.5rem] font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant w-24">Date</th>
                      <th className="p-[0.5rem] font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant">Libellé / Référence</th>
                      <th className="p-[0.5rem] font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant text-right w-28">Débit</th>
                      <th className="p-[0.5rem] font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant text-right w-28">Crédit</th>
                      <th className="p-[0.5rem] font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant text-center w-12">État</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular">
                    {bankTransactions.map((transaction) => (
                      <tr 
                        key={transaction.id} 
                        onClick={() => setSelectedTransaction(transaction.id)}
                        className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer ${selectedTransaction === transaction.id ? 'border-primary bg-primary-fixed bg-opacity-20 relative' : ''}`}
                      >
                        {selectedTransaction === transaction.id && <td className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></td>}
                        <td className="p-[0.5rem] text-on-surface">{transaction.date}</td>
                        <td className={`p-[0.5rem] text-on-surface ${selectedTransaction === transaction.id ? 'font-bold' : 'font-medium'}`}>{transaction.libelle}</td>
                        <td className={`p-[0.5rem] text-on-surface text-right ${selectedTransaction === transaction.id ? 'font-bold' : ''}`}>{transaction.debit}</td>
                        <td className={`p-[0.5rem] text-right ${transaction.credit ? 'text-secondary font-medium' : ''}`}>{transaction.credit}</td>
                        <td className="p-[0.5rem] text-center">
                          <span className={`material-symbols-outlined text-[16px] ${transaction.status === 'matched' ? 'text-secondary' : 'text-outline'}`}>
                            {transaction.status === 'matched' ? 'check_circle' : 'pending'}
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
              <div className="bg-surface-container-highest p-[0.5rem] border-b border-outline-variant">
                <h2 className="font-title-md text-title-md text-on-surface flex items-center">
                  <span className="material-symbols-outlined mr-[0.25rem] text-[20px] text-primary">edit_document</span>
                  Saisie Manuelle - Ligne Non Rapprochée
                </h2>
              </div>
              <div className="p-[1rem] flex-1 overflow-y-auto">
                <form className="space-y-[1rem]">
                  {/* Alert Context */}
                  <div className="bg-surface-container p-[0.5rem] rounded border border-outline-variant flex items-start space-x-[0.5rem]">
                    <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface">Saisie d'une écriture comptable pour la transaction bancaire sélectionnée :</p>
                      <p className="font-label-md text-label-md font-bold text-on-surface mt-1">FRAIS TENUE DE COMPTE OCT - Débit: 1,250.00 DZD</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-[0.5rem]">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Date de valeur</label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" type="date" value="2023-10-13"/>
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Date comptable</label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" type="date" value="2023-10-13"/>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Libellé de l'écriture</label>
                    <input className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" type="text" value="FRAIS TENUE DE COMPTE OCT"/>
                  </div>
                  <div className="grid grid-cols-2 gap-[0.5rem]">
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Montant (DZD)</label>
                      <input className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none text-right" readOnly type="text" value="1 250.00"/>
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Sens</label>
                      <div className="flex items-center space-x-2 mt-2">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input checked className="text-primary focus:ring-primary" disabled name="sens" type="radio" value="debit"/>
                          <span className="font-body-sm text-body-sm text-on-surface">Débit</span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input className="text-primary focus:ring-primary" disabled name="sens" type="radio" value="credit"/>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Crédit</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-outline-variant pt-[1rem] mt-[1rem]">
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-[0.5rem]">Imputation Comptable (Compte de Contrepartie)</h3>
                    <div className="space-y-[0.5rem]">
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Compte Général (G/L Account)</label>
                        <div className="flex space-x-2">
                          <input className="w-1/3 bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="Ex: 627" type="text" value="627800"/>
                          <input className="flex-1 bg-surface-container-low border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface-variant outline-none" readOnly type="text" value="Frais bancaires divers"/>
                          <button className="px-3 border border-outline-variant rounded bg-surface hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center" type="button">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-[0.5rem]">
                        <div>
                          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Centre de Coût (Optionnel)</label>
                          <select className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                            <option value="">Sélectionner...</option>
                            <option value="cc1">CC-FIN (Département Finance)</option>
                            <option value="cc2">CC-DIR (Direction Générale)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Code Taxe</label>
                          <select className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                            <option value="t0">T0 - Exonéré</option>
                            <option value="t1">T1 - TVA 9%</option>
                            <option selected value="t2">T2 - TVA 19%</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-[0.5rem] border-t border-outline-variant bg-surface-container-highest flex justify-end space-x-[0.5rem]">
                <button onClick={handleCancel} className="px-4 py-2 border border-outline rounded text-on-surface hover:bg-surface-variant transition-colors font-label-md text-label-md">
                  Annuler
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-md text-label-md shadow-sm flex items-center">
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
