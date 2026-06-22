// src/app/(app)/master-data/tiers-management/page.tsx - Master Data Tiers Management - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function MasterDataTiersManagement() {
  const [selectedRow, setSelectedRow] = useState(0)
  const [searchWidth, setSearchWidth] = useState('w-64')

  const selectTier = (index: number) => {
    setSelectedRow(index)
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 10px; }
        .tier-row-active {
          background-color: #ecfdf5 !important;
          border-left: 4px solid #10B981 !important;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface flex min-h-screen overflow-hidden">
        {/* SideNavBar */}
        <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container border-r border-outline-variant">
          <div className="px-md py-lg flex flex-col gap-xs">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined icon-fill">terminal</span>
              </div>
              <div>
                <h2 className="text-headline-sm font-headline-sm font-black text-primary leading-tight">KAMLOG ERP</h2>
                <p className="text-label-sm font-label-sm text-on-surface-variant opacity-70">Operational Control</p>
              </div>
            </div>
            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              <a className="flex items-center gap-sm px-md py-sm rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all group" href="/transport/control">
                <span className="material-symbols-outlined text-title-md">local_shipping</span>
                <span className="text-label-md font-label-md">Transport</span>
              </a>
              <a className="flex items-center gap-sm px-md py-sm rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all group" href="/finance/overview">
                <span className="material-symbols-outlined text-title-md">payments</span>
                <span className="text-label-md font-label-md">Finance</span>
              </a>
              <a className="flex items-center gap-sm px-md py-sm rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all group" href="/parc/overview">
                <span className="material-symbols-outlined text-title-md">inventory_2</span>
                <span className="text-label-md font-label-md">Parc</span>
              </a>
              <a className="flex items-center gap-sm px-md py-sm rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all group" href="/magasin/dashboard">
                <span className="material-symbols-outlined text-title-md">warehouse</span>
                <span className="text-label-md font-label-md">Magasin</span>
              </a>
              <a className="flex items-center gap-sm px-md py-sm rounded-sm text-primary font-bold border-l-4 border-primary bg-surface-container-highest scale-[0.99] transition-transform duration-150" href="/audit/dashboard/health">
                <span className="material-symbols-outlined text-title-md icon-fill">history_edu</span>
                <span className="text-label-md font-label-md">Audit</span>
              </a>
            </nav>
            <div className="mt-xl pt-lg border-t border-outline-variant">
              <button className="w-full flex items-center justify-between px-md py-xs bg-surface-container-highest rounded border border-outline-variant text-label-md font-label-md text-on-surface-variant">
                <span>T-Code Search</span>
                <span className="material-symbols-outlined text-sm">search</span>
              </button>
            </div>
          </div>
          <div className="mt-auto px-md flex flex-col gap-1">
            <a className="flex items-center gap-sm px-md py-sm rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all" href="/settings/system/audit-health">
              <span className="material-symbols-outlined text-title-md">settings</span>
              <span className="text-label-md font-label-md">Settings</span>
            </a>
            <a className="flex items-center gap-sm px-md py-sm rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-all" href="/login">
              <span className="material-symbols-outlined text-title-md">logout</span>
              <span className="text-label-md font-label-md">Logout</span>
            </a>
          </div>
        </aside>
        {/* TopNavBar */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
          <div className="flex items-center gap-xl ml-60">
            <h1 className="text-title-lg font-title-lg font-bold text-primary">KAMLOG EM-ERP</h1>
            <nav className="hidden md:flex items-center gap-lg">
              <a className="text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors px-2 py-1 rounded" href="#">Alerts</a>
              <a className="text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors px-2 py-1 rounded" href="#">MFA Status</a>
              <a className="text-label-md font-label-md text-primary border-b-2 border-primary pb-1" href="#">Modules</a>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative">
              <input 
                className={`bg-surface-container-highest border-none rounded-full px-md py-xs text-label-md ${searchWidth} focus:ring-2 focus:ring-primary/20 transition-all duration-300`} 
                placeholder="Search Master Data..." 
                type="text"
                onFocus={() => setSearchWidth('w-80')}
                onBlur={() => setSearchWidth('w-64')}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-md">search</span>
            </div>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-low"></span>
            </button>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">security</span>
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant bg-surface-variant">
              <img alt="User Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh0YcMXQbu-z9ao_1YCWb26ZfNWtFG7tT-srqoAhUbHmCrea4tsXCDkqF-0qlSTgSVaCts7rfQ089fxbJYLYOKcNAKisBLIpg7Pek_-Eo_k0VO_ve2-a1uUL-hC2zsKy3pWTWq6xk8R4r9sHPFYVSDxOmELL7Mc4cTQ85fHlRlNM16bmNLfNVwAXnHkPTjULe9bTgPF-KtEZVmfOpTyRKCKA-kysb2BVnw--fhrScnRBaBtwHnxBkAU0E1UBJ0z_K03lIZkHYZVkM"/>
            </div>
          </div>
        </header>
        {/* Main Content Stage */}
        <main className="flex-1 ml-60 mt-16 flex overflow-hidden">
          {/* Table Section */}
          <section className="flex-1 flex flex-col min-w-0 border-r border-outline-variant bg-surface-container-low">
            {/* Toolbar & Filters */}
            <div className="p-md bg-surface-container-lowest flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-md">
                <div className="flex items-center gap-xs">
                  <span className="text-label-md font-label-md text-on-surface-variant">Filter by:</span>
                  <select className="text-label-md font-label-md border-outline-variant rounded-sm focus:ring-secondary py-1 pl-2 pr-8 bg-surface">
                    <option>All Tiers</option>
                    <option>Clients</option>
                    <option>Suppliers</option>
                    <option>Internal Partners</option>
                  </select>
                </div>
                <div className="flex items-center gap-xs">
                  <select className="text-label-md font-label-md border-outline-variant rounded-sm focus:ring-secondary py-1 pl-2 pr-8 bg-surface">
                    <option>Any Status</option>
                    <option>Active</option>
                    <option>Pending Audit</option>
                    <option>Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-xs">
                <button className="p-1 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-md">download</span>
                </button>
                <button className="p-1 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-md">print</span>
                </button>
                <button className="p-1 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined text-md">more_vert</span>
                </button>
              </div>
            </div>
            {/* Scrollable Table */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-surface-container-low shadow-sm">
                  <tr>
                    <th className="px-md py-sm border-b border-outline-variant text-label-md font-label-md text-on-surface-variant">
                      <input className="rounded-sm text-secondary focus:ring-secondary" type="checkbox"/>
                    </th>
                    <th className="px-md py-sm border-b border-outline-variant text-label-md font-label-md text-on-surface-variant">Tier Code</th>
                    <th className="px-md py-sm border-b border-outline-variant text-label-md font-label-md text-on-surface-variant">Entity Name</th>
                    <th className="px-md py-sm border-b border-outline-variant text-label-md font-label-md text-on-surface-variant">Category</th>
                    <th className="px-md py-sm border-b border-outline-variant text-label-md font-label-md text-on-surface-variant">Tax ID</th>
                    <th className="px-md py-sm border-b border-outline-variant text-label-md font-label-md text-on-surface-variant">Status</th>
                    <th className="px-md py-sm border-b border-outline-variant text-label-md font-label-md text-on-surface-variant">Credit Score</th>
                  </tr>
                </thead>
                <tbody className="bg-surface-container-lowest">
                  {/* Row 1 */}
                  <tr className={`${selectedRow === 0 ? 'tier-row-active' : ''} border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer`} onClick={() => selectTier(0)}>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <input checked={selectedRow === 0} className="rounded-sm text-secondary focus:ring-secondary" type="checkbox"/>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-primary font-medium">CL-88902</td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm font-semibold">Global Logistics Corp.</td>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <span className="px-xs py-0.5 rounded-sm bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Client</span>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">VAT-9922881-A</td>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                      </span>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">880/1000</td>
                  </tr>
                  {/* Row 2 */}
                  <tr className={`${selectedRow === 1 ? 'tier-row-active' : ''} border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer`} onClick={() => selectTier(1)}>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <input checked={selectedRow === 1} className="rounded-sm text-secondary focus:ring-secondary" type="checkbox"/>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-primary font-medium">SP-11023</td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm font-semibold">Maritime Fuel Supplies</td>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <span className="px-xs py-0.5 rounded-sm bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-wider">Supplier</span>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">TAX-4412211-B</td>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                      </span>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">920/1000</td>
                  </tr>
                  {/* Row 3 */}
                  <tr className={`${selectedRow === 2 ? 'tier-row-active' : ''} border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer`} onClick={() => selectTier(2)}>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <input checked={selectedRow === 2} className="rounded-sm text-secondary focus:ring-secondary" type="checkbox"/>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-primary font-medium">CL-44512</td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm font-semibold">East Coast Terminals</td>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <span className="px-xs py-0.5 rounded-sm bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Client</span>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">VAT-2211445-K</td>
                    <td className="px-md py-xs border-b border-outline-variant">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tertiary">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Pending Audit
                      </span>
                    </td>
                    <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">450/1000</td>
                  </tr>
                  {/* Additional rows */}
                  {[...Array(15)].map((_, i) => (
                    <tr key={i} className={`${selectedRow === i + 3 ? 'tier-row-active' : ''} border-b border-outline-variant hover:bg-surface transition-colors cursor-pointer`} onClick={() => selectTier(i + 3)}>
                      <td className="px-md py-xs border-b border-outline-variant">
                        <input checked={selectedRow === i + 3} className="rounded-sm text-secondary focus:ring-secondary" type="checkbox"/>
                      </td>
                      <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-primary font-medium">TR-{10000 + i}</td>
                      <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm font-semibold">Partner Sub-Group {i}</td>
                      <td className="px-md py-xs border-b border-outline-variant">
                        <span className="px-xs py-0.5 rounded-sm bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">Partner</span>
                      </td>
                      <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">VAT-X92{i}</td>
                      <td className="px-md py-xs border-b border-outline-variant">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                        </span>
                      </td>
                      <td className="px-md py-xs border-b border-outline-variant font-data-tabular text-body-sm text-on-surface-variant">710/1000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-md py-sm bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between text-label-md">
              <span className="text-on-surface-variant">Showing 1-18 of 245 entities</span>
              <div className="flex items-center gap-xs">
                <button className="p-1 hover:bg-surface-container-high rounded disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="px-2 py-0.5 bg-primary text-on-primary rounded-sm">1</button>
                <button className="px-2 py-0.5 hover:bg-surface-container-high rounded-sm">2</button>
                <button className="px-2 py-0.5 hover:bg-surface-container-high rounded-sm">3</button>
                <button className="p-1 hover:bg-surface-container-high rounded">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
          {/* Detail Side Panel */}
          <aside className="w-96 bg-surface flex flex-col shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-30 transition-all overflow-hidden">
            {/* Panel Header */}
            <div className="p-lg bg-surface-container-lowest border-b border-outline-variant relative">
              <div className="flex items-start justify-between mb-md">
                <div className="w-16 h-16 rounded bg-surface-container-highest flex items-center justify-center text-primary border border-outline-variant">
                  <span className="material-symbols-outlined text-4xl icon-fill">corporate_fare</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-sm py-0.5 bg-secondary/10 text-secondary text-[11px] font-bold rounded-full uppercase tracking-widest">Active Client</span>
                  <button className="text-primary hover:underline text-label-sm font-label-sm flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-sm">edit</span> Edit Details
                  </button>
                </div>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface leading-tight">Global Logistics Corp.</h3>
              <p className="text-body-sm text-on-surface-variant opacity-80">Parent ID: KAM-ENT-GLOBAL-001</p>
            </div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto custom-scrollbar p-lg space-y-lg">
              {/* Contact Section */}
              <section>
                <h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-md border-b border-outline-variant pb-1">Contact Information</h4>
                <div className="space-y-sm">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary opacity-60">person</span>
                    <div className="flex-1">
                      <p className="text-label-md font-label-md text-on-surface">Elena Rodriguez</p>
                      <p className="text-[11px] text-on-surface-variant">Senior Procurement Lead</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary opacity-60">mail</span>
                    <span className="text-body-sm text-on-surface-variant truncate">e.rodriguez@globallogistics.com</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary opacity-60">call</span>
                    <span className="text-body-sm text-on-surface-variant">+49 (0) 40 338 221-0</span>
                  </div>
                </div>
              </section>
              {/* Financial Health */}
              <section className="bg-surface-container-high p-md rounded border border-outline-variant">
                <h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-md">Financial Status</h4>
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">Credit Limit</p>
                    <p className="text-title-md font-bold text-on-surface">€ 1,250,000</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase">Exposure</p>
                    <p className="text-title-md font-bold text-secondary">€ 422,100</p>
                  </div>
                  <div className="col-span-2">
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{width: '34%'}}></div>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">34% of total credit utilized</p>
                  </div>
                </div>
              </section>
              {/* Active Contracts */}
              <section>
                <div className="flex items-center justify-between mb-md">
                  <h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Active Contracts</h4>
                  <span className="text-[11px] font-bold text-primary px-1.5 bg-primary/10 rounded">3 Total</span>
                </div>
                <div className="space-y-xs">
                  <div className="p-xs hover:bg-surface-container-highest rounded transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-outline-variant">
                    <div>
                      <p className="text-body-sm font-medium">Terminal Op #772</p>
                      <p className="text-[11px] text-on-surface-variant">Exp: Dec 2026</p>
                    </div>
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </div>
                  <div className="p-xs hover:bg-surface-container-highest rounded transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-outline-variant">
                    <div>
                      <p className="text-body-sm font-medium">Cold Storage MSA</p>
                      <p className="text-[11px] text-on-surface-variant">Exp: Jan 2026</p>
                    </div>
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                  </div>
                </div>
              </section>
              {/* Map Integration */}
              <section className="h-32 w-full rounded overflow-hidden relative border border-outline-variant">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTCi2Nrl65wUgp-mwxwa52k7lQ0IJv-Do7DMZ1KkovQlOK49wVFLL_knXo3isfcit4_1KkggEIlRBqydQanbpq1xuNoHXzr_0C-bvjCZAIPvwmkXU-zWd9rh8fz9hj1TzLw-y7oOU7HlKVTJuoejCCQg472hGSvydYr4huWl-QoC6bbWJwM0hVpsBr2di3wWUIeKIq1Rb5cARUg06svHkHXqFZpUtbvX5w1dNKstWvG6fMD9bd8O-YGhmIr95SlMJhrefjb4ixxbk"/>
                <div className="absolute inset-0 bg-secondary/10 pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-surface/90 rounded shadow text-[10px] font-bold">
                  HQ: Hamburg, DE
                </div>
              </section>
            </div>
            {/* Footer Actions */}
            <div className="p-md bg-surface-container-low border-t border-outline-variant flex gap-sm">
              <button className="flex-1 py-2 bg-primary text-on-primary text-label-md font-bold rounded hover:opacity-90 transition-opacity">
                Create Invoice
              </button>
              <button className="px-3 py-2 border border-outline-variant text-on-surface-variant rounded hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-md">share</span>
              </button>
            </div>
          </aside>
        </main>
        {/* Add Tier FAB */}
        <button className="fixed bottom-lg right-lg w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50 group">
          <span className="material-symbols-outlined text-2xl icon-fill">add</span>
          <div className="absolute right-16 px-md py-2 bg-inverse-surface text-inverse-on-surface text-label-md rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md">
            Register New Tier Entity
          </div>
        </button>
      </div>
    </>
  )
}
