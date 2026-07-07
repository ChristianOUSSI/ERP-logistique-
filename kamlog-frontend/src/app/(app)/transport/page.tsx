// src/app/(app)/transport/page.tsx — K-Transport Mission Control
'use client'

import { useEffect, useState } from 'react'
import { transportAPI } from '@/lib/api-client'
import { useI18n } from '@/hooks/useI18n'

export default function TransportPage() {
  const t = useI18n()
  const [camions, setCamions] = useState<any[]>([])
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [camionsRes, missionsRes] = await Promise.all([
          transportAPI.getCamions().catch(() => ({ data: [] })),
          transportAPI.getMissions().catch(() => ({ data: [] }))
        ]);
        setCamions(camionsRes.data || []);
        setMissions(missionsRes.data || []);
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingMissions = missions.filter(
    m => m.statut !== 'LIVREE' && m.statut !== 'TERMINEE'
  );

  const filteredMissions = filterValue
    ? missions.filter(m =>
        (m.reference || '').toLowerCase().includes(filterValue.toLowerCase()) ||
        String(m.id || '').includes(filterValue)
      )
    : missions;

  const getStatusClass = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
      case 'EN_ROUTE': return 'status-badge status-transit';
      case 'PLANIFIE': return 'status-badge status-loading';
      case 'LIVREE':
      case 'TERMINEE': return 'status-badge status-delivered';
      case 'MAINTENANCE': return 'status-badge status-maintenance';
      default: return 'status-badge status-info';
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      <main className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">{t.transport.missionControl}</h1>
            <p className="text-sm text-on-surface-variant mt-1">{t.transport.subtitle}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="flex items-center gap-1.5 border border-outline bg-surface px-3 py-2 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span className="hidden sm:inline">{t.transport.filterBtn}</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span className="hidden sm:inline">{t.transport.refreshBtn}</span>
            </button>
          </div>
        </div>

        {/* ── Dashboard Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Fleet Status Summary */}
          <div className="lg:col-span-8 glass-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-on-surface">{t.transport.fleetStatus}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{t.transport.realTimeOverview}</p>
              </div>
              <div className="flex gap-6 sm:gap-10">
                <div className="text-center">
                  <span className="block text-3xl font-black text-on-surface tabular-nums">
                    {camions.filter(c => c.statut === 'EN_ROUTE').length}
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {t.transport.onRoad}
                  </span>
                </div>
                <div className="w-px bg-outline-variant" />
                <div className="text-center">
                  <span className="block text-3xl font-black text-on-surface tabular-nums">
                    {camions.filter(c => c.statut === 'DISPONIBLE').length}
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {t.transport.available}
                  </span>
                </div>
                <div className="w-px bg-outline-variant" />
                <div className="text-center">
                  <span className="block text-3xl font-black text-on-surface tabular-nums">
                    {camions.filter(c => c.statut === 'MAINTENANCE').length}
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant flex items-center justify-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {t.transport.maintenance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Deliveries */}
          <div className="lg:col-span-4 glass-card flex flex-col" style={{ maxHeight: '400px', minHeight: '300px' }}>
            <div className="erp-card-header flex items-center justify-between rounded-t-xl">
              <h3 className="text-sm font-bold text-on-surface">{t.transport.nextDeliveries}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{t.transport.today}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-sidebar">
              {pendingMissions.slice(0, 5).map((m: any, idx) => (
                <div
                  key={idx}
                  className="p-3 border border-outline rounded-xl hover:border-orange-400/60 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-mono text-sm font-bold text-on-surface group-hover:text-orange-500 transition-colors">
                      {m.reference || `MSN-${m.id}`}
                    </span>
                    <span className="text-[11px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-medium">
                      {m.date_prevue
                        ? new Date(m.date_prevue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--:--'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-on-surface truncate">
                    {m.destination || t.transport.unspecifiedDestination}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {t.transport.client}: {m.client_id || t.transport.internalClient}
                  </p>
                </div>
              ))}
              {pendingMissions.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-6">{t.transport.noDeliveries}</p>
              )}
            </div>
            <div className="p-3 border-t border-outline">
              <button className="w-full text-center text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors py-1">
                {t.transport.viewAllSchedule}
              </button>
            </div>
          </div>

          {/* Active Missions Table */}
          <div className="lg:col-span-8 glass-card overflow-hidden flex flex-col" style={{ maxHeight: '400px' }}>
            <div className="erp-card-header flex items-center justify-between rounded-t-xl">
              <h3 className="text-sm font-bold text-on-surface">{t.transport.activeMissions}</h3>
              <input
                className="border border-outline rounded-lg px-2 py-1 text-xs w-28 sm:w-36 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-orange-400 transition-colors"
                placeholder={t.transport.filterById}
                type="text"
                value={filterValue}
                onChange={e => setFilterValue(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead className="sticky top-0 bg-surface-container-low border-b border-outline z-10">
                  <tr>
                    <th className="py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{t.transport.missionId}</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{t.transport.driver}</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hidden sm:table-cell">{t.transport.route}</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hidden md:table-cell">{t.transport.vehicle}</th>
                    <th className="py-2.5 px-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{t.common.status}</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-outline-variant/50">
                  {loading ? (
                    <tr><td colSpan={5} className="py-6 text-center text-on-surface-variant text-sm">{t.common.loading}</td></tr>
                  ) : filteredMissions.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-on-surface-variant text-sm">{t.transport.noMissions}</td></tr>
                  ) : filteredMissions.map((m: any, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-orange-500/5 transition-colors ${idx % 2 === 1 ? 'bg-surface-container-lowest/50' : ''}`}
                    >
                      <td className="py-2.5 px-4 font-mono text-sm font-bold text-on-surface">
                        {m.reference || `TRN-${m.id}`}
                      </td>
                      <td className="py-2.5 px-4 text-on-surface-variant">
                        {m.chauffeur_id ? `#${m.chauffeur_id}` : t.common.unassigned}
                      </td>
                      <td className="py-2.5 px-4 text-on-surface-variant truncate max-w-[140px] hidden sm:table-cell">
                        {m.origine || '?'} → {m.destination || '?'}
                      </td>
                      <td className="py-2.5 px-4 text-on-surface-variant hidden md:table-cell">
                        {m.camion_id ? `#${m.camion_id}` : 'N/A'}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={getStatusClass(m.statut)}>
                          {m.statut || t.common.unknown}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map View Placeholder */}
          <div className="lg:col-span-12 glass-card relative overflow-hidden" style={{ height: '260px' }}>
            {/* Decorative grid background — adapts to theme */}
            <div
              className="absolute inset-0 opacity-30 dark:opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--outline)) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            {/* Overlay label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-2">map</span>
              <span className="text-base font-bold text-on-surface-variant/60">{t.transport.liveMapView}</span>
              <span className="text-xs text-on-surface-variant/40 mt-1">{t.transport.trackingTrucks}</span>
            </div>
            {/* Truck blips */}
            <div className="absolute w-3 h-3 bg-orange-400 rounded-full top-[30%] left-[40%] shadow-[0_0_10px_rgba(251,146,60,0.7)] animate-pulse" />
            <div className="absolute w-3 h-3 bg-orange-400 rounded-full top-[60%] left-[20%] shadow-[0_0_10px_rgba(251,146,60,0.7)] animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-3 h-3 bg-blue-400 rounded-full top-[45%] left-[70%] shadow-[0_0_10px_rgba(96,165,250,0.7)] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute w-3 h-3 bg-orange-400 rounded-full top-[80%] left-[55%] shadow-[0_0_10px_rgba(251,146,60,0.7)] animate-pulse" style={{ animationDelay: '0.2s' }} />
            {/* Map controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
              <button className="bg-surface border border-outline p-2 rounded-lg shadow-sm hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">add</span>
              </button>
              <button className="bg-surface border border-outline p-2 rounded-lg shadow-sm hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">remove</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
