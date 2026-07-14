// src/app/(app)/finance/gateway/page.tsx - K-Finance Gateway Monitor - Fidèle 100% au HTML original
'use client'

import { useState, useEffect } from 'react'
import { useComingSoon } from '@/contexts/ComingSoonContext'
import { gatewayAPI } from '@/lib/api-client';
import { Passerelle } from '@/types/gateway';
import { toast } from 'sonner'

export default function KFinanceGatewayMonitor() {
  const [showToast, setShowToast] = useState(false)
  const [validating, setValidating] = useState(false)
  const [passerelles, setPasserelles] = useState<Passerelle[]>([])
  const [loading, setLoading] = useState(true)
  const { showComingSoon } = useComingSoon()

  useEffect(() => {
    fetchPasserelles()
  }, [])

  const fetchPasserelles = async () => {
    try {
      setLoading(true)
      const data = await gatewayAPI.getPasserelles()
      setPasserelles(data || [])
    } catch (error) {
      toast.error("Erreur lors du chargement des passerelles")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkValidate = () => {
    showComingSoon('Validation groupée K-Finance')
  }

  const successfulCount = passerelles.filter(p => p.statut === 'TRAITE').length
  const pendingCount = passerelles.filter(p => p.statut === 'EN_ATTENTE' || p.statut === 'EN_COURS').length
  const failedCount = passerelles.filter(p => p.statut === 'ECHOUE').length
  const totalCount = passerelles.length
  
  const successRate = totalCount > 0 ? ((successfulCount / totalCount) * 100).toFixed(1) : '100.0'
  const strokeDashoffset = totalCount > 0 ? (282.7 * (1 - (successfulCount / totalCount))) : 0

  const totalRevenue = passerelles.reduce((acc, curr) => acc + (curr.donnees_json?.montant || 0), 0)
  const taxAccrual = totalRevenue * 0.1925 // 19.25% TVA Cameroun
  const netTransfer = totalRevenue - taxAccrual

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-filled {
          font-variation-settings: 'FILL 1';
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dce2f3;
          border-radius: 10px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
        }
        .purple-accent {
          border-left: 4px solid #8B5CF6;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md overflow-hidden h-screen flex flex-col">
        
        
        <div className="flex flex-1 pt-16 overflow-hidden">
          

          {/* Main Content Area */}
          <main className="ml-[240px] flex-1 overflow-y-auto custom-scrollbar bg-surface p-md md:p-lg space-y-lg">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
              <div className="space-y-xxs">
                
                <h1 className="text-headline-lg font-headline-lg text-on-surface">Financial Integration Gateway</h1>
              </div>
              <div className="flex gap-xs">
                <button 
                  className="bg-primary text-white px-md py-2 rounded-lg font-label-md text-label-md flex items-center gap-xs hover:opacity-90 transition-opacity active:scale-[0.98]"
                  onClick={handleBulkValidate}
                  disabled={validating}
                >
                  {validating ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  )}
                  {validating ? 'Validating...' : 'Bulk Validate Transactions'}
                </button>
                <button className="bg-surface-container-highest text-on-surface px-md py-2 rounded-lg font-label-md text-label-md flex items-center gap-xs hover:bg-surface-dim transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export logs
                </button>
              </div>
            </div>
            {/* Bento Grid Stats & Charts */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-md h-auto">
              {/* Main Status Chart */}
              <div className="md:col-span-4 lg:col-span-8 bg-white border border-outline-variant rounded-xl p-lg flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-lg">
                  <div>
                    <h2 className="text-title-md font-title-md text-on-surface">Revenue Projection by Module</h2>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">Live gateway processing throughput (FCFA)</p>
                  </div>
                  <div className="flex gap-xs">
                    <span className="flex items-center gap-xs text-label-sm font-label-sm"><span className="w-3 h-3 bg-primary rounded-full"></span>K-Parc</span>
                    <span className="flex items-center gap-xs text-label-sm font-label-sm"><span className="w-3 h-3 bg-secondary-fixed-dim rounded-full"></span>K-Transport</span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-xs px-md">
                  {passerelles.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-body-sm">
                      No live data available. Add invoices or trigger missions to process transfers.
                    </div>
                  ) : (
                    passerelles.slice(0, 10).map((p, idx) => {
                      const amount = p.donnees_json?.montant || 0;
                      const maxAmount = Math.max(...passerelles.map(x => x.donnees_json?.montant || 1), 1);
                      const heightPercent = Math.max(10, Math.min(100, (amount / maxAmount) * 100));
                      return (
                        <div 
                          key={p.id || idx} 
                          className={`group relative flex-1 ${idx % 2 === 0 ? 'bg-primary' : 'bg-surface-container-low'} rounded-t-lg transition-all hover:bg-primary-container`} 
                          style={{ height: `${heightPercent}%` }}
                          title={`FCFA ${amount.toLocaleString()}`}
                        />
                      )
                    })
                  )}
                </div>
                <div className="grid grid-cols-5 mt-md border-t border-outline-variant pt-md text-center">
                  <div className="col-span-5 text-label-sm text-on-surface-variant font-bold">
                    Total Volume Traité : FCFA {totalRevenue.toLocaleString()}
                  </div>
                </div>
              </div>
              {/* Circular Gateway Status */}
              <div className="md:col-span-4 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center space-y-md">
                <h2 className="text-title-md font-title-md text-on-surface w-full text-left">Gateway Health</h2>
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-primary" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeDasharray="282.7" strokeDashoffset={strokeDashoffset} strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-md font-headline-md text-on-surface">{successRate}%</span>
                    <span className="text-label-md text-primary font-bold">{parseFloat(successRate) > 90 ? 'OPTIMIZED' : 'MONITORED'}</span>
                  </div>
                </div>
                <div className="w-full space-y-xs pt-xs">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Successful</span>
                    <span className="font-bold">{successfulCount}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Pending</span>
                    <span className="font-bold">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Failed</span>
                    <span className="font-bold text-error">{failedCount}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Transaction Table Section */}
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden flex flex-col">
              <div className="p-md flex flex-col md:flex-row justify-between items-center gap-md border-b border-outline-variant">
                <div className="flex items-center gap-md">
                  <h2 className="text-title-md font-title-md text-on-surface">Recent Inter-Module Transactions</h2>
                  <div className="flex gap-xs">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">K-TRANSPORT</span>
                    <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[10px] font-bold">K-PARC</span>
                  </div>
                </div>
                <div className="flex items-center gap-xs w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-md py-1.5 rounded-lg border border-outline-variant text-body-md hover:bg-surface-container-low transition-colors">Filters</button>
                  <button className="flex-1 md:flex-none px-md py-1.5 rounded-lg border border-outline-variant text-body-md hover:bg-surface-container-low transition-colors">Date Range</button>
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low sticky top-0 z-10">
                    <tr>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase w-12">
                        <input className="rounded border-outline text-primary focus:ring-primary" type="checkbox"/>
                      </th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Type</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Source ID</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Target ID</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Amount</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Status</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Timestamp</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {loading ? (
                      <tr><td colSpan={8} className="px-md py-8 text-center text-on-surface-variant">Chargement des transactions...</td></tr>
                    ) : passerelles.length === 0 ? (
                      <tr><td colSpan={8} className="px-md py-8 text-center text-on-surface-variant">Aucune transaction</td></tr>
                    ) : (
                      passerelles.map((passerelle) => (
                        <tr key={passerelle.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-md py-3"><input className="transaction-check rounded border-outline text-primary focus:ring-primary" type="checkbox"/></td>
                          <td className="px-md py-3">
                            <span className="text-body-sm font-bold font-mono">{passerelle.type_passerelle}</span>
                          </td>
                          <td className="px-md py-3 text-body-md font-data-tabular">{passerelle.source_module}-{passerelle.source_id}</td>
                          <td className="px-md py-3 text-body-md font-data-tabular">{passerelle.cible_module}-{passerelle.cible_id || 'N/A'}</td>
                          <td className="px-md py-3 font-bold text-on-surface">FCFA {passerelle.donnees_json?.montant?.toLocaleString() || '0'}</td>
                          <td className="px-md py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-bold ${
                              passerelle.statut === 'TRAITE' ? 'bg-secondary-container/20 text-on-secondary-container' : 
                              passerelle.statut === 'ECHOUE' ? 'bg-error-container/40 text-on-error-container' :
                              'bg-surface-container-highest text-on-surface-variant'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                passerelle.statut === 'TRAITE' ? 'bg-secondary' : 
                                passerelle.statut === 'ECHOUE' ? 'bg-error' :
                                'bg-outline'
                              }`}></span>
                              {passerelle.statut}
                            </span>
                          </td>
                          <td className="px-md py-3 text-label-md text-on-surface-variant">{new Date(passerelle.date_creation).toLocaleString()}</td>
                          <td className="px-md py-3 text-right">
                            <button className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Operational Pane */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="bg-white border border-outline-variant rounded-xl p-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <h3 className="text-title-md font-title-md text-on-surface mb-md">System Log Insight</h3>
                <div className="space-y-sm">
                  {passerelles.length === 0 ? (
                    <div className="text-body-sm text-on-surface-variant">No logs generated.</div>
                  ) : (
                    passerelles.slice(0, 3).map((p, idx) => (
                      <div key={p.id || idx} className="flex gap-md text-body-sm font-mono p-xs bg-surface-container rounded">
                        <span className="text-primary font-bold">[{new Date(p.date_creation).toLocaleTimeString()}]</span>
                        <span className="text-on-surface">GATEWAY: {p.type_passerelle} processed ({p.source_module} → {p.cible_module})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* Financial Summary Card */}
              <div className="bg-primary text-white rounded-xl p-lg flex flex-col justify-between shadow-lg shadow-primary/20">
                <div>
                  <div className="flex justify-between items-start mb-lg">
                    <span className="text-label-md font-label-md opacity-80 uppercase tracking-widest">Gateway Cashflow (24h)</span>
                    <span className="material-symbols-outlined opacity-60">trending_up</span>
                  </div>
                  <div className="text-headline-lg font-headline-lg leading-none">FCFA {totalRevenue.toLocaleString()}</div>
                </div>
                <div className="pt-lg flex gap-md">
                  <div className="flex-1 p-md bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-label-sm opacity-70">Tax Accrual (TVA)</div>
                    <div className="text-title-md font-bold">FCFA {taxAccrual.toLocaleString()}</div>
                  </div>
                  <div className="flex-1 p-md bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-label-sm opacity-70">Net Transfer</div>
                    <div className="text-title-md font-bold">FCFA {netTransfer.toLocaleString()}</div>
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
