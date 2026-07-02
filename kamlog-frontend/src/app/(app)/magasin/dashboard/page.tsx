// src/app/(app)/magasin/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { magasinAPI } from '@/lib/api-client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CardSkeletonLoader } from '@/components/ui/Loaders'

export default function KMagasinDashboard() {
  const [stocks, setStocks] = useState<any[]>([])
  const [receptions, setReceptions] = useState<any[]>([])
  const [declarations, setDeclarations] = useState<any[]>([])
  const [kpis, setKpis] = useState<any>({
    totalStockValue: 0,
    occupationRate: 0,
    activeOrders: 0,
    lowStockAlerts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [stocksRes, receptionsRes, declarationsRes, kpisRes] = await Promise.all([
          magasinAPI.getStocks(),
          magasinAPI.getReceptions(),
          magasinAPI.getDeclarations(),
          magasinAPI.getKpis().catch(() => ({ data: { totalStockValue: 0, occupationRate: 0, activeOrders: 0, lowStockAlerts: 0 } }))
        ]);
        setStocks(stocksRes.data || []);
        setReceptions(receptionsRes.data || []);
        setDeclarations(declarationsRes.data || []);
        setKpis(kpisRes.data || { totalStockValue: 0, occupationRate: 0, activeOrders: 0, lowStockAlerts: 0 });
      } catch (err) {
        console.error("Failed to fetch K-Magasin data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingReceptions = receptions.filter(r => r.statut !== 'COMPLETEE' && r.statut !== 'ANNULEE').length;
  const activeDeclarations = declarations.filter(d => d.statut !== 'ANNULEE').length;

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
    if (status === 'COMPLETEE' || status === 'VALIDEE') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'EN_COURS') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === 'ANNULEE') return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  }

  // Premium Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-slate-700/50">
          <p className="font-semibold text-sm mb-1">{payload[0].name}</p>
          <p className="text-xl font-bold text-blue-400">
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            K-Magasin
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
              Warehouse Overview
            </span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Supervision des stocks et des opérations d'entrepôt</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <CardSkeletonLoader key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KPI Cards (Bento Grid Style) */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KPI 1: Valeur Stock */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Valeur Stock (Est.)</span>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-indigo-600">account_balance_wallet</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                  FCFA {kpis.totalStockValue.toLocaleString()}
                </div>
              </div>
            </div>
            
            {/* KPI 2: Occupation */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Occupation</span>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-emerald-600">warehouse</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                  {kpis.occupationRate}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${kpis.occupationRate}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* KPI 3: Réceptions en attente */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Réceptions en attente</span>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-blue-600">input</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{pendingReceptions}</div>
              </div>
            </div>
            
            {/* KPI 4: Déclarations Actives */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Déclarations Actives</span>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-amber-600">description</span>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{activeDeclarations}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Chart */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex-1 relative flex flex-col min-h-[300px]">
              <h4 className="text-lg font-bold text-slate-900 mb-2">Occupation Magasin</h4>
              <p className="text-sm text-slate-500 mb-4">Répartition de l'espace de stockage</p>
              
              <div className="flex-1 w-full relative min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="colorUtilise" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={[
                        { name: 'Utilisé', value: kpis.occupationRate },
                        { name: 'Libre', value: 100 - kpis.occupationRate }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      animationBegin={200}
                      animationDuration={1200}
                    >
                      <Cell key="cell-0" fill="url(#colorUtilise)" className="drop-shadow-md" />
                      <Cell key="cell-1" fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                  <span className="text-3xl font-bold text-slate-800">{kpis.occupationRate}%</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utilisé</span>
                </div>
              </div>
            </div>

            {/* Actions Rapides */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Actions Rapides</h4>
              <div className="flex flex-col gap-3">
                <Link href="/magasin/reception-mag3" className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3 border border-slate-100 hover:border-blue-200 group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">add_box</span>
                  <span className="font-semibold text-sm">Nouvelle Réception</span>
                </Link>
                <Link href="/magasin/search" className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3 border border-slate-100 hover:border-blue-200 group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">search</span>
                  <span className="font-semibold text-sm">Recherche Stock</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Operations Table */}
          <div className="col-span-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">history</span>
                Opérations Récentes
              </h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Référence</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {recentOperations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 bg-slate-50/30">
                        <div className="flex flex-col items-center gap-2">
                          <span className="material-symbols-outlined text-4xl text-slate-300">inbox</span>
                          <p>Aucune opération récente trouvée.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentOperations.map((op, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono font-semibold text-slate-700">{op.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-[18px] ${op.type === 'Reception' ? 'text-blue-500' : 'text-amber-500'}`}>
                              {op.type === 'Reception' ? 'download' : 'description'}
                            </span>
                            <span className="text-sm font-medium text-slate-700">{op.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {op.date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {op.user.substring(0, 2).toUpperCase()}
                          </div>
                          {op.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(op.status)}`}>
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
          
        </div>
      )}
    </div>
  )
}

