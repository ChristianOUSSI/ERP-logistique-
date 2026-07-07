'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { Map, Navigation, Settings2, RefreshCw, Box } from 'lucide-react';

// Dynamic import of MapViewer to avoid SSR window is not defined errors
const MapViewer = dynamic(() => import('@/components/map/MapViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Initialisation de la cour...</div>
});

export default function YardMapPage() {
  const [points, setPoints] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchYardPositions();
  }, []);

  const fetchYardPositions = () => {
    setRefreshing(true);
    // Simulation d'emplacements sur la cour
    setTimeout(() => {
      setPoints([
        { id: 'CONT-101', lat: 4.0520, lng: 9.7680, type: 'container', label: 'Conteneur 40" - MSCU1234567' },
        { id: 'CONT-102', lat: 4.0515, lng: 9.7685, type: 'container', label: 'Conteneur 20" - CMAU7654321' },
        { id: 'CONT-103', lat: 4.0522, lng: 9.7675, type: 'container', label: 'Conteneur 40" HC - HLXU9876543' },
      ]);
      setRefreshing(false);
    }, 800);
  };

  return (
    <ModuleLayout module="parc">
      <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-80px)]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Map className="w-8 h-8 text-amber-600" />
              Vue de la Cour (Yard Management)
            </h1>
            <p className="text-sm text-slate-500 mt-2">Vue satellite des emplacements et conteneurs sur la cour.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchYardPositions}
              disabled={refreshing}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-amber-600' : ''}`} />
              Actualiser Cour
            </button>
            <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
              <Settings2 className="w-4 h-4" />
              Configuration Zones
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative">
          
          {/* Overlay Panel */}
          <div className="absolute top-4 left-4 z-[400] w-80 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl overflow-hidden flex flex-col max-h-[80%]">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Box className="w-5 h-5 text-amber-600" />
                Conteneurs sur site
              </h3>
            </div>
            <div className="p-2 flex-1 overflow-y-auto custom-scrollbar">
              {points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{pt.id}</h4>
                    <p className="text-xs text-slate-500 truncate w-44">{pt.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-full">
            <MapViewer points={points} center={[4.0511, 9.7679]} zoom={16} mode="yard_management" />
          </div>
        </div>

      </div>
    </ModuleLayout>
  );
}
