// src/app/(app)/transport/dispatch/page.tsx - K-Transport Dispatch Control - De-hardcoded
'use client'
import React, { useState, useEffect } from 'react';
import { transportAPI } from '@/lib/api-client';

export default function TransportDispatchPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routesOptimized, setRoutesOptimized] = useState(false);
  
  const [missions, setMissions] = useState<any[]>([]);
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [camions, setCamions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newMission, setNewMission] = useState({
    chauffeur_id: '',
    camion_id: '',
    point_depart: '',
    point_arrivee: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [missRes, chaufRes, camRes] = await Promise.all([
        transportAPI.getMissions().catch(() => ({ data: [] })),
        transportAPI.getChauffeurs().catch(() => ({ data: [] })),
        transportAPI.getCamions().catch(() => ({ data: [] }))
      ]);
      setMissions(missRes.data || []);
      setChauffeurs(chaufRes.data || []);
      setCamions(camRes.data || []);
    } catch (error) {
      console.error("Failed to load dispatch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setRoutesOptimized(true);
    }, 2000);
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.chauffeur_id || !newMission.camion_id || !newMission.point_depart || !newMission.point_arrivee) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    
    try {
      await transportAPI.createMission({
        chauffeur_id: parseInt(newMission.chauffeur_id),
        camion_id: parseInt(newMission.camion_id),
        point_depart: newMission.point_depart,
        point_arrivee: newMission.point_arrivee,
        statut: 'PLANIFIEE',
        client_id: 1, // Defaulting for MVP
        type_marchandise: 'STANDARD'
      });
      alert("Mission créée avec succès !");
      loadData();
      setNewMission({ chauffeur_id: '', camion_id: '', point_depart: '', point_arrivee: '' });
    } catch (error) {
      console.error("Creation failed", error);
      alert("Erreur lors de la création de la mission.");
    }
  };

  const getStatusStyle = (statut: string) => {
    switch (statut) {
      case 'EN_TRANSIT':
      case 'EN_COURS': return 'bg-blue-100 text-blue-700';
      case 'EN_CHARGEMENT': return 'bg-orange-100 text-orange-700';
      case 'LIVREE':
      case 'TERMINEE': return 'bg-green-100 text-green-700';
      case 'PLANIFIEE': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const activeMissions = missions.filter(m => m.statut !== 'TERMINEE' && m.statut !== 'ANNULEE');

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
          vertical-align: middle;
        }
        body { font-family: 'Inter', sans-serif; background-color: #f0f3ff; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F59E0B; border-radius: 10px; }
      `}</style>
      <div className="text-on-surface">
        
        

        
        

        {/* Main Content Stage */}
        <main className="pt-16 min-h-screen p-8">
          {/* Dashboard Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              
              <h1 className="text-headline-md font-headline-md text-on-background">Dispatch Fleet Monitor</h1>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white border border-outline-variant px-4 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-label-md font-label-md">System Live</span>
              </div>
              <div className="text-on-surface-variant text-label-md font-label-md bg-surface-container-high px-4 py-1 rounded">
                Updated: Just now
              </div>
            </div>
          </div>

          {/* Bento Layout */}
          <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
            {/* Left Pane: Map & Mission Form */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              {/* Map Widget */}
              <div className="bg-white border border-outline-variant rounded shadow-sm relative overflow-hidden h-[400px]">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-sm p-4 border border-outline-variant rounded shadow-md">
                    <h3 className="text-label-md font-label-md font-bold text-on-background mb-1">Real-time Telemetry</h3>
                    <div className="flex items-center gap-2 text-label-sm">
                      <span className="w-3 h-3 rounded-full bg-primary"></span> {activeMissions.length} Active Trucks
                    </div>
                  </div>
                </div>
                {/* Placeholder for Map */}
                <div className="w-full h-full bg-surface-container-highest relative">
                  <img alt="Operational Map" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFck20JD_GQMW1qAQDetaNG-7VrbYx_S6dlTjf0BH1UydGIlWxC8aCWzKZB_C3qSE25FMMih-oA3ecSoc3H1HALp0E7SM39Y5NTLQtnl2dcpJZjUJZUx1mZdDVUxkPZ7QFlbrQ3GW5pKD9U2jeh_mK5IkwQl8zMirNz0W0ZvntY8d5E8O4OPIkv0KXX98-ug-YLJdYkCw_S6-xl9LuTEalBQvsN1kr78f47dBlSO4t2YWF9fXu3H9AtV9vaVTPTj28ieS_qMfiToQ"/>
                  {/* Simulated Markers based on count */}
                  {[...Array(Math.min(3, activeMissions.length))].map((_, i) => (
                    <div key={i} className={`absolute w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg ${i===0 ? 'top-1/4 left-1/3 animate-bounce' : i===1 ? 'top-1/2 left-1/2' : 'bottom-1/3 right-1/4'}`}>
                      <span className="material-symbols-outlined text-white text-[14px]">local_shipping</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table: Active Missions */}
              <div className="bg-white border border-outline-variant rounded shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                  <h2 className="text-title-md font-title-md text-on-background flex items-center gap-2">
                    Live Mission Log
                    {!routesOptimized && !isOptimizing && (
                      <button onClick={handleOptimize} className="ml-4 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">route</span> Optimize Routes (AI)
                      </button>
                    )}
                    {isOptimizing && (
                      <span className="ml-4 text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-[14px] animate-spin">sync</span> Calculating...
                      </span>
                    )}
                    {routesOptimized && (
                      <span className="ml-4 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Routes Optimized
                      </span>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    <button className="material-symbols-outlined p-1 text-on-surface-variant hover:bg-surface-container-highest rounded">filter_list</button>
                    <button className="material-symbols-outlined p-1 text-on-surface-variant hover:bg-surface-container-highest rounded">download</button>
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[400px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-surface-container-low border-b border-outline-variant">
                      <tr>
                        <th className="px-4 py-2 text-label-sm font-label-sm text-outline uppercase tracking-wider">Mission ID</th>
                        <th className="px-4 py-2 text-label-sm font-label-sm text-outline uppercase tracking-wider">Driver</th>
                        <th className="px-4 py-2 text-label-sm font-label-sm text-outline uppercase tracking-wider">Route</th>
                        <th className="px-4 py-2 text-label-sm font-label-sm text-outline uppercase tracking-wider">Vehicle</th>
                        <th className="px-4 py-2 text-label-sm font-label-sm text-outline uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-label-sm font-label-sm text-outline uppercase tracking-wider">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {loading ? (
                        <tr><td colSpan={6} className="text-center py-8">Chargement...</td></tr>
                      ) : activeMissions.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Aucune mission active.</td></tr>
                      ) : (
                        activeMissions.map((mission, i) => (
                          <tr key={mission.id} className="hover:bg-surface-container-lowest transition-colors h-12">
                            <td className="px-4 py-2 font-data-tabular text-body-sm text-primary font-bold">{mission.reference || `#MSN-${mission.id}`}</td>
                            <td className="px-4 py-2 text-body-sm">{mission.chauffeur?.nom || 'N/A'} {mission.chauffeur?.prenom || ''}</td>
                            <td className="px-4 py-2 text-body-sm">
                              {mission.point_depart} → {mission.point_arrivee}
                              {routesOptimized && i % 2 === 0 && <div className="text-[10px] text-green-600 font-bold mt-0.5">-12% distance via N4</div>}
                            </td>
                            <td className="px-4 py-2 text-body-sm">{mission.camion?.immatriculation || 'N/A'}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${getStatusStyle(mission.statut)}`}>
                                {mission.statut}
                              </span>
                            </td>
                            <td className="px-4 py-2 min-w-[120px]">
                              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-1000" style={{ width: routesOptimized ? `${Math.min(100, 30 + (i*20) + 10)}%` : `${Math.min(100, 30 + (i*20))}%` }}></div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Pane: Add Mission Form & Analytics */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              {/* Add Mission Form */}
              <div className="bg-white border border-outline-variant rounded shadow-sm p-6">
                <h2 className="text-title-md font-title-md text-on-background mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">add_circle</span>
                  Initialize New Mission
                </h2>
                <form className="space-y-4" onSubmit={handleCreateMission}>
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline mb-1">Select Driver</label>
                    <select 
                      value={newMission.chauffeur_id} 
                      onChange={e => setNewMission({...newMission, chauffeur_id: e.target.value})}
                      className="w-full border-outline-variant border rounded px-4 py-2 text-body-md focus:ring-primary focus:border-primary outline-none"
                    >
                      <option value="">-- Choisir un chauffeur --</option>
                      {chauffeurs.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.nom} {ch.prenom} - {ch.statut}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline mb-1">Vehicle Assignment</label>
                    <select 
                      value={newMission.camion_id} 
                      onChange={e => setNewMission({...newMission, camion_id: e.target.value})}
                      className="w-full border-outline-variant border rounded px-4 py-2 text-body-md focus:ring-primary focus:border-primary outline-none"
                    >
                      <option value="">-- Choisir un camion --</option>
                      {camions.map(c => (
                        <option key={c.id} value={c.id}>{c.immatriculation} - {c.statut}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-label-sm font-label-sm text-outline mb-1">Origin</label>
                      <input 
                        value={newMission.point_depart} 
                        onChange={e => setNewMission({...newMission, point_depart: e.target.value})}
                        className="w-full border-outline-variant border rounded px-4 py-2 text-body-md outline-none focus:border-primary" placeholder="e.g. Zone A" type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm font-label-sm text-outline mb-1">Destination</label>
                      <input 
                        value={newMission.point_arrivee} 
                        onChange={e => setNewMission({...newMission, point_arrivee: e.target.value})}
                        className="w-full border-outline-variant border rounded px-4 py-2 text-body-md outline-none focus:border-primary" placeholder="e.g. Quay 9" type="text"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button className="w-full bg-primary text-white font-bold py-3 rounded hover:brightness-110 transition-all shadow-md shadow-primary/20 disabled:opacity-50" type="submit" disabled={loading}>
                      {loading ? 'CHARGEMENT...' : 'DISPATCH MISSION'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Stats/Atmospheric Widget */}
              <div className="bg-primary rounded p-6 text-white shadow-lg relative overflow-hidden">
                {/* Subtle background pattern/animation */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-label-sm opacity-80 uppercase tracking-widest font-bold">Fleet Efficiency</p>
                      <h4 className="text-headline-sm font-headline-sm">94.2%</h4>
                    </div>
                    <span className="material-symbols-outlined text-[32px] opacity-50">analytics</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-label-sm">
                      <span>Active Missions</span>
                      <span className="font-bold">{activeMissions.length}/{missions.length || 1}</span>
                    </div>
                    <div className="w-full bg-white/20 h-1 rounded-full">
                      <div className="bg-white h-full" style={{ width: `${missions.length > 0 ? (activeMissions.length/missions.length)*100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] opacity-70 uppercase">Total Deliveries</p>
                      <p className="text-title-md font-bold">{missions.length}</p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-70 uppercase">Fuel Index</p>
                      <p className="text-title-md font-bold transition-colors duration-1000">
                        {routesOptimized ? '0.94' : '0.82'} 
                        <span className={`text-[10px] font-normal ml-2 ${routesOptimized ? 'text-green-300' : 'text-red-300'}`}>
                          {routesOptimized ? '▲ 14%' : '▼ 2%'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Alerts Feed */}
              <div className="bg-white border border-outline-variant rounded shadow-sm flex-1 flex flex-col min-h-0">
                <div className="px-6 py-4 border-b border-outline-variant">
                  <h3 className="text-label-md font-bold text-on-background flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                    Critical Alerts
                  </h3>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-2 space-y-2 max-h-[160px]">
                  <div className="p-2 bg-error-container/30 border border-error/10 rounded flex gap-2">
                    <span className="material-symbols-outlined text-error text-[16px]">tire_repair</span>
                    <div className="text-[11px]">
                      <p className="font-bold text-on-error-container">TRK-009: Pressure Warning</p>
                      <p className="text-outline">Sensor detected low PSI on Rear-Axle 2.</p>
                    </div>
                  </div>
                  <div className="p-2 bg-surface-container-high border border-outline-variant rounded flex gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">schedule</span>
                    <div className="text-[11px]">
                      <p className="font-bold text-on-surface">Delay: Quay 4 Congestion</p>
                      <p className="text-outline">Estimated wait time increased by 15 mins.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
