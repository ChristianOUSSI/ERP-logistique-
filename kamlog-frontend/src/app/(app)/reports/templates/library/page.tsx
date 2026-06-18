// src/app/(app)/reports/templates/library/page.tsx - Rapports Bibliothèque de Modèles Enregistrés - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReportsLibrary() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('me')
  const [sortFilter, setSortFilter] = useState('last_used')

  const handleCreateTemplate = () => {
    router.push('/reports/templates/create')
  }

  const handleRunReport = (reportId: string) => {
    // Run report - will be connected to backend
  }

  const handleEditReport = (reportId: string) => {
    router.push(`/reports/templates/edit/${reportId}`)
  }

  const templates = [
    {
      id: 1,
      module: 'Transport',
      moduleColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      icon: 'local_shipping',
      title: 'Monthly Fuel Consumption',
      description: 'Aggregates all fuel tickets across the fleet, calculating efficiency per 100km and variance against budget.',
      lastRun: '2 hrs ago',
      frequency: 'Weekly',
      owner: 'System'
    },
    {
      id: 2,
      module: 'Magasin',
      moduleColor: 'bg-error-container text-on-error-container',
      icon: 'warehouse',
      title: 'Weekly Stock Variance',
      description: 'Highlights discrepancies between physical counts and system records for high-value SKU categories.',
      lastRun: 'Yesterday',
      frequency: 'Daily',
      owner: 'Me'
    },
    {
      id: 3,
      module: 'Finance',
      moduleColor: 'bg-secondary-container text-on-secondary-container',
      icon: 'payments',
      title: 'Port Fees Reconciliation',
      description: 'Matches incoming invoice data from port authority against internal docking schedules to identify overcharges.',
      lastRun: '12 Oct 2023',
      frequency: 'Monthly',
      owner: 'Finance Dept'
    },
    {
      id: 4,
      module: 'Parc',
      moduleColor: 'bg-primary-fixed text-on-primary-fixed-variant',
      icon: 'minor_crash',
      title: 'Vehicle Maintenance Log',
      description: 'Upcoming maintenance schedules and historical service records filtered by terminal zone.',
      lastRun: 'Just now',
      frequency: 'Ad-hoc',
      owner: 'Me'
    }
  ]

  const recentReports = [
    { id: 1, module: 'Transport', moduleColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', icon: 'local_shipping', title: 'Daily Dispatch Sheet', time: 'Ran 15 mins ago' },
    { id: 2, module: 'Magasin', moduleColor: 'bg-error-container text-on-error-container', icon: 'warehouse', title: 'Critical Low Stock Alerts', time: 'Ran 2 hours ago' },
    { id: 3, module: 'Parc', moduleColor: 'bg-primary-fixed text-on-primary-fixed-variant', icon: 'minor_crash', title: 'Driver Timesheets', time: 'Ran yesterday' }
  ]

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
      `}</style>
      <div className="bg-surface-container-low min-h-screen text-on-surface overflow-x-hidden">
        {/* SideNavBar */}
        <nav className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col p-4 z-50">
          <div className="mb-8 px-4 mt-2">
            <div className="font-headline-md text-headline-md text-primary font-bold tracking-tight">KAMLOG ERP</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">Port Operations</div>
          </div>
          <button className="mb-6 flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-2.5 px-4 rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nouvelle Opération
          </button>
          <div className="flex flex-col gap-1 flex-1">
            <a onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-title-md text-title-md group cursor-pointer">
              <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">dashboard</span>
              Tableau de bord
            </a>
            <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-title-md text-title-md group cursor-pointer">
              <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">local_shipping</span>
              Transport
            </a>
            <a onClick={() => router.push('/finance')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-title-md text-title-md group cursor-pointer">
              <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">payments</span>
              Finances
            </a>
            <a onClick={() => router.push('/parc')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-title-md text-title-md group cursor-pointer">
              <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">minor_crash</span>
              Parc Automobile
            </a>
            <a onClick={() => router.push('/settings')} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-title-md text-title-md group cursor-pointer">
              <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">settings</span>
              Paramètres
            </a>
          </div>
          <div className="mt-auto border-t border-outline-variant pt-4 flex flex-col gap-1">
            <a onClick={() => router.push('/support')} className="flex items-center gap-3 px-4 py-2 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-body-sm text-body-sm cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
              Support
            </a>
            <a onClick={() => router.push('/logout')} className="flex items-center gap-3 px-4 py-2 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-body-sm text-body-sm cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Déconnexion
            </a>
          </div>
        </nav>
        {/* TopNavBar */}
        <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem] ml-[260px] w-[calc(100%-260px)] shadow-sm">
          <div className="flex items-center gap-8 h-full">
            <div className="font-title-sm text-title-sm text-on-surface font-black hidden md:block">KAMLOG EM-ERP</div>
            <nav className="flex gap-6 h-full items-end">
              <a onClick={() => router.push('/master-data/articles')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all pb-[18px] cursor-pointer">Articles</a>
              <a onClick={() => router.push('/master-data/clients')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all pb-[18px] cursor-pointer">Clients</a>
              <a onClick={() => router.push('/magasin')} className="font-body-base text-body-base text-on-surface-variant hover:text-primary transition-all pb-[18px] cursor-pointer">Stocks</a>
              <a onClick={() => router.push('/reports')} className="font-body-base text-body-base text-primary border-b-2 border-primary pb-[16px] font-medium cursor-pointer">Rapports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-lg">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input className="pl-9 pr-4 py-1.5 bg-surface-container border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none w-48 text-on-surface placeholder-on-surface-variant" placeholder="Rechercher T-Code" type="text"/>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant border-l border-outline-variant pl-4">
              <button className="p-1 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <button onClick={() => router.push('/security')} className="p-1 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
              <button onClick={() => router.push('/profile')} className="p-1 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined text-[28px] text-primary">account_circle</span></button>
            </div>
          </div>
        </header>
        {/* Main Workspace */}
        <div className="ml-[260px] p-[1rem] min-h-[calc(100vh-64px)] flex gap-[1rem] items-start max-w-[1600px]">
          {/* Center Stage: Templates Library */}
          <main className="flex-1 flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 font-label-sm text-label-sm text-outline mb-1">
                  <a onClick={() => router.push('/reports')} className="hover:text-primary transition-colors cursor-pointer">Rapports</a>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-on-surface">Bibliothèque</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Saved Templates</h1>
              </div>
              <button onClick={handleCreateTemplate} className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">note_add</span>
                Create New Template
              </button>
            </div>
            {/* Filter & Search Bar */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                  <input 
                    className="w-full pl-9 pr-3 py-1.5 border border-outline-variant rounded bg-surface focus:outline-none focus:ring-1 focus:ring-primary font-body-sm text-body-sm placeholder-on-surface-variant" 
                    placeholder="Search templates..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="h-6 w-px bg-outline-variant"></div>
                <select 
                  className="border border-outline-variant rounded py-1.5 px-3 bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface-variant appearance-none min-w-[140px]"
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                >
                  <option value="all">Module: All</option>
                  <option value="transport">Transport</option>
                  <option value="magasin">Magasin</option>
                  <option value="finance">Finance</option>
                  <option value="parc">Parc</option>
                </select>
                <select 
                  className="border border-outline-variant rounded py-1.5 px-3 bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface-variant appearance-none min-w-[140px]"
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                >
                  <option value="me">Owner: Me</option>
                  <option value="system">Owner: System</option>
                  <option value="shared">Owner: Shared</option>
                </select>
                <select 
                  className="border border-outline-variant rounded py-1.5 px-3 bg-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface-variant appearance-none min-w-[140px]"
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                >
                  <option value="last_used">Sort: Last Used</option>
                  <option value="az">Sort: A-Z</option>
                  <option value="newest">Sort: Newest</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pl-4 border-l border-outline-variant">
                <button className="p-1.5 text-primary bg-surface-container rounded hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-[20px]">grid_view</span></button>
                <button className="p-1.5 text-outline hover:bg-surface-container rounded transition-colors"><span className="material-symbols-outlined text-[20px]">view_list</span></button>
              </div>
            </div>
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {templates.map((template) => (
                <div key={template.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex justify-between items-start">
                    <div className={`inline-flex items-center gap-1.5 ${template.moduleColor} px-2 py-0.5 rounded font-label-sm text-label-sm uppercase`}>
                      <span className="material-symbols-outlined text-[14px]">{template.icon}</span>
                      {template.module}
                    </div>
                    <button className="text-outline hover:text-on-surface transition-colors opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">more_vert</span></button>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface mb-1 group-hover:text-primary transition-colors cursor-pointer">{template.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 h-9">{template.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 mt-auto pt-4 border-t border-surface-container-highest font-data-tabular text-data-tabular">
                    <div className="text-outline">Last Run: <span className="text-on-surface">{template.lastRun}</span></div>
                    <div className="text-outline">Freq: <span className="text-on-surface">{template.frequency}</span></div>
                    <div className="text-outline">Owner: <span className="text-on-surface">{template.owner}</span></div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleRunReport(template.id.toString())} className="flex-1 bg-surface-container text-primary py-2 rounded font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      Run Now
                    </button>
                    <button onClick={() => handleEditReport(template.id.toString())} className="px-3 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
          {/* Right Rail: Contextual Pane */}
          <aside className="w-[280px] bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hidden xl:flex flex-col gap-4 sticky top-[80px]">
            <h2 className="font-title-md text-title-md text-on-surface flex items-center gap-2 border-b border-surface-container-highest pb-3">
              <span className="material-symbols-outlined text-outline text-[20px]">history</span>
              Recently Used
            </h2>
            <div className="flex flex-col gap-2">
              {recentReports.map((report) => (
                <a key={report.id} className="group flex items-start gap-3 p-2 rounded hover:bg-surface-container transition-colors cursor-pointer">
                  <div className={`mt-1 ${report.moduleColor} p-1 rounded`}>
                    <span className="material-symbols-outlined text-[16px] block">{report.icon}</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{report.title}</div>
                    <div className="font-data-tabular text-data-tabular text-outline mt-0.5">{report.time}</div>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-surface-container-highest">
              <div className="bg-surface-container rounded-lg p-3 border border-outline-variant border-dashed flex flex-col items-center text-center gap-2">
                <span className="material-symbols-outlined text-outline">tune</span>
                <div className="font-label-sm text-label-sm text-on-surface-variant">Need a specific layout?</div>
                <button onClick={() => router.push('/reports/custom')} className="text-primary font-label-md text-label-md hover:underline">Build Custom Report</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
