'use client'

import React, { useState, useEffect } from 'react'
import { Activity, ShieldCheck, ServerCrash, Users, AlertTriangle, ArrowUpRight, Cpu } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

const mockUptimeData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  uptime: 98 + Math.random() * 2
}))

export default function AuditHealthDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch for health data
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="text-emerald-600 w-7 h-7" />
          Santé Système & Audit
        </h1>
        <p className="text-sm text-slate-500 mt-1">Surveillance en temps réel des performances et de la sécurité de l'ERP.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">Normal</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Statut Global</p>
            <h2 className="text-2xl font-black text-slate-800">100% <span className="text-sm font-bold text-slate-500">Opérationnel</span></h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-full">32ms ping</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Charge Serveur (CPU)</p>
            <h2 className="text-2xl font-black text-slate-800">24% <span className="text-sm font-bold text-slate-500">Moyenne</span></h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sessions Actives</p>
            <h2 className="text-2xl font-black text-slate-800">142 <span className="text-sm font-bold text-slate-500">Utilisateurs</span></h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-red-50 text-red-700 rounded-full">2 Non Résolues</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alertes Sécurité (MFA)</p>
            <h2 className="text-2xl font-black text-slate-800">5 <span className="text-sm font-bold text-slate-500">Aujourd'hui</span></h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-[400px]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Disponibilité des Services (24h)</h3>
            <p className="text-sm text-slate-500">Temps de réponse et SLA</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockUptimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[90, 100]} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Disponibilité']}
                />
                <Area type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUptime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Événements Récents</h3>
            <p className="text-sm text-slate-500">Journal système (Auto-refresh)</p>
          </div>
          <div className="space-y-4">
            {[
              { id: 1, type: 'success', text: 'Backup Base de données terminé', time: 'Il y a 5 min' },
              { id: 2, type: 'warning', text: 'Tentative de connexion échouée (Admin)', time: 'Il y a 12 min' },
              { id: 3, type: 'info', text: 'Mise à jour du certificat SSL', time: 'Il y a 1h' },
              { id: 4, type: 'error', text: 'Timeout API Passerelle', time: 'Il y a 2h' },
              { id: 5, type: 'success', text: 'Synchronisation Master Data ok', time: 'Il y a 3h' },
            ].map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  log.type === 'success' ? 'bg-emerald-500' : 
                  log.type === 'warning' ? 'bg-amber-500' : 
                  log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{log.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
