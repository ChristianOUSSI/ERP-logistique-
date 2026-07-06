'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { transportAPI } from '@/lib/api-client';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { MapPin, Search, Truck, ShieldAlert, CheckCircle2, Navigation, Activity } from 'lucide-react';

export default function TransportMapPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [liveFeed, setLiveFeed] = useState(true);

  // Poll for GPS data
  useEffect(() => {
    const fetchGps = async () => {
      try {
        const res = await transportAPI.getGPS();
        if (res.data) {
          setVehicles(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch GPS", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGps();
    
    let interval: NodeJS.Timeout;
    if (liveFeed) {
      interval = setInterval(fetchGps, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveFeed]);

  // Filter vehicles by immatriculation
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => v.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [vehicles, searchTerm]);

  return (
    <ModuleLayout module="transport">
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Header & Controls */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shadow-sm relative">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              Tracking GPS Flotte
            </h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher par matricule..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm outline-none shadow-inner bg-slate-50"
              />
            </div>
            <button 
              onClick={() => setLiveFeed(!liveFeed)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${liveFeed ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Activity className={`w-4 h-4 ${liveFeed ? 'animate-pulse' : ''}`} />
              {liveFeed ? 'Live ON' : 'Live OFF'}
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 flex flex-col md:flex-row relative bg-slate-100 overflow-hidden">
          
          {/* Simulated Map Background */}
          <div className="flex-1 relative" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}>
            {/* Map Overlay for context */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-emerald-50/50 pointer-events-none" />
            
            {/* Markers */}
            {filteredVehicles.map((v) => {
              // Simulated position calculation based on real coordinates or random for demo
              // Using Douala coords roughly mapping to screen percentages
              const xPos = ((v.longitude - 9.7) / 0.15) * 100;
              const yPos = ((v.latitude - 4.0) / 0.1) * 100;
              
              // Ensure markers stay within bounds for demo
              const safeX = Math.max(5, Math.min(95, xPos));
              const safeY = Math.max(5, Math.min(95, 100 - yPos));

              const isRunning = v.statut === 'EN_ROUTE';
              const isMaintenance = v.statut === 'EN_MAINTENANCE' || v.statut === 'BLOQUE_HSE';

              return (
                <div 
                  key={v.camion_id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-1000 ease-in-out"
                  style={{ left: `${safeX}%`, top: `${safeY}%` }}
                >
                  <div className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-2 ${isRunning ? 'bg-blue-500 border-white' : isMaintenance ? 'bg-red-500 border-white' : 'bg-emerald-500 border-white'} ${isRunning && liveFeed ? 'animate-bounce' : ''}`}>
                    <Navigation className="w-5 h-5 text-white transform rotate-45" />
                    
                    {/* Ripple Effect for active vehicles */}
                    {isRunning && liveFeed && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75"></div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="font-bold text-base mb-1">{v.immatriculation}</div>
                    <div className="text-xs text-slate-300 flex items-center justify-between mb-2">
                      <span>{v.vitesse_kmh} km/h</span>
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-blue-400' : isMaintenance ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                        {v.statut.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 text-right">
                      Mis à jour: {v.derniere_mise_a_jour}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar: Vehicle List */}
          <div className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-800 flex justify-between items-center">
              <span>Véhicules ({filteredVehicles.length})</span>
              {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
              {filteredVehicles.length === 0 ? (
                <div className="text-center text-slate-500 mt-10 text-sm">Aucun véhicule trouvé.</div>
              ) : (
                filteredVehicles.map(v => (
                  <div key={v.camion_id} className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-400" />
                        {v.immatriculation}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.statut === 'EN_ROUTE' ? 'bg-blue-100 text-blue-700' : 
                        v.statut.includes('MAINTENANCE') || v.statut.includes('HSE') ? 'bg-red-100 text-red-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {v.statut.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex justify-between items-center">
                      <span>Vitesse: <strong className="text-slate-700">{v.vitesse_kmh} km/h</strong></span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> GPS Actif
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </ModuleLayout>
  )
}
