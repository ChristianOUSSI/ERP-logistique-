'use client'

import { useState } from 'react'
import { Plus, AlertTriangle, Route, Wrench, Activity, Euro, Leaf, Filter, Download, Car, Gauge, MapPin } from 'lucide-react'

export default function ParcPage() {
  const [alertVisible, setAlertVisible] = useState(true)

  const dismissAlert = () => {
    setAlertVisible(false)
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Breadcrumbs & Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Car className="w-7 h-7 text-blue-600" />
            K-Parc: Fleet Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">Supervision temps réel et analyse de la flotte.</p>
        </div>
        <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-200 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Register Vehicle
        </button>
      </div>

      {/* CRITICAL ALERT BANNER */}
      {alertVisible && (
        <div className="mb-8 bg-red-50 border border-red-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-red-100 rounded-bl-full -z-0 opacity-50" />
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0 relative z-10 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1 relative z-10">
            <h2 className="text-red-800 font-bold text-lg">Fuel Siphoning Detected</h2>
            <p className="text-red-700/90 text-sm mt-0.5">Anomalous fuel drop detected on Vehicle <strong>K-FLT-8821</strong> (Volvo FH16) at Warehouse Section C. Timestamp: 14:32:01. Security protocol initiated.</p>
          </div>
          <div className="flex gap-3 relative z-10 mt-2 md:mt-0">
            <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all shadow-sm">
              Dispatch Response
            </button>
            <button 
              className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all"
              onClick={dismissAlert}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Fleet Overview Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Vehicle Card 1 */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Container Hauler</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">K-FLT-4402</h3>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold border border-blue-100">In Transit</span>
          </div>
          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-slate-500">Fuel Level</span>
              <span className="text-lg font-black text-blue-600">78%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[78%] transition-all duration-1000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">Odometer</span>
              <span className="font-mono text-sm font-bold text-slate-800">124,502 km</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">Maint.</span>
              <span className="text-sm font-bold text-slate-800">12d left</span>
            </div>
          </div>
        </div>

        {/* Vehicle Card 2 - Alert State */}
        <div className="bg-white border-2 border-red-200 p-5 rounded-2xl shadow-sm relative flex flex-col justify-between">
          <div className="absolute top-3 right-3 flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 relative" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heavy Duty Cab</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">K-FLT-8821</h3>
            </div>
          </div>
          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-red-600">Critical Alert</span>
              <span className="text-lg font-black text-red-600">12%</span>
            </div>
            <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full w-[12%]" />
            </div>
            <span className="text-xs font-semibold text-red-600">Fuel loss detected!</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <span className="text-xs font-medium text-red-700/70 block mb-1">Odometer</span>
              <span className="font-mono text-sm font-bold text-red-900">89,231 km</span>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <span className="text-xs font-medium text-red-700/70 block mb-1">Status</span>
              <span className="text-sm font-bold text-red-700">Locked</span>
            </div>
          </div>
        </div>

        {/* Vehicle Card 3 */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cargo Sprinter</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">K-FLT-3390</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-100">Loading</span>
          </div>
          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-slate-500">Fuel Level</span>
              <span className="text-lg font-black text-emerald-600">92%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[92%] transition-all duration-1000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">Odometer</span>
              <span className="font-mono text-sm font-bold text-slate-800">45,110 km</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-medium text-slate-500 block mb-1">Maint.</span>
              <span className="text-sm font-bold text-slate-800">5,000 km</span>
            </div>
          </div>
        </div>

        {/* Live Map/Location View */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative min-h-[220px]">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MapPin className="w-12 h-12 text-blue-600 drop-shadow-md" />
            <div className="w-4 h-4 bg-blue-600/30 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 animate-ping" />
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-4 flex justify-between items-center border-t border-slate-200">
            <span className="text-sm font-bold text-slate-900">Active Terminal 4</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">12 Vehicles Active</span>
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Consumption Logs Table */}
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              Fuel Consumption Logs
            </h3>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all shadow-sm">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6 font-semibold">Vehicle ID</th>
                  <th className="py-4 px-6 font-semibold">Date/Time</th>
                  <th className="py-4 px-6 font-semibold">Amount (L)</th>
                  <th className="py-4 px-6 font-semibold">Operator</th>
                  <th className="py-4 px-6 font-semibold">Efficiency</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">K-FLT-4402</td>
                  <td className="py-4 px-6 font-mono text-sm text-slate-600">2023-10-24 11:45</td>
                  <td className="py-4 px-6 font-mono text-sm font-medium text-slate-800">342.50 L</td>
                  <td className="py-4 px-6 text-sm text-slate-600">Jean Dupont</td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-emerald-600">Optimal</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Verified
                    </span>
                  </td>
                </tr>
                <tr className="bg-red-50/30 hover:bg-red-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">K-FLT-8821</td>
                  <td className="py-4 px-6 font-mono text-sm text-slate-600">2023-10-24 10:12</td>
                  <td className="py-4 px-6 font-mono text-sm font-medium text-slate-800">115.00 L</td>
                  <td className="py-4 px-6 text-sm text-slate-600">Marc Leroy</td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-red-600">-14.2%</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Flagged
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">K-FLT-3390</td>
                  <td className="py-4 px-6 font-mono text-sm text-slate-600">2023-10-24 09:55</td>
                  <td className="py-4 px-6 font-mono text-sm font-medium text-slate-800">520.12 L</td>
                  <td className="py-4 px-6 text-sm text-slate-600">Sarra S.</td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-slate-500">Standard</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Verified
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Repair History Sidebar */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-500" />
              Repair History
            </h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">View All</button>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto max-h-[400px]">
            {/* History Item 1 */}
            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0 group-hover:scale-110 transition-transform">
                  <Wrench className="w-5 h-5" />
                </div>
                <div className="w-0.5 h-full bg-slate-100 group-last:hidden mt-2" />
              </div>
              <div className="pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-900">K-FLT-4402</span>
                  <span className="text-xs font-medium text-slate-400">Oct 20</span>
                </div>
                <p className="text-sm font-bold text-slate-700">Brake Pad Replacement</p>
                <p className="text-sm text-slate-500 mt-1">Routine maintenance. All units replaced.</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono">FCFA 1,240</span>
                </div>
              </div>
            </div>
            {/* History Item 2 */}
            <div className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shrink-0 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="w-0.5 h-full bg-slate-100 group-last:hidden mt-2" />
              </div>
              <div className="pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-900">K-FLT-1102</span>
                  <span className="text-xs font-medium text-slate-400">Oct 18</span>
                </div>
                <p className="text-sm font-bold text-slate-700">Hydraulic Leakage Repair</p>
                <p className="text-sm text-slate-500 mt-1">Emergency repair at Dock A.</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono">FCFA 3,800</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Analytics Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-slate-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Fleet Availability</span>
            <span className="text-3xl font-black text-slate-900">94.2%</span>
            <span className="text-sm font-semibold text-emerald-600 block mt-1">↑ 2.1% from last month</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-slate-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Euro className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Avg. Cost per km</span>
            <span className="text-3xl font-black text-slate-900">FCFA 0.84</span>
            <span className="text-sm font-semibold text-red-600 block mt-1">↑ FCFA 0.05 from last month</span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:border-slate-200 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Carbon Footprint</span>
            <span className="text-3xl font-black text-slate-900">1.2 tCO2e</span>
            <span className="text-sm font-semibold text-emerald-600 block mt-1">↓ 8% from last month</span>
          </div>
        </div>
      </div>
    </div>
  )
}
