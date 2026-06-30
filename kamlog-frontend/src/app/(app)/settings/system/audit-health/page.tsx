// src/app/(app)/settings/system/audit-health/page.tsx - Audit System Health Monitor 2 - Fidèle 100% au HTML original
'use client'


import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SystemAuditHealth() {
  const router = useRouter()
  const [severityFilter, setSeverityFilter] = useState('ERROR')

  const handleExport = () => {
    // Export logs - will be connected to backend
  }

  const handleRefresh = () => {
    // Refresh data - will be connected to backend
  }

  const logs = [
    { timestamp: '14:02:11.405', level: 'Error', service: 'KAMLOG-Finance-Svc', message: 'Connection timeout to payment gateway (Retry 3/3)', correlationId: 'req-7b8a-4c2d-9f1e' },
    { timestamp: '14:01:55.120', level: 'Error', service: 'KAMLOG-Auth-Svc', message: 'Invalid LDAP credentials supplied for user_id: 8442', correlationId: 'req-11a2-9b4f-00c1' },
    { timestamp: '13:58:44.901', level: 'Warn', service: 'Postgres-DB-Master', message: 'Connection pool approaching max capacity (95%)', correlationId: 'sys-db-pool-mon' },
    { timestamp: '13:45:10.002', level: 'Error', service: 'KAMLOG-Logistics-Svc', message: 'Failed to parse manifest XML from T-Code: MNF-209', correlationId: 'req-88c1-2d3e-4a5b' }
  ]

  const getLevelBadge = (level: string) => {
    const styles = {
      'Error': 'bg-error-container text-error',
      'Warn': 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant'
    }
    return (
      <span className={`${styles[level as keyof typeof styles] || styles['Error']} px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase`}>
        {level}
      </span>
    )
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md antialiased overflow-hidden flex">
        
        
        
        <div className="flex-1 flex flex-col h-screen">
          
          
          {/* Main Stage */}
          <main className="flex-1 overflow-y-auto p-[1rem] bg-surface-container-low flex flex-col gap-[1rem] max-w-[1600px] mx-auto w-full">
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
                  <button onClick={handleExport} className="px-3 py-1.5 border border-outline-variant rounded bg-surface text-body-sm font-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">download</span> Exporter
                  </button>
                  <button onClick={handleRefresh} className="px-3 py-1.5 bg-primary text-on-primary rounded text-body-sm font-body-sm shadow-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">refresh</span> Actualiser
                  </button>
                </div>
              </div>
            </div>
            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1rem]">
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
                    <select 
                      className="pl-8 pr-6 py-1 bg-surface-container border border-outline-variant rounded text-body-sm font-body-sm focus:outline-none appearance-none cursor-pointer"
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                    >
                      <option value="ERROR">Severity: ERROR</option>
                      <option value="ALL">Severity: ALL</option>
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
                    {logs.map((log, index) => (
                      <tr key={index} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${index % 2 === 1 ? 'bg-surface-container-lowest' : ''}`}>
                        <td className="py-3 px-4 text-outline">{log.timestamp}</td>
                        <td className="py-3 px-4">{getLevelBadge(log.level)}</td>
                        <td className="py-3 px-4 text-on-surface-variant">{log.service}</td>
                        <td className="py-3 px-4 font-medium">{log.message}</td>
                        <td className="py-3 px-4 text-outline text-[11px] font-mono">{log.correlationId}</td>
                      </tr>
                    ))}
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
