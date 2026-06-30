// src/app/(app)/security/dashboard/page.tsx - Security Dashboard Summary Metrics - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SecurityDashboard() {
  const router = useRouter()
  const [selectedAlerts, setSelectedAlerts] = useState<Set<number>>(new Set())

  const criticalAlerts = [
    { id: 1, detail: 'Brute force attempt detected', ip: '192.168.4.112', module: 'K-FINANCE', timestamp: '12:44:02 PM', severity: 'error' },
    { id: 2, detail: 'Unauthorized API Token usage', ip: 'Internal_Gateway_01', module: 'K-PARC', timestamp: '12:38:15 PM', severity: 'error' },
    { id: 3, detail: 'Privileged escalation warning', ip: '10.0.42.18', module: 'K-AUDIT', timestamp: '11:12:00 AM', severity: 'tertiary' },
    { id: 4, detail: 'Database mass-export initiated', ip: 'Admin_004', module: 'K-MAGASIN', timestamp: '10:55:22 AM', severity: 'error' },
    { id: 5, detail: 'Geo-location mismatch - Tokyo', ip: '203.0.113.5', module: 'K-TRANSPORT', timestamp: '09:42:11 AM', severity: 'error' }
  ]

  const modules = [
    { name: 'K-Finance', description: 'General Ledger & Assets', color: 'bg-primary', status: 'Secure', statusColor: 'text-secondary bg-secondary/10', checkTime: 'Check 12s ago' },
    { name: 'K-Transport', description: 'Fleet & Driver Logs', color: 'bg-secondary', status: 'Secure', statusColor: 'text-secondary bg-secondary/10', checkTime: 'Check 1m ago' },
    { name: 'K-Magasin', description: 'Warehouse & Stock', color: 'bg-tertiary', status: 'Warning', statusColor: 'text-tertiary bg-tertiary/10', checkTime: 'Pending update' },
    { name: 'K-Parc', description: 'Infrastructure & Hardware', color: 'bg-on-surface-variant', status: 'Secure', statusColor: 'text-secondary bg-secondary/10', checkTime: 'Check 5s ago' }
  ]

  const handleAcknowledge = (id: number) => {
    // Acknowledge alert - will be connected to backend
  }

  const handleViewAllAlerts = () => {
    router.push('/security/alert-monitoring')
  }

  const handleRefresh = () => {
    // Refresh data - will be connected to backend
  }

  const handleGenerateReport = () => {
    router.push('/security/reports')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
          vertical-align: middle;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 10px; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface antialiased overflow-hidden">
        
        
        
        <aside className="fixed left-0 top-0 h-full w-60 bg-surface-container-low flex flex-col pt-14 z-40">
          <div className="px-4 py-6 border-b border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-black text-secondary uppercase leading-none">Audit & Security</h2>
                <p className="font-label-md text-label-md text-on-surface-variant">Module: K-AUDIT</p>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-4 space-y-4">
            <button onClick={handleGenerateReport} className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">analytics</span>
              Generate Forensic Report
            </button>
            <div className="pt-4 border-t border-outline-variant/30 space-y-1">
              <div onClick={() => router.push('/settings')} className="flex items-center text-on-surface-variant px-4 py-2 hover:bg-surface-container transition-all cursor-pointer">
                <span className="material-symbols-outlined mr-3 text-sm">settings</span>
                <span className="font-label-md text-label-md">Settings</span>
              </div>
              <div onClick={() => router.push('/support')} className="flex items-center text-on-surface-variant px-4 py-2 hover:bg-surface-container transition-all cursor-pointer">
                <span className="material-symbols-outlined mr-3 text-sm">help</span>
                <span className="font-label-md text-label-md">Support</span>
              </div>
            </div>
          </div>
        </aside>
        {/* Main Content Stage */}
        <main className="pt-14 h-screen overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-[1.5rem] space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-end">
              <div>
                
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Security Operations Center</h1>
              </div>
              <div className="flex gap-3">
                <div className="bg-surface-container-high px-4 py-2 rounded border border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant">calendar_today</span>
                  <span className="font-label-md text-label-md">Last 24 Hours</span>
                  <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                </div>
                <button onClick={handleRefresh} className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">sync</span>
                  Refresh Data
                </button>
              </div>
            </div>
            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-[1rem]">
              {/* 1. Security Scorecard */}
              <div className="col-span-12 lg:col-span-4 h-full">
                <div className="bg-white border border-outline-variant p-6 rounded-xl h-full flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors"></div>
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="font-title-lg text-title-lg text-on-surface">Security Health Score</h3>
                      <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2 py-1 rounded-full">+2.4% vs prev week</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-headline-lg text-[64px] font-black text-secondary leading-none">94</span>
                      <span className="font-headline-md text-headline-md text-outline">/100</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-4">System posture is rated <span className="text-secondary font-bold">Excellent</span>. No critical vulnerabilities detected in top-level modules.</p>
                  </div>
                  <div className="mt-8 space-y-3">
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full" style={{width: '94%'}}></div>
                    </div>
                    <div className="flex justify-between font-label-md text-label-md text-outline">
                      <span>Risk Level: Minimal</span>
                      <span>Updated: 2 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 2. Threat Detection Summary */}
              <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-[1rem]">
                <div className="bg-white border border-outline-variant p-5 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error">gpp_maybe</span>
                    </div>
                    <h4 className="font-label-md text-label-md text-on-surface-variant">Active Threats</h4>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface">12</div>
                  <div className="flex items-center gap-1 text-error font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>3 new alerts</span>
                  </div>
                </div>
                <div className="bg-white border border-outline-variant p-5 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">security</span>
                    </div>
                    <h4 className="font-label-md text-label-md text-on-surface-variant">Blocked Attacks</h4>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface">1,402</div>
                  <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Mitigated 100%</span>
                  </div>
                </div>
                <div className="bg-white border border-outline-variant p-5 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary">person_search</span>
                    </div>
                    <h4 className="font-label-md text-label-md text-on-surface-variant">Unusual Logins</h4>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface">04</div>
                  <div className="flex items-center gap-1 text-tertiary font-label-sm text-label-sm mt-1">
                    <span className="material-symbols-outlined text-sm">priority_high</span>
                    <span>Geo-fence triggers</span>
                  </div>
                </div>
                {/* 3. MFA & Access Compliance */}
                <div className="col-span-3 bg-white border border-outline-variant p-6 rounded-xl flex items-center justify-between">
                  <div className="space-y-4">
                    <h3 className="font-title-lg text-title-lg text-on-surface">Access Compliance</h3>
                    <div className="flex gap-8">
                      <div className="flex flex-col">
                        <span className="font-headline-md text-headline-md text-on-surface">98.2%</span>
                        <span className="font-label-md text-label-md text-on-surface-variant">MFA Adoption</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-md text-headline-md text-on-surface">1,248</span>
                        <span className="font-label-md text-label-md text-on-surface-variant">Active Sessions</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-md text-headline-md text-on-surface">0</span>
                        <span className="font-label-md text-label-md text-on-surface-variant">Privileged Expiry</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <path className="stroke-surface-container-high fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeWidth="3"></path>
                      <path className="stroke-primary fill-none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeDasharray="98, 100" strokeLinecap="round" strokeWidth="3"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-primary font-label-md">98%</div>
                  </div>
                </div>
              </div>
              {/* 4. Recent Critical Alerts */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
                    <h3 className="font-title-lg text-title-lg text-on-surface">Recent Critical Alerts</h3>
                    <button onClick={handleViewAllAlerts} className="text-primary font-label-md text-label-md hover:underline">View All Alerts</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3 font-medium">Alert Details</th>
                          <th className="px-6 py-3 font-medium">Source IP</th>
                          <th className="px-6 py-3 font-medium">Module</th>
                          <th className="px-6 py-3 font-medium">Timestamp</th>
                          <th className="px-6 py-3 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30 font-data-tabular text-data-tabular">
                        {criticalAlerts.map((alert) => (
                          <tr key={alert.id} className="hover:bg-surface-container/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full bg-${alert.severity}`}></span>
                                <span className="font-medium text-on-surface">{alert.detail}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-on-surface-variant">{alert.ip}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary-container text-[10px] font-bold">{alert.module}</span>
                            </td>
                            <td className="px-6 py-4 text-on-surface-variant">{alert.timestamp}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleAcknowledge(alert.id)} className="text-primary hover:bg-primary/5 px-3 py-1 rounded font-label-sm">Acknowledge</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* 5. System Integrity Status */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white border border-outline-variant rounded-xl p-6 h-full">
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-6">Module Integrity</h3>
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:border-secondary transition-colors cursor-default">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-10 ${module.color} rounded-full`}></div>
                          <div>
                            <div className="font-label-md text-label-md text-on-surface font-bold">{module.name}</div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">{module.description}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`font-label-sm text-label-sm ${module.statusColor} px-2 rounded`}>{module.status}</span>
                          <span className="text-[10px] text-outline mt-1">{module.checkTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 relative rounded-lg overflow-hidden h-32 bg-surface-container-high">
                    <div className="absolute inset-0 opacity-40 grayscale" style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuArliuwdWRm97e8HUeVuybO7W6DW6NU3uCxd_0HQUjAspVNGYiz5motrkbVm9jX8i3r1wYrsiA-egVqJa4ZhQYNyZ5-7DRvtSDjEOjUN7toIhisXKgfLwu9Kv9VouWiENNxxOG7srFA8-Qce1KrFaHOe_Uk-p-gOzWkrKRCJ9WwcOdU10tgs_2VoA61t19xilU9YvkhqlbY_sPotq9znk-aRdGJkKg3-PT_r_mnxr7Mk8fiEAhIDlii_IBnkiQrG49uI-PxjsesZuM)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="font-label-sm text-label-sm text-primary font-bold">GLOBAL ACCESS MAP</div>
                        <div className="text-[10px] text-on-surface-variant">Monitoring 4 worldwide terminals</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Operational Activity Log Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1rem]">
              <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/30 flex items-center gap-4">
                <span className="material-symbols-outlined text-outline">history</span>
                <div className="flex-1">
                  <div className="font-label-md text-label-md text-on-surface">Last Backup Successful</div>
                  <div className="text-[10px] text-on-surface-variant italic">24 Dec 2023, 03:00 AM UTC</div>
                </div>
              </div>
              <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/30 flex items-center gap-4">
                <span className="material-symbols-outlined text-outline">gpp_good</span>
                <div className="flex-1">
                  <div className="font-label-md text-label-md text-on-surface">SSL Certificates Valid</div>
                  <div className="text-[10px] text-on-surface-variant italic">Next renewal: In 145 days</div>
                </div>
              </div>
              <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/30 flex items-center gap-4">
                <span className="material-symbols-outlined text-outline">dns</span>
                <div className="flex-1">
                  <div className="font-label-md text-label-md text-on-surface">Forensic Node Health</div>
                  <div className="text-[10px] text-on-surface-variant italic">4 nodes active - No latency</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
