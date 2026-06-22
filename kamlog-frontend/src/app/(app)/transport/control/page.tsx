// src/app/(app)/transport/control/page.tsx - K-Transport Mission Control ERP Design - Fidèle au HTML original
'use client'

export default function KTransportControl() {
  return (
    <div className="bg-background text-on-background font-body-base antialiased flex h-screen overflow-hidden">
      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack-md z-50">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 module-bg rounded flex items-center justify-center font-bold text-white">K</div>
          <div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
            <span className="font-label-caps text-label-caps text-secondary">Port Operations</span>
          </div>
        </div>

        <button className="module-bg hover:opacity-90 active:scale-95 duration-150 rounded px-4 py-2 mb-6 flex items-center justify-center gap-2 font-title-sm text-title-sm w-full transition-all shadow-sm">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nouvelle Opération
        </button>

        <ul className="flex-1 space-y-1">
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/dashboard/global">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="font-body-base text-body-base">Tableau de bord</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-primary bg-secondary-container font-bold hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/transport/control">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span className="font-body-base text-body-base">Transport</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/finance/overview">
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span className="font-body-base text-body-base">Finances</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/parc/overview">
              <span className="material-symbols-outlined text-[20px]">minor_crash</span>
              <span className="font-body-base text-body-base">Parc Automobile</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/settings/system/audit-health">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-body-base text-body-base">Paramètres</span>
            </a>
          </li>
        </ul>

        <div className="mt-auto pt-4 border-t border-outline-variant space-y-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors" href="/support">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            <span className="font-body-base text-body-base">Support</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-secondary hover:bg-surface-container-high transition-colors" href="/login">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-body-base text-body-base">Déconnexion</span>
          </a>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-[260px] flex flex-col h-screen overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-surface border-b border-outline-variant sticky top-0 w-full z-40 flex justify-between items-center h-[64px] px-gutter">
          <div className="flex items-center gap-6">
            <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
            <nav className="hidden md:flex gap-4">
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-4" href="#">Articles</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-4" href="#">Clients</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-4" href="#">Stocks</a>
              <a className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all py-4" href="#">Rapports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-full bg-surface-container-low px-4 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[18px]">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-body-sm w-48 placeholder:text-outline p-0" 
                placeholder="Rechercher T-Code" 
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-outline-variant flex items-center justify-center text-xs font-bold text-primary">JD</div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-container-margin bg-background">
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface mb-1">Mission Control</h2>
              <p className="text-secondary font-body-base">Transport & Fleet Operations Center</p>
            </div>
            <div className="flex gap-2">
              <button className="border border-outline-variant bg-surface px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filtres
              </button>
              <button className="module-bg px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Actualiser
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Fleet Status Summary (Bento Top) */}
            <div className="col-span-12 md:col-span-8 glass-card p-stack-md flex justify-between items-center">
              <div>
                <h3 className="font-title-sm text-title-sm text-on-surface mb-1">Fleet Status</h3>
                <p className="font-body-sm text-body-sm text-secondary">Real-time overview</p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <span className="block font-display-lg text-display-lg text-on-surface">25</span>
                  <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> On Road
                  </span>
                </div>
                <div className="w-px h-10 bg-outline-variant"></div>
                <div className="text-center">
                  <span className="block font-display-lg text-display-lg text-on-surface">12</span>
                  <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Available
                  </span>
                </div>
                <div className="w-px h-10 bg-outline-variant"></div>
                <div className="text-center">
                  <span className="block font-display-lg text-display-lg text-on-surface">3</span>
                  <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Maintenance
                  </span>
                </div>
              </div>
            </div>

            {/* Next Deliveries (Bento Right) */}
            <div className="col-span-12 md:col-span-4 glass-card p-stack-md flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-title-sm text-title-sm text-on-surface">Next Deliveries</h3>
                <span className="font-label-caps text-label-caps text-secondary">TODAY</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {/* Item 1 */}
                <div className="p-3 border border-outline-variant rounded-DEFAULT hover:border-[#F59E0B] transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono-data text-mono-data text-on-surface group-hover:text-[#F59E0B]">DLV-8821</span>
                    <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-1 rounded text-secondary">14:30</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">Port Terminal B</p>
                  <p className="font-body-sm text-body-sm text-secondary truncate">Client: Maersk Logistics</p>
                </div>
                {/* Item 2 */}
                <div className="p-3 border border-outline-variant rounded-DEFAULT hover:border-[#F59E0B] transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono-data text-mono-data text-on-surface group-hover:text-[#F59E0B]">DLV-8822</span>
                    <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-1 rounded text-secondary">15:15</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">Warehouse Alpha</p>
                  <p className="font-body-sm text-body-sm text-secondary truncate">Client: CMA CGM</p>
                </div>
                {/* Item 3 */}
                <div className="p-3 border border-outline-variant rounded-DEFAULT hover:border-[#F59E0B] transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono-data text-mono-data text-on-surface group-hover:text-[#F59E0B]">DLV-8823</span>
                    <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-1 rounded text-secondary">16:45</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">Zone Industrielle Sud</p>
                  <p className="font-body-sm text-body-sm text-secondary truncate">Client: Bolloré Transports</p>
                </div>
              </div>
              <button className="mt-4 w-full text-center text-[#F59E0B] font-body-sm text-body-sm hover:underline">View All Schedule</button>
            </div>

            {/* Active Missions List */}
            <div className="col-span-12 md:col-span-8 glass-card overflow-hidden flex flex-col h-[400px]">
              <div className="p-stack-md border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                <h3 className="font-title-sm text-title-sm text-on-surface">Active Missions</h3>
                <div className="flex gap-2">
                  <input 
                    className="border border-outline-variant rounded px-2 py-1 text-body-sm w-32 focus:outline-none focus:border-[#F59E0B]" 
                    placeholder="Filter ID..." 
                    type="text"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant z-10">
                    <tr>
                      <th className="py-2 px-4 font-label-caps text-label-caps text-secondary whitespace-nowrap">Mission ID</th>
                      <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Driver</th>
                      <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Route</th>
                      <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Vehicle</th>
                      <th className="py-2 px-4 font-label-caps text-label-caps text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm">
                    <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group">
                      <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-901</td>
                      <td className="py-2 px-4 text-on-surface">Amadou Diallo</td>
                      <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Port -> ZI Dakar</td>
                      <td className="py-2 px-4 text-on-surface">VOL-FR-45</td>
                      <td className="py-2 px-4">
                        <span className="status-transit px-2 py-1 rounded font-label-caps text-label-caps">In Transit</span>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group bg-surface-bright">
                      <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-902</td>
                      <td className="py-2 px-4 text-on-surface">Jean Dupont</td>
                      <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Whse 1 -> Port Term</td>
                      <td className="py-2 px-4 text-on-surface">MER-AX-12</td>
                      <td className="py-2 px-4">
                        <span className="status-loading px-2 py-1 rounded font-label-caps text-label-caps">Loading</span>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group">
                      <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-903</td>
                      <td className="py-2 px-4 text-on-surface">Sarah Koné</td>
                      <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Dakar -> Thies</td>
                      <td className="py-2 px-4 text-on-surface">SCA-R-09</td>
                      <td className="py-2 px-4">
                        <span className="status-delivered px-2 py-1 rounded font-label-caps text-label-caps">Delivered</span>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group bg-surface-bright">
                      <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-904</td>
                      <td className="py-2 px-4 text-on-surface">Moussa Sow</td>
                      <td className="py-2 px-4 text-secondary truncate max-w-[150px]">ZI Sud -> Port Term</td>
                      <td className="py-2 px-4 text-on-surface">MAN-TG-88</td>
                      <td className="py-2 px-4">
                        <span className="status-transit px-2 py-1 rounded font-label-caps text-label-caps">In Transit</span>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group">
                      <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-905</td>
                      <td className="py-2 px-4 text-on-surface">Oumar Fall</td>
                      <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Port -> Whse 3</td>
                      <td className="py-2 px-4 text-on-surface">VOL-FR-42</td>
                      <td className="py-2 px-4">
                        <span className="status-loading px-2 py-1 rounded font-label-caps text-label-caps">Loading</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Map View Placeholder */}
            <div className="col-span-12 glass-card p-1 relative h-[300px] overflow-hidden group">
              <div className="absolute inset-0 bg-surface-container-highest flex flex-col items-center justify-center opacity-80 z-10 pointer-events-none">
                <span className="material-symbols-outlined text-outline text-[40px]">map</span>
                <span className="font-title-sm text-title-sm text-outline">Live Map View</span>
                <span className="font-body-sm text-body-sm text-outline">Tracking 25 Active Trucks</span>
              </div>
              {/* Decorative Map Grid Background */}
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#c2c6d6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              {/* Simulated truck blips */}
              <div className="absolute w-3 h-3 bg-[#F59E0B] rounded-full top-[30%] left-[40%] shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse"></div>
              <div className="absolute w-3 h-3 bg-[#F59E0B] rounded-full top-[60%] left-[20%] shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-[45%] left-[70%] shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute w-3 h-3 bg-[#F59E0B] rounded-full top-[80%] left-[55%] shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              {/* Overlay Controls */}
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-surface p-2 rounded shadow border border-outline-variant hover:bg-surface-container-low">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
                <button className="bg-surface p-2 rounded shadow border border-outline-variant hover:bg-surface-container-low">
                  <span className="material-symbols-outlined text-[16px]">filter_list</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
