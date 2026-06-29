// src/app/(app)/finance/gateway/page.tsx - K-Finance Gateway Monitor - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function KFinanceGatewayMonitor() {
  const [showToast, setShowToast] = useState(false)
  const [validating, setValidating] = useState(false)

  const handleBulkValidate = () => {
    setValidating(true)
    setTimeout(() => {
      setValidating(false)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 4000)
    }, 1500)
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-filled {
          font-variation-settings: 'FILL 1';
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dce2f3;
          border-radius: 10px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
        }
        .purple-accent {
          border-left: 4px solid #8B5CF6;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md overflow-hidden h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-2">
              <span className="text-title-lg font-title-lg font-bold text-primary">KAMLOG EM-ERP</span>
              <select className="hidden md:block bg-surface-container-high border border-outline-variant text-label-sm font-label-sm text-on-surface rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary ml-4 shadow-sm cursor-pointer hover:bg-surface-container-highest transition-colors">
                <option>🇨🇲 Agence de Douala (HQ)</option>
                <option>🇨🇮 Agence d'Abidjan</option>
                <option>🇨🇲 Agence de Kribi</option>
                <option>🇸🇳 Agence de Dakar</option>
              </select>
            </div>
            <div className="hidden md:flex gap-md ml-xl items-center">
              <a className="text-on-surface-variant hover:bg-surface-container-high px-xs py-xxs transition-colors text-label-md font-label-md" href="#">Alerts</a>
              <a className="text-on-surface-variant hover:bg-surface-container-high px-xs py-xxs transition-colors text-label-md font-label-md" href="#">MFA Status</a>
              <a className="text-primary border-b-2 border-primary pb-1 font-bold text-label-md font-label-md" href="#">Modules</a>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input 
                className="pl-10 pr-4 py-1.5 bg-surface-container-highest border-none rounded-lg text-body-md focus:ring-2 focus:ring-primary w-64 transition-all" 
                placeholder="T-Code Search..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-xs">
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">security</span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">apps</span>
              </button>
            </div>
            <img alt="User Profile Avatar" className="w-8 h-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdIrUZYGD7MxV0h8gyRyZ0qXpfutTKrDeyOPSzDvmQFs2qlDMQyQJPRUsrQ_OXmqcZ07xjwissbGHhXCru0i-22o3zKN5bHy335XuaGGO9-Y92iqbuoquJ2LZWUullca7KB-5y2k4BgvBWM3JlYAcCsmIGYlMWqZcLw_We0Pub0JhTszDsizhy6W-nsCc5Ihb2xT_NYK_nnePIJOMEH0VinSVuUZQ5TvAuDxVy7Gx_61rKnbIUROfXrJylVj5Auwjt-Pm4zn7az38"/>
          </div>
        </header>
        <div className="flex flex-1 pt-16 overflow-hidden">
          {/* SideNavBar */}
          <aside className="w-60 bg-surface-container border-r border-outline-variant flex flex-col pt-4 pb-md z-40">
            <div className="px-md mb-lg">
              <div className="flex items-center gap-sm mb-xs">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white icon-filled">payments</span>
                </div>
                <div>
                  <div className="text-headline-sm font-headline-sm font-black text-primary leading-tight">KAMLOG</div>
                  <div className="text-label-md font-label-md text-on-surface-variant">K-Finance Gateway</div>
                </div>
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-xxs">
              <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all text-label-md font-label-md" href="/transport/control">
                <span className="material-symbols-outlined">local_shipping</span>
                <span>Transport</span>
              </a>
              <a className="flex items-center gap-md px-md py-3 text-primary font-bold border-l-4 border-primary bg-surface-container-highest transition-all text-label-md font-label-md scale-[0.99]" href="/finance/overview">
                <span className="material-symbols-outlined icon-filled">payments</span>
                <span>Finance</span>
              </a>
              <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all text-label-md font-label-md" href="/parc/overview">
                <span className="material-symbols-outlined">inventory_2</span>
                <span>Parc</span>
              </a>
              <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all text-label-md font-label-md" href="/magasin/dashboard">
                <span className="material-symbols-outlined">warehouse</span>
                <span>Magasin</span>
              </a>
              <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all text-label-md font-label-md" href="/audit/dashboard/health">
                <span className="material-symbols-outlined">history_edu</span>
                <span>Audit</span>
              </a>
            </nav>
            <div className="mt-auto px-xxs pt-4 border-t border-outline-variant">
              <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all text-label-md font-label-md" href="/settings/system/audit-health">
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </a>
              <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all text-label-md font-label-md" href="/login">
                <span className="material-symbols-outlined text-error">logout</span>
                <span>Logout</span>
              </a>
            </div>
          </aside>
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto custom-scrollbar bg-surface p-md md:p-lg space-y-lg">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
              <div className="space-y-xxs">
                <nav className="flex text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                  <span>ERP CENTRAL</span>
                  <span className="mx-2">/</span>
                  <span>FINANCE</span>
                  <span className="mx-2">/</span>
                  <span className="text-primary">GATEWAY MONITOR</span>
                </nav>
                <h1 className="text-headline-lg font-headline-lg text-on-surface">Financial Integration Gateway</h1>
              </div>
              <div className="flex gap-xs">
                <button 
                  className="bg-primary text-white px-md py-2 rounded-lg font-label-md text-label-md flex items-center gap-xs hover:opacity-90 transition-opacity active:scale-[0.98]"
                  onClick={handleBulkValidate}
                  disabled={validating}
                >
                  {validating ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  )}
                  {validating ? 'Validating...' : 'Bulk Validate Transactions'}
                </button>
                <button className="bg-surface-container-highest text-on-surface px-md py-2 rounded-lg font-label-md text-label-md flex items-center gap-xs hover:bg-surface-dim transition-colors">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export logs
                </button>
              </div>
            </div>
            {/* Bento Grid Stats & Charts */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-md h-auto">
              {/* Main Status Chart */}
              <div className="md:col-span-4 lg:col-span-8 bg-white border border-outline-variant rounded-xl p-lg flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-lg">
                  <div>
                    <h2 className="text-title-md font-title-md text-on-surface">Revenue Projection by Module</h2>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">Live gateway processing throughput (FCFA)</p>
                  </div>
                  <div className="flex gap-xs">
                    <span className="flex items-center gap-xs text-label-sm font-label-sm"><span className="w-3 h-3 bg-primary rounded-full"></span>K-Parc</span>
                    <span className="flex items-center gap-xs text-label-sm font-label-sm"><span className="w-3 h-3 bg-secondary-fixed-dim rounded-full"></span>K-Transport</span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-xs px-md">
                  {/* Simplified bar chart representation */}
                  <div className="group relative flex-1 bg-surface-container-low rounded-t-lg transition-all hover:bg-primary-container h-[40%]"></div>
                  <div className="group relative flex-1 bg-primary rounded-t-lg transition-all hover:bg-primary/80 h-[65%]"></div>
                  <div className="group relative flex-1 bg-surface-container-low rounded-t-lg transition-all hover:bg-primary-container h-[20%]"></div>
                  <div className="group relative flex-1 bg-primary rounded-t-lg transition-all hover:bg-primary/80 h-[90%]"></div>
                  <div className="group relative flex-1 bg-surface-container-low rounded-t-lg transition-all hover:bg-primary-container h-[55%]"></div>
                  <div className="group relative flex-1 bg-primary rounded-t-lg transition-all hover:bg-primary/80 h-[75%]"></div>
                  <div className="group relative flex-1 bg-surface-container-low rounded-t-lg transition-all hover:bg-primary-container h-[45%]"></div>
                  <div className="group relative flex-1 bg-primary rounded-t-lg transition-all hover:bg-primary/80 h-[85%]"></div>
                  <div className="group relative flex-1 bg-surface-container-low rounded-t-lg transition-all hover:bg-primary-container h-[35%]"></div>
                  <div className="group relative flex-1 bg-primary rounded-t-lg transition-all hover:bg-primary/80 h-[60%]"></div>
                </div>
                <div className="grid grid-cols-5 mt-md border-t border-outline-variant pt-md">
                  <div className="text-center"><span className="block text-title-md font-bold text-primary">FCFA42k</span><span className="text-label-sm text-on-surface-variant">Mon</span></div>
                  <div className="text-center"><span className="block text-title-md font-bold text-primary">FCFA68k</span><span className="text-label-sm text-on-surface-variant">Tue</span></div>
                  <div className="text-center"><span className="block text-title-md font-bold text-primary">FCFA39k</span><span className="text-label-sm text-on-surface-variant">Wed</span></div>
                  <div className="text-center"><span className="block text-title-md font-bold text-primary">FCFA92k</span><span className="text-label-sm text-on-surface-variant">Thu</span></div>
                  <div className="text-center"><span className="block text-title-md font-bold text-primary">FCFA54k</span><span className="text-label-sm text-on-surface-variant">Fri</span></div>
                </div>
              </div>
              {/* Circular Gateway Status */}
              <div className="md:col-span-4 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center space-y-md">
                <h2 className="text-title-md font-title-md text-on-surface w-full text-left">Gateway Health</h2>
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-primary" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeDasharray="282.7" strokeDashoffset="30" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-md font-headline-md text-on-surface">94.2%</span>
                    <span className="text-label-md text-primary font-bold">OPTIMIZED</span>
                  </div>
                </div>
                <div className="w-full space-y-xs pt-xs">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Successful</span>
                    <span className="font-bold">1,482</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Pending</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Failed</span>
                    <span className="font-bold text-error">12</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Transaction Table Section */}
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden flex flex-col">
              <div className="p-md flex flex-col md:flex-row justify-between items-center gap-md border-b border-outline-variant">
                <div className="flex items-center gap-md">
                  <h2 className="text-title-md font-title-md text-on-surface">Recent Inter-Module Transactions</h2>
                  <div className="flex gap-xs">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">K-TRANSPORT</span>
                    <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[10px] font-bold">K-PARC</span>
                  </div>
                </div>
                <div className="flex items-center gap-xs w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-md py-1.5 rounded-lg border border-outline-variant text-body-md hover:bg-surface-container-low transition-colors">Filters</button>
                  <button className="flex-1 md:flex-none px-md py-1.5 rounded-lg border border-outline-variant text-body-md hover:bg-surface-container-low transition-colors">Date Range</button>
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low sticky top-0 z-10">
                    <tr>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase w-12">
                        <input className="rounded border-outline text-primary focus:ring-primary" type="checkbox"/>
                      </th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Type</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Source ID</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Target ID</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Amount</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Status</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase">Timestamp</th>
                      <th className="px-md py-3 border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {/* Row 1 */}
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-3"><input className="transaction-check rounded border-outline text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-md py-3">
                        <span className="text-body-sm font-bold font-mono">COMMANDE_FACTURE</span>
                      </td>
                      <td className="px-md py-3 text-body-md font-data-tabular">TR-9921-X</td>
                      <td className="px-md py-3 text-body-md font-data-tabular">FI-2026-001</td>
                      <td className="px-md py-3 font-bold text-on-surface">FCFA12,450.00</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-label-sm font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                          TRAITÉ
                        </span>
                      </td>
                      <td className="px-md py-3 text-label-md text-on-surface-variant">Today, 10:42 AM</td>
                      <td className="px-md py-3 text-right">
                        <button className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
                      <td className="px-md py-3"><input className="transaction-check rounded border-outline text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-md py-3">
                        <span className="text-body-sm font-bold font-mono">MISSION_FACTURE</span>
                      </td>
                      <td className="px-md py-3 text-body-md font-data-tabular">MS-4412-K</td>
                      <td className="px-md py-3 text-body-md font-data-tabular">FI-2026-002</td>
                      <td className="px-md py-3 font-bold text-on-surface">FCFA3,890.15</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error-container/40 text-on-error-container text-label-sm font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error mr-1.5"></span>
                          ÉCHOUÉ
                        </span>
                      </td>
                      <td className="px-md py-3 text-label-md text-on-surface-variant">Today, 09:15 AM</td>
                      <td className="px-md py-3 text-right">
                        <button className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">refresh</span></button>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-3"><input className="transaction-check rounded border-outline text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-md py-3">
                        <span className="text-body-sm font-bold font-mono">COMMANDE_FACTURE</span>
                      </td>
                      <td className="px-md py-3 text-body-md font-data-tabular">TR-9945-Z</td>
                      <td className="px-md py-3 text-body-md font-data-tabular">FI-2026-003</td>
                      <td className="px-md py-3 font-bold text-on-surface">FCFA45,000.00</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline mr-1.5"></span>
                          EN ATTENTE
                        </span>
                      </td>
                      <td className="px-md py-3 text-label-md text-on-surface-variant">Today, 08:30 AM</td>
                      <td className="px-md py-3 text-right">
                        <button className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      </td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
                      <td className="px-md py-3"><input className="transaction-check rounded border-outline text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-md py-3">
                        <span className="text-body-sm font-bold font-mono">MISSION_FACTURE</span>
                      </td>
                      <td className="px-md py-3 text-body-md font-data-tabular">MS-4415-L</td>
                      <td className="px-md py-3 text-body-md font-data-tabular">FI-2026-004</td>
                      <td className="px-md py-3 font-bold text-on-surface">FCFA1,120.00</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-label-sm font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                          TRAITÉ
                        </span>
                      </td>
                      <td className="px-md py-3 text-label-md text-on-surface-variant">Yesterday, 05:55 PM</td>
                      <td className="px-md py-3 text-right">
                        <button className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      </td>
                    </tr>
                    {/* Row 5 */}
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-3"><input className="transaction-check rounded border-outline text-primary focus:ring-primary" type="checkbox"/></td>
                      <td className="px-md py-3">
                        <span className="text-body-sm font-bold font-mono">COMMANDE_FACTURE</span>
                      </td>
                      <td className="px-md py-3 text-body-md font-data-tabular">TR-9948-M</td>
                      <td className="px-md py-3 text-body-md font-data-tabular">FI-2026-005</td>
                      <td className="px-md py-3 font-bold text-on-surface">FCFA28,500.00</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-label-sm font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                          TRAITÉ
                        </span>
                      </td>
                      <td className="px-md py-3 text-label-md text-on-surface-variant">Yesterday, 04:12 PM</td>
                      <td className="px-md py-3 text-right">
                        <button className="p-1 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-md bg-surface-container-low flex justify-between items-center text-label-md border-t border-outline-variant">
                <span className="text-on-surface-variant">Showing 1-5 of 152 transactions</span>
                <div className="flex gap-xs">
                  <button className="p-1.5 rounded hover:bg-surface-dim transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                  <button className="px-2 rounded bg-primary text-white font-bold">1</button>
                  <button className="px-2 rounded hover:bg-surface-dim transition-colors">2</button>
                  <button className="px-2 rounded hover:bg-surface-dim transition-colors">3</button>
                  <button className="p-1.5 rounded hover:bg-surface-dim transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                </div>
              </div>
            </div>
            {/* Operational Pane */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="bg-white border border-outline-variant rounded-xl p-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                <h3 className="text-title-md font-title-md text-on-surface mb-md">System Log Insight</h3>
                <div className="space-y-sm">
                  <div className="flex gap-md text-body-sm font-mono p-xs bg-surface-container rounded">
                    <span className="text-primary font-bold">[11:04:22]</span>
                    <span className="text-on-surface">GATEWAY: COMMANDE_FACTURE validated (ID: TR-9921-X)</span>
                  </div>
                  <div className="flex gap-md text-body-sm font-mono p-xs">
                    <span className="text-tertiary font-bold">[10:58:10]</span>
                    <span className="text-on-surface">SECURITY: Authentication handshake from K-PARC confirmed.</span>
                  </div>
                  <div className="flex gap-md text-body-sm font-mono p-xs bg-surface-container rounded">
                    <span className="text-error font-bold">[10:45:00]</span>
                    <span className="text-on-surface">ERROR: Mission FI-2026-002 timeout - Retrying in 300s.</span>
                  </div>
                </div>
              </div>
              {/* Financial Summary Card */}
              <div className="bg-primary text-white rounded-xl p-lg flex flex-col justify-between shadow-lg shadow-primary/20">
                <div>
                  <div className="flex justify-between items-start mb-lg">
                    <span className="text-label-md font-label-md opacity-80 uppercase tracking-widest">Gateway Cashflow (24h)</span>
                    <span className="material-symbols-outlined opacity-60">trending_up</span>
                  </div>
                  <div className="text-headline-lg font-headline-lg leading-none">FCFA 482,904.55</div>
                  <div className="mt-xs text-label-sm flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    <span>+12.4% vs previous period</span>
                  </div>
                </div>
                <div className="pt-lg flex gap-md">
                  <div className="flex-1 p-md bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-label-sm opacity-70">Tax Accrual</div>
                    <div className="text-title-md font-bold">FCFA 91.5k</div>
                  </div>
                  <div className="flex-1 p-md bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-label-sm opacity-70">Net Transfer</div>
                    <div className="text-title-md font-bold">FCFA 391.4k</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* Micro-interaction: Toast */}
        <div className={`fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-lg py-md rounded-xl shadow-2xl transition-all duration-300 flex items-center gap-md z-[100] ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
          <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
          <div>
            <div className="font-bold text-label-md">Operation Successful</div>
            <div className="text-body-sm opacity-80">14 pending transactions have been processed.</div>
          </div>
        </div>
      </div>
    </>
  )
}
