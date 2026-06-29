// src/app/(app)/magasin/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { magasinAPI } from '@/lib/api-client'

export default function KMagasinDashboard() {
  const [stocks, setStocks] = useState<any[]>([])
  const [receptions, setReceptions] = useState<any[]>([])
  const [declarations, setDeclarations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [stocksRes, receptionsRes, declarationsRes] = await Promise.all([
          magasinAPI.getStocks(),
          magasinAPI.getReceptions(),
          magasinAPI.getDeclarations()
        ]);
        setStocks(stocksRes.data || []);
        setReceptions(receptionsRes.data || []);
        setDeclarations(declarationsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch K-Magasin data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute KPIs
  const totalStockValue = stocks.reduce((acc, stock) => {
    // Dummy price calculation if price not available: assume 500 per UDB
    const qty = parseFloat(stock.quantite_udb) || 0;
    return acc + (qty * 500);
  }, 0);

  const pendingReceptions = receptions.filter(r => r.statut !== 'COMPLETEE' && r.statut !== 'ANNULEE').length;
  const activeDeclarations = declarations.filter(d => d.statut !== 'ANNULEE').length;
  
  // Dummy occupation rate for now until bin management is implemented
  const occupationRate = stocks.length > 0 ? Math.min(100, Math.round(stocks.length * 15)) : 0; 

  const recentOperations = [
    ...receptions.map(r => ({
      id: r.numero_reception,
      type: 'Reception',
      user: r.recu_par || 'System',
      status: r.statut,
      date: new Date(r.date_reception)
    })),
    ...declarations.map(d => ({
      id: d.numero_bl,
      type: 'Declaration',
      user: d.cree_par || 'System',
      status: d.statut,
      date: new Date(d.date_declaration)
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETEE' || status === 'VALIDEE') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'EN_COURS') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === 'ANNULEE') return 'bg-error-container text-on-error-container border-error';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  }

  return (
    <div className="flex h-screen bg-surface text-on-background font-body-base antialiased overflow-hidden">
      
      <aside className="bg-surface-container-lowest text-on-surface flex flex-col h-screen p-stack-md fixed left-0 top-0 h-full w-[260px] border-r border-outline-variant shadow-sm z-50">
        <div className="mb-stack-lg flex items-center gap-3 px-3 mt-16 md:mt-0">
          <div className="w-10 h-10 bg-primary text-on-primary rounded flex items-center justify-center font-bold font-title-sm">
            K
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Port Operations</p>
          </div>
        </div>
        
        <button className="w-full bg-primary text-on-primary rounded py-2 px-4 flex items-center justify-center gap-2 mb-stack-lg font-title-sm hover:opacity-90 active:scale-95 duration-150 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nouvelle Opération
        </button>
        
        
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen bg-surface relative z-0">
        
        

        {/* Canvas / Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-container-margin">
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h3 className="font-display-lg text-display-lg text-on-surface mb-1">K-Magasin</h3>
              <p className="font-body-base text-body-base text-on-surface-variant">Warehouse Management Overview</p>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
               <span className="text-primary font-bold">Chargement des données...</span>
             </div>
          ) : (
            <div className="grid grid-cols-12 gap-stack-md">
              {/* KPI Cards */}
              <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-stack-md">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-caps text-label-caps text-secondary">Valeur Stock (Est.)</span>
                    <span className="material-symbols-outlined text-outline text-[20px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">FCFA {totalStockValue.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-caps text-label-caps text-secondary">Occupation</span>
                    <span className="material-symbols-outlined text-outline text-[20px]">warehouse</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">{occupationRate}%</div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${occupationRate}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-caps text-label-caps text-secondary">Réceptions en attente</span>
                    <span className="material-symbols-outlined text-outline text-[20px]">input</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">{pendingReceptions}</div>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-caps text-label-caps text-secondary">Déclarations Actives</span>
                    <span className="material-symbols-outlined text-outline text-[20px]">description</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">{activeDeclarations}</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm">
                <h4 className="font-label-caps text-label-caps text-secondary mb-3 border-b border-outline-variant pb-2">Actions Rapides</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/magasin/reception-mag3" className="w-full text-left px-3 py-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between border border-transparent hover:border-outline-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">add</span>
                      <span className="font-body-base text-sm font-medium text-on-surface">Nouvelle Réception</span>
                    </div>
                  </Link>
                  <Link href="/magasin/search" className="w-full text-left px-3 py-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between border border-transparent hover:border-outline-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">search</span>
                      <span className="font-body-base text-sm font-medium text-on-surface">Recherche Stock</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Operation Trace Table */}
              <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-outline-variant flex justify-between items-center">
                  <h4 className="font-title-sm text-title-sm text-on-surface">Opérations Récentes</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-highest border-b border-outline-variant">
                        <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">Référence</th>
                        <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">Type</th>
                        <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">Date</th>
                        <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">Utilisateur</th>
                        <th className="px-4 py-2 font-label-caps text-label-caps text-secondary">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant">
                      {recentOperations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-on-surface-variant">Aucune opération récente trouvée.</td>
                        </tr>
                      ) : (
                        recentOperations.map((op, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low transition-colors group">
                            <td className="px-4 py-2 font-mono-data font-bold">{op.id}</td>
                            <td className="px-4 py-2">{op.type}</td>
                            <td className="px-4 py-2">{op.date.toLocaleDateString()}</td>
                            <td className="px-4 py-2">{op.user}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(op.status)}`}>
                                {op.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chart */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm flex flex-col items-center justify-center relative min-h-[300px]">
                <h4 className="font-title-sm text-title-sm text-on-surface absolute top-4 left-4 w-full text-left">Occupation Magasin</h4>
                <div className="relative w-48 h-48 rounded-full flex items-center justify-center mt-6" style={{ background: `conic-gradient(#EF4444 0% ${occupationRate}%, #e1e2ec ${occupationRate}% 100%)` }}>
                  <div className="absolute inset-0 m-4 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="font-display-lg text-display-lg text-on-surface">{occupationRate}%</span>
                    <span className="font-label-caps text-label-caps text-secondary">Utilisé</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
