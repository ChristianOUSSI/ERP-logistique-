'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, Package, ShieldAlert, CreditCard, Truck, Terminal, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getRouteFromTCode } from '@/utils/tcodeLookup'
import { financeAPI, transportAPI, auditAPI, magasinAPI } from '@/lib/api-client'

// Mock Data pour les graphiques
const revenueDataWeek = [
  { name: 'Lun', value: 4000 },
  { name: 'Mar', value: 3000 },
  { name: 'Mer', value: 2000 },
  { name: 'Jeu', value: 2780 },
  { name: 'Ven', value: 1890 },
  { name: 'Sam', value: 2390 },
  { name: 'Dim', value: 3490 },
]

const revenueDataMonth = [
  { name: 'Sem 1', value: 12000 },
  { name: 'Sem 2', value: 15500 },
  { name: 'Sem 3', value: 10200 },
  { name: 'Sem 4', value: 18900 },
]

const fleetData = [
  { name: 'En Route', value: 85, fill: '#00ACC1' },
  { name: 'Maintenance', value: 15, fill: '#f59e0b' },
  { name: 'Dispo', value: 45, fill: '#10b981' },
]

export default function GlobalDashboard() {
  const router = useRouter()
  const [tcodeFocused, setTcodeFocused] = useState(false)
  const [tcode, setTcode] = useState('')
  const [period, setPeriod] = useState('week')
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString())
  
  // States for real KPI data
  const [stockValue, setStockValue] = useState('14.2M')
  const [activeMissions, setActiveMissions] = useState('42')
  const [monthlyRevenue, setMonthlyRevenue] = useState('2.8M')
  const [activeVehicles, setActiveVehicles] = useState('156')

  const fetchRealData = useCallback(async () => {
    try {
      // Parallel fetch for available APIs
      const [finRes, transRes] = await Promise.allSettled([
        financeAPI.getKpis(),
        transportAPI.getKpis(),
      ]);

      if (finRes.status === 'fulfilled' && finRes.value.data) {
        // e.g., finRes.value.data.revenue_mensuel
        if (finRes.value.data.revenue_mensuel) {
          setMonthlyRevenue((finRes.value.data.revenue_mensuel / 1000000).toFixed(1) + 'M')
        }
      }

      if (transRes.status === 'fulfilled' && transRes.value.data) {
        // e.g., transRes.value.data.vehicules_actifs
        if (transRes.value.data.vehicules_actifs !== undefined) {
          setActiveVehicles(transRes.value.data.vehicules_actifs.toString())
        }
      }

    } catch (e) {
      console.error("Failed to sync KPIs", e)
    }
  }, [])

  useEffect(() => {
    fetchRealData()
  }, [fetchRealData])

  const handleSync = async () => {
    setIsSyncing(true)
    await fetchRealData()
    setTimeout(() => {
      setIsSyncing(false)
      setLastSync(new Date().toLocaleTimeString())
    }, 800) // Small visual delay
  }

  const handleTCodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (tcode.trim()) {
      router.push(getRouteFromTCode(tcode.trim()))
    }
  }

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
        
        /* Animation Pulse Douce */
        @keyframes softPulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 172, 193, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(0, 172, 193, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 172, 193, 0); }
        }
        .animate-soft-pulse { animation: softPulse 2s infinite; }
      `}</style>

      <div className="min-h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        {/* Global Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vue d'Ensemble Système</h1>
            <p className="text-sm text-slate-500 mt-1">Plateforme ERP d'opérations intégrées • <span className="font-mono text-xs">v2.0.4-stable</span></p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">Dernière synchro: {lastSync}</span>
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm shadow-blue-200 transition-all active:scale-95 disabled:opacity-70"
            >
              {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-symbols-outlined text-[20px]">sync</span>}
              {isSyncing ? 'Synchronisation...' : 'Synchroniser'}
            </button>
          </div>
        </div>

        {/* Bento Layout Main Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
          {/* KPI CARDS */}
          {/* Card 1: Stock */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                <TrendingUp className="w-3 h-3" /> +2.4%
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valeur des Stocks</p>
              <h2 className="text-2xl font-black text-slate-800">{stockValue} <span className="text-sm font-bold text-slate-500">FCFA</span></h2>
            </div>
          </div>

          {/* Card 2: Missions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-red-50 text-red-700 rounded-full">
                <TrendingUp className="w-3 h-3" /> 12 Urgences
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Missions Audit</p>
              <h2 className="text-2xl font-black text-slate-800">{activeMissions} <span className="text-sm font-bold text-slate-500">Actives</span></h2>
            </div>
          </div>

          {/* Card 3: Revenus */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                <TrendingUp className="w-3 h-3" /> Objectif atteint
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Revenu Mensuel</p>
              <h2 className="text-2xl font-black text-slate-800">{monthlyRevenue} <span className="text-sm font-bold text-slate-500">FCFA</span></h2>
            </div>
          </div>

          {/* Card 4: Transport */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 bg-cyan-100 text-cyan-600 rounded-xl group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full">
                88% Util.
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Véhicules Actifs</p>
              <h2 className="text-2xl font-black text-slate-800">{activeVehicles} <span className="text-sm font-bold text-slate-500">Unités</span></h2>
            </div>
          </div>
        </div>

        {/* Charts & Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Évolution des Revenus</h3>
                <p className="text-sm text-slate-500">7 derniers jours</p>
              </div>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-purple-500 focus:border-purple-500 py-1.5 pl-3 pr-8"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={period === 'week' ? revenueDataWeek : revenueDataMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fleet Status Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800">Disponibilité Flotte</h3>
              <p className="text-sm text-slate-500">Répartition en temps réel</p>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fleetData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link href="/parc/overview" className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                Voir le détail du parc <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* T-Code Launcher & Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* T-Code Quick Launcher */}
          <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 transition-all duration-300 ${tcodeFocused ? 'ring-2 ring-blue-500/20 shadow-lg' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-600" />
                T-Code Quick Launcher
              </h3>
              <kbd className="hidden sm:inline-flex px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-500 font-bold">CMD + K</kbd>
            </div>
            <form onSubmit={handleTCodeSubmit} className="relative mb-6 group">
              <input 
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-16 text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none group-hover:bg-white uppercase" 
                placeholder="Entrez un code de transaction (ex: KFIN_TAX, KTRN_RTE)..." 
                type="text"
                value={tcode}
                onChange={(e) => setTcode(e.target.value.toUpperCase())}
                onFocus={() => setTcodeFocused(true)}
                onBlur={() => setTcodeFocused(false)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-slate-400">search</span>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button type="submit" className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tcode.length > 0 ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  ALLER
                </button>
              </div>
            </form>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { code: 'KMAG_INV', icon: 'inventory_2', label: 'Inventaire' },
                { code: 'KFIN_TAX', icon: 'account_balance', label: 'Taxes' },
                { code: 'KTRN_RTE', icon: 'route', label: 'Routes' },
                { code: 'KAUD_LOG', icon: 'verified_user', label: 'Logs Audit' }
              ].map((shortcut) => (
                <button 
                  key={shortcut.code} 
                  onClick={() => router.push(getRouteFromTCode(shortcut.code))}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm transition-all group"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors">{shortcut.icon}</span>
                  <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-blue-700 transition-colors">{shortcut.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Alertes
              </h3>
              <Link href="/security/alert-monitoring" className="text-xs font-bold text-blue-600 hover:underline">Tout voir</Link>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl relative overflow-hidden group hover:bg-red-50 transition-colors cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 group-hover:w-1.5 transition-all"></div>
                <div className="flex justify-between items-start mb-1 pl-2">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Système Critique</span>
                  <span className="text-[10px] text-slate-400">il y a 2m</span>
                </div>
                <p className="text-xs text-slate-700 font-medium pl-2 leading-relaxed">TRK-902 a signalé une défaillance télématique dans le secteur 4.</p>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl relative overflow-hidden group hover:bg-amber-50 transition-colors cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 group-hover:w-1.5 transition-all"></div>
                <div className="flex justify-between items-start mb-1 pl-2">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Mission En Attente</span>
                  <span className="text-[10px] text-slate-400">il y a 15m</span>
                </div>
                <p className="text-xs text-slate-700 font-medium pl-2 leading-relaxed">Mission Audit #4412 en retard de 48 heures pour validation finale.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden group hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400 group-hover:w-1.5 transition-all"></div>
                <div className="flex justify-between items-start mb-1 pl-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Mise à jour MFA</span>
                  <span className="text-[10px] text-slate-400">il y a 1h</span>
                </div>
                <p className="text-xs text-slate-700 font-medium pl-2 leading-relaxed">Nouveau protocole appliqué aux points d'accès Finance.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
