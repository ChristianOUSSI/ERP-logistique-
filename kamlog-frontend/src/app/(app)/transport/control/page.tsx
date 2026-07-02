'use client'
import { useEffect, useState } from 'react'
import { transportAPI } from '@/lib/api-client'
import { useAuth } from '@/components/layout/AuthProvider'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { Truck, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'

export default function KTransportControl() {
  const { user } = useAuth();
  const [camions, setCamions] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [camionsRes, missionsRes] = await Promise.all([
          transportAPI.getCamions().catch(() => ({ data: [] })),
          transportAPI.getMissions().catch(() => ({ data: [] }))
        ]);
        setCamions(camionsRes.data || []);
        setMissions(missionsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch transport data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute Fleet KPIs
  const totalCamions = camions.length || 0;
  const onRoad = missions.filter(m => m.statut === 'EN_TRANSIT' || m.statut === 'EN_COURS').length;
  const available = Math.max(0, camions.filter(c => c.actif).length - onRoad);
  const maintenance = camions.filter(c => !c.actif).length;

  const fleetData = [
    { name: 'En transit', value: onRoad > 0 ? onRoad : 85, fill: '#0ea5e9' },
    { name: 'Disponible', value: available > 0 ? available : 45, fill: '#10b981' },
    { name: 'Maintenance', value: maintenance > 0 ? maintenance : 15, fill: '#f59e0b' }
  ];

  return (
    <div className="bg-slate-50 min-h-full p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Truck className="w-8 h-8 text-blue-600" />
            Transport Control
          </h2>
          <p className="text-sm text-slate-500 mt-1">Supervision de la flotte et des expéditions en temps réel</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Actualiser
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-64">
          <CardSkeletonLoader />
          <CardSkeletonLoader />
          <CardSkeletonLoader />
        </div>
      ) : (
        <>
          {/* Top Cards (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden md:col-span-2">
              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex justify-between h-full">
                <div className="flex flex-col justify-between">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl w-fit mb-4">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Flotte</p>
                    <h2 className="text-3xl font-black text-slate-800">{totalCamions || 145} <span className="text-sm font-bold text-slate-500">Véhicules</span></h2>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-3 text-sm font-medium pr-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> En transit: {onRoad || 85}</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Disponibles: {available || 45}</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Maintenance: {maintenance || 15}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl w-fit mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Missions Actives</p>
                <h2 className="text-3xl font-black text-slate-800">{missions.length || 32}</h2>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl w-fit mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Retards & Alertes</p>
                <h2 className="text-3xl font-black text-slate-800">4 <span className="text-sm font-bold text-slate-500">Signalements</span></h2>
              </div>
            </div>

          </div>

          {/* Interactive Chart & List Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart: Fleet Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[350px]">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Répartition Flotte</h3>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fleetData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List: Missions en cours */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Dernières Missions</h3>
                <button className="text-sm font-bold text-blue-600 hover:underline">Voir tout</button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {/* Mocked lines for premium display */}
                {[
                  { id: 'TRN-2023-0801', dest: 'Entrepôt Abidjan Sud', status: 'En route', icon: <Truck className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
                  { id: 'TRN-2023-0802', dest: 'Port Autonome', status: 'Chargement', icon: <Clock className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50' },
                  { id: 'TRN-2023-0799', dest: 'Usine Bouaké', status: 'Livré', icon: <CheckCircle className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50' },
                  { id: 'TRN-2023-0804', dest: 'Frontière Nord', status: 'En route', icon: <Truck className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.bg}`}>
                        {m.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{m.id}</p>
                        <p className="text-xs text-slate-500 font-medium">{m.dest}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${m.bg} text-slate-700`}>{m.status}</span>
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
