"use client";

import { useState } from 'react';
import Link from 'next/link';

interface OperationLog {
  id: string;
  otNumber: string;
  action: string;
  icon: string;
  iconColor: string;
  module: string;
  moduleColor: string;
  moduleBg: string;
  user: {
    initials: string;
    name: string;
    id: string;
    isAdmin?: boolean;
  };
  timestamp: string;
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  trend?: string;
  subtitle?: string;
}

export default function OperationTrace2Page() {
  const [tCode, setTCode] = useState('KM24');
  const [logs] = useState<OperationLog[]>([
    {
      id: '1',
      otNumber: '843291054',
      action: 'CREATE_FREIGHT_MANIFEST',
      icon: 'add_task',
      iconColor: 'text-secondary',
      module: 'K-MAGASIN',
      moduleColor: '#EF4444',
      moduleBg: '#FEE2E2',
      user: { initials: 'JD', name: 'John Doe (ID: 4022)', id: '4022' },
      timestamp: '2023-11-24 14:22:15.004',
    },
    {
      id: '2',
      otNumber: '921105382',
      action: 'UPDATE_INVENTORY_QTY',
      icon: 'edit_note',
      iconColor: 'text-primary',
      module: 'K-PARC',
      moduleColor: '#4338CA',
      moduleBg: '#E0E7FF',
      user: { initials: 'AS', name: 'Aminata S. (ID: 3911)', id: '3911' },
      timestamp: '2023-11-24 14:20:58.912',
    },
    {
      id: '3',
      otNumber: '310029584',
      action: 'POST_LEDGER_ENTRY',
      icon: 'currency_exchange',
      iconColor: 'text-tertiary',
      module: 'K-FINANCE',
      moduleColor: '#15803D',
      moduleBg: '#DCFCE7',
      user: { initials: 'SY', name: 'System Auto (ID: 0001)', id: '0001' },
      timestamp: '2023-11-24 14:18:22.441',
    },
    {
      id: '4',
      otNumber: '119482756',
      action: 'TRUCK_GATE_EXIT',
      icon: 'local_shipping',
      iconColor: 'text-secondary',
      module: 'K-TRANSPORT',
      moduleColor: '#854D0E',
      moduleBg: '#FEF9C3',
      user: { initials: 'MK', name: 'M. Koné (ID: 5521)', id: '5521' },
      timestamp: '2023-11-24 14:15:10.012',
    },
    {
      id: '5',
      otNumber: '772819405',
      action: 'AUDIT_LOG_READ',
      icon: 'visibility',
      iconColor: 'text-on-surface-variant',
      module: 'K-AUDIT',
      moduleColor: '#374151',
      moduleBg: '#F3F4F6',
      user: { initials: 'AD', name: 'Admin Level 3', id: '0000', isAdmin: true },
      timestamp: '2023-11-24 14:12:01.883',
    },
    {
      id: '6',
      otNumber: '551029384',
      action: 'PURGE_STALE_CACHE',
      icon: 'delete_forever',
      iconColor: 'text-error',
      module: 'SYSTEM',
      moduleColor: '#374151',
      moduleBg: '#F3F4F6',
      user: { initials: 'RB', name: 'Root (ID: 0000)', id: '0000' },
      timestamp: '2023-11-24 14:10:44.221',
    },
  ]);

  const [stats] = useState<StatCard[]>([
    {
      label: 'Total Traces (24h)',
      value: '12,842',
      icon: 'analytics',
      iconColor: 'text-primary',
      trend: '+4.2% from yesterday',
    },
    {
      label: 'Security Alerts',
      value: '03',
      icon: 'warning',
      iconColor: 'text-error',
      subtitle: 'Requires Audit Review',
    },
    {
      label: 'Active Modules',
      value: '12 Modules',
      icon: 'dashboard_customize',
      iconColor: 'text-primary',
      subtitle: 'Cross-terminal integration',
    },
    {
      label: 'Avg Response Time',
      value: '42ms',
      icon: 'speed',
      iconColor: 'text-primary',
      trend: 'System Optimal',
    },
  ]);

  const handleTCodeSubmit = () => {
    if (tCode.toUpperCase() === 'KM24') {
      console.log('Reloading Audit Trace context...');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-2">
              <span className="text-title-lg font-title-lg font-bold text-primary">KAMLOG EM-ERP</span>
              <select className="hidden md:block bg-surface-container-high border border-outline-variant text-label-sm font-label-sm text-on-surface rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary ml-4 shadow-sm cursor-pointer hover:bg-surface-container-highest transition-colors">
                <option>🇨🇲 Agence de Douala (HQ)</option>
                <option>🇨🇮 Agence d'Abidjan</option>
                <option>🇨🇲 Agence de Kribi</option>
                <option>🇸🇳 Agence de Dakar</option>
              </select>
            </div>
          <div className="h-8 w-px bg-outline-variant mx-xs"></div>
          <nav className="hidden md:flex items-center gap-lg">
            <Link href="/alerts" className="text-on-surface-variant hover:bg-surface-container-high transition-colors text-label-md font-label-md px-2 py-1">Alerts</Link>
            <Link href="/mfa-status" className="text-on-surface-variant hover:bg-surface-container-high transition-colors text-label-md font-label-md px-2 py-1">MFA Status</Link>
            <Link href="/modules" className="text-on-surface-variant hover:bg-surface-container-high transition-colors text-label-md font-label-md px-2 py-1">Modules</Link>
          </nav>
        </div>
        <div className="flex-1 max-w-md mx-xl hidden md:block">
          <div className="relative group transition-all duration-200 bg-white border border-outline-variant rounded p-1 flex items-center focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <span className="material-symbols-outlined text-outline px-xs" style={{ fontSize: '20px' }}>terminal</span>
            <input 
              className="w-full border-none focus:ring-0 text-body-sm font-data-tabular bg-transparent" 
              placeholder="Enter T-Code (e.g. KM24)" 
              type="text" 
              value={tCode}
              onChange={(e) => setTCode(e.target.value)}
              onKeyUp={(e) => { if (e.key === 'Enter') handleTCodeSubmit(); }}
            />
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1">ACTIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded transition-colors">notifications</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded transition-colors">security</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-xs rounded transition-colors">apps</button>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border border-outline-variant">
            <span className="text-sm font-bold">AD</span>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container border-r border-outline-variant">
        <div className="px-md py-lg">
          <div className="flex flex-col gap-xxs">
            <span className="text-headline-sm font-headline-sm font-black text-primary">KAMLOG ERP</span>
            <span className="text-label-md font-label-md text-on-surface-variant opacity-70">Operational Control</span>
          </div>
        </div>
        <div className="flex-1 px-xs flex flex-col gap-1">
          <div className="px-md py-xs text-label-sm font-label-sm text-outline uppercase tracking-wider">Main Modules</div>
          <Link href="/transport" className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-label-md text-label-md">Transport</span>
          </Link>
          <Link href="/finance" className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-label-md text-label-md">Finance</span>
          </Link>
          <Link href="/parc" className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-label-md text-label-md">Parc</span>
          </Link>
          <Link href="/magasin" className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">warehouse</span>
            <span className="text-label-md text-label-md">Magasin</span>
          </Link>
          <Link href="/audit/operation-trace-2" className="flex items-center gap-md px-md py-2.5 text-primary font-bold border-l-4 border-primary bg-surface-container-highest scale-[0.99] transition-transform duration-150">
            <span className="material-symbols-outlined">history_edu</span>
            <span className="text-label-md text-label-md">Audit</span>
          </Link>
        </div>
        <div className="mt-auto px-xs flex flex-col gap-1">
          <Link href="/settings" className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-label-md text-label-md">Settings</span>
          </Link>
          <Link href="/logout" className="flex items-center gap-md px-md py-2.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-label-md text-label-md">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-60 pt-16 h-screen overflow-y-auto bg-surface-container-low">
        <div className="max-w-[1600px] mx-auto p-lg">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-xs text-label-sm font-label-sm text-outline mb-xs">
            <Link href="/system-control" className="hover:text-primary">System Control</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <Link href="/audit-log" className="hover:text-primary">Audit Log</Link>
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
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-md border border-outline-variant rounded-lg">
                <div className="flex justify-between items-start mb-xs">
                  <span className="text-label-md font-label-md text-outline uppercase tracking-wider">{stat.label}</span>
                  <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
                </div>
                <div className="text-headline-sm font-headline-sm">{stat.value}</div>
                {stat.trend && (
                  <div className="text-[11px] text-secondary mt-1 flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> {stat.trend}
                  </div>
                )}
                {stat.subtitle && (
                  <div className="text-[11px] text-on-surface-variant mt-1 opacity-70">{stat.subtitle}</div>
                )}
              </div>
            ))}
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
                  <input className="border-none focus:ring-0 text-body-sm w-48 p-0" placeholder="Search OT Number..." type="text" />
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
                  {logs.map((log, index) => (
                    <tr key={log.id} className={`border-b border-outline-variant hover:bg-surface-container transition-colors group ${index % 2 === 1 ? 'bg-[#F9FAFB]' : ''}`}>
                      <td className="px-md py-3 font-bold text-primary">{log.otNumber}</td>
                      <td className="px-md py-3">
                        <span className="flex items-center gap-xs">
                          <span className={`material-symbols-outlined text-[16px] ${log.iconColor}`}>{log.icon}</span>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: log.moduleBg, color: log.moduleColor }}>
                          {log.module}
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-xs">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${log.user.isAdmin ? 'bg-primary text-white' : 'bg-surface-dim'}`}>
                            {log.user.initials}
                          </div>
                          <span>{log.user.name}</span>
                        </div>
                      </td>
                      <td className="px-md py-3 text-on-surface-variant">{log.timestamp}</td>
                      <td className="px-md py-3 text-right">
                        <button className="px-3 py-1 bg-white border border-error text-error text-label-sm font-label-sm rounded hover:bg-error hover:text-white transition-all shadow-sm">Cancel</button>
                      </td>
                    </tr>
                  ))}
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
            <div className="relative rounded-xl overflow-hidden min-h-[160px] border border-outline-variant bg-surface-container-lowest">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-primary/50">public</span>
                  <p className="text-on-surface-variant mt-2">Global Infrastructure</p>
                  <p className="text-on-surface-variant/70 text-sm">Monitoring 14 terminals across West Africa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
