// src/app/(app)/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'
import { getRouteForRole } from '@/lib/role-routes'
import { magasinAPI, financeAPI, transportAPI } from '@/lib/api-client'

export default function GlobalDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  // States for dynamic data
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
          transportAPI.getKPIs().catch(() => ({ data: { activeVehicles: 0 } })),
          financeAPI.getKpis().catch(() => ({ data: { chiffre_affaires: 0 } })),
          magasinAPI.getStocks().catch(() => ({ data: [] }))
        ]);

        setStockValue(magasinKpis.data.totalStockValue || 0);
        setActiveVehicles(transportKpis.data.activeVehicles || 0);
        setTotalRevenue(financeKpis.data.chiffre_affaires || 0);
        setPendingMissions(transportKpis.data.activeMissions || 0);
        
        // Mocking dynamic alerts for now based on low stock
        const stocks = stocksRes.data || [];
        setAlerts(stocks.filter((s: any) => parseFloat(s.quantite_udb) < 10).map((s: any) => ({
          id: s.id || Math.random(),
          message: `Stock faible pour l'article ${s.article_id || 'inconnu'}`,
          type: 'warning'
        })));
        
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setDataLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [isRedirecting]);

  if (loading || isRedirecting) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-container-low text-on-surface">Redirection vers votre espace...</div>;
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .zebra-table tr:nth-child(even) {
          background-color: #F9FAFB;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dce2f3;
          border-radius: 10px;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface min-h-screen">
        {/* TopAppBar Shell */}
        

        {/* SideNavBar Shell */}
        

        {/* Main Content Area */}
        <main className="lg: pt-16 min-h-screen">
          <div className="p-lg max-w-max-width mx-auto">
            {/* Global Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
              <div>
                
                <h1 className="text-headline-lg font-headline-lg text-on-background">System Overview</h1>
              </div>
              <div className="flex items-center gap-sm">
                {dataLoading ? (
                  <span className="text-label-md font-label-md text-on-surface-variant">Chargement...</span>
                ) : (
                  <span className="text-label-md font-label-md text-green-600">Données à jour</span>
                )}
              </div>
            </div>

            {/* Bento Layout Main Dashboard */}
            <div className="grid grid-cols-12 gap-gutter animate-fade-in">
              {/* KPI CARDS (4 Modules) */}
              {/* Stock Value - Red (Magasin) */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-md">
                  <div className="p-xs bg-error/10 text-error rounded-lg">
                    <span className="material-symbols-outlined">warehouse</span>
                  </div>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Stock Value</p>
                  <h2 className="text-headline-md font-headline-md text-on-background">{stockValue.toLocaleString()} FCFA</h2>
                </div>
                <div className="mt-md border-t border-outline-variant pt-sm">
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-error">K-Magasin</span></p>
                </div>
              </div>

              {/* Pending Missions - Orange (Audit) */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-md">
                  <div className="p-xs bg-tertiary/10 text-tertiary rounded-lg">
                    <span className="material-symbols-outlined">assignment_late</span>
                  </div>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Pending Missions</p>
                  <h2 className="text-headline-md font-headline-md text-on-background">{pendingMissions}</h2>
                </div>
                <div className="mt-md border-t border-outline-variant pt-sm">
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-tertiary">K-Audit</span></p>
                </div>
              </div>

              {/* Total Revenue - Purple (Finance) */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-md">
                  <div className="p-xs bg-[#8E24AA]/10 text-[#8E24AA] rounded-lg">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Total Revenue</p>
                  <h2 className="text-headline-md font-headline-md text-on-background">{totalRevenue.toLocaleString()} FCFA</h2>
                </div>
                <div className="mt-md border-t border-outline-variant pt-sm">
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-[#8E24AA]">K-Finance</span></p>
                </div>
              </div>

              {/* Active Vehicles - Cyan (Transport) */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-md">
                  <div className="p-xs bg-[#00ACC1]/10 text-[#00ACC1] rounded-lg">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Active Vehicles</p>
                  <h2 className="text-headline-md font-headline-md text-on-background">{activeVehicles} Units</h2>
                </div>
                <div className="mt-md border-t border-outline-variant pt-sm">
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-[#00ACC1]">K-Transport</span></p>
                </div>
              </div>

              {/* Alerts Center */}
              <div className="col-span-12 lg:col-span-12">
                <div className="bg-white p-lg rounded-xl border border-outline-variant flex flex-col">
                  <div className="flex items-center justify-between mb-md">
                    <h3 className="text-title-lg font-title-lg text-on-background flex items-center gap-xs">
                      <span className="material-symbols-outlined text-error">warning</span>
                      Critical Alerts
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-sm custom-scrollbar p-sm">
                    {alerts.length === 0 ? (
                      <div className="p-sm bg-surface-container-highest border-l-4 border-outline rounded-r-lg">
                        <p className="text-body-sm font-body-sm text-on-surface text-center">Toutes les opérations sont normales. Aucune alerte critique pour le moment.</p>
                      </div>
                    ) : (
                      alerts.map((alert: any) => (
                        <div key={alert.id} className={`p-sm bg-${alert.type === 'error' ? 'error' : 'tertiary'}/10 border-l-4 border-${alert.type === 'error' ? 'error' : 'tertiary'} rounded-r-lg animate-slide-up`}>
                          <p className={`text-body-sm font-body-sm text-${alert.type === 'error' ? 'error' : 'tertiary'} font-medium`}>{alert.message}</p>
                        </div>
                      ))
                    )}
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
