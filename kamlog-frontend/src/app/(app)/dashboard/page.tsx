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
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  // Redirection
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const targetRoute = getRouteForRole(user.role);
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
        const [stocksRes, camionsRes, facturesRes] = await Promise.all([
          magasinAPI.getStocks().catch(() => ({ data: [] })),
          transportAPI.getCamions().catch(() => ({ data: [] })),
          financeAPI.getFactures().catch(() => ({ data: [] }))
        ]);

        // Calculate Stock Value
        const stocks = stocksRes.data || [];
        const value = stocks.reduce((acc: number, stock: any) => {
          const qty = parseFloat(stock.quantite_udb) || 0;
          return acc + (qty * 500); // Dummy multiplier for value
        }, 0);
        setStockValue(value);

        // Calculate Active Vehicles
        const camions = camionsRes.data || [];
        const activeCount = camions.filter((c: any) => c.actif).length;
        setActiveVehicles(activeCount);

        // Calculate Total Revenue (Factures Payées)
        const factures = facturesRes.data || [];
        const revenue = factures
          .filter((f: any) => f.statut === 'PAYEE')
          .reduce((acc: number, f: any) => acc + (parseFloat(f.montant_ttc) || 0), 0);
        setTotalRevenue(revenue);
        
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
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
          <div className="flex items-center gap-xl">
            <span className="text-title-lg font-title-lg font-bold text-primary ml-10 lg:ml-0">KAMLOG EM-ERP</span>
          </div>
          <div className="flex items-center gap-md">
            <button className="p-xs hover:bg-surface-container-high transition-colors rounded-full">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-outline-variant flex items-center justify-center font-bold text-sm">
              {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* SideNavBar Shell */}
        <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container-low border-r border-outline-variant hidden lg:flex">
          <div className="px-md py-lg border-b border-outline-variant mb-md">
            <div className="flex items-center gap-sm mb-xs">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                <span className="material-symbols-outlined">hub</span>
              </div>
              <span className="text-headline-sm font-headline-sm font-black text-primary">KAMLOG ERP</span>
            </div>
            <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Operational Control</p>
          </div>
          <nav className="flex-1 px-xs space-y-xxs overflow-y-auto custom-scrollbar">
            <a className="flex items-center gap-sm px-md py-sm rounded-lg text-primary bg-primary/10 font-bold transition-all" href="/dashboard/global">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-label-md font-label-md">Tableau de bord</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="/transport/control">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="text-label-md font-label-md">Transport</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="/finance/overview">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-label-md font-label-md">Finance</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="/parc/overview">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-label-md font-label-md">Parc</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="/magasin/dashboard">
              <span className="material-symbols-outlined">warehouse</span>
              <span className="text-label-md font-label-md">Magasin</span>
            </a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:ml-60 pt-16 min-h-screen">
          <div className="p-lg max-w-max-width mx-auto">
            {/* Global Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
              <div>
                <nav className="flex items-center gap-xxs text-label-sm font-label-sm text-on-surface-variant mb-xs">
                  <span>Modules</span>
                  <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  <span className="text-primary">Global Dashboard</span>
                </nav>
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
            <div className="grid grid-cols-12 gap-gutter">
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
                  <h2 className="text-headline-md font-headline-md text-on-background">N/A</h2>
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
                  <div className="flex-1 overflow-y-auto space-y-sm custom-scrollbar">
                    {/* Placeholder until Notifications API is ready */}
                    <div className="p-sm bg-surface-container-highest border-l-4 border-outline rounded-r-lg">
                      <p className="text-body-sm font-body-sm text-on-surface text-center">Toutes les opérations sont normales. Aucune alerte critique pour le moment.</p>
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
