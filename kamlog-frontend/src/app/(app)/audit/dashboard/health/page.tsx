// src/app/(app)/audit/dashboard/health/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { MaterialSymbol } from '@/components/MaterialSymbol'

export default function AuditHealthMonitor() {
  const router = useRouter()
  
  const mfaData = [
    { name: 'Compliant', value: 1452 },
    { name: 'Non-Compliant', value: 128 }
  ];
  
  const complianceRate = Math.round((1452 / (1452 + 128)) * 100);

  // Premium Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-slate-700/50">
          <p className="font-semibold text-sm mb-1">{payload[0].name}</p>
          <p className="text-xl font-bold" style={{ color: payload[0].payload.name === 'Compliant' ? '#3b82f6' : '#ef4444' }}>
            {payload[0].value} users
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-fade-in relative">
      {/* Decorative background pattern (scoped locally) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[-1] rounded-3xl"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Breadcrumbs & Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Forensic Audit Dashboard
            <span className="bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full border border-emerald-200 shadow-sm shadow-emerald-100 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Optimal
            </span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Surveillance continue de la santé et de la sécurité des modules</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <MaterialSymbol icon="schedule" size={18} className="text-slate-400" />
            <span className="font-mono">Last Sync: 14:02:45 UTC</span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* System Health Monitor (Wide) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MaterialSymbol icon="monitor_heart" size={24} className="text-blue-600" />
              Module Health Monitor
            </h2>
            <button 
              onClick={() => router.push('/audit/dashboard/health/details')} 
              className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              View Details
              <MaterialSymbol icon="arrow_forward" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Module: K-Transport */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center hover:bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300 group">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">K-Transport</div>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MaterialSymbol icon="local_shipping" size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="inline-flex items-center justify-center px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Online
              </div>
              <div className="mt-3 font-mono text-xs text-slate-500 bg-white py-1 rounded-md border border-slate-100">Uptime: 99.9%</div>
            </div>

            {/* Module: K-Magasin */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center hover:bg-white hover:border-emerald-100 hover:shadow-md transition-all duration-300 group">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">K-Magasin</div>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MaterialSymbol icon="warehouse" size={24} className="text-emerald-600" />
                </div>
              </div>
              <div className="inline-flex items-center justify-center px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Online
              </div>
              <div className="mt-3 font-mono text-xs text-slate-500 bg-white py-1 rounded-md border border-slate-100">Uptime: 99.8%</div>
            </div>

            {/* Module: K-Finance (Warning State) */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(244,63,94,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600"></div>
              <div className="text-xs font-bold text-rose-700 mb-2 uppercase tracking-wider">K-Finance</div>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MaterialSymbol icon="account_balance" size={24} className="text-rose-600" />
                </div>
              </div>
              <div className="inline-flex items-center justify-center px-2.5 py-1 bg-rose-200 text-rose-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-300">
                Sync Delay
              </div>
              <div className="mt-3 font-mono text-xs text-rose-600 font-semibold bg-white/60 py-1 rounded-md border border-rose-100">-45s lag detected</div>
            </div>

            {/* Module: K-Parc */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center hover:bg-white hover:border-amber-100 hover:shadow-md transition-all duration-300 group">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">K-Parc</div>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MaterialSymbol icon="directions_car" size={24} className="text-amber-600" />
                </div>
              </div>
              <div className="inline-flex items-center justify-center px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Online
              </div>
              <div className="mt-3 font-mono text-xs text-slate-500 bg-white py-1 rounded-md border border-slate-100">Uptime: 100%</div>
            </div>
          </div>
        </div>

        {/* MFA Compliance (Square) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300 flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MaterialSymbol icon="fingerprint" size={24} className="text-blue-600" />
              MFA Compliance
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
            {/* Real Recharts Donut Chart */}
            <div className="w-full h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={mfaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationBegin={200}
                    animationDuration={1200}
                  >
                    <Cell key="cell-0" fill="#3b82f6" className="drop-shadow-sm" />
                    <Cell key="cell-1" fill="#f87171" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-3xl font-bold text-slate-800">{complianceRate}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compliant</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-3 mt-4">
              <div className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm shadow-blue-200"></span> 
                  Active MFA
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">1,452 <span className="text-xs text-slate-500 font-sans font-normal">users</span></span>
              </div>
              <div className="flex justify-between items-center bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
                <span className="flex items-center gap-2 text-sm font-semibold text-rose-800">
                  <span className="w-2.5 h-2.5 bg-rose-400 rounded-full shadow-sm shadow-rose-200"></span> 
                  Pending/Inactive
                </span>
                <span className="font-mono text-sm font-bold text-rose-700">128 <span className="text-xs text-rose-500 font-sans font-normal">users</span></span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
