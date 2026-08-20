'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShieldAlert,
  CreditCard,
  Truck,
  Terminal,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Building,
  Globe,
  Tag,
  Radio,
  Fuel,
  ShoppingCart,
  Landmark,
  BarChart3,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getRouteFromTCode } from '@/utils/tcodeLookup'
import { financeAPI, transportAPI, adminAPI } from '@/lib/api-client'

export default function GlobalDashboard() {
  const router = useRouter()
  const [tcodeFocused, setTcodeFocused] = useState(false)
  const [tcode, setTcode] = useState('')
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString())

  // KPI State with rich default values
  const [monthlyRevenue, setMonthlyRevenue] = useState('284.5M')
  const [activeMissions, setActiveMissions] = useState('48')
  const [activeVehicles, setActiveVehicles] = useState('82')
  const [stockValue, setStockValue] = useState('14.2M$')
  const [warehouseCapacity, setWarehouseCapacity] = useState('88.5%')
  const [transitDeclarations, setTransitDeclarations] = useState('142')
  const [qhseScore, setQhseScore] = useState('98.5%')

  // Sample Chart Data for Enterprise Performance (Week, Month, Year)
  const [revenueDataWeek] = useState([
    { day: 'Lun', revenue: 38.5, fretTons: 1200 },
    { day: 'Mar', revenue: 42.0, fretTons: 1450 },
    { day: 'Mer', revenue: 45.2, fretTons: 1600 },
    { day: 'Jeu', revenue: 41.8, fretTons: 1380 },
    { day: 'Ven', revenue: 52.4, fretTons: 1900 },
    { day: 'Sam', revenue: 34.6, fretTons: 1100 },
    { day: 'Dim', revenue: 30.0, fretTons: 950 },
  ])

  const [revenueDataMonth] = useState([
    { day: 'Sem 1', revenue: 185.0, fretTons: 5200 },
    { day: 'Sem 2', revenue: 210.5, fretTons: 6100 },
    { day: 'Sem 3', revenue: 245.8, fretTons: 7400 },
    { day: 'Sem 4', revenue: 284.5, fretTons: 8900 },
  ])

  const [revenueDataYear] = useState([
    { day: 'Jan', revenue: 620, fretTons: 18000 },
    { day: 'FÃ©v', revenue: 710, fretTons: 21000 },
    { day: 'Mar', revenue: 840, fretTons: 25000 },
    { day: 'Avr', revenue: 790, fretTons: 23500 },
    { day: 'Mai', revenue: 920, fretTons: 28000 },
    { day: 'Juin', revenue: 1050, fretTons: 31000 },
    { day: 'Juil', revenue: 1180, fretTons: 34500 },
  ])

  const activeChartData = period === 'year' ? revenueDataYear : period === 'month' ? revenueDataMonth : revenueDataWeek;

  const [fleetStatusData] = useState([
    { name: 'En Mission Active', count: 82, color: '#10b981' },
    { name: 'En Entretien / Garages', count: 12, color: '#f59e0b' },
    { name: 'En Attente au DÃ©pÃ´t', count: 18, color: '#6366f1' },
  ])

  const [warehouseZonesData] = useState([
    { zone: 'MAG1 (Conteneurs)', occupancy: 92 },
    { zone: 'MAG2 (Vrac Souterrain)', occupancy: 78 },
    { zone: 'MAG3 (Frigo SÃ©quentiel)', occupancy: 85 },
    { zone: 'Quai Nord Acconage', occupancy: 95 },
  ])

  const [liveOperationLogs] = useState([
    { id: 1, type: 'TRANSPORT', text: 'Camion LT-890-AA arrivÃ© au Port de Kribi - e-POD signÃ© avec succÃ¨s', time: '10 min ago', status: 'SUCCESS' },
    { id: 2, type: 'MAGASIN', text: 'EntrÃ©e en stock BL-4901 (400 Tonnes de Ciment ZLECAF) au MAG3', time: '25 min ago', status: 'INFO' },
    { id: 3, type: 'TRANSIT', text: 'DÃ©claration Douane DEC-2026-908 LiquidÃ©e sans pÃ©nalitÃ©', time: '45 min ago', status: 'SUCCESS' },
    { id: 4, type: 'QHSE', text: 'Inspection SÃ©curitÃ© VÃ©hicule TR-402-BB validÃ©e (Note 100%)', time: '1h ago', status: 'INFO' },
    { id: 5, type: 'FINANCE', text: 'Facture Client F-2026-088 acquittÃ©e (14.5M FCFA par Virement BGFI)', time: '2h ago', status: 'SUCCESS' },
  ])

  const fetchRealData = useCallback(async () => {
    try {
      const [finRes, transRes, dashRes] = await Promise.allSettled([
        financeAPI.getKpis(),
        transportAPI.getKpis(),
        adminAPI.getDashboardKpis()
      ])

      if (finRes.status === 'fulfilled' && finRes.value?.data?.chiffre_affaires) {
        setMonthlyRevenue((finRes.value.data.chiffre_affaires / 1000000).toFixed(1) + 'M')
      }
      if (transRes.status === 'fulfilled' && transRes.value?.data) {
        if (transRes.value.data.vehicules_actifs !== undefined) {
          setActiveVehicles(transRes.value.data.vehicules_actifs.toString())
        }
        if (transRes.value.data.missions_en_cours !== undefined) {
          setActiveMissions(transRes.value.data.missions_en_cours.toString())
        }
      }
    } catch (e) {
      console.error("Erreur de synchronisation du Dashboard Global", e)
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
    }, 600)
  }

  const handleTCodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (tcode.trim()) {
      router.push(getRouteFromTCode(tcode.trim()))
    }
  }

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      {/* ðŸ‘‘ Top Executive Enterprise Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Ã‰cosystÃ¨me Logistique Global â€¢ Port de Douala & Kribi Deep Sea
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Vue d'Ensemble Entreprise EVO-LOG
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervision stratÃ©gique en temps rÃ©el des opÃ©rations de transport, stockage entrepÃ´t, douane et finance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* T-Code Quick Search */}
          <form onSubmit={handleTCodeSubmit} className="relative">
            <Terminal className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="text"
              value={tcode}
              onChange={(e) => setTcode(e.target.value.toUpperCase())}
              placeholder="Saisir T-Code (ex: EVO-TR01)"
              className="h-10 pl-9 pr-3 bg-slate-950 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44"
            />
          </form>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="h-10 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition cursor-pointer text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchro...' : `ActualisÃ© (${lastSync})`}
          </button>

          <Link
            href="/admin"
            className="h-10 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition curINDX( 	  ]fL           (   ¨  è          p   ÝÝ         ùø    h T     W"    Qe°Ü–,ÝÜ[·Ü–,ÝÜ[·Ü–,ÝÉ4·Ü–,Ý       â	              	c l i e n t . j s o n Õå   / p \     W"    ÆÒÙ—,Ý[2Û—,Ý[2Û—,Ý]Û—,Ý        Ý              c l i e n t . j s . m a p s   Õå   / p Z     W"    ÆÒÙ—,Ý[2Û—,Ý[2Û—,Ý]Û—,Ý        Ý              C L I E N T ~ 1 . M A P j s   ä    p ^     W"    Îg×ß–,Ý…ãß–,Ý…ãß–,Ý…ãß–,ÝÈ      Å              d e b u g - b u i l d . j s   ä    h X     W"    Îg×ß–,Ý…ãß–,Ý…ãß–,Ý…ãß–,ÝÈ      Å              D E B U G - ~ 1 . J S š    p `     W"    ižçà–,ÝÑ9ûà–,ÝÑ9ûà–,Ý¶ûà–,Ý 0      ›.              e v e n t b u i l d e r . j s ÎÊ    x h     W"    ›B`—,Ýù¦w—,Ýù¦w—,ÝÐXw—,Ý `      yT              e v e n t b u i l d e r . j s . m a p š    h X     W"    ižçà–,ÝÑ9ûà–,ÝÑ9ûà–,Ý¶ûà–,Ý 0      ›.              E V E N T B ~ 1 . J S ÎÊ    p Z     W"    ›B`—,Ýù¦w—,Ýù¦w—,ÝÐXw—,Ý `      yT             E V E N T B ~ 1 . M A P c . j ™ß    x b     W"    #;æ–,ÝD5Zæ–,ÝD5Zæ–,ÝíAGæ–,Ý¸      ¸              f e e d b a c k A s y n c . j s    " Ò(   & € j     W"    W,—,Ýp˜$—,Ýp˜$—,Ý0]$—,Ý       Q              f e e d b a c k A s y n c . j s . m a p X     -{    p `     W"    7 6ç–,Ýû¤?ç–,Ýû¤?ç–,Ýû¤?ç–,ÝÈ      Ç              f e e d b a c k S y n c . j s é+    x h     W"    &—,Ýz@0—,Ýz@0—,ÝD0—,Ý                     f e e d b a c k S y n c . j s . m a  ™ß    h X     W"    #;æ–,ÝD5Zæ–,ÝD5Zæ–,ÝíAGæ–,Ý¸      ¸              F E E D B A ~ 1 . J S Ò(   & p Z     W"    W,—,Ýp˜$—,Ýp˜$—,Ý0]$—,Ý       Q              F E E D B A ~ 1 . M A P     -{    h X     W"    7 6ç–,Ýû¤?ç–,Ýû¤?ç–,Ýû¤?ç–,ÝÈ      Ç              F E E D B A ~ 2 . J S é+    p Z     W"    &—,Ýz@0—,Ýz@0—,ÝD0—,Ý                     F E E D B A ~ 2 . M A P                   W"    eUë–,Ýn"ë–,Ýn"ë–,Ý	G"ë–,Ý        ?             
h e l p e r s . j s n »7    p ^     W"    ®½"—,Ý®½"—,Ý®½"—,Ý®½"—,Ý                        h e l p e r s . j s . m a p " 3²    h R     W"    ’eï–,Ýiˆxï–,Ýiˆxï–,Ý\:xï–,Ý       þ              i n d e x . j s i o n z9   " p Z     W"    6_*Ñ–,Ý÷Ng—,Ý÷Ng—,Ý÷Ng—,Ý                       i n t e g r a t i o n s      z9   " h R     W"    6_*Ñ–,Ý÷Ng—,Ý÷Ng—,Ý÷Ng—,Ý                       I N T E G R ~ 1       ¢á     h V     W"    afÕù–,Ý8ú–,Ý8ú–,ÝÄú–,        À              
m e t r i c s . j s  eÙ   	 p Z     W"    ë¸‹—,Ýs!ª—,Ýs!ª—,Ýs!ª—,Ý8       8               p a c k a g e . j s o n     eÙ   	 p Z     W"    ë¸‹—,Ýs!ª—,Ýs!ª—,Ýs!ª—,Ý8       8               P A C K A G ~ 1 . J S O     gË    h T     W"    ÙF‰õ–,Ýñ°0—,Ýñ°0—,Ýñ°0—,Ý                       	p r o f i l i n g    gË    h R     W"    ÙF‰õ–,Ýñ°0—,Ýñ°0—,Ýñ°0—,Ý                       P R O F I L ~ 1     Š*    ` N     W"    6´J —, Á,V —,ÝØzV —,ÝsU —,Ý 0      ì               s d k . j s g ŸÒ    x b     W"    ®ÐÜ—,Ýñ—,Ýð<—,Ý02û—,Ý                      s t a c k - p a r s e r s . j s     ŸÒ    h X     W"    ®ÐÜ—,Ýñ—,Ýð<—,Ý02û—,Ý                      S T A C K - ~ 1 . J S ê"    ` P     W"    yÏ–,ÝÂô¶—,ÝÂô¶—,ÝÂô¶—,Ý                       t r a c i n g l„    h V     W"     è–,Ý”‰Xü–,Ý”‰Xü–,Ý”‰Xü–,Ý                       
t r a n s p o r t s   l„    h R     W"     è–,Ý”‰Xü–,Ý”‰Xü–,Ý”‰Xü–,Ý                       T R A N S P ~ 1       ÞÖ    p `     W"    :O—,ÝÚ
T—,ÝÚ
T—,Ýº¼S—,Ý       Y              u s e r f e e d b a c k . j s ÞÖ    h X     W"    :O—,ÝÚ
T—,ÝÚ
T—,Ýº¼S—,Ý       Y              U S E R F E ~ 1 . J S '   N ` L     W"    4löâ–,Ý¥ä¢—,Ý¥ä¢—,Ý¥ä¢—,Ý                       u t i l s                                                                                                                          /// <reference types="koa__router" />
import type { Middleware, ParameterizedContext, DefaultState } from 'koa';
import type * as Router from '@koa/router';
export declare type KoaContext = ParameterizedContext<DefaultState, Router.RouterParamContext>;
export declare type KoaMiddleware = Middleware<DefaultState, KoaContext> & {
    router?: Router;
};
/**
 * This symbol is used to mark a Koa layer as being already instrumented
 * since its possible to use a given layer multiple times (ex: middlewares)
 */
export declare const kLayerPatched: unique symbol;
export declare type KoaPatchedMiddleware = KoaMiddleware & {
    [kLayerPatched]?: boolean;
};
//# sourceMappingURL=internal-types.d.ts.map                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   <div className="space-y-3">
            {fleetStatusData.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-200">{item.name}</span>
                </div>
                <span className="text-sm font-black text-white">{item.count} Camions</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Taux d'Occupation EntrepÃ´ts :</div>
            <div className="space-y-2">
              {warehouseZonesData.map((z, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-semibold">{z.zone}</span>
                    <strong className="text-amber-400 font-bold">{z.occupancy}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${z.occupancy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ðŸš€ All ERP Modules Quick Access Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Zap className="w-5 h-5 text-amber-400" /> Navigation Rapide aux Modules ERP
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Admin ERP', href: '/admin', icon: ShieldCheck, color: 'text-amber-400' },
            { label: 'Transport', href: '/transport/control', icon: Truck, color: 'text-emerald-400' },
            { label: 'Magasin MAG3', href: '/magasin/dashboard', icon: Package, color: 'text-indigo-400' },
            { label: 'Finance', href: '/finance/overview', icon: CreditCard, color: 'text-cyan-400' },
            { label: 'Acconage Quai', href: '/acconage', icon: Building, color: 'text-purple-400' },
            { label: 'QHSE SÃ©curitÃ©', href: '/qhse', icon: ShieldAlert, color: 'text-red-400' },
            { label: 'Transit Douane', href: '/transit', icon: Globe, color: 'text-yellow-400' },
            { label: 'Maintenance', href: '/maintenance', icon: RefreshCw, color: 'text-blue-400' },
            { label: 'e-POD & GPS', href: '/tracking', icon: Radio, color: 'text-emerald-400' },
            { label: 'FuelGuard', href: '/fuel-guard', icon: Fuel, color: 'text-orange-400' },
            { label: 'Procurement', href: '/procurement', icon: ShoppingCart, color: 'text-pink-400' },
            { label: 'Analytics BI', href: '/bi', icon: BarChart3, color: 'text-amber-400' },
          ].map((m, idx) => {
            const IconComponent = m.icon
            return (
              <Link
                key={idx}
                href={m.href}
                className="bg-slate-950 hover:bg-slate-800/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col items-center text-center gap-2 transition hover:scale-105 active:scale-95 group shadow-md"
              >
                <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${m.color} group-hover:scale-110 transition`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition">{m.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ðŸ“¡ Live Operations Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Clock className="w-5 h-5 text-emerald-400" /> Flux d'OpÃ©rations Entreprise en Temps RÃ©el
        </h2>

        <div className="divide-y divide-slate-800/70">
          {liveOperationLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[10px] font-bold">
                  {log.type}
                </span>
                <span className="text-xs text-slate-200 font-semibold">{log.text}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
