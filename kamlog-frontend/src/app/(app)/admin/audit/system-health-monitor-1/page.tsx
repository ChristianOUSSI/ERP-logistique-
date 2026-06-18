"use client";

import { useState } from 'react';
import Link from 'next/link';

interface ModuleHealth {
  id: string;
  name: string;
  icon: string;
  status: 'online' | 'sync_delay' | 'offline';
  uptime: string;
  lag?: string;
}

export default function SystemHealthMonitor1Page() {
  const [modules, setModules] = useState<ModuleHealth[]>([
    { id: 'transport', name: 'K-Transport', icon: 'local_shipping', status: 'online', uptime: '99.9%' },
    { id: 'magasin', name: 'K-Magasin', icon: 'warehouse', status: 'online', uptime: '99.8%' },
    { id: 'finance', name: 'K-Finance', icon: 'account_balance', status: 'sync_delay', uptime: '99.5%', lag: '-45s lag detected' },
    { id: 'parc', name: 'K-Parc', icon: 'directions_car', status: 'online', uptime: '100%' },
  ]);

  const [mfaCompliance] = useState({
    compliant: 92,
    activeUsers: 1452,
    pendingUsers: 128,
  });

  const getStatusBadge = (status: ModuleHealth['status']) => {
    switch (status) {
      case 'online':
        return 'bg-[#d1fae5] text-[#047857]';
      case 'sync_delay':
        return 'bg-[#fee2e2] text-[#b91c1c]';
      case 'offline':
        return 'bg-[#f3f4f6] text-[#6b7280]';
      default:
        return 'bg-[#f3f4f6] text-[#6b7280]';
    }
  };

  const getStatusLabel = (status: ModuleHealth['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'sync_delay':
        return 'Sync Delay';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* TopNavBar */}
      <header className="bg-surface-container-highest border-b border-outline-variant flex justify-between items-center w-full px-margin-desktop h-14 z-50 fixed top-0 left-0">
        <div className="flex items-center gap-md">
          <div className="font-headline-md text-headline-md font-bold text-primary mr-xl">
            KAMLOG EM-ERP
          </div>
          <nav className="hidden md:flex items-center gap-lg h-full">
            <Link href="/audit" className="font-headline-sm text-headline-sm text-primary border-b-2 border-primary pb-1 h-14 flex items-center mt-1">
              Dashboard
            </Link>
            <Link href="/audit/activity-log" className="font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high transition-colors h-14 flex items-center px-sm">
              Activity Log
            </Link>
            <Link href="/audit/user-audit" className="font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high transition-colors h-14 flex items-center px-sm">
              User Audit
            </Link>
            <Link href="/audit/compliance" className="font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high transition-colors h-14 flex items-center px-sm">
              Compliance
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative hidden lg:block mr-md">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input className="pl-8 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-primary font-body-sm text-body-sm w-64 placeholder-outline" placeholder="T-Code Search..." type="text" />
          </div>
          <button className="p-2 text-primary hover:bg-surface-container-high transition-colors rounded-full cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined">security</span>
          </button>
          <button className="p-2 text-primary hover:bg-surface-container-high transition-colors rounded-full cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </button>
          <button className="p-2 text-primary hover:bg-surface-container-high transition-colors rounded-full cursor-pointer active:opacity-80 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="p-2 text-primary hover:bg-surface-container-high transition-colors rounded-full cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="bg-surface-container-low fixed left-0 top-0 h-full flex flex-col pt-14 z-40 docked h-full w-60 border-r border-outline-variant hidden md:flex">
        <div className="p-4 border-b border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-secondary">
            <span className="material-symbols-outlined text-on-secondary">person</span>
          </div>
          <div>
            <div className="font-title-md text-title-md text-on-surface">Audit & Security</div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">Module: K-AUDIT</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <Link href="/audit/security-overview" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3 text-[20px]">shield</span>
            <span className="font-label-md text-label-md">Security Overview</span>
          </Link>
          <Link href="/audit/event-viewer" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3 text-[20px]">list_alt</span>
            <span className="font-label-md text-label-md">Event Viewer</span>
          </Link>
          <Link href="/audit/policy-manager" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3 text-[20px]">policy</span>
            <span className="font-label-md text-label-md">Policy Manager</span>
          </Link>
          <Link href="/audit/key-vault" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3 text-[20px]">vpn_key</span>
            <span className="font-label-md text-label-md">Key Vault</span>
          </Link>
          <Link href="/audit/system-integrity" className="flex items-center text-on-surface-variant px-4 py-3 hover:bg-surface-container transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3 text-[20px]">verified_user</span>
            <span className="font-label-md text-label-md">System Integrity</span>
          </Link>
          <Link href="/audit/system-health-monitor-1" className="flex items-center text-secondary font-bold border-l-4 border-secondary bg-secondary-container/10 px-4 py-3 transition-all duration-150 ease-in-out">
            <span className="material-symbols-outlined mr-3 text-[20px] fill">analytics</span>
            <span className="font-label-md text-label-md">Audit Reports</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-outline-variant space-y-4">
          <button className="w-full bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-md text-label-md py-2 rounded transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">summarize</span>
            Generate Forensic Report
          </button>
          <div className="space-y-1">
            <Link href="/settings" className="flex items-center text-on-surface-variant px-2 py-2 hover:bg-surface-container transition-all duration-150 ease-in-out rounded">
              <span className="material-symbols-outlined mr-3 text-[18px]">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </Link>
            <Link href="/support" className="flex items-center text-on-surface-variant px-2 py-2 hover:bg-surface-container transition-all duration-150 ease-in-out rounded">
              <span className="material-symbols-outlined mr-3 text-[18px]">help</span>
              <span className="font-label-md text-label-md">Support</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 ml-0 md:ml-60 mt-14 p-gutter overflow-y-auto bg-surface-container-low relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0"></div>
        <div className="max-w-[1600px] mx-auto relative z-10 space-y-lg">
          {/* Breadcrumbs & Page Header */}
          <div className="flex justify-between items-end mb-xl">
            <div>
              <nav className="flex text-on-surface-variant font-label-sm text-label-sm mb-xs">
                <Link href="/" className="hover:text-primary transition-colors">ERP Root</Link>
                <span className="mx-2">/</span>
                <Link href="/audit" className="hover:text-primary transition-colors">K-AUDIT</Link>
                <span className="mx-2">/</span>
                <span className="text-on-surface">Dashboard</span>
              </nav>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Forensic Audit Dashboard</h1>
            </div>
            <div className="flex gap-sm">
              <div className="bg-surface-container-highest px-3 py-1.5 rounded flex items-center gap-2 border border-outline-variant">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                <span className="font-label-md text-label-md text-on-surface">System Status: Optimal</span>
              </div>
              <div className="bg-surface-container-highest px-3 py-1.5 rounded flex items-center gap-2 border border-outline-variant">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
                <span className="font-label-md text-label-md text-on-surface font-data-tabular">Last Sync: 14:02:45 UTC</span>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* System Health Monitor (Wide) */}
            <div className="lg:col-span-8 dash-card bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
              <div className="flex justify-between items-center mb-md pb-xs border-b border-surface-variant">
                <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">monitor_heart</span>
                  Module Health Monitor
                </h2>
                <button className="text-primary font-label-sm text-label-sm hover:underline">View Details</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                {modules.map((module) => (
                  <div key={module.id} className={`bg-surface border border-outline-variant rounded p-3 text-center ${module.status === 'sync_delay' ? 'ring-2 ring-error/50' : ''}`}>
                    <div className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">{module.name}</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className={`material-symbols-outlined text-[32px] ${module.status === 'sync_delay' ? 'text-error' : 'text-secondary'}`}>
                        {module.icon}
                      </span>
                    </div>
                    <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(module.status)}`}>
                      {getStatusLabel(module.status)}
                    </div>
                    <div className={`mt-2 font-data-tabular text-data-tabular ${module.status === 'sync_delay' ? 'text-error' : 'text-on-surface-variant'}`}>
                      {module.lag || `Uptime: ${module.uptime}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MFA Compliance (Square) */}
            <div className="lg:col-span-4 dash-card bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col">
              <div className="flex justify-between items-center mb-md pb-xs border-b border-surface-variant">
                <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">fingerprint</span>
                  MFA Compliance
                </h2>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-32 h-32 rounded-full border-8 border-surface-variant relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-secondary border-r-transparent border-b-transparent transform rotate-45"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-secondary border-t-transparent border-l-transparent transform -rotate-45"></div>
                  <div className="text-center">
                    <div className="font-headline-lg text-headline-lg text-on-surface">{mfaCompliance.compliant}%</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">Compliant</div>
                  </div>
                </div>
                <div className="mt-md w-full space-y-2">
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-secondary rounded-full"></span> Active MFA</span>
                    <span className="font-data-tabular">{mfaCompliance.activeUsers.toLocaleString()} users</span>
                  </div>
                  <div className="flex justify-between font-label-md text-label-md">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-surface-variant rounded-full"></span> Pending/Inactive</span>
                    <span className="font-data-tabular text-error">{mfaCompliance.pendingUsers} users</span>
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
