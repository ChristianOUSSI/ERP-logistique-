// src/app/(app)/transport/dispatch/page.tsx - K-Transport Dispatch Control - Fidèle 100% au HTML original
'use client'

export default function TransportDispatchPage() {
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
        {/* TopNavBar */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
          <div className="flex items-center gap-xl">
            <span className="text-title-lg font-title-lg font-bold text-primary">KAMLOG EM-ERP</span>
            <nav className="hidden md:flex gap-md">
              <a className="text-on-surface-variant hover:bg-surface-container-high transition-colors px-xs py-1 text-label-md font-label-md" href="#">Alerts</a>
              <a className="text-on-surface-variant hover:bg-surface-container-high transition-colors px-xs py-1 text-label-md font-label-md" href="#">MFA Status</a>
              <a className="text-primary border-b-2 border-primary pb-1 font-bold text-label-md font-label-md" href="#">Modules</a>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full">security</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded-full">apps</button>
            <img alt="User Profile Avatar" className="w-8 h-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA47c17Ec7rXp6CysyfuF14CCt-CyFivRD_ZcrnsSbE1SrAxqpKLxTszGzjg7IANwcGhw7Bbfmifnz0rDUSgyVWoZXCvW-NyAGCLaSfUtOFaPOTcxDJTWI_HYwGEP4iAKiitnm7dMY1O9wW9dN-YtC-oY8xKHb17b8TED6oJ2Vh5Nsjc9eOoId-zNaEd-hS8D0zd_FZqQecSVnaRE2S434faVlAihsIPqvNQTB29zYpaykqyAPUagNmZ0roYtH7PVEEh2kUI6k6MCA"/>
          </div>
        </header>

        {/* SideNavBar */}
        <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container border-r border-outline-variant">
          <div className="p-md border-b border-outline-variant mb-xs">
            <div className="flex items-center gap-xs">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">K</div>
              <div>
                <div className="text-title-md font-title-md font-bold text-primary">KAMLOG ERP</div>
                <div className="text-label-sm font-label-sm text-on-surface-variant">Operational Control</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-xs">
            {/* Active: Transport */}
            <a className="flex items-center gap-md px-md py-sm text-primary font-bold border-l-4 border-primary bg-surface-container-highest transition-all duration-150 scale-[0.99]" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>local_shipping</span>
              <span className="text-label-md font-label-md">Transport</span>
            </a>
            <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-label-md font-label-md">Finance</span>
            </a>
            <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-label-md font-label-md">Parc</span>
            </a>
            <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">warehouse</span>
              <span className="text-label-md font-label-md">Magasin</span>
            </a>
            <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">history_edu</span>
              <span className="text-label-md font-label-md">Audit</span>
            </a>
          </nav>
          <div className="px-md mb-md">
            <button className="w-full bg-primary text-white py-xs text-label-md font-label-md rounded flex items-center justify-center gap-xs hover:opacity-90">
              <span className="material-symbols-outlined text-[18px]">search</span>
              T-Code Search
            </button>
          </div>
          <div className="border-t border-outline-variant pt-xs">
            <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-label-md font-label-md">Settings</span>
            </a>
            <a className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-label-md font-label-md">Logout</span>
            </a>
          </div>
        </aside>

        {/* Main Content Stage */}
        <main className="ml-60 pt-16 min-h-screen p-lg">
          {/* Dashboard Header */}
          <div className="flex justify-between items-end mb-lg">
            <div>
              <nav className="flex text-label-sm font-label-sm text-outline mb-xs">
                <span>Operations</span>
                <span className="mx-xs">/</span>
                <span className="text-primary">Dispatch Control Room</span>
              </nav>
              <h1 className="text-headline-md font-headline-md text-on-background">Dispatch Fleet Monitor</h1>
            </div>
            <div className="flex gap-sm">
              <div className="flex items-center gap-xs bg-white border border-outline-variant px-sm py-xxs rounded">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-label-md font-label-md">System Live</span>
              </div>
              <div className="text-on-surface-variant text-label-md font-label-md bg-surface-container-high px-sm py-xxs rounded">
                Updated: Just now
              </div>
            </div>
          </div>

          {/* Bento Layout */}
          <div className="grid grid-cols-12 gap-gutter max-w-max-width mx-auto">
            {/* Left Pane: Map & Mission Form */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
              {/* Map Widget */}
              <div className="bg-white border border-outline-variant rounded shadow-sm relative overflow-hidden h-[400px]">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-xs">
                  <div className="bg-white/90 backdrop-blur-sm p-sm border border-outline-variant rounded shadow-md">
                    <h3 className="text-label-md font-label-md font-bold text-on-background mb-xxs">Real-time Telemetry</h3>
                    <div className="flex items-center gap-xs text-label-sm">
                      <span className="w-3 h-3 rounded-full bg-primary"></span> 12 Active Trucks
                    </div>
                  </div>
                </div>
                {/* Placeholder for Map */}
                <div className="w-full h-full bg-surface-container-highest relative">
                  <img alt="Operational Map" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFck20JD_GQMW1qAQDetaNG-7VrbYx_S6dlTjf0BH1UydGIlWxC8aCWzKZB_C3qSE25FMMih-oA3ecSoc3H1HALp0E7SM39Y5NTLQtnl2dcpJZjUJZUx1mZdDVUxkPZ7QFlbrQ3GW5pKD9U2jeh_mK5IkwQl8zMirNz0W0ZvntY8d5E8O4OPIkv0KXX98-ug-YLJdYkCw_S6-xl9LuTEalBQvsN1kr78f47dBlSO4t2YWF9fXu3H9AtV9vaVTPTj28ieS_qMfiToQ"/>
                  {/* Simulated Markers */}
                  <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
                    <span className="material-symbols-outlined text-white text-[14px]">local_shipping</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-[14px]">local_shipping</span>
                  </div>
                  <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-[14px]">local_shipping</span>
                  </div>
                </div>
              </div>

              {/* Table: Active Missions */}
              <div className="bg-white border border-outline-variant rounded shadow-sm overflow-hidden">
                <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                  <h2 className="text-title-md font-title-md text-on-background">Live Mission Log</h2>
                  <div className="flex gap-xs">
                    <button className="material-symbols-outlined p-xxs text-on-surface-variant hover:bg-surface-container-highest rounded">filter_list</button>
                    <button className="material-symbols-outlined p-xxs text-on-surface-variant hover:bg-surface-container-highest rounded">download</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        <th className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Mission ID</th>
                        <th className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Driver</th>
                        <th className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Route</th>
                        <th className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Vehicle</th>
                        <th className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Status</th>
                        <th className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      <tr className="hover:bg-surface-container-lowest transition-colors h-12">
                        <td className="px-md py-xs font-data-tabular text-body-sm text-primary font-bold">#MSN-4921</td>
                        <td className="px-md py-xs text-body-sm">Jean-Pierre K.</td>
                        <td className="px-md py-xs text-body-sm">Terminal A → Warehouse 4</td>
                        <td className="px-md py-xs text-body-sm">TRK-009 (DAF)</td>
                        <td className="px-md py-xs">
                          <span className="inline-flex items-center px-xs py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">IN TRANSIT</span>
                        </td>
                        <td className="px-md py-xs min-w-[120px]">
                          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: '65%' }}></div>
                          </div>
                        </td>
                      </tr>
                      <tr className="bg-surface-container-lowest hover:bg-surface-container-highest transition-colors h-12">
                        <td className="px-md py-xs font-data-tabular text-body-sm text-primary font-bold">#MSN-4922</td>
                        <td className="px-md py-xs text-body-sm">Moussa D.</td>
                        <td className="px-md py-xs text-body-sm">Main Gate → Quay 12</td>
                        <td className="px-md py-xs text-body-sm">TRK-042 (MAN)</td>
                        <td className="px-md py-xs">
                          <span className="inline-flex items-center px-xs py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700">LOADING</span>
                        </td>
                        <td className="px-md py-xs min-w-[120px]">
                          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: '12%' }}></div>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container-lowest transition-colors h-12">
                        <td className="px-md py-xs font-data-tabular text-body-sm text-primary font-bold">#MSN-4919</td>
                        <td className="px-md py-xs text-body-sm">Samuel E.</td>
                        <td className="px-md py-xs text-body-sm">Zone C → Depot B</td>
                        <td className="px-md py-xs text-body-sm">TRK-015 (Scania)</td>
                        <td className="px-md py-xs">
                          <span className="inline-flex items-center px-xs py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">IN TRANSIT</span>
                        </td>
                        <td className="px-md py-xs min-w-[120px]">
                          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: '89%' }}></div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Pane: Add Mission Form & Analytics */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
              {/* Add Mission Form */}
              <div className="bg-white border border-outline-variant rounded shadow-sm p-md">
                <h2 className="text-title-md font-title-md text-on-background mb-md flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary">add_circle</span>
                  Initialize New Mission
                </h2>
                <form className="space-y-sm">
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline mb-xxs">Mission ID</label>
                    <input className="w-full bg-surface-container-low border-outline-variant rounded px-sm py-xs text-body-md font-bold text-on-surface-variant cursor-not-allowed" readOnly type="text" value="#MSN-4925"/>
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline mb-xxs">Select Driver</label>
                    <select className="w-full border-outline-variant rounded px-sm py-xs text-body-md focus:ring-primary focus:border-primary">
                      <option>Amedeo R. - Ready</option>
                      <option>Boris Y. - On Break</option>
                      <option>Claire L. - Ready</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-outline mb-xxs">Vehicle Assignment</label>
                    <select className="w-full border-outline-variant rounded px-sm py-xs text-body-md focus:ring-primary focus:border-primary">
                      <option>TRK-088 - Flatbed</option>
                      <option>TRK-092 - Reefer</option>
                      <option>TRK-104 - Container Carrier</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-xs">
                    <div>
                      <label className="block text-label-sm font-label-sm text-outline mb-xxs">Origin</label>
                      <input className="w-full border-outline-variant rounded px-sm py-xs text-body-md" placeholder="e.g. Zone A" type="text"/>
                    </div>
                    <div>
                      <label className="block text-label-sm font-label-sm text-outline mb-xxs">Destination</label>
                      <input className="w-full border-outline-variant rounded px-sm py-xs text-body-md" placeholder="e.g. Quay 9" type="text"/>
                    </div>
                  </div>
                  <div className="pt-xs">
                    <button className="w-full bg-primary text-white font-bold py-sm rounded hover:brightness-110 transition-all shadow-md shadow-primary/20" type="submit">
                      DISPATCH MISSION
                    </button>
                  </div>
                </form>
              </div>

              {/* Stats/Atmospheric Widget */}
              <div className="bg-primary rounded p-md text-white shadow-lg relative overflow-hidden">
                {/* Subtle background pattern/animation */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-lg">
                    <div>
                      <p className="text-label-sm opacity-80 uppercase tracking-widest font-bold">Fleet Efficiency</p>
                      <h4 className="text-headline-sm font-headline-sm">94.2%</h4>
                    </div>
                    <span className="material-symbols-outlined text-[32px] opacity-50">analytics</span>
                  </div>
                  <div className="space-y-xs">
                    <div className="flex justify-between text-label-sm">
                      <span>Active Missions</span>
                      <span className="font-bold">48/50</span>
                    </div>
                    <div className="w-full bg-white/20 h-1 rounded-full">
                      <div className="bg-white h-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div className="mt-md pt-md border-t border-white/10 grid grid-cols-2 gap-md">
                    <div>
                      <p className="text-[10px] opacity-70 uppercase">Daily Deliveries</p>
                      <p className="text-title-md font-bold">1,240</p>
                    </div>
                    <div>
                      <p className="text-[10px] opacity-70 uppercase">Fuel Index</p>
                      <p className="text-title-md font-bold">0.82 <span className="text-[10px] font-normal">▼ 2%</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Alerts Feed */}
              <div className="bg-white border border-outline-variant rounded shadow-sm flex-1 flex flex-col min-h-0">
                <div className="px-md py-sm border-b border-outline-variant">
                  <h3 className="text-label-md font-bold text-on-background flex items-center gap-xs">
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                    Critical Alerts
                  </h3>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-xs space-y-xs max-h-[160px]">
                  <div className="p-xs bg-error-container/30 border border-error/10 rounded flex gap-xs">
                    <span className="material-symbols-outlined text-error text-[16px]">tire_repair</span>
                    <div className="text-[11px]">
                      <p className="font-bold text-on-error-container">TRK-009: Pressure Warning</p>
                      <p className="text-outline">Sensor detected low PSI on Rear-Axle 2.</p>
                    </div>
                  </div>
                  <div className="p-xs bg-surface-container-high border border-outline-variant rounded flex gap-xs">
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

        {/* Floating Action Button (FAB) */}
        <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-50 group">
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">headset_mic</span>
          <div className="absolute right-16 bg-on-surface text-white px-md py-xs rounded text-label-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Contact Support
          </div>
        </button>
      </div>
    </>
  )
}
