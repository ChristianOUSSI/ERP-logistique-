// src/app/(app)/finance/reconciliation/page.tsx - K-Finance Bank Reconciliation - Fidèle 100% au HTML original
'use client'

export default function BankReconciliationPage() {
  return (
    <>
      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; background-color: #f0f3ff; }
        .material-symbols-outlined { font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24'; }
        .material-symbols-outlined.fill { font-variation-settings: 'FILL 1'; }
        /* Custom scrollbar for tables */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f0f3ff; }
        ::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #727785; }
      `}</style>
      <div className="text-on-background antialiased flex flex-col bg-surface-container-low">
        
        

        
        <div className="flex-1 flex flex-col min-w-0">
          
          

          {/* Main Stage Canvas */}
          <main className="flex-1 p-gutter overflow-hidden flex flex-col">
            {/* Context Header */}
            <div className="mb-4 flex flex-col gap-1">
              
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-2">
                    <span className="w-2 h-6 bg-module-finance rounded-sm inline-block"></span>
                    Reconciliation: SGBCI Compte Principal
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Period: Oct 01, 2023 - Oct 31, 2023 | T-Code: F-RECON-01</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-outline-variant rounded-md font-label-md text-label-md text-on-surface bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    Upload Statement
                  </button>
                  <button className="px-3 py-1.5 bg-module-finance text-white rounded-md font-label-md text-label-md font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">done_all</span>
                    Auto-Match
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard / Status Cards */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Ledger Balance (End)</p>
                <p className="font-headline-md text-headline-md text-on-background font-data-tabular">FCFA 45,230,000</p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Statement Balance</p>
                <p className="font-headline-md text-headline-md text-on-background font-data-tabular">FCFA 45,150,000</p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm border-l-4 border-l-discrepancy bg-discrepancy-light/20">
                <p className="font-label-sm text-label-sm text-discrepancy uppercase mb-1 font-bold">Unreconciled Difference</p>
                <p className="font-headline-md text-headline-md text-discrepancy font-data-tabular font-bold">- FCFA 80,000</p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 shadow-sm flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Match Rate</span>
                  <span className="font-label-sm text-label-sm text-module-finance font-bold">92%</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5">
                  <div className="bg-module-finance h-1.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-right">342 / 370 Items</p>
              </div>
            </div>

            {/* Split View Area */}
            <div className="flex-1 flex gap-4 min-h-0">
              {/* Left Pane: Internal Ledger */}
              <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col shadow-sm overflow-hidden">
                <div className="p-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="font-title-md text-title-md text-on-background font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">book</span>
                    Internal Ledger (GL 1020)
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded text-[10px] font-label-caps text-on-surface-variant">Unmatched: 3</span>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant z-10">
                      <tr>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-10"></th>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Date</th>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Ref / Description</th>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase text-right">Amount (FCFA)</th>
                      </tr>
                    </thead>
                    <tbody className="font-data-tabular text-data-tabular">
                      {/* Matched Row */}
                      <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors group">
                        <td className="py-2 px-3 text-center">
                          <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 12</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">TRF-2023-8991</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">Maersk Line Freight</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface">- 1,250,000</td>
                      </tr>
                      {/* Unmatched/Discrepancy Row */}
                      <tr className="border-b border-outline-variant/50 bg-discrepancy-light/20 hover:bg-discrepancy-light/40 transition-colors border-l-2 border-l-discrepancy">
                        <td className="py-2 px-3 text-center">
                          <input className="rounded border-outline-variant text-discrepancy focus:ring-discrepancy w-3.5 h-3.5" type="checkbox"/>
                        </td>
                        <td className="py-2 px-3 text-on-surface font-medium">Oct 14</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">FEE-OCT-14</div>
                          <div className="text-discrepancy text-[11px] truncate w-48 font-medium">Missing from Statement</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface font-medium">- 45,000</td>
                      </tr>
                      {/* Matched Row */}
                      <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors bg-surface-bright">
                        <td className="py-2 px-3 text-center">
                          <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 15</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">REC-2023-441</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">Bollore Logistics Pymt</div>
                        </td>
                        <td className="py-2 px-3 text-right text-secondary font-medium">+ 3,400,000</td>
                      </tr>
                      {/* Selected for manual match */}
                      <tr className="border-b border-outline-variant/50 bg-module-finance-light/40 hover:bg-module-finance-light/60 transition-colors border-l-2 border-l-module-finance cursor-pointer">
                        <td className="py-2 px-3 text-center">
                          <input checked className="rounded border-module-finance text-module-finance focus:ring-module-finance w-3.5 h-3.5" type="checkbox"/>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 16</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">TRF-2023-9002</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">Fuel Surcharge (Total)</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface">- 120,000</td>
                      </tr>
                      <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                        <td className="py-2 px-3 text-center">
                          <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 18</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">PAY-EMP-OCT</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">Payroll Batch A</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface">- 8,500,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Center: Manual Match Controls */}
              <div className="flex flex-col justify-center items-center px-2 gap-4">
                <button className="w-8 h-8 rounded-full bg-module-finance text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform" title="Match Selected">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant text-on-surface-variant flex items-center justify-center shadow-sm hover:bg-surface-variant transition-colors" title="Force Clear">
                  <span className="material-symbols-outlined text-[18px]">playlist_add_check</span>
                </button>
              </div>

              {/* Right Pane: Bank Statement */}
              <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col shadow-sm overflow-hidden">
                <div className="p-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="font-title-md text-title-md text-on-background font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">account_balance</span>
                    Bank Statement (SGBCI)
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded text-[10px] font-label-caps text-on-surface-variant">Unmatched: 2</span>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant z-10">
                      <tr>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase w-10"></th>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Date</th>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Bank Narrative</th>
                        <th className="py-2 px-3 font-label-sm text-label-sm text-on-surface-variant uppercase text-right">Amount (FCFA)</th>
                      </tr>
                    </thead>
                    <tbody className="font-data-tabular text-data-tabular">
                      {/* Matched Row */}
                      <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                        <td className="py-2 px-3 text-center">
                          <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 12</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">VIREMENT EMIS MAERSK</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">REF: TRF-2023-8991</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface">- 1,250,000</td>
                      </tr>
                      {/* Matched Row */}
                      <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors bg-surface-bright">
                        <td className="py-2 px-3 text-center">
                          <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 16</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">REMISE CHEQUE BOLLORE</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">CHQ: 9948271</div>
                        </td>
                        <td className="py-2 px-3 text-right text-secondary font-medium">+ 3,400,000</td>
                      </tr>
                      {/* Unmatched/Discrepancy Row */}
                      <tr className="border-b border-outline-variant/50 bg-discrepancy-light/20 hover:bg-discrepancy-light/40 transition-colors border-l-2 border-l-discrepancy cursor-pointer">
                        <td className="py-2 px-3 text-center">
                          <input className="rounded border-outline-variant text-discrepancy focus:ring-discrepancy w-3.5 h-3.5" type="checkbox"/>
                        </td>
                        <td className="py-2 px-3 text-on-surface font-medium">Oct 17</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">FRAIS BANC ET COMMISSION</div>
                          <div className="text-discrepancy text-[11px] truncate w-48 font-medium">Unexpected Bank Fee</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface font-medium">- 35,000</td>
                      </tr>
                      {/* Selected for manual match */}
                      <tr className="border-b border-outline-variant/50 bg-module-finance-light/40 hover:bg-module-finance-light/60 transition-colors border-l-2 border-l-module-finance cursor-pointer">
                        <td className="py-2 px-3 text-center">
                          <input checked className="rounded border-module-finance text-module-finance focus:ring-module-finance w-3.5 h-3.5" type="checkbox"/>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 17</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">PRELV TOTAL ENERGIES</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">PRLV: 88291</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface">- 120,000</td>
                      </tr>
                      <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                        <td className="py-2 px-3 text-center">
                          <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                        </td>
                        <td className="py-2 px-3 text-on-surface">Oct 18</td>
                        <td className="py-2 px-3">
                          <div className="text-on-surface font-medium truncate w-48">VIR MULTIPLE SALAIRES</div>
                          <div className="text-on-surface-variant text-[11px] truncate w-48">LOT: A-OCT23</div>
                        </td>
                        <td className="py-2 px-3 text-right text-on-surface">- 8,500,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
