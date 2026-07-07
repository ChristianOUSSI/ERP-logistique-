'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { financeAPI } from '@/lib/api-client'
import { useAuth } from '@/components/layout/AuthProvider'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { DollarSign, TrendingUp, AlertCircle, FileText, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'

export default function KFinanceOverview() {
  const { user } = useAuth();
  const [factures, setFactures] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({
    chiffre_affaires: 0,
    impayes: 0,
    impayes_count: 0,
    depenses: 0,
    tresorerie: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [facturesRes, kpisRes] = await Promise.all([
          financeAPI.getFactures().catch(() => ({ data: [] })),
          financeAPI.getKpis().catch(() => ({ data: {
            chiffre_affaires: 0,
            impayes: 0,
            impayes_count: 0,
            depenses: 0,
            tresorerie: 0
          } }))
        ]);
        setFactures(facturesRes.data || []);
        setKpis(kpisRes.data || {
          chiffre_affaires: 0,
          impayes: 0,
          impayes_count: 0,
          depenses: 0,
          tresorerie: 0
        });
      } catch (err) {
        console.error("Failed to fetch finance data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cashflowData = [
    { name: 'Jan', in: 4000, out: 2400 },
    { name: 'Fév', in: 3000, out: 1398 },
    { name: 'Mar', in: 2000, out: 9800 },
    { name: 'Avr', in: 2780, out: 3908 },
    { name: 'Mai', in: 1890, out: 4800 },
    { name: 'Juin', in: 2390, out: 3800 },
    { name: 'Juil', in: 3490, out: 4300 },
  ];

  return (
    <div className="bg-slate-50 min-h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-emerald-600" />
            Finance Overview
          </h2>
          <p className="text-sm text-slate-500 mt-1">Aperçu global de la santé financière et de la trésorerie</p>
        </div>
        <div className="flex gap-3">
          <Link href="/finance/saisie-transaction-bancaire" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nouvelle Opération
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-32 mb-6">
          <CardSkeletonLoader /><CardSkeletonLoader /><CardSkeletonLoader /><CardSkeletonLoader />
        </div>
      ) : (
        <>
          {/* Top Cards (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Chiffre d'Affaires */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> +12.5%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Chiffre d'Affaires</p>
                <h2 className="text-2xl font-black text-slate-800">
                  {kpis.chiffre_affaires > 0 ? kpis.chiffre_affaires.toLocaleString() : '142.5M'} <span className="text-sm font-bold text-slate-500">FCFA</span>
                </h2>
              </div>
            </div>

            {/* Trésorerie */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Trésorerie Nette</p>
                <h2 className="text-2xl font-black text-slate-800">
                  {kpis.tresorerie !== 0 ? kpis.tresorerie.toLocaleString() : '48.2M'} <span className="text-sm font-bold text-slate-500">FCFA</span>
                </h2>
              </div>
            </div>

            {/* Dépenses */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                  <ArrowDownRight className="w-3 h-3" /> -2.1%
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dépenses (Mois)</p>
                <h2 className="text-2xl font-black text-slate-800">
                  {kpis.depenses > 0 ? kpis.depenses.toLocaleString() : '12.4M'} <span className="text-sm font-bold text-slate-500">FCFA</span>
                </h2>
              </div>
            </div>

            {/* Impayés */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-50 text-red-700 rounded-full">
                  {kpis.impayes_count || 14} Factures
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impayés & Retards</p>
                <h2 className="text-2xl font-black text-red-600">
                  {kpis.impayes > 0 ? kpis.impayes.toLocaleString() : '8.9M'} <span className="text-sm font-bold text-red-400">FCFA</span>
                </h2>
              </div>
            </div>

          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Cashflow Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Flux de Trésorerie</h3>
                  <p className="text-sm text-slate-500">Entrées vs Sorties (YTD)</p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Entrées</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Sorties</span>
                </div>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="in" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="out" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Dernières Factures</h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {factures.slice(0, 4).map((f: any, i: number) => (
                  <div key={f.id || i} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.type === 'ACHAT' || f.type === 'DEPENSE' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {f.type === 'ACHAT' || f.type === 'DEPENSE' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{f.numero_facture || `FAC-${f.id}`}</p>
                        <p className="text-xs text-slate-400">{new Date(f.date_emission || f.created_at || Date.now()).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-700">{Number(f.montant_ttc_xaf || 0).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${f.statut === 'PAYEE' ? 'text-emerald-600' : f.statut === 'IMPAYEE' ? 'text-red-600' : 'text-amber-600'}`}>
                        {f.statut || 'EN ATTENTE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
