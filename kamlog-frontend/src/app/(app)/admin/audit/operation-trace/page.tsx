// src/app/(app)/admin/audit/operation-trace/page.tsx - Audit Trail Operation Trace - Fidèle 100% au HTML original
'use client'

import { useEffect } from 'react'

export default function AuditTrailOperationTracePage() {
  useEffect(() => {
    // Micro-interaction for T-Code selection
    const rows = document.querySelectorAll('.zebra-stripe')
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        const icon = row.querySelector('.material-symbols-outlined') as HTMLElement
        if (icon) {
          icon.style.transform = 'scale(1.2)'
          icon.style.transition = 'transform 0.2s ease'
        }
      })
      row.addEventListener('mouseleave', () => {
        const icon = row.querySelector('.material-symbols-outlined') as HTMLElement
        if (icon) {
          icon.style.transform = 'scale(1)'
        }
      })
    })

    // Simulate T-Code feedback
    const tcodeInput = document.querySelector('input[placeholder*="T-Code"]') as HTMLInputElement
    if (tcodeInput) {
      tcodeInput.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          const code = tcodeInput.value.toUpperCase()
          if (code === 'KM24') {
            alert('Reloading Audit Trace context...')
          }
        }
      })
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
          vertical-align: middle;
        }
        .zebra-stripe:nth-child(even) { background-color: #F9FAFB; }
        .t-code-focus:focus-within {
          box-shadow: 0 0 0 2px #6B7280;
          border-color: #6B7280;
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md overflow-hidden">
        {/* TopNavBar Implementation */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
          <div className="flex items-center gap-md">
            <span className="text-title-lg font-title-lg font-bold text-primary">KAMLOG EM-ERP</span>
            <div className="h-8 w-px bg-outline-variant mx-xs"></div>
            <nav className="hidden md:flex items-center gap-lg">
              <a className="text-on-surface-variant hover:bg-surface-container-high transition-colors text-label-md font-label-md px-2 py-1" href="#">Alerts</a>
              <a className="text-on-surface-variant hover:bg-surface-container-high transition-colors text-label-md font-label-md px-2 py-1" href="#">MFA Status</a>
              <a className="text-on-surface-variant hover:bg-surface-container-high transition-colors text-label-md font-label-md px-2 py-1" href="#">Modules</a>
            </nav>
          </div>
          {/* T-Code Search Bar - Critical Requirement */}
          <div className="flex-1 max-w-md mx-xl hidden md:block">
            <div className="relative t-code-focus group transition-all duration-200 bg-white border border-outline-variant rounded p-1 flex items-center">
              <span className="material-symbols-outlined text-outline px-xs" style={{ fontSize: '20px' }}>terminal</span>
              <input className="w-full border-none focus:ring-0 text-body-sm font-data-tabular bg-transparent" placeholder="Enter T-Code (e.g. KM24)" type="text" value="KM24"/>
              <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1">ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded transition-colors">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded transition-colors">security</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded transition-colors">apps</button>
            <img alt="User Profile Avatar" className="w-8 h-8 rounded-full border border-outline-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2CFriw6FjN_IS0g8HuJsJN6IrruZOflxB_C3r5_z6uXM6qrnJ1xNSeGecI4kRKeJm6gVF3wVA9Eg3NgvT89hIppO9y9PLlZ7CJ22xMG1H_1v4Ksx5hzRb63FjMZKJp89ioZPtXI4_6t_eZyv0RT1w0MVDcDL4yncbYRVVGh3nq-EwiYJB-51otCBj78p1FNleatpsjKh68FX03VUGYLkr2Cw7TaKraejqGrz-MvEwKu9F7yTt-9737BrwU_ayXVd8guhcIz4yGcA"/>
          </div>
        </header>

        {/* SideNavBar Implementation */}
        <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container border-r border-outline-variant">
          <div className="px-md py-lg">
            <div className="flex flex-col gap-xxs">
              <span className="text-headline-sm font-headline-sm font-black text-primary">KAMLOG ERP</span>
              <span className="text-label-md font-label-md text-on-surface-variant opacity-70">Operational Control</span>
            </div>
          </div>
          <div className="flex-1 px-xs flex flex-col gap-1">
            <div className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Main Modules</div>
            <a className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="text-label-md font-label-md">Transport</span>
            </a>
            <a className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-label-md font-label-md">Finance</span>
            </a>
            <a className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="text-label-md font-label-md">Parc</span>
            </a>
            <a className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">warehouse</span>
              <span className="text-label-md font-label-md">Magasin</span>
            </a>
            {/* Active State: Audit */}
            <a className="flex items-center gap-md px-md py-2.5 text-primary font-bold border-l-4 border-primary bg-surface-container-highest scale-[0.99] transition-transform duration-150" href="#">
              <span className="material-symbols-outlined">history_edu</span>
              <span className="text-label-md font-label-md">Audit</span>
            </a>
          </div>
          <div className="mt-auto px-xs flex flex-col gap-1">
            <a className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-label-md font-label-md">Settings</span>
            </a>
            <a className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="text-label-md font-label-md">Logout</span>
            </a>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="ml-60 pt-16 h-screen overflow-y-auto bg-surface-container-low">
          <div className="max-w-[1600px] mx-auto p-lg">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-xs text-label-sm font-label-sm text-outline mb-xs">
              <a className="hover:text-primary" href="#">System Control</a>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <a className="hover:text-primary" href="#">Audit Log</a>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-on-surface font-semibold">OT Trace</span>
            </nav>

            {/* Header Section */}
            <div className="flex justify-between items-end mb-lg">
              <div className="flex flex-col gap-1">
                <h1 className="text-headline-md font-headline-md text-on-surface">Audit Trail & Operation Trace</h1>
                <p className="text-body-sm text-on-surface-variant max-w-2xl">Real-time logging of system transactions and operational movements across the KAMLOG terminal ecosystem. Traceability maintained for 90 days.</p>
              </div>
              <div className="flex gap-md">
                <button className="flex items-center gap-xs px-md py-2 border border-outline text-label-md font-label-md rounded hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filter View
                </button>
                <button className="flex items-center gap-xs px-md py-2 bg-primary text-white text-label-md font-label-md rounded hover:bg-primary-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Log
                </button>
              </div>
            </div>

            {/* Bento Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
              <div className="bg-white p-md border border-outline-variant rounded-lg">
                <div className="flex justify-between items-start mb-xs">
                  <span className="text-label-md font-label-md text-outline uppercase tracking-wider">Total Traces (24h)</span>
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </div>
                <div className="text-headline-sm font-headline-sm">12,842</div>
                <div className="text-[11px] text-secondary mt-1 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +4.2% from yesterday
                </div>
              </div>
              <div className="bg-white p-md border border-outline-variant rounded-lg">
                <div className="flex justify-between items-start mb-xs">
                  <span className="text-label-md font-label-md text-outline uppercase tracking-wider">Security Alerts</span>
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>
                <div className="text-headline-sm font-headline-sm">03</div>
                <div className="text-[11px] text-on-surface-variant mt-1 opacity-70">Requires Audit Review</div>
              </div>
              <div className="bg-white p-md border border-outline-variant rounded-lg">
                <div className="flex justify-between items-start mb-xs">
                  <span className="text-label-md font-label-md text-outline uppercase tracking-wider">Active Modules</span>
                  <span className="material-symbols-outlined text-primary">dashboard_customize</span>
                </div>
                <div className="text-headline-sm font-headline-sm">12 Modules</div>
                <div className="text-[11px] text-on-surface-variant mt-1 opacity-70">Cross-terminal integration</div>
              </div>
              <div className="bg-white p-md border border-outline-variant rounded-lg">
                <div className="flex justify-between items-start mb-xs">
                  <span className="text-label-md font-label-md text-outline uppercase tracking-wider">Avg Response Time</span>
                  <span className="material-symbols-outlined text-primary">speed</span>
                </div>
                <div className="text-headline-sm font-headline-sm">42ms</div>
                <div className="text-[11px] text-secondary mt-1 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> System Optimal
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
              {/* Table Header/Toolbar */}
              <div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-lg">
                  <h2 className="text-title-md font-title-md flex items-center gap-xs">
                    <span className="material-symbols-outlined">list_alt</span>
                    Operation Logs
                  </h2>
                  <div className="flex items-center gap-xs bg-white border border-outline-variant rounded px-2 py-1">
                    <span className="material-symbols-outlined text-outline text-[18px]">search</span>
                    <input className="border-none focus:ring-0 text-body-sm w-48 p-0" placeholder="Search OT Number..." type="text"/>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <span className="text-label-md font-label-md text-on-surface-variant">Showing 1-15 of 2,450 results</span>
                  <div className="flex border border-outline-variant rounded overflow-hidden">
                    <button className="p-1 hover:bg-surface-container-high border-r border-outline-variant bg-white"><span className="material-symbols-outlined">chevron_left</span></button>
                    <button className="p-1 hover:bg-surface-container-high bg-white"><span className="material-symbols-outlined">chevron_right</span></button>
                  </div>
                </div>
              </div>

              {/* Actual Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant text-label-md font-label-md text-on-surface-variant uppercase tracking-tight">
                      <th className="px-md py-3 font-semibold">OT Number</th>
                      <th className="px-md py-3 font-semibold">Action</th>
                      <th className="px-md py-3 font-semibold">Module</th>
                      <th className="px-md py-3 font-semibold">User</th>
                      <th className="px-md py-3 font-semibold">Timestamp</th>
                      <th className="px-md py-3 font-semibold text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-sm font-data-tabular">
                    {/* Row 1 */}
                    <tr className="zebra-stripe border-b border-outline-variant hover:bg-surface-container transition-colors group">
                      <td className="px-md py-3 font-bold text-primary">843291054</td>
                      <td className="px-md py-3">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-secondary">add_task</span>
                          CREATE_FREIGHT_MANIFEST
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#EF4444]">K-MAGASIN</span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-surface-dim flex items-center justify-center text-[10px] font-bold">JD</div>
                          <span>John Doe (ID: 4022)</span>
                        </div>
                      </td>
                      <td className="px-md py-3 text-on-surface-variant">2023-11-24 14:22:15.004</td>
                      <td className="px-md py-3 text-right">
                        <button className="px-3 py-1 bg-white border border-error text-error text-label-sm font-label-sm rounded hover:bg-error hover:text-white transition-all shadow-sm">Cancel</button>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="zebra-stripe border-b border-outline-variant hover:bg-surface-container transition-colors">
                      <td className="px-md py-3 font-bold text-primary">921105382</td>
                      <td className="px-md py-3">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                          UPDATE_INVENTORY_QTY
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0E7FF] text-[#4338CA]">K-PARC</span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-surface-dim flex items-center justify-center text-[10px] font-bold">AS</div>
                          <span>Aminata S. (ID: 3911)</span>
                        </div>
                      </td>
                      <td className="px-md py-3 text-on-surface-variant">2023-11-24 14:20:58.912</td>
                      <td className="px-md py-3 text-right">
                        <button className="px-3 py-1 bg-white border border-error text-error text-label-sm font-label-sm rounded hover:bg-error hover:text-white transition-all shadow-sm">Cancel</button>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr className="zebra-stripe border-b border-outline-variant hover:bg-surface-container transition-colors">
                      <td className="px-md py-3 font-bold text-primary">310029584</td>
                      <td className="px-md py-3">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">currency_exchange</span>
                          POST_LEDGER_ENTRY
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">K-FINANCE</span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-surface-dim flex items-center justify-center text-[10px] font-bold">SY</div>
                          <span>System Auto (ID: 0001)</span>
                        </div>
                      </td>
                      <td className="px-md py-3 text-on-surface-variant">2023-11-24 14:18:22.441</td>
                      <td className="px-md py-3 text-right">
                        <button className="px-3 py-1 bg-white border border-error text-error text-label-sm font-label-sm rounded hover:bg-error hover:text-white transition-all shadow-sm">Cancel</button>
                      </td>
                    </tr>
                    {/* Row 4 */}
                    <tr className="zebra-stripe border-b border-outline-variant hover:bg-surface-container transition-colors">
                      <td className="px-md py-3 font-bold text-primary">119482756</td>
                      <td className="px-md py-3">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span>
                          TRUCK_GATE_EXIT
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF9C3] text-[#854D0E]">K-TRANSPORT</span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-surface-dim flex items-center justify-center text-[10px] font-bold">MK</div>
                          <span>M. Koné (ID: 5521)</span>
                        </div>
                      </td>
                      <td className="px-md py-3 text-on-surface-variant">2023-11-24 14:15:10.012</td>
                      <td className="px-md py-3 text-right">
                        <button className="px-3 py-1 bg-white border border-error text-error text-label-sm font-label-sm rounded hover:bg-error hover:text-white transition-all shadow-sm">Cancel</button>
                      </td>
                    </tr>
                    {/* Row 5 */}
                    <tr className="zebra-stripe border-b border-outline-variant hover:bg-surface-container transition-colors">
                      <td className="px-md py-3 font-bold text-primary">772819405</td>
                      <td className="px-md py-3">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">visibility</span>
                          AUDIT_LOG_READ
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3F4F6] text-[#374151]">K-AUDIT</span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">AD</div>
                          <span>Admin Level 3</span>
                        </div>
                      </td>
                      <td className="px-md py-3 text-on-surface-variant">2023-11-24 14:12:01.883</td>
                      <td className="px-md py-3 text-right">
                        <button className="px-3 py-1 bg-white border border-error text-error text-label-sm font-label-sm rounded hover:bg-error hover:text-white transition-all shadow-sm">Cancel</button>
                      </td>
                    </tr>
                    {/* Row 6 */}
                    <tr className="zebra-stripe border-b border-outline-variant hover:bg-surface-container transition-colors">
                      <td className="px-md py-3 font-bold text-primary">551029384</td>
                      <td className="px-md py-3">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-error">delete_forever</span>
                          PURGE_STALE_CACHE
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3F4F6] text-[#374151]">SYSTEM</span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-xs">
                          <div className="w-6 h-6 rounded-full bg-surface-dim flex items-center justify-center text-[10px] font-bold">RB</div>
                          <span>Root (ID: 0000)</span>
                        </div>
                      </td>
                      <td className="px-md py-3 text-on-surface-variant">2023-11-24 14:10:44.221</td>
                      <td className="px-md py-3 text-right">
                        <button className="px-3 py-1 bg-white border border-error text-error text-label-sm font-label-sm rounded hover:bg-error hover:text-white transition-all shadow-sm">Cancel</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer Pagination */}
              <div className="p-md bg-white border-t border-outline-variant flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-outline-variant rounded text-label-md font-label-md hover:bg-surface-container-high">Previous</button>
                  <button className="px-3 py-1 bg-primary text-white rounded text-label-md font-label-md">1</button>
                  <button className="px-3 py-1 border border-outline-variant rounded text-label-md font-label-md hover:bg-surface-container-high">2</button>
                  <button className="px-3 py-1 border border-outline-variant rounded text-label-md font-label-md hover:bg-surface-container-high">3</button>
                  <span className="px-2 self-center">...</span>
                  <button className="px-3 py-1 border border-outline-variant rounded text-label-md font-label-md hover:bg-surface-container-high">164</button>
                  <button className="px-3 py-1 border border-outline-variant rounded text-label-md font-label-md hover:bg-surface-container-high">Next</button>
                </div>
                <div className="flex items-center gap-md">
                  <span className="text-label-md font-label-md text-on-surface-variant">Rows per page:</span>
                  <select className="border border-outline-variant rounded text-label-md font-label-md py-1 pr-8">
                    <option>15</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contextual Information Card */}
            <div className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="bg-surface-container-highest p-lg rounded-xl border border-outline-variant">
                <h3 className="text-title-md font-title-md mb-md flex items-center gap-xs">
                  <span className="material-symbols-outlined text-primary">terminal</span>
                  T-Code Shortcuts (KM Trace)
                </h3>
                <div className="grid grid-cols-2 gap-md">
                  <div className="flex justify-between items-center p-xs bg-white rounded border border-outline-variant">
                    <span className="font-data-tabular font-bold text-primary">KM24</span>
                    <span className="text-label-sm font-label-sm text-outline">Trace OT</span>
                  </div>
                  <div className="flex justify-between items-center p-xs bg-white rounded border border-outline-variant">
                    <span className="font-data-tabular font-bold text-primary">KM25</span>
                    <span className="text-label-sm font-label-sm text-outline">Cancel OT</span>
                  </div>
                  <div className="flex justify-between items-center p-xs bg-white rounded border border-outline-variant">
                    <span className="font-data-tabular font-bold text-primary">KA01</span>
                    <span className="text-label-sm font-label-sm text-outline">Audit Config</span>
                  </div>
                  <div className="flex justify-between items-center p-xs bg-white rounded border border-outline-variant">
                    <span className="font-data-tabular font-bold text-primary">KA99</span>
                    <span className="text-label-sm font-label-sm text-outline">System Logs</span>
                  </div>
                </div>
                <p className="mt-md text-label-sm font-label-sm text-on-surface-variant italic">Note: All KM series commands require Level 2 clearance or higher.</p>
              </div>
              <div className="relative rounded-xl overflow-hidden min-h-[160px] border border-outline-variant">
                <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB75oDITk8Pz9FEbzvqd7dgS6G2gJ7KlmmzWGDUdMJOcpvIDdSkmZe07-9X9HEnkp8LCE-PcycebmPskx3JUoEHuDr_B_-5duZ3eC8zoerGlpp0MteQQQIFvuBDeGqIIMxgS0euNFtuRB1Sx7lhTG_gKGK7A37Qq7-NGo1mSHtEsl5uol3T-280JR6S26oZuk1DQn3lXR8CPIfRSwoVXkJ831NHNHmFFac-yqQyYMX1U5O24vM2-cEvGzzlkYewFvR3PLbzyPWd_5M"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-lg">
                  <h4 className="text-white font-bold text-title-md">Global Infrastructure</h4>
                  <p className="text-white/80 text-body-sm">Monitoring 14 terminals across West Africa.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
