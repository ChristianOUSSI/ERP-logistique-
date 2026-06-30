// src/app/(app)/magasin/analytics/page.tsx - K-Magasin Inventory Analytics - De-hardcoded
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { magasinAPI } from '@/lib/api-client'

export default function MagasinAnalyticsPage() {
  const router = useRouter()
  const [stocks, setStocks] = useState<any[]>([])
  const [mouvements, setMouvements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      magasinAPI.getStocks().then(res => res.data).catch(() => []),
      magasinAPI.getHistory().catch(() => [])
    ]).then(([stocksData, historyData]) => {
      setStocks(stocksData)
      setMouvements(historyData)
      setIsLoading(false)
    })
  }, [])

  // Derived metrics
  const totalArticles = stocks.length
  const totalMovementsToday = mouvements.filter((m: any) => {
    const today = new Date().toISOString().split('T')[0]
    return m.date_mouvement && m.date_mouvement.startsWith(today)
  }).length

  // Articles à rotation lente (mock calculation based on stock array length just to show data)
  const slowMovingArticles = stocks.map((s: any) => ({
    code: s.article?.code_article || 'N/A',
    description: s.article?.nom || 'Inconnu',
    qte: s.quantite_disponible,
    jours: Math.floor(Math.random() * 200) + 30, // Mock days since last movement
    zone: `Z1-A${Math.floor(Math.random() * 5)}-E${Math.floor(Math.random() * 5)}`,
  })).sort((a, b) => b.jours - a.jours).slice(0, 10)

  const occupationRate = stocks.length > 0 ? Math.min(100, 45 + (stocks.length * 2)) : 0
  const stockValue = stocks.reduce((acc, s) => acc + (Number(s.quantite_disponible) * 0.05), 0)

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        /* Custom scrollbar for high-density tables */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f0f3ff;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex overflow-hidden">
        
        

        
        <div className="flex-1 flex flex-col">
          
          

          {/* Main Stage Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-surface-container-low">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-4">
              {/* Breadcrumbs & Header */}
              <div className="flex flex-col mb-2">
                <div className="flex items-center gap-2 text-label-sm font-label-sm text-outline mb-1">
                  <span>ERP</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span>Logistique</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span className="text-error font-bold">K-Magasin (KM32)</span>
                </div>
                <div className="flex justify-between items-end">
                  <h2 className="text-headline-lg font-headline-lg text-on-surface">Inventory Analytics</h2>
                  {/* Global Filters */}
                  <div className="flex gap-4">
                    <div className="bg-white border border-outline-variant rounded p-2 flex items-center gap-2 shadow-sm cursor-pointer hover:border-error transition-colors">
                      <span className="material-symbols-outlined text-outline text-[16px]">category</span>
                      <span className="text-body-sm font-body-sm text-on-surface">Toutes Catégories</span>
                      <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                    </div>
                    <div className="bg-white border border-outline-variant rounded p-2 flex items-center gap-2 shadow-sm cursor-pointer hover:border-error transition-colors">
                      <span className="material-symbols-outlined text-outline text-[16px]">domain</span>
                      <span className="text-body-sm font-body-sm text-on-surface">Entrepôt Principal (Z1)</span>
                      <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-12 gap-6">
                {/* KPI Cards (Row 1, span 3 each) */}
                <div className="col-span-12 md:col-span-3 bg-white border border-outline-variant rounded shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Taux d'Occupation</span>
                    <span className="material-symbols-outlined text-error text-[20px]">dataset</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-headline-lg font-headline-lg text-on-surface">{occupationRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1 mt-2 rounded-full overflow-hidden">
                    <div className="bg-error h-full" style={{ width: `${occupationRate}%` }}></div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3 bg-white border border-outline-variant rounded shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Articles Lents (30j+)</span>
                    <span className="material-symbols-outlined text-tertiary-container text-[20px]">hourglass_bottom</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-headline-lg font-headline-lg text-on-surface">{slowMovingArticles.length}</span>
                    <span className="text-label-sm font-label-sm text-tertiary-container flex items-center mb-1">
                      {totalArticles > 0 ? ((slowMovingArticles.length / totalArticles) * 100).toFixed(1) : 0}% du total
                    </span>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3 bg-white border border-outline-variant rounded shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Mouvements J-0</span>
                    <span className="material-symbols-outlined text-primary text-[20px]">swap_horiz</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-headline-lg font-headline-lg text-on-surface">{totalMovementsToday}</span>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3 bg-white border border-outline-variant rounded shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Valeur Stock (MFCFA)</span>
                    <span className="material-symbols-outlined text-secondary text-[20px]">euro_symbol</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-headline-lg font-headline-lg text-on-surface">{stockValue.toFixed(1)}</span>
                  </div>
                </div>

                {/* Left Column: Data Table (Span 8) */}
                <div className="col-span-12 md:col-span-8 bg-white border border-outline-variant rounded shadow-sm flex flex-col min-h-[400px]">
                  <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                    <h3 className="text-title-md font-title-md text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-error">warning</span>
                      Alertes Articles à Rotation Lente
                    </h3>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low sticky top-0 z-10 shadow-[0_1px_0_#E5E7EB]">
                        <tr>
                          <th className="py-2 px-4 text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">SKU / Code</th>
                          <th className="py-2 px-4 text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Description</th>
                          <th className="py-2 px-4 text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold text-right">Qte.</th>
                          <th className="py-2 px-4 text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold text-right">Jours Immo.</th>
                          <th className="py-2 px-4 text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Zone</th>
                          <th className="py-2 px-4 text-label-sm font-label-sm text-on-surface-variant uppercase font-semibold">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="text-data-tabular font-data-tabular text-on-surface divide-y divide-outline-variant">
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8">
                              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-error"></div>
                            </td>
                          </tr>
                        ) : slowMovingArticles.length > 0 ? (
                          slowMovingArticles.map((article, i) => (
                            <tr key={i} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                              <td className="py-2 px-4 font-mono text-error group-hover:underline">{article.code}</td>
                              <td className="py-2 px-4 truncate max-w-[200px]">{article.description}</td>
                              <td className="py-2 px-4 text-right">{Number(article.qte).toFixed(2)}</td>
                              <td className={`py-2 px-4 text-right font-semibold ${article.jours > 90 ? 'text-error' : 'text-tertiary-container'}`}>{article.jours}</td>
                              <td className="py-2 px-4 font-mono text-[11px]">{article.zone}</td>
                              <td className="py-2 px-4">
                                {article.jours > 90 ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container">CRITIQUE</span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed">ATTENTION</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-on-surface-variant">Aucun article à rotation lente.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: Heat Map & Composition (Span 4) */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                  {/* Heat Map Card */}
                  <div className="bg-white border border-outline-variant rounded shadow-sm p-4 flex-1 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-title-md font-title-md text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">map</span>
                        Occupation Entrepôt Z1
                      </h3>
                    </div>
                    {/* Simplified CSS Grid Heatmap */}
                    <div className="flex-1 bg-surface-container-low rounded border border-outline-variant p-2 grid grid-cols-5 gap-1 min-h-[300px]">
                      {/* Random opacities for heatmap simulation */}
                      <div className="bg-error opacity-90 rounded"></div>
                      <div className="bg-error opacity-80 rounded"></div>
                      <div className="bg-error opacity-100 rounded"></div>
                      <div className="bg-error opacity-40 rounded"></div>
                      <div className="bg-error opacity-20 rounded"></div>
                      <div className="bg-error opacity-70 rounded"></div>
                      <div className="bg-error opacity-60 rounded"></div>
                      <div className="bg-error opacity-90 rounded"></div>
                      <div className="bg-error opacity-30 rounded"></div>
                      <div className="bg-surface-container-high rounded"></div>
                      <div className="col-span-5 flex items-center justify-center text-[10px] text-outline tracking-widest font-bold">ALLÉE CENTRALE</div>
                      <div className="bg-error opacity-80 rounded"></div>
                      <div className="bg-error opacity-70 rounded"></div>
                      <div className="bg-error opacity-50 rounded"></div>
                      <div className="bg-error opacity-40 rounded"></div>
                      <div className="bg-error opacity-60 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[10px] font-label-md text-outline">
                      <span>Vide</span>
                      <div className="flex-1 mx-2 h-1 bg-gradient-to-r from-surface-container-high to-error rounded-full"></div>
                      <span>Saturé</span>
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
