"use client";

import { useState } from 'react';
import Link from 'next/link';

interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  module: string;
  action: string;
  objectId: string;
  ipAddress: string;
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  requestContext?: string;
  stateChange?: string;
  diff?: string;
}

export default function OperationTrace1Page() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [events] = useState<AuditEvent[]>([
    {
      id: '1',
      timestamp: '2023-10-27 14:32:01.452',
      userId: 'usr_892x_admin',
      module: 'K-FINANCE',
      action: 'DELETE',
      objectId: 'INV-99421',
      ipAddress: '192.168.45.102',
      severity: 'HIGH',
      requestContext: `{
  "trace_id": "req_88f2a1b9",
  "session_id": "sess_9xkq21",
  "auth_method": "MFA_TOKEN",
  "endpoint": "/api/v2/finance/invoice/INV-99421",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
}`,
      stateChange: `{
  "status": "PENDING_APPROVAL",
  "amount": "45,200.00 USD",
  "vendor_id": "VND-402",
  "created_by": "usr_771x_clerk",
  "flags": ["HIGH_VALUE_TRANSACTION"]
}`,
    },
    {
      id: '2',
      timestamp: '2023-10-27 14:30:15.110',
      userId: 'usr_442y_oper',
      module: 'K-MAGASIN',
      action: 'UPDATE',
      objectId: 'LOC-A4-Shelf2',
      ipAddress: '10.0.12.88',
      severity: 'INFO',
      diff: `"diff": {
  "capacity_status": { "old": "75%", "new": "90%" },
  "last_scanned_by": { "old": "SYS_AUTO", "new": "usr_442y_oper" }
}`,
    },
    {
      id: '3',
      timestamp: '2023-10-27 14:28:44.002',
      userId: 'usr_442y_oper',
      module: 'K-MAGASIN',
      action: 'READ',
      objectId: 'LOC-A4-Shelf2',
      ipAddress: '10.0.12.88',
      severity: 'INFO',
    },
  ]);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getSeverityBadge = (severity: AuditEvent['severity']) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-error-container text-on-error-container border border-error/20';
      case 'MEDIUM':
        return 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant';
      default:
        return 'bg-surface-container-high text-on-surface border border-outline-variant';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'DELETE':
        return 'text-error font-bold';
      case 'UPDATE':
        return 'text-secondary font-medium';
      default:
        return 'text-on-surface-variant font-medium';
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full flex flex-col pt-14 z-40 bg-surface-container-low w-60 border-r border-outline-variant flex-shrink-0 transition-all duration-150 ease-in-out">
        <div className="p-4 border-b border-outline-variant flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container overflow-hidden">
            <span className="material-symbols-outlined fill">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="font-title-md text-title-md font-bold text-secondary">Audit & Security</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Module: K-AUDIT</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/audit/security-overview" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container rounded-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3">shield</span>
                <span className="font-label-md text-label-md">Security Overview</span>
              </Link>
            </li>
            <li>
              <Link href="/audit/operation-trace-1" className="flex items-center text-secondary font-bold border-l-4 border-secondary bg-secondary-container/10 px-4 py-3 rounded-r-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3">list_alt</span>
                <span className="font-label-md text-label-md">Event Viewer</span>
              </Link>
            </li>
            <li>
              <Link href="/audit/policy-manager" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container rounded-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3">policy</span>
                <span className="font-label-md text-label-md">Policy Manager</span>
              </Link>
            </li>
            <li>
              <Link href="/audit/key-vault" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container rounded-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3">vpn_key</span>
                <span className="font-label-md text-label-md">Key Vault</span>
              </Link>
            </li>
            <li>
              <Link href="/audit/system-integrity" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container rounded-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3">verified_user</span>
                <span className="font-label-md text-label-md">System Integrity</span>
              </Link>
            </li>
            <li>
              <Link href="/audit/audit-reports" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container rounded-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3">analytics</span>
                <span className="font-label-md text-label-md">Audit Reports</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-outline-variant space-y-4">
          <button className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-2 rounded-DEFAULT hover:bg-secondary/90 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined mr-2 text-[18px]">summarize</span>
            Generate Forensic Report
          </button>
          <ul className="space-y-1">
            <li>
              <Link href="/settings" className="flex items-center text-on-surface-variant px-2 py-2 hover:bg-surface-container rounded-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3 text-[18px]">settings</span>
                <span className="font-label-sm text-label-sm">Settings</span>
              </Link>
            </li>
            <li>
              <Link href="/support" className="flex items-center text-on-surface-variant px-2 py-2 hover:bg-surface-container rounded-DEFAULT transition-colors">
                <span className="material-symbols-outlined mr-3 text-[18px]">help</span>
                <span className="font-label-sm text-label-sm">Support</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-60 w-[calc(100%-240px)] h-full">
        {/* TopNavBar */}
        <header className="bg-surface-container-highest flex justify-between items-center w-full px-margin-desktop h-14 z-50 border-b border-outline-variant docked full-width top-0 flex-shrink-0">
          <div className="flex items-center h-full">
            <span className="font-headline-md text-headline-md font-bold text-primary mr-8 tracking-tight">KAMLOG EM-ERP</span>
            <div className="relative mr-8">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input className="w-64 bg-surface-container-lowest border border-outline-variant rounded-DEFAULT py-1.5 pl-9 pr-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-on-surface-variant/50 transition-all" placeholder="T-Code or Event ID Search..." type="text" />
            </div>
            <nav className="h-full hidden md:flex">
              <ul className="flex space-x-6 h-full items-center font-label-md text-label-md">
                <li className="h-full flex items-center">
                  <Link href="/audit/dashboard" className="text-on-surface-variant hover:bg-surface-container-high transition-colors px-2 py-1 rounded cursor-pointer active:opacity-80">Dashboard</Link>
                </li>
                <li className="h-full flex items-center">
                  <Link href="/audit/activity-log" className="text-on-surface-variant hover:bg-surface-container-high transition-colors px-2 py-1 rounded cursor-pointer active:opacity-80">Activity Log</Link>
                </li>
                <li className="h-full flex items-center border-b-2 border-primary pt-0.5">
                  <Link href="/audit/operation-trace-1" className="text-primary px-2 py-1 cursor-pointer active:opacity-80">User Audit</Link>
                </li>
                <li className="h-full flex items-center">
                  <Link href="/audit/compliance" className="text-on-surface-variant hover:bg-surface-container-high transition-colors px-2 py-1 rounded cursor-pointer active:opacity-80">Compliance</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4 text-on-surface-variant">
            <button className="hover:bg-surface-container-high p-1.5 rounded-full transition-colors cursor-pointer active:opacity-80"><span className="material-symbols-outlined">security</span></button>
            <button className="hover:bg-surface-container-high p-1.5 rounded-full transition-colors cursor-pointer active:opacity-80"><span className="material-symbols-outlined">admin_panel_settings</span></button>
            <div className="relative">
              <button className="hover:bg-surface-container-high p-1.5 rounded-full transition-colors cursor-pointer active:opacity-80"><span className="material-symbols-outlined">notifications</span></button>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </div>
            <button className="hover:bg-surface-container-high p-1.5 rounded-full transition-colors cursor-pointer active:opacity-80"><span className="material-symbols-outlined">account_circle</span></button>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-margin-desktop bg-surface-container-low custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {/* Page Header & Breadcrumbs */}
            <div className="mb-6 flex justify-between items-end">
              <div>
                <div className="flex items-center text-on-surface-variant font-label-sm text-label-sm mb-2 space-x-2">
                  <span className="material-symbols-outlined text-[14px]">home</span>
                  <span>/</span>
                  <span>K-AUDIT</span>
                  <span>/</span>
                  <span className="font-bold text-on-surface">Event Viewer</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Operation Trace Log</h1>
              </div>
              <div className="flex space-x-3">
                <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-4 py-2 rounded-DEFAULT font-label-md text-label-md flex items-center hover:bg-surface-container transition-colors shadow-sm">
                  <span className="material-symbols-outlined mr-2 text-[18px]">download</span>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Time Range</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">calendar_today</span>
                    <input className="w-full bg-surface-container-low border border-outline-variant rounded-DEFAULT py-1.5 pl-9 pr-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer" type="text" defaultValue="Last 24 Hours (UTC)" />
                  </div>
                </div>
                <div className="w-48">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Severity</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-DEFAULT py-1.5 px-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none">
                    <option>All Severities</option>
                    <option>CRITICAL</option>
                    <option>HIGH</option>
                    <option>MEDIUM</option>
                    <option>INFO</option>
                  </select>
                </div>
                <div className="w-48">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Action Type</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-DEFAULT py-1.5 px-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none">
                    <option>All Actions</option>
                    <option>UPDATE</option>
                    <option>DELETE</option>
                    <option>CREATE</option>
                    <option>READ</option>
                  </select>
                </div>
                <div className="w-48">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Module</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-DEFAULT py-1.5 px-3 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none">
                    <option>All Modules</option>
                    <option>K-FINANCE</option>
                    <option>K-PARC</option>
                    <option>K-MAGASIN</option>
                    <option>K-HR</option>
                  </select>
                </div>
                <button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-DEFAULT font-label-md text-label-md flex items-center hover:bg-primary-container/90 transition-colors h-[34px]">
                  <span className="material-symbols-outlined mr-2 text-[18px]">filter_list</span>
                  Apply Filters
                </button>
              </div>
            </div>

            {/* High-Density Data Table Container */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm flex flex-col">
              {/* Table Header Row (Sticky) */}
              <div className="grid grid-cols-[40px_160px_120px_100px_100px_120px_140px_100px] gap-2 bg-surface-variant border-b border-outline-variant px-4 py-2 font-label-sm text-label-sm text-on-surface-variant sticky top-0 z-10 uppercase tracking-wider">
                <div></div>
                <div>Timestamp (UTC)</div>
                <div>User ID</div>
                <div>Module</div>
                <div>Action</div>
                <div>Object ID</div>
                <div>IP Address</div>
                <div>Severity</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-outline-variant/50 flex-1 overflow-y-auto font-data-tabular text-data-tabular text-on-surface">
                {events.map((event, index) => (
                  <div key={event.id} className={`hover:bg-surface-container-low transition-colors group cursor-pointer ${index % 2 === 1 ? 'bg-surface-bright' : ''}`} onClick={() => toggleRow(event.id)}>
                    <div className="grid grid-cols-[40px_160px_120px_100px_100px_120px_140px_100px] gap-2 px-4 py-2.5 items-center">
                      <div className="text-outline-variant flex justify-center">
                        <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${expandedRows.has(event.id) ? 'rotate-180' : ''}`}>
                          keyboard_arrow_down
                        </span>
                      </div>
                      <div className="text-on-surface-variant">{event.timestamp}</div>
                      <div className={`font-medium ${event.userId.includes('admin') ? 'text-primary' : ''}`}>{event.userId}</div>
                      <div>
                        <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface-variant text-[11px] font-medium border border-outline-variant">
                          {event.module}
                        </span>
                      </div>
                      <div className={getActionColor(event.action)}>{event.action}</div>
                      <div className="font-mono text-[12px]">{event.objectId}</div>
                      <div className="text-on-surface-variant font-mono text-[12px]">{event.ipAddress}</div>
                      <div>
                        <span className={`${getSeverityBadge(event.severity)} px-2 py-0.5 rounded text-[11px] font-bold border`}>
                          {event.severity}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Payload Area */}
                    <div className={`overflow-hidden transition-all duration-300 ease-out ${expandedRows.has(event.id) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="bg-surface px-12 border-t border-outline-variant/30 py-4">
                        {event.requestContext && event.stateChange ? (
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Request Context</h4>
                              <div className="bg-inverse-surface text-surface-container-low p-3 rounded font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar border border-outline">
                                {event.requestContext}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">State Change (Before Deletion)</h4>
                              <div className="bg-surface-container-lowest border border-outline-variant p-3 rounded font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar">
                                {event.stateChange}
                              </div>
                            </div>
                          </div>
                        ) : event.diff ? (
                          <div className="bg-surface-container-lowest border border-outline-variant p-3 rounded font-mono text-[11px] whitespace-pre overflow-x-auto text-on-surface">
                            {event.diff}
                          </div>
                        ) : (
                          <p className="text-body-sm text-on-surface-variant italic py-2">No state change payload for READ operations.</p>
                        )}
                        {event.requestContext && (
                          <div className="mt-4 flex justify-end">
                            <button className="text-primary font-label-sm text-label-sm hover:underline flex items-center">
                              View Full Audit Trail <span className="material-symbols-outlined text-[14px] ml-1">open_in_new</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Footer */}
              <div className="bg-surface-container border-t border-outline-variant p-2 px-4 flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant">
                <div>Showing 1-3 of 84,201 events</div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 rounded hover:bg-outline-variant/30 text-outline disabled:opacity-50"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                  <span className="px-2">Page 1 of 28,067</span>
                  <button className="p-1 rounded hover:bg-outline-variant/30 text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
