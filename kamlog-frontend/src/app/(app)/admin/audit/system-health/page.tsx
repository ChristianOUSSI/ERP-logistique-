// src/app/(app)/admin/audit/system-health/page.tsx - Audit System Health Monitor - Fidèle 100% au HTML original
'use client'

export default function SystemHealthMonitorPage() {
  return (
    <>
      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md antialiased overflow-hidden flex">
        {/* SideNavBar */}
        <aside className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-stack-md z-50">
          <div className="p-4 border-b border-outline-variant flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-on-primary font-headline-md font-bold">K</div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-none">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Port Operations</p>
            </div>
          </div>
          <div className="p-4">
            <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded shadow-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>add</span>
              Nouvelle Opération
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/dashboard/global">
                  <span className="material-symbols-outlined">dashboard</span>
                  Tableau de bord
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/transport/control">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/finance/overview">
                  <span className="material-symbols-outlined">payments</span>
                  Finances
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150" href="/parc/overview">
                  <span className="material-symbols-outlined">minor_crash</span>
                  Parc Automobile
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-primary bg-secondary-container font-bold font-label-caps text-label-caps active:scale-95 duration-150 border-l-4 border-primary" href="/settings/system/audit-health">
                  <span className="material-symbols-outlined">settings</span>
                  Paramètres
                </a>
              </li>
            </ul>
          </nav>
          <div className="mt-auto border-t border-outline-variant p-2">
            <ul className="space-y-1 px-2">
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors" href="/support">
                  <span className="material-symbols-outlined">help_outline</span>
                  Support
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors" href="/login">
                  <span className="material-symbols-outlined">logout</span>
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col ml-[260px] h-screen">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-gutter shrink-0">
            <div className="flex items-center gap-6">
              <span className="font-title-sm text-title-sm text-on-surface font-black tracking-tight">KAMLOG EM-ERP</span>
              <nav className="hidden md:flex gap-6">
                <a className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all" href="#">Articles</a>
                <a className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all" href="#">Clients</a>
                <a className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all" href="#">Stocks</a>
                <a className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all" href="#">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <TCodeSearch />
              <div className="flex items-center gap-3 text-on-surface-variant">
                <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden border border-outline-variant">
                  <img alt="User profile with MFA status" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4--7_rZnGGoLPxpKVnjqiSJpMF8GSCrCFqxLYUDGrflUJO_wW-aekPWYpM5VKV-ij1FCS-yHv4hZ1sPkBX-QlVpraRxHS5bXE3EugqIV_IjQnRGyjv--vZtC9UNMLPq0fxe5NCVEWuL4Ch7iLF5UKqW33XWEbrORrol7Byn1DodrjCmP_H6sXS1Ggq2H_5KAWX9GojRBR3VdpR9YA7XDHUDuKx7R_IO_cCP8ci79ily8Pb1gOvl_cggg_eheon_wPDMlV_HPLhcg"/>
                </div>
              </div>
            </div>
          </header>

          {/* Main Stage */}
          <main className="flex-1 overflow-y-auto p-gutter bg-surface-container-low flex flex-col gap-gutter max-w-max-width mx-auto w-full">
            {/* Breadcrumbs & Header */}
            <div className="mb-2">
              <div className="flex items-center text-label-sm font-label-sm text-outline mb-2">
                <span>Paramètres</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span>Système</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span className="text-primary font-semibold">Audit: Santé & Logs</span>
              </div>
              <div className="flex justify-between items-end">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">System Health Audit</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-outline-variant rounded bg-surface text-body-sm font-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">download</span> Exporter
                  </button>
                  <button className="px-3 py-1.5 bg-primary text-on-primary rounded text-body-sm font-body-sm shadow-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">refresh</span> Actualiser
                  </button>
                </div>
              </div>
            </div>

            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* CPU Usage */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface">CPU Allocation</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Core T-1 Logistics Node</p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary">memory</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-headline-lg text-headline-lg leading-none">68%</span>
                  <span className="text-secondary text-label-sm font-label-sm bg-secondary-container px-1.5 py-0.5 rounded flex items-center"><span className="material-symbols-outlined text-[12px]">arrow_downward</span> 2.4%</span>
                </div>
                {/* Faux Bar Chart */}
                <div className="flex items-end gap-1 h-12 mt-4 opacity-80">
                  <div className="w-full bg-surface-container-highest rounded-t h-[40%]"></div>
                  <div className="w-full bg-surface-container-highest rounded-t h-[55%]"></div>
                  <div className="w-full bg-surface-container-highest rounded-t h-[60%]"></div>
                  <div className="w-full bg-surface-container-highest rounded-t h-[45%]"></div>
                  <div className="w-full bg-surface-container-highest rounded-t h-[70%]"></div>
                  <div className="w-full bg-surface-container-highest rounded-t h-[85%]"></div>
                  <div className="w-full bg-tertiary rounded-t h-[68%]"></div>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface">Memory Utilization</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Active JVM Heap</p>
                  </div>
                  <span className="material-symbols-outlined text-primary">data_usage</span>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="font-headline-lg text-headline-lg leading-none">24.2 <span className="text-title-md font-title-md text-outline">GB</span></span>
                  <span className="text-error text-label-sm font-label-sm bg-error-container px-1.5 py-0.5 rounded flex items-center"><span className="material-symbols-outlined text-[12px]">arrow_upward</span> 12%</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[78%]"></div>
                </div>
                <div className="flex justify-between mt-2 text-label-sm font-label-sm text-outline">
                  <span>Used: 78%</span>
                  <span>Total: 32 GB</span>
                </div>
              </div>

              {/* DB Connection Pool */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm border-l-4 border-l-error">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface">DB Connection Pool</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">PostgreSQL - KAMLOG_MAIN</p>
                  </div>
                  <span className="material-symbols-outlined text-error">database</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-headline-lg text-headline-lg leading-none text-error">195/200</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-surface-container p-2 rounded border border-outline-variant">
                    <span className="block text-label-sm font-label-sm text-outline uppercase">Active</span>
                    <span className="font-title-lg text-title-lg">182</span>
                  </div>
                  <div className="bg-error-container p-2 rounded border border-error/20">
                    <span className="block text-label-sm font-label-sm text-on-error-container uppercase">Idle</span>
                    <span className="font-title-lg text-title-lg text-on-error-container">13</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Logs Table */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
                <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">list_alt</span>
                  Critical Event Stream
                </h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[16px]">filter_list</span>
                    <select className="pl-8 pr-6 py-1 bg-surface-container border border-outline-variant rounded text-body-sm font-body-sm focus:outline-none appearance-none cursor-pointer">
                      <option>Severity: ERROR</option>
                      <option>Severity: ALL</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-high font-label-md text-label-md text-on-surface-variant sticky top-0">
                    <tr>
                      <th className="py-2 px-4 border-b border-outline-variant font-medium w-32">Timestamp</th>
                      <th className="py-2 px-4 border-b border-outline-variant font-medium w-24">Level</th>
                      <th className="py-2 px-4 border-b border-outline-variant font-medium w-48">Service</th>
                      <th className="py-2 px-4 border-b border-outline-variant font-medium">Message</th>
                      <th className="py-2 px-4 border-b border-outline-variant font-medium w-48">Correlation ID</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-tabular text-data-tabular">
                    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 text-outline">14:02:11.405</td>
                      <td className="py-3 px-4">
                        <span className="bg-error-container text-error px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Error</span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">KAMLOG-Finance-Svc</td>
                      <td className="py-3 px-4 font-medium">Connection timeout to payment gateway (Retry 3/3)</td>
                      <td className="py-3 px-4 text-outline text-[11px] font-mono">req-7b8a-4c2d-9f1e</td>
                    </tr>
                    <tr className="border-b border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 text-outline">14:01:55.120</td>
                      <td className="py-3 px-4">
                        <span className="bg-error-container text-error px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Error</span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">KAMLOG-Auth-Svc</td>
                      <td className="py-3 px-4 font-medium">Invalid LDAP credentials supplied for user_id: 8442</td>
                      <td className="py-3 px-4 text-outline text-[11px] font-mono">req-11a2-9b4f-00c1</td>
                    </tr>
                    <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 text-outline">13:58:44.901</td>
                      <td className="py-3 px-4">
                        <span className="bg-tertiary-fixed-dim text-on-tertiary-fixed-variant px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Warn</span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">Postgres-DB-Master</td>
                      <td className="py-3 px-4">Connection pool approaching max capacity (95%)</td>
                      <td className="py-3 px-4 text-outline text-[11px] font-mono">sys-db-pool-mon</td>
                    </tr>
                    <tr className="border-b border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 text-outline">13:45:10.002</td>
                      <td className="py-3 px-4">
                        <span className="bg-error-container text-error px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">Error</span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">KAMLOG-Logistics-Svc</td>
                      <td className="py-3 px-4 font-medium">Failed to parse manifest XML from T-Code: MNF-209</td>
                      <td className="py-3 px-4 text-outline text-[11px] font-mono">req-88c1-2d3e-4a5b</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
