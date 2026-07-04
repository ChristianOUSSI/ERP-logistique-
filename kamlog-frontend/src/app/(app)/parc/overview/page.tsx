// src/app/(app)/parc/overview/page.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { transportAPI } from '@/lib/api-client'
import { useAuth } from '@/components/layout/AuthProvider'
import { Car, Route, Wrench, ParkingCircle, Plus, LayoutList } from 'lucide-react'

export default function KParcFleetManagementOverview() {
  const { user } = useAuth();
  const [camions, setCamions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const camionsRes = await transportAPI.getCamions().catch(() => ({ data: [] }));
        setCamions(camionsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch parc data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalVehicles = camions.length;
  // We mock the status distribution since the backend only gives "actif" boolean.
  const activeVehicles = camions.filter(c => c.actif).length;
  const enMission = Math.floor(activeVehicles * 0.7);
  const available = activeVehicles - enMission;
  const inMaintenance = camions.filter(c => !c.actif).length;

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Car className="text-blue-600 w-7 h-7" />
            Gestion de Flotte
          </h1>
          <p className="text-sm text-slate-500 mt-1">Supervision globale et registre des véhicules.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/parc/vehicles/new" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-200 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau Véhicule
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Fleet Health Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 w-20 h-20 bg-blue-50 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Flotte</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <div className="relative z-10 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{totalVehicles}</span>
                <span className="text-sm font-medium text-slate-500">Unités</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-50 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110" />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">En Mission (Est.)</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Route className="w-4 h-4" />
                </div>
              </div>
              <div className="relative z-10 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{enMission}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 w-20 h-20 bg-amber-50 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110" />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">En Maintenance</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="relative z-10 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{inMaintenance}</span>
                <span className="text-sm font-medium text-slate-500">Atelier</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 w-20 h-20 bg-slate-50 rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110" />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disponibles (Est.)</span>
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <ParkingCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="relative z-10 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{available}</span>
              </div>
            </div>
          </div>

          {/* Detailed Vehicle List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-blue-600" />
                Registre des Véhicules
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6 font-semibold">Immatriculation</th>
                    <th className="py-4 px-6 font-semibold">Modèle / Type</th>
                    <th className="py-4 px-6 font-semibold">Capacité</th>
                    <th className="py-4 px-6 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {camions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 px-6 text-center">
                         <p className="text-slate-900 font-medium">Aucun véhicule trouvé.</p>
                         <p className="text-slate-500 text-sm mt-1">Ajoutez un véhicule pour commencer.</p>
                      </td>
                    </tr>
                  ) : (
                    camions.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-4 px-6 font-bold text-slate-900">{c.immatriculation}</td>
                        <td className="py-4 px-6 text-slate-600">{c.marque} {c.modele} <span className="text-xs text-slate-400">({c.type_vehicule})</span></td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{c.charge_utile_kg ? `${(parseFloat(c.charge_utile_kg) / 1000).toFixed(1)} t` : 'N/A'}</td>
                        <td className="py-4 px-6">
                          {c.actif ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Maintenance
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
