// src/app/(app)/transport/page.tsx - K-Transport Mission Control - Fidèle 100% au HTML original
'use client'

import { useEffect } from 'react'

export default function TransportPage() {
  // ── Micro-interactions JavaScript fidèles au HTML original ─────────
  useEffect(() => {
    // Add hover scale effect to cards
    const cards = document.querySelectorAll('.hover-scale')
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('scale-[1.02]')
      })
      card.addEventListener('mouseleave', () => {
        card.classList.remove('scale-[1.02]')
      })
    })
  }, [])

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
          font-variation-settings: 'FILL' 1;
        }
        
        /* Module Signature Color (Orange Override for Transport) */
        .module-bg { background-color: #F59E0B; color: white; }
        .module-text { color: #F59E0B; }
        .module-border { border-color: #F59E0B; }
        .module-bg-light { background-color: #FEF3C7; color: #B45309; }
        
        /* Status Badges */
        .status-transit { background-color: #DBEAFE; color: #1E40AF; }
        .status-loading { background-color: #FEF3C7; color: #B45309; }
        .status-delivered { background-color: #DCFCE7; color: #166534; }
        .status-maintenance { background-color: #FEE2E2; color: #991B1B; }

        /* Elevation 1 - Soft Shadow */
        .glass-card {
          background-color: #ffffff;
          border: 1px solid #E2E8F0;
          box-shadow: 0px 1px 3px rgba(0,0,0,0.05);
          border-radius: 0.5rem;
        }
      `}</style>
      <div className="bg-background text-on-background font-body-base antialiased flex flex-col">
        
        

        
        <div className="flex-1 flex flex-col">
          
          

          
          <main className="flex-1 overflow-y-auto p-container-margin bg-background">
            <div className="flex justify-between items-end mb-stack-lg">
              <div>
                <h2 className="font-display-lg text-display-lg text-on-surface mb-1">Mission Control</h2>
                <p className="text-secondary font-body-base">Transport & Fleet Operations Center</p>
              </div>
              <div className="flex gap-2">
                <button className="border border-outline-variant bg-surface px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filtres
                </button>
                <button className="module-bg px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-sm">refresh</span>
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
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> On Road</span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">12</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Available</span>
                  </div>
                  <div className="w-px h-10 bg-outline-variant"></div>
                  <div className="text-center">
                    <span className="block font-display-lg text-display-lg text-on-surface">3</span>
                    <span className="font-label-caps text-label-caps text-secondary flex items-center justify-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Maintenance</span>
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
                    <input className="border border-outline-variant rounded px-2 py-1 text-body-sm w-32 focus:outline-none focus:border-[#F59E0B]" placeholder="Filter ID..." type="text"/>
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
                        <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Port -&gt; ZI Dakar</td>
                        <td className="py-2 px-4 text-on-surface">VOL-FR-45</td>
                        <td className="py-2 px-4"><span className="status-transit px-2 py-1 rounded font-label-caps text-label-caps">In Transit</span></td>
                      </tr>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group bg-surface-bright">
                        <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-902</td>
                        <td className="py-2 px-4 text-on-surface">Jean Dupont</td>
                        <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Whse 1 -&gt; Port Term</td>
                        <td className="py-2 px-4 text-on-surface">MER-AX-12</td>
                        <td className="py-2 px-4"><span className="status-loading px-2 py-1 rounded font-label-caps text-label-caps">Loading</span></td>
                      </tr>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group">
                        <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-903</td>
                        <td className="py-2 px-4 text-on-surface">Sarah Koné</td>
                        <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Dakar -&gt; Thies</td>
                        <td className="py-2 px-4 text-on-surface">SCA-R-09</td>
                        <td className="py-2 px-4"><span className="status-delivered px-2 py-1 rounded font-label-caps text-label-caps">Delivered</span></td>
                      </tr>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group bg-surface-bright">
                        <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-904</td>
                        <td className="py-2 px-4 text-on-surface">Moussa Sow</td>
                        <td className="py-2 px-4 text-secondary truncate max-w-[150px]">ZI Sud -&gt; Port Term</td>
                        <td className="py-2 px-4 text-on-surface">MAN-TG-88</td>
                        <td className="py-2 px-4"><span className="status-transit px-2 py-1 rounded font-label-caps text-label-caps">In Transit</span></td>
                      </tr>
                      <tr className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors h-[grid-row-height] group">
                        <td className="py-2 px-4 font-mono-data text-mono-data text-on-surface">TRN-905</td>
                        <td className="py-2 px-4 text-on-surface">Oumar Fall</td>
                        <td className="py-2 px-4 text-secondary truncate max-w-[150px]">Port -&gt; Whse 3</td>
                        <td className="py-2 px-4 text-on-surface">VOL-FR-42</td>
                        <td className="py-2 px-4"><span className="status-loading px-2 py-1 rounded font-label-caps text-label-caps">Loading</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Map View Placeholder */}
              <div className="col-span-12 glass-card p-1 relative h-[300px] overflow-hidden group">
                <div className="absolute inset-0 bg-surface-container-highest flex flex-col items-center justify-center opacity-80 z-10 pointer-events-none">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">map</span>
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
                  <button className="bg-surface p-2 rounded shadow border border-outline-variant hover:bg-surface-container-low"><span className="material-symbols-outlined text-sm">add</span></button>
                  <button className="bg-surface p-2 rounded shadow border border-outline-variant hover:bg-surface-container-low"><span className="material-symbols-outlined text-sm">remove</span></button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
