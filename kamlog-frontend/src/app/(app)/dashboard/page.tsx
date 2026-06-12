// src/app/(app)/dashboard/page.tsx - Global Dashboard ERP Design - Fidèle au HTML original
'use client'

export default function GlobalDashboard() {
  return (
    <div className="bg-surface-container-low text-on-surface min-h-screen">
      {/* TopAppBar Shell */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
        <div className="flex items-center gap-xl">
          <span className="text-title-lg font-title-lg font-bold text-primary">KAMLOG EM-ERP</span>
          <nav className="hidden md:flex items-center gap-md">
            <a className="text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors px-sm py-xs" href="#">Alerts</a>
            <a className="text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors px-sm py-xs" href="#">MFA Status</a>
            <a className="text-label-md font-label-md text-primary font-bold border-b-2 border-primary pb-1" href="#">Modules</a>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-xs hover:bg-surface-container-high transition-colors rounded-full">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">notifications</span>
          </button>
          <button className="p-xs hover:bg-surface-container-high transition-colors rounded-full">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">verified_user</span>
          </button>
          <button className="p-xs hover:bg-surface-container-high transition-colors rounded-full">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">apps</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-outline-variant">
            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container-low border-r border-outline-variant">
        <div className="px-md py-lg border-b border-outline-variant mb-md">
          <div className="flex items-center gap-sm mb-xs">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <span className="text-headline-sm font-headline-sm font-black text-primary">KAMLOG ERP</span>
          </div>
          <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Operational Control</p>
        </div>
        <nav className="flex-1 px-xs space-y-xxs overflow-y-auto">
          <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            <span className="text-label-md font-label-md">Transport</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]">payments</span>
            <span className="text-label-md font-label-md">Finance</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span className="text-label-md font-label-md">Parc</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]">warehouse</span>
            <span className="text-label-md font-label-md">Magasin</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]">assignment_late</span>
            <span className="text-label-md font-label-md">Audit</span>
          </a>
        </nav>
        <div className="px-xs pt-md border-t border-outline-variant space-y-xxs">
          <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-label-md font-label-md">Settings</span>
          </a>
          <a className="flex items-center gap-sm px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all text-error" href="#">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-label-md font-label-md">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-60 pt-16 min-h-screen">
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
              <span className="text-label-md font-label-md text-on-surface-variant">Last Update: 14:32:01</span>
              <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-title-md text-title-md flex items-center gap-xs shadow-sm hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Force Sync
              </button>
            </div>
          </div>

          {/* Bento Layout Main Dashboard */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* KPI CARDS (4 Modules) */}
            {/* Stock Value - Red (Magasin) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <div className="p-xs bg-error/10 text-error rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">warehouse</span>
                </div>
                <span className="text-label-sm font-label-sm px-xs py-1 bg-error/10 text-error rounded">+2.4%</span>
              </div>
              <div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Stock Value</p>
                <h2 className="text-headline-md font-headline-md text-on-background">$14,204,500</h2>
              </div>
              <div className="mt-md border-t border-outline-variant pt-sm">
                <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-error">K-Magasin</span></p>
              </div>
            </div>

            {/* Pending Missions - Orange (Audit) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <div className="p-xs bg-tertiary/10 text-tertiary rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">assignment_late</span>
                </div>
                <span className="text-label-sm font-label-sm px-xs py-1 bg-tertiary/10 text-tertiary rounded">Urgent</span>
              </div>
              <div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Pending Missions</p>
                <h2 className="text-headline-md font-headline-md text-on-background">42 Active</h2>
              </div>
              <div className="mt-md border-t border-outline-variant pt-sm">
                <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-tertiary">K-Audit</span></p>
              </div>
            </div>

            {/* Total Revenue - Purple (Finance) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <div className="p-xs bg-[#8E24AA]/10 text-[#8E24AA] rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <span className="text-label-sm font-label-sm px-xs py-1 bg-[#8E24AA]/10 text-[#8E24AA] rounded">On Target</span>
              </div>
              <div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Total Revenue</p>
                <h2 className="text-headline-md font-headline-md text-on-background">$2.8M <span className="text-body-sm font-body-sm text-on-surface-variant">MTD</span></h2>
              </div>
              <div className="mt-md border-t border-outline-variant pt-sm">
                <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-[#8E24AA]">K-Finance</span></p>
              </div>
            </div>

            {/* Active Vehicles - Cyan (Transport) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white p-lg rounded-xl border border-outline-variant flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-md">
                <div className="p-xs bg-[#00ACC1]/10 text-[#00ACC1] rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <span className="text-label-sm font-label-sm px-xs py-1 bg-[#00ACC1]/10 text-[#00ACC1] rounded">88% Util.</span>
              </div>
              <div>
                <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-xxs">Active Vehicles</p>
                <h2 className="text-headline-md font-headline-md text-on-background">156 Units</h2>
              </div>
              <div className="mt-md border-t border-outline-variant pt-sm">
                <p className="text-label-sm font-label-sm text-on-surface-variant">Module: <span className="font-bold text-[#00ACC1]">K-Transport</span></p>
              </div>
            </div>

            {/* T-Code Quick Launcher (Central) */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white p-lg rounded-xl border border-outline-variant h-full">
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="text-title-lg font-title-lg text-on-background flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
                    T-Code Quick Launcher
                  </h3>
                  <span className="text-label-md font-label-md text-on-surface-variant">F1 for command help</span>
                </div>
                <div className="relative mb-xl">
                  <input 
                    className="w-full h-14 bg-surface-container-low border border-outline-variant rounded-lg px-xl text-body-lg font-body-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                    placeholder="Enter Transaction Code (e.g., KFIN_01, KTRN_EXPL)..." 
                    type="text"
                  />
                  <div className="absolute left-md top-1/2 -translate-y-1/2">
                    <span className="material-symbols-outlined text-outline text-[20px]">search</span>
                  </div>
                  <div className="absolute right-md top-1/2 -translate-y-1/2">
                    <kbd className="px-xs py-xxs bg-surface-container-highest border border-outline-variant rounded text-label-sm font-label-sm">ENTER</kbd>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
                  <button className="flex flex-col items-center gap-xs p-md rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container transition-all group">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary text-[24px]">inventory</span>
                    <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-primary">KMAG_INV</span>
                  </button>
                  <button className="flex flex-col items-center gap-xs p-md rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container transition-all group">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary text-[24px]">account_balance</span>
                    <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-primary">KFIN_TAX</span>
                  </button>
                  <button className="flex flex-col items-center gap-xs p-md rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container transition-all group">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary text-[24px]">route</span>
                    <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-primary">KTRN_RTE</span>
                  </button>
                  <button className="flex flex-col items-center gap-xs p-md rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container transition-all group">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary text-[24px]">verified_user</span>
                    <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-primary">KAUD_LOG</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts Center (Right) */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white p-lg rounded-xl border border-outline-variant flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-md">
                  <h3 className="text-title-lg font-title-lg text-on-background flex items-center gap-xs">
                    <span className="material-symbols-outlined text-error text-[20px]">warning</span>
                    Critical Alerts
                  </h3>
                  <a className="text-label-sm font-label-sm text-primary font-bold hover:underline" href="#">View All</a>
                </div>
                <div className="flex-1 overflow-y-auto space-y-sm pr-xs">
                  {/* Alert 1 */}
                  <div className="p-sm bg-error-container/20 border-l-4 border-error rounded-r-lg">
                    <div className="flex justify-between items-start mb-xxs">
                      <span className="text-label-sm font-label-sm font-bold text-on-error-container uppercase">System Critical</span>
                      <span className="text-[10px] text-on-surface-variant">2m ago</span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface">Vehicle ID TRK-902 reported telematics failure in Sector 4.</p>
                  </div>
                  {/* Alert 2 */}
                  <div className="p-sm bg-tertiary-fixed/30 border-l-4 border-tertiary-container rounded-r-lg">
                    <div className="flex justify-between items-start mb-xxs">
                      <span className="text-label-sm font-label-sm font-bold text-on-tertiary-container uppercase">Mission Pending</span>
                      <span className="text-[10px] text-on-surface-variant">15m ago</span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface">Audit mission #4412 is 48 hours overdue for final sign-off.</p>
                  </div>
                  {/* Alert 3 */}
                  <div className="p-sm bg-surface-container-highest border-l-4 border-outline rounded-r-lg">
                    <div className="flex justify-between items-start mb-xxs">
                      <span className="text-label-sm font-label-sm font-bold text-on-surface uppercase">MFA Update</span>
                      <span className="text-[10px] text-on-surface-variant">1h ago</span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface">New security protocol applied to Finance Module access points.</p>
                  </div>
                  {/* Alert 4 */}
                  <div className="p-sm bg-error-container/20 border-l-4 border-error rounded-r-lg">
                    <div className="flex justify-between items-start mb-xxs">
                      <span className="text-label-sm font-label-sm font-bold text-on-error-container uppercase">Low Stock</span>
                      <span className="text-[10px] text-on-surface-variant">3h ago</span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface">Hazardous container gaskets (Item #22) below safety threshold.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity / Logistics Stream (Bottom Full Width) */}
            <div className="col-span-12">
              <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
                  <h3 className="text-title-lg font-title-lg text-on-background">Live Operations Stream</h3>
                  <div className="flex gap-xs">
                    <span className="flex items-center gap-xxs px-sm py-xs bg-surface-container rounded text-label-md font-label-md">
                      <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse"></span>
                      Live Feed
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-label-md font-label-md text-on-surface-variant border-b border-outline-variant">
                      <tr>
                        <th className="px-lg py-sm font-medium">Timestamp</th>
                        <th className="px-lg py-sm font-medium">Module</th>
                        <th className="px-lg py-sm font-medium">Operation</th>
                        <th className="px-lg py-sm font-medium">Operator</th>
                        <th className="px-lg py-sm font-medium">Status</th>
                        <th className="px-lg py-sm font-medium text-right">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="text-body-sm font-body-sm text-on-surface">
                      <tr className="hover:bg-surface-container-low">
                        <td className="px-lg py-md font-data-tabular">14:30:44</td>
                        <td className="px-lg py-md"><span className="px-xs py-xxs bg-[#00ACC1]/10 text-[#00ACC1] rounded text-label-sm">K-Transport</span></td>
                        <td className="px-lg py-md">Gate Entry Validation</td>
                        <td className="px-lg py-md flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-outline-variant overflow-hidden flex items-center justify-center text-xs font-bold text-primary">JC</div>
                          J. Chen
                        </td>
                        <td className="px-lg py-md">
                          <span className="inline-flex items-center gap-xs text-secondary font-bold">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Completed
                          </span>
                        </td>
                        <td className="px-lg py-md text-right font-data-tabular text-on-surface-variant">#G-40912</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low">
                        <td className="px-lg py-md font-data-tabular">14:28:12</td>
                        <td className="px-lg py-md"><span className="px-xs py-xxs bg-[#8E24AA]/10 text-[#8E24AA] rounded text-label-sm">K-Finance</span></td>
                        <td className="px-lg py-md">Invoice Generation</td>
                        <td className="px-lg py-md flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-outline-variant overflow-hidden flex items-center justify-center text-xs font-bold text-primary">SM</div>
                          S. Miller
                        </td>
                        <td className="px-lg py-md">
                          <span className="inline-flex items-center gap-xs text-secondary font-bold">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Verified
                          </span>
                        </td>
                        <td className="px-lg py-md text-right font-data-tabular text-on-surface-variant">#INV-8822</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low">
                        <td className="px-lg py-md font-data-tabular">14:25:01</td>
                        <td className="px-lg py-md"><span className="px-xs py-xxs bg-error/10 text-error rounded text-label-sm">K-Magasin</span></td>
                        <td className="px-lg py-md">Inventory Adjustment</td>
                        <td className="px-lg py-md flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-outline-variant overflow-hidden flex items-center justify-center text-xs font-bold text-primary">AP</div>
                          A. Petrov
                        </td>
                        <td className="px-lg py-md">
                          <span className="inline-flex items-center gap-xs text-tertiary font-bold">
                            <span className="material-symbols-outlined text-[14px]">pending</span>
                            Awaiting Sign-off
                          </span>
                        </td>
                        <td className="px-lg py-md text-right font-data-tabular text-on-surface-variant">#ADJ-004</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Visual Polish: Persistent Floating Module Status (Bottom Left) */}
      <div className="fixed bottom-lg left-lg z-50 flex flex-col gap-xs">
        <div className="bg-white px-md py-xs rounded-full border border-outline-variant shadow-xl flex items-center gap-sm">
          <div className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></div>
          <span className="text-label-md font-label-md text-on-surface-variant">System Connectivity: 99.9%</span>
        </div>
      </div>
    </div>
  )
}
