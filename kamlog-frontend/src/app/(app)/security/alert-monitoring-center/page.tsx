"use client";

import { useState } from 'react';
import Link from 'next/link';

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  severityColor: string;
  severityBg: string;
  module: string;
  location: string;
  user: string;
  deviceInfo: string;
  timestamp: string;
  isPulsing?: boolean;
}

interface FilterState {
  severity: {
    critical: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  module: string;
  dateFrom: string;
  dateTo: string;
}

export default function AlertMonitoringCenterPage() {
  const [filters, setFilters] = useState<FilterState>({
    severity: { critical: true, high: true, medium: false, low: false },
    module: 'All Modules',
    dateFrom: '',
    dateTo: '',
  });

  const [alerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'MFA Bypass Attempt',
      severity: 'Critical',
      severityColor: 'text-error',
      severityBg: 'bg-error/10',
      module: 'K-FINANCE',
      location: 'Terminal B-04 / IP: 192.168.1.42',
      user: 'U_ADMN_921',
      deviceInfo: 'Token: AB-92-9331',
      timestamp: '2023-11-24 14:02:11',
      isPulsing: true,
    },
    {
      id: '2',
      type: 'Unauthorized File Export',
      severity: 'High',
      severityColor: 'text-tertiary',
      severityBg: 'bg-tertiary/10',
      module: 'K-HR',
      location: 'Export: Payroll_2023.csv',
      user: 'U_MGR_012',
      deviceInfo: 'Dept: Logistics-Ops',
      timestamp: '2023-11-24 13:58:45',
    },
    {
      id: '3',
      type: 'Brute Force Detected',
      severity: 'Medium',
      severityColor: 'text-primary',
      severityBg: 'bg-primary/10',
      module: 'Auth Gateway',
      location: '5 failed attempts / 30s',
      user: 'ANON_EXT_01',
      deviceInfo: 'Proxy Detected',
      timestamp: '2023-11-24 13:42:01',
    },
    {
      id: '4',
      type: 'System Integrity Warning',
      severity: 'Low',
      severityColor: 'text-secondary',
      severityBg: 'bg-secondary/10',
      module: 'K-MAGASIN',
      location: 'Checksum mismatch (Log-04)',
      user: 'SYS_BOT_88',
      deviceInfo: 'Auto-correct pending',
      timestamp: '2023-11-24 13:10:12',
    },
  ]);

  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());

  const toggleAlertSelection = (id: string) => {
    const newSelected = new Set(selectedAlerts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAlerts(newSelected);
  };

  const toggleAllAlerts = () => {
    if (selectedAlerts.size === alerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(alerts.map(a => a.id)));
    }
  };

  const getSeverityDotColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-error';
      case 'High':
        return 'bg-tertiary';
      case 'Medium':
        return 'bg-primary';
      case 'Low':
        return 'bg-secondary';
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full bg-surface-container-highest border-b border-outline-variant flex justify-between items-center px-margin-desktop h-14 z-50">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md font-bold text-primary">KAMLOG EM-ERP</span>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Dashboard</Link>
            <Link href="/activity-log" className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Activity Log</Link>
            <Link href="/security/alert-monitoring-center" className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 cursor-pointer">User Audit</Link>
            <Link href="/compliance" className="font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">Compliance</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container flex items-center px-3 py-1.5 rounded border border-outline-variant w-64">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-label-md w-full" placeholder="Search T-Codes (e.g. K-SEC-01)" type="text" />
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">security</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">admin_panel_settings</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">notifications</button>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-2 rounded transition-colors">account_circle</button>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-surface-container-low flex flex-col pt-14 z-40">
        <div className="p-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container border border-secondary">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <div>
              <p className="font-headline-sm text-headline-sm font-black text-secondary">Audit & Security</p>
              <p className="font-label-sm text-label-sm text-outline">Module: K-AUDIT</p>
            </div>
          </div>
          <button className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-2 rounded shadow-sm hover:opacity-90 transition-all">Generate Forensic Report</button>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <Link href="/security/alert-monitoring-center" className="flex items-center px-4 py-3 text-secondary font-bold border-l-4 border-secondary bg-secondary-container/10 transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3">shield</span>
            <span className="font-title-md text-title-md">Security Overview</span>
          </Link>
          <Link href="/audit/event-viewer" className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3">list_alt</span>
            <span className="font-label-md text-label-md">Event Viewer</span>
          </Link>
          <Link href="/audit/policy-manager" className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3">policy</span>
            <span className="font-label-md text-label-md">Policy Manager</span>
          </Link>
          <Link href="/audit/key-vault" className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3">vpn_key</span>
            <span className="font-label-md text-label-md">Key Vault</span>
          </Link>
          <Link href="/audit/system-integrity" className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3">verified_user</span>
            <span className="font-label-md text-label-md">System Integrity</span>
          </Link>
          <Link href="/audit/audit-reports" className="flex items-center px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3">analytics</span>
            <span className="font-label-md text-label-md">Audit Reports</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-outline-variant/30">
          <Link href="/settings" className="flex items-center px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded transition-all">
            <span className="material-symbols-outlined mr-3">settings</span>
            <span className="font-label-md text-label-md">Settings</span>
          </Link>
          <Link href="/support" className="flex items-center px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded transition-all">
            <span className="material-symbols-outlined mr-3">help</span>
            <span className="font-label-md text-label-md">Support</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-60 pt-14 min-h-screen">
        <div className="max-w-max-width mx-auto p-gutter">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-4 text-outline font-label-md text-label-md">
            <Link href="/erp-global" className="hover:text-primary">ERP Global</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/audit-security" className="hover:text-primary">Audit & Security</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">Security: Alert Monitoring Center</span>
          </nav>

          <div className="flex gap-gutter">
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
                          checked={filters.severity.critical}
                          onChange={(e) => setFilters({...filters, severity: {...filters.severity, critical: e.target.checked}})}
                          className="w-4 h-4 rounded border-outline-variant text-error focus:ring-error/20" 
                          type="checkbox"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface">Critical</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          checked={filters.severity.high}
                          onChange={(e) => setFilters({...filters, severity: {...filters.severity, high: e.target.checked}})}
                          className="w-4 h-4 rounded border-outline-variant text-tertiary focus:ring-tertiary/20" 
                          type="checkbox"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface">High</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          checked={filters.severity.medium}
                          onChange={(e) => setFilters({...filters, severity: {...filters.severity, medium: e.target.checked}})}
                          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20" 
                          type="checkbox"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-on-surface">Medium</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          checked={filters.severity.low}
                          onChange={(e) => setFilters({...filters, severity: {...filters.severity, low: e.target.checked}})}
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
                    <select 
                      className="w-full bg-surface-container-low border border-outline-variant rounded p-2 font-body-sm text-body-sm"
                      value={filters.module}
                      onChange={(e) => setFilters({...filters, module: e.target.value})}
                    >
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
                      <input 
                        className="w-full bg-surface-container-low border border-outline-variant rounded p-2 font-body-sm text-body-sm" 
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      />
                      <input 
                        className="w-full bg-surface-container-low border border-outline-variant rounded p-2 font-body-sm text-body-sm" 
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      />
                    </div>
                  </div>
                  <button className="w-full bg-surface-container-high border border-outline-variant font-label-md text-label-md py-2 rounded hover:bg-surface-variant transition-colors">Reset All Filters</button>
                </div>
              </div>

              {/* Risk Profile Image Card */}
              <div className="relative overflow-hidden rounded-lg h-48 border border-outline-variant bg-secondary-container/10 group">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 transition-transform duration-500 group-hover:scale-110"></div>
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
                  <button className="bg-surface-container-high border border-outline-variant text-on-surface font-label-md text-label-md px-4 py-2.5 rounded flex items-center gap-2 hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-[20px]">done_all</span>
                    Acknowledge All
                  </button>
                  <button className="bg-secondary text-on-secondary font-label-md text-label-md px-4 py-2.5 rounded flex items-center gap-2 hover:opacity-90 transition-all">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Clear Resolved
                  </button>
                </div>
              </div>

              {/* Alerts Table/List */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
                {/* Table Headers */}
                <div className="grid grid-cols-[48px_1.2fr_1fr_1fr_1fr_100px] gap-4 bg-surface-container-low border-b border-outline-variant px-4 py-3">
                  <div className="flex justify-center">
                    <input 
                      className="w-4 h-4 rounded border-outline-variant" 
                      type="checkbox"
                      checked={selectedAlerts.size === alerts.length}
                      onChange={toggleAllAlerts}
                    />
                  </div>
                  <div className="font-label-sm text-label-sm text-outline uppercase">Alert Type & Severity</div>
                  <div className="font-label-sm text-label-sm text-outline uppercase">Module / Location</div>
                  <div className="font-label-sm text-label-sm text-outline uppercase">User / Device ID</div>
                  <div className="font-label-sm text-label-sm text-outline uppercase">Timestamp</div>
                  <div className="font-label-sm text-label-sm text-outline uppercase text-right">Action</div>
                </div>

                {/* Alert Rows */}
                <div className="divide-y divide-outline-variant/30">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`grid grid-cols-[48px_1.2fr_1fr_1fr_1fr_100px] gap-4 px-4 py-4 hover:bg-surface-container transition-colors items-center ${selectedAlerts.has(alert.id) ? 'bg-secondary-container/5' : ''}`}
                    >
                      <div className="flex justify-center">
                        <input 
                          className="w-4 h-4 rounded border-outline-variant" 
                          type="checkbox"
                          checked={selectedAlerts.has(alert.id)}
                          onChange={() => toggleAlertSelection(alert.id)}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${getSeverityDotColor(alert.severity)} ${alert.isPulsing ? 'animate-pulse' : ''}`}></span>
                        <div>
                          <p className="font-title-md text-title-md font-semibold text-on-surface">{alert.type}</p>
                          <span className={`${alert.severityBg} ${alert.severityColor} text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider`}>{alert.severity}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-data-tabular text-data-tabular text-on-surface">{alert.module}</p>
                        <p className="text-[11px] text-outline">{alert.location}</p>
                      </div>
                      <div>
                        <p className="font-data-tabular text-data-tabular text-on-surface">{alert.user}</p>
                        <p className="text-[11px] text-outline">{alert.deviceInfo}</p>
                      </div>
                      <div className="font-data-tabular text-data-tabular text-on-surface">
                        {alert.timestamp}
                      </div>
                      <div className="text-right">
                        <button className="text-primary font-label-md text-label-md hover:underline">View Details</button>
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
              <div className="mt-gutter grid grid-cols-1 md:grid-cols-3 gap-gutter">
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
  );
}
