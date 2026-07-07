// src/app/(app)/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'
import { getRouteForRole } from '@/lib/role-routes'
import { magasinAPI, financeAPI, transportAPI } from '@/lib/api-client'
import { useI18n } from '@/hooks/useI18n'

export default function GlobalDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useI18n();
  const [isRedirecting, setIsRedirecting] = useState(true);

  const [stockValue, setStockValue] = useState<number>(0);
  const [activeVehicles, setActiveVehicles] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [pendingMissions, setPendingMissions] = useState<number>(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  // Redirection
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const targetRoute = getRouteForRole(user.roles);
        if (targetRoute === '/dashboard' || targetRoute === '/dashboard/global') {
          setIsRedirecting(false);
        } else {
          router.push(targetRoute);
        }
      }
    }
  }, [user, loading, router]);

  // Fetch Data
  useEffect(() => {
    if (isRedirecting) return;
    async function fetchDashboardData() {
      try {
        const [magasinKpis, transportKpis, financeKpis, stocksRes] = await Promise.all([
          magasinAPI.getKpis().catch(() => ({ data: { totalStockValue: 0 } })),
          transportAPI.getKpis().catch(() => ({ data: { activeVehicles: 0 } })),
          financeAPI.getKpis().catch(() => ({ data: { chiffre_affaires: 0 } })),
          magasinAPI.getStocks().catch(() => ({ data: [] }))
        ]);
        setStockValue(magasinKpis.data.totalStockValue || 0);
        setActiveVehicles(transportKpis.data.activeVehicles || 0);
        setTotalRevenue(financeKpis.data.chiffre_affaires || 0);
        setPendingMissions(transportKpis.data.activeMissions || 0);
        const stocks = stocksRes.data || [];
        setAlerts(stocks.filter((s: any) => parseFloat(s.quantite_udb) < 10).map((s: any) => ({
          id: s.id || Math.random(),
          message: `${t.magasin.lowStock} — ${s.article_id || t.common.unknown}`,
          type: 'warning'
        })));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setDataLoading(false);
      }
    }
    fetchDashboardData();
  }, [isRedirecting, t]);

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low text-on-surface-variant text-sm">
        {t.common.redirecting}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">

      <main className="p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">{t.dashboard.systemOverview}</h1>
            <p className="text-sm text-on-surface-variant mt-1">{t.dashboard.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {dataLoading ? (
              <span className="text-xs text-on-surface-variant">{t.common.loadingData}</span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.common.dataUpToDate}
              </span>
            )}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {/* Stock Value — Magasin */}
          <div className="kpi-card">
            <div className="flex justify-between items-start mb-4">
              <div className="kpi-icon-wrap bg-error/10">
                <span className="material-symbols-outlined text-error text-[22px]">warehouse</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t.dashboard.stockValue}</p>
              <h2 className="text-2xl font-black text-on-surface tabular-nums">{stockValue.toLocaleString()} <span className="text-sm font-semibold">FCFA</span></h2>
            </div>
            <div className="mt-4 border-t border-outline pt-3">
              <p className="text-[11px] text-on-surface-variant">Module: <span className="font-bold text-error">{t.dashboard.moduleKMagasin}</span></p>
            </div>
          </div>

          {/* Pending Missions — Audit */}
          <div className="kpi-card">
            <div className="flex justify-between items-start mb-4">
              <div className="kpi-icon-wrap bg-tertiary/10">
                <span className="material-symbols-outlined text-tertiary text-[22px]">assignment_late</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t.dashboard.pendingMissions}</p>
              <h2 className="text-2xl font-black text-on-surface tabular-nums">{pendingMissions}</h2>
            </div>
            <div className="mt-4 border-t border-outline pt-3">
              <p className="text-[11px] text-on-surface-variant">Module: <span className="font-bold text-tertiary">{t.dashboard.moduleKAudit}</span></p>
            </div>
          </div>

          {/* Total Revenue — Finance */}
          <div className="kpi-card">
            <div className="flex justify-between items-start mb-4">
              <div className="kpi-icon-wrap bg-violet-500/10">
                <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[22px]">payments</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t.dashboard.totalRevenue}</p>
              <h2 className="text-2xl font-black text-on-surface tabular-nums">{totalRevenue.toLocaleString()} <span className="text-sm font-semibold">FCFA</span></h2>
            </div>
            <div className="mt-4 border-t border-outline pt-3">
              <p className="text-[11px] text-on-surface-variant">Module: <span className="font-bold text-violet-600 dark:text-violet-400">{t.dashboard.moduleKFinance}</span></p>
            </div>
          </div>

          {/* Active Vehicles — Transport */}
          <div className="kpi-card">
            <div className="flex justify-between items-start mb-4">
              <div className="kpi-icon-wrap bg-cyan-500/10">
                <span className="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-[22px]">local_shipping</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t.dashboard.activeVehicles}</p>
              <h2 className="text-2xl font-black text-on-surface tabular-nums">{activeVehicles} <span className="text-sm font-semibold">units</span></h2>
            </div>
            <div className="mt-4 border-t border-outline pt-3">
              <p className="text-[11px] text-on-surface-variant">Module: <span className="font-bold text-cyan-600 dark:text-cyan-400">{t.dashboard.moduleKTransport}</span></p>
            </div>
          </div>
        </div>

        {/* ── Critical Alerts ── */}
        <div className="erp-card">
          <div className="erp-card-header flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              {t.dashboard.criticalAlerts}
            </h3>
            {alerts.length > 0 && (
              <span className="rounded-full bg-error/10 text-error text-[11px] font-bold px-2 py-0.5">{alerts.length}</span>
            )}
          </div>
          <div className="p-4 space-y-2 max-h-60 overflow-y-auto scrollbar-sidebar">
            {alerts.length === 0 ? (
              <div className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-xl">
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {t.dashboard.alertsNormal}
                </p>
              </div>
            ) : (
              alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border-l-4 ${
                    alert.type === 'error'
                      ? 'bg-error/5 border-error'
                      : 'bg-tertiary/5 border-tertiary'
                  }`}
                >
                  <p className={`text-sm font-medium ${alert.type === 'error' ? 'text-error' : 'text-tertiary'}`}>
                    {alert.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
