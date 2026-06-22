// src/app/(app)/security/alert-monitoring/page.tsx - Security Alert Monitoring Center - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SecurityAlertMonitoring() {
  const router = useRouter()
  const [selectedAlerts, setSelectedAlerts] = useState<Set<number>>(new Set())
  const [severityFilters, setSeverityFilters] = useState({ critical: true, high: true, medium: false, low: false })

  const alerts = [
    { id: 1, type: 'MFA Bypass Attempt', severity: 'Critical', module: 'K-FINANCE', location: 'Terminal B-04 / IP: 192.168.1.42', user: 'U_ADMN_921', token: 'AB-92-9331', timestamp: '2023-11-24 14:02:11' },
    { id: 2, type: 'Unauthorized File Export', severity: 'High', module: 'K-HR', location: 'Export: Payroll_2023.csv', user: 'U_MGR_012', token: 'Dept: Logistics-Ops', timestamp: '2023-11-24 13:58:45' },
    { id: 3, type: 'Brute Force Detected', severity: 'Medium', module: 'Auth Gateway', location: '5 failed attempts / 30s', user: 'ANON_EXT_01', token: 'Proxy Detected', timestamp: '2023-11-24 13:42:01' },
    { id: 4, type: 'System Integrity Warning', severity: 'Low', module: 'K-MAGASIN', location: 'Checksum mismatch (Log-04)', user: 'SYS_BOT_88', token: 'Auto-correct pending', timestamp: '2023-11-24 13:10:12' }
  ]

  const handleAlertSelect = (id: number) => {
    setSelectedAlerts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleViewDetails = (id: number) => {
    router.push(`/security/alert-monitoring/${id}`)
  }

  const handleAcknowledgeAll = () => {
    // Acknowledge all alerts - will be connected to backend
  }

  const handleClearResolved = () => {
    // Clear resolved alerts - will be connected to backend
  }

  const handleGenerateReport = () => {
    router.push('/security/reports')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-error'
      case 'High': return 'bg-tertiary'
      case 'Medium': return 'bg-primary'
      case 'Low': return 'bg-secondary'
      default: return 'bg-outline'
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-error/10 text-error'
      case 'High': return 'bg-tertiary/10 text-tertiary'
      case 'Medium': return 'bg-primary/10 text-primary'
      case 'Low': return 'bg-secondary/10 text-secondary'
      default: return 'bg-outline/10 text-outline'
    }
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 2px; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface">
        {/* TopNavBar */}
        <header className="fixed top-0 left-0 w-full bg-surface-container-highest border-b border-outline-variant flex justify-between items-center px-[1.5rem] h-14 z-50">
          <div className="flex items-center gap-8">
            <span className="font-headline-md text-headline-md font-bold text-primary">KAMLOG EM-ERP</span>
            <nav className="hidden md:flex gap-6">
              <a onClick={() => router.push('/dashboard')} className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Dashboard</a>
              <a onClick={() => router.push('/audit')} className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Activity Log</a>
              <a onClick={() => router.push('/security/audit')} className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 cursor-pointer">User Audit</a>
              <a onClick={() => router.push('/compliance')} className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Compliance</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-surface-container flex items-center px-3 py-1.5 rounded border border-outline-variant w-64">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant mr-2">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-label-md w-full" placeholder="Search T-Codes (e.g. K-SEC-01)" type="text"/>
            </div>
            <button onClick={() => router.push('/security')} className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">security</button>
            <button onClick={() => router.push('/admin')} className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">admin_panel_settings</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">notifications</button>
            <button onClick={() => router.push('/profile')} className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">account_circle</button>
          </div>
        </header>
        {/* SideNavBar */}
        <aside className="fixed left-0 top-0 h-full w-60 bg-surface-container-low flex flex-col pt-14 z-40">
          <div className="p-6 border-b border-outline-variant/30">
            <div className="flex items-center gap-3 mb-4">
              <img alt="Audit Officer Avatar" className="w-10 h-10 rounded-full border border-secondary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD_Pb2epWHWmHciH_vEIQNpENB1yWD0ysIVYy-0Wp4dslL01eNSnjOkiVq3QSClFCsr--bWz0a8UsmBu9f3EWwN6M2OYTNwZr5JZv8NVTbAHNem6a0WMILJjYJny7zKSzdWp-mmlwriMlSrWxaLyRjySuWXgF7Ym1TFOAURqJziiyl7HG1k29x-hK-DN3k8V08o3AtMuEQWNvSJw2eW57f4lfWlT8WUfwupvf-xNUzDD0-aiyyPca1qj4gknzG29P-QnNOkQ5QFCQ"/>
              <div>
                <p className="font-headline-sm text-headline-sm font-black text-secondary">Audit & Security</p>
                <p className="font-label-sm text-label-sm text-outline">Module: K-AUDIT</p>
              </div>
            </div>
            <button onClick={handleGenerateReport} className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-2 rounded shadow-sm hover:opacity-90 transition-all">Generate Forensic Report</button>
          </div>
          <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
            <a onClick={() => router.push('/security/overview')} className="flex items-center px-4 py-3 text-secondary font-bold border-l-4 border-secondary bg-secondary-container/10 transition-all duration-150 ease-in-out cursor-pointer">
              <span className="material-symbols-outlined mr-3">shield</span>
              <span className="font-title-md text-title-md">Security Overview</span>
            </a>
            <a onClick={() => router.push('/security/event-viewer')} className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out cursor-pointer">
              <span className="material-symbols-outlined mr-3">list_alt</span>
              <span className="font-label-md text-label-md">Event Viewer</span>
            </a>
            <a onClick={() => router.push('/security/policies')} className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out cursor-pointer">
              <span className="material-symbols-outlined mr-3">policy</span>
              <span className="font-label-md text-label-md">Policy Manager</span>
            </a>
            <a onClick={() => router.push('/security/key-vault')} className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out cursor-pointer">
              <span className="material-symbols-outlined mr-3">vpn_key</span>
              <span className="font-label-md text-label-md">Key Vault</span>
            </a>
            <a onClick={() => router.push('/security/integrity')} className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out cursor-pointer">
              <span className="material-symbols-outlined mr-3">verified_user</span>
              <span className="font-label-md text-label-md">System Integrity</span>
            </a>
            <a onClick={() => router.push('/security/reports')} className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out cursor-pointer">
              <span className="material-symbols-outlined mr-3">analytics</span>
              <span className="font-label-md text-label-md">Audit Reports</span>
            </a>
          </nav>
          <div className="p-4 border-t border-outline-variant/30">
            <a onClick={() => router.push('/settings')} className="flex items-center px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded transition-all cursor-pointer">
              <span className="material-symbols-outlined mr-3">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </a>
            <a onClick={() => router.push('/support')} className="flex items-center px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded transition-all cursor-pointer">
              <span className="material-symbols-outlined mr-3">help</span>
              <span className="font-label-md text-label-md">Support</span>
            </a>
          </div>
        </aside>
        {/* Main Content Area */}
        <main className="ml-60 pt-14 min-h-screen">
          <div className="max-w-[1600px] mx-auto p-[1rem]">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-4 text-outline font-label-md text-label-md">
              <a onClick={() => router.push('/dashboard')} className="hover:text-primary cursor-pointer">ERP Global</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <a onClick={() => router.push('/security')} className="hover:text-primary cursor-pointer">Audit & Security</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface">Security: Alert Monitoring Center</span>
            </nav>
            <div className="flex gap-[1rem]">
              {/* Filter Sidebar */}
              <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-sm">
                  <h3 className="font-title-md text-title-md mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">filter_alt</span>
                    Alert Filters
                  </h3>
                  <div className="space-y-6">
                    {/* Severity */}
                    <div>
                      <label className="font-label-sm text-label-sm uppercase text-outline block mb-2">Severity Level</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            checked={severityFilters.critical}
                            onChange={(e) => setSeverityFilters({...severityFilters, critical: e.target.checked})}
                            className="w-4 h-4 rounded border-outline-variant text-error focus:ring-error/20" 
                            type="checkbox"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface">Critical</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            checked={severityFilters.high}
                            onChange={(e) => setSeverityFilters({...severityFilters, high: e.target.checked})}
                            className="w-4 h-4 rounded border-outline-variant text-tertiary focus:ring-tertiary/20" 
                            type="checkbox"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface">High</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            checked={severityFilters.medium}
                            onChange={(e) => setSeverityFilters({...severityFilters, medium: e.target.checked})}
                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                            type="checkbox"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface">Medium</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            checked={severityFilters.low}
                            onChange={(e) => setSeverityFilters({...severityFilters, low: e.target.checked})}
                            className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20" 
                            type="checkbox"
                          />
                          <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface">Low</span>
                        </label>
                      </div>
                    </div>
                    {/* Module */}
                    <div>
                      <label className="font-label-sm text-label-sm uppercase text-outline block mb-2">Target Module</label>
                      <select className="w-full bg-surface-container-low border border-outline-variant rounded p-2 font-body-sm text-body-sm">
                        <option>All Modules</option>
                        <option>K-FINANCE</option>
                        <option>K-PARC</option>
                        <option>K-MAGASIN</option>
                        <option>K-HR</option>
                      </select>
                    </div>
                    {/* Time Range */}
                    <div>
                      <label className="font-label-sm text-label-sm uppercase text-outline block mb-2">Time Range</label>
                      <div className="space-y-2">
                        <input className="w-full bg-surface-container-low border border-outline-variant rounded p-2 font-body-sm text-body-sm" type="date"/>
                        <input className="w-full bg-surface-container-low border border-outline-variant rounded p-2 font-body-sm text-body-sm" type="date"/>
                      </div>
                    </div>
                    <button className="w-full bg-surface-container-high border border-outline-variant font-label-md text-label-md py-2 rounded hover:bg-surface-variant transition-colors">Reset All Filters</button>
                  </div>
                </div>
                {/* Risk Profile Image Card */}
                <div className="relative overflow-hidden rounded-lg h-48 border border-outline-variant bg-secondary-container/10 group">
                  <img className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2XbDxjH52vfsB9gyP9agkFvm12_efHAOYKrHhL6mhRsQ1Gv3lF5AluMG6UMhifFzggIF6-Cn_1-hKG93kHpa0JRqxDmjdLEfhnEtDDbqcHJR-dpoymzMc7t0fbFvrDz7Kb1rceCpPAnUULYO6P4AbQYOV4LOzjyZEJ2mkZoTzllBvUrjuyNEtue2Efwuinbiw6SBZ5nKwZCkwrXEeVArdosiiBw5imPHQJHFzpt9OVFhikSr71gf9lIj0CVU6Nc3CX10GIq9-9cM"/>
                  <div className="relative p-4 flex flex-col h-full justify-between">
                    <span className="font-label-sm text-label-sm bg-secondary/10 text-secondary px-2 py-1 rounded w-fit">Live Status</span>
                    <div className="space-y-1">
                      <p className="font-title-md text-title-md font-bold text-secondary">System Integrity: 98.4%</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Last deep scan: 14m ago</p>
                    </div>
                  </div>
                </div>
              </aside>
              {/* Alerts List Area */}
              <div className="flex-1">
                {/* Page Header Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Security: Alert Monitoring Center</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">Real-time surveillance of ERP transaction patterns and access logs.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAcknowledgeAll} className="bg-surface-container-high border border-outline-variant text-on-surface font-label-md text-label-md px-4 py-2.5 rounded flex items-center gap-2 hover:bg-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[20px]">done_all</span>
                      Acknowledge All
                    </button>
                    <button onClick={handleClearResolved} className="bg-secondary text-on-secondary font-label-md text-label-md px-4 py-2.5 rounded flex items-center gap-2 hover:opacity-90 transition-all">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      Clear Resolved
                    </button>
                  </div>
                </div>
                {/* Alerts Table/List */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
                  {/* Table Headers */}
                  <div className="grid grid-cols-[48px_1.2fr_1fr_1fr_1fr_100px] gap-4 bg-surface-container-low border-b border-outline-variant px-4 py-3">
                    <div className="flex justify-center"><input className="w-4 h-4 rounded border-outline-variant" type="checkbox"/></div>
                    <div className="font-label-sm text-label-sm text-outline uppercase">Alert Type & Severity</div>
                    <div className="font-label-sm text-label-sm text-outline uppercase">Module / Location</div>
                    <div className="font-label-sm text-label-sm text-outline uppercase">User / Device ID</div>
                    <div className="font-label-sm text-label-sm text-outline uppercase">Timestamp</div>
                    <div className="font-label-sm text-label-sm text-outline uppercase text-right">Action</div>
                  </div>
                  {/* Alert Rows */}
                  <div className="divide-y divide-outline-variant/30">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`grid grid-cols-[48px_1.2fr_1fr_1fr_1fr_100px] gap-4 px-4 py-4 hover:bg-surface-container transition-colors items-center ${selectedAlerts.has(alert.id) ? 'bg-secondary-container/5' : ''}`}>
                        <div className="flex justify-center">
                          <input 
                            checked={selectedAlerts.has(alert.id)}
                            onChange={() => handleAlertSelect(alert.id)}
                            className="w-4 h-4 rounded border-outline-variant" 
                            type="checkbox"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)} ${alert.severity === 'Critical' ? 'animate-pulse' : ''}`}></span>
                          <div>
                            <p className="font-title-md text-title-md font-semibold text-on-surface">{alert.type}</p>
                            <span className={`${getSeverityBgColor(alert.severity)} text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider`}>{alert.severity}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-data-tabular text-data-tabular text-on-surface">{alert.module}</p>
                          <p className="text-[11px] text-outline">{alert.location}</p>
                        </div>
                        <div>
                          <p className="font-data-tabular text-data-tabular text-on-surface">{alert.user}</p>
                          <p className="text-[11px] text-outline">{alert.token}</p>
                        </div>
                        <div className="font-data-tabular text-data-tabular text-on-surface">
                          {alert.timestamp}
                        </div>
                        <div className="text-right">
                          <button onClick={() => handleViewDetails(alert.id)} className="text-primary font-label-md text-label-md hover:underline">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Footer / Pagination */}
                  <div className="bg-surface-container-low border-t border-outline-variant px-4 py-3 flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 1-4 of 24 active security alerts</span>
                    <div className="flex gap-1">
                      <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                      <button className="w-8 h-8 rounded flex items-center justify-center bg-secondary text-on-secondary font-label-md text-label-md">1</button>
                      <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md">2</button>
                      <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md">3</button>
                      <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                    </div>
                  </div>
                </div>
                {/* Statistics Bento Section */}
                <div className="mt-[1rem] grid grid-cols-1 md:grid-cols-3 gap-[1rem]">
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-error-container text-on-error-container rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-outline uppercase">Active Critical</p>
                      <p className="font-headline-sm text-headline-sm font-bold text-on-surface">03</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined">history</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-outline uppercase">Resolved (24h)</p>
                      <p className="font-headline-sm text-headline-sm font-bold text-on-surface">142</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined">security</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-outline uppercase">Audit Score</p>
                      <p className="font-headline-sm text-headline-sm font-bold text-on-surface">A+</p>
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
