'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { Map, Activity, MapPin, Search } from 'lucide-react';

// Dynamic import with SSR false is REQUIRED for react-leaflet
const MapControlTower = dynamic(() => import('@/components/transport/MapControlTower'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-slate-400 font-bold flex items-center gap-2">
        <Map className="w-5 h-5 animate-spin" />
        Initialisation de la tour de contrôle...
      </p>
    </div>
  )
});

export default function GPSControlTowerPage() {
  return (
    <ModuleLayout module="transport">
      <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col p-4 animate-in fade-in duration-500">
        
        {/* Header Compact */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Map className="w-6 h-6 text-blue-600" />
              Tour de Contrôle GPS
            </h1>
            <p className="text-slate-500 text-sm">Suivi télématique en temps réel de la flotte.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher OT, Camion..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-64"
              />
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100 shadow-sm">
              <Activity className="w-4 h-4" />
              Système En Ligne
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
          <MapControlTower missions={[]} />
          
          {/* Overlay Stats Card */}
          <div className="absolute top-4 right-4 z-[400] w-72 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Statut Flotte
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">En Mouvement</span>
                <span className="text-sm font-black text-emerald-600">12</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-[60%]"></div></div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">En Arrêt / Quai</span>
                <span className="text-sm font-black text-amber-600">5</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full w-[25%]"></div></div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Hors Ligne / Maintenance</span>
                <span className="text-sm font-black text-red-600">3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full w-[15%]"></div></div>
            </div>
          </div>
        </div>
        
      </div>
    </ModuleLayout>
  );
}
