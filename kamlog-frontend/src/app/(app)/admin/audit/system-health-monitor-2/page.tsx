"use client";

import { useState } from 'react';
import Link from 'next/link';

interface SystemMetric {
  id: string;
  name: string;
  description: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  icon: string;
  iconColor: string;
  chartData?: number[];
  additionalData?: {
    label: string;
    value: string | number;
  }[];
}

interface LogEntry {
  timestamp: string;
  level: 'Error' | 'Warn' | 'Info';
  service: string;
  message: string;
  correlationId: string;
}

export default function SystemHealthMonitor2Page() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Allocation',
      description: 'Core T-1 Logistics Node',
      value: '68%',
      trend: '2.4%',
      trendDirection: 'down',
      icon: 'memory',
      iconColor: 'text-tertiary',
      chartData: [40, 55, 60, 45, 70, 85, 68],
    },
    {
      id: 'memory',
      name: 'Memory Utilization',
      description: 'Active JVM Heap',
      value: '24.2 GB',
      trend: '12%',
      trendDirection: 'up',
      icon: 'data_usage',
      iconColor: 'text-primary',
      additionalData: [
        { label: 'Used', value: '78%' },
        { label: 'Total', value: '32 GB' },
      ],
    },
    {
      id: 'db',
      name: 'DB Connection Pool',
      description: 'PostgreSQL - KAMLOG_MAIN',
      value: '195/200',
      icon: 'database',
      iconColor: 'text-error',
      additionalData: [
        { label: 'Active', value: '182' },
        { label: 'Idle', value: '13' },
      ],
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: '14:02:11.405',
      level: 'Error',
      service: 'KAMLOG-Finance-Svc',
      message: 'Connection timeout to payment gateway (Retry 3/3)',
      correlationId: 'req-7b8a-4c2d-9f1e',
    },
    {
      timestamp: '14:01:55.120',
      level: 'Error',
      service: 'KAMLOG-Auth-Svc',
      message: 'Invalid LDAP credentials supplied for user_id: 8442',
      correlationId: 'req-11a2-9b4f-00c1',
    },
    {
      timestamp: '13:58:44.901',
      level: 'Warn',
      service: 'Postgres-DB-Master',
      message: 'Connection pool approaching max capacity (95%)',
      correlationId: 'sys-db-pool-mon',
    },
    {
      timestamp: '13:45:10.002',
      level: 'Error',
      service: 'KAMLOG-Logistics-Svc',
      message: 'Failed to parse manifest XML from T-Code: MNF-209',
      correlationId: 'req-88c1-2d3e-4a5b',
    },
  ]);

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'Error':
        return 'bg-error-container text-error';
      case 'Warn':
        return 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  const getTrendBadge = (direction: 'up' | 'down') => {
    return direction === 'up'
      ? 'text-error bg-error-container'
      : 'text-secondary bg-secondary-container';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
            <span className="material-symbols-outlined fill">add</span>
            Nouvelle Opération
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150">
                <span className="material-symbols-outlined">dashboard</span>
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link href="/transport" className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150">
                <span className="material-symbols-outlined">local_shipping</span>
                Transport
              </Link>
            </li>
            <li>
              <Link href="/finance" className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150">
                <span className="material-symbols-outlined">payments</span>
                Finances
              </Link>
            </li>
            <li>
              <Link href="/parc" className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150">
                <span className="material-symbols-outlined">minor_crash</span>
                Parc Automobile
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded text-primary bg-secondary-container font-bold font-label-caps text-label-caps active:scale-95 duration-150 border-l-4 border-primary">
                <span className="material-symbols-outlined">settings</span>
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto border-t border-outline-variant p-2">
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/support" className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">help_outline</span>
                Support
              </Link>
            </li>
            <li>
              <Link href="/logout" className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">logout</span>
                Déconnexion
              </Link>
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
              <Link href="/articles" className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all">Articles</Link>
              <Link href="/clients" className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all">Clients</Link>
              <Link href="/stocks" className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all">Stocks</Link>
              <Link href="/rapports" className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all">Rapports</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative focus-within:ring-2 focus-within:ring-primary rounded">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input className="pl-8 pr-3 py-1.5 bg-surface-container-high border-none rounded text-sm w-48 focus:outline-none focus:ring-0" placeholder="Rechercher T-Code" type="text" />
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden border border-outline-variant">
                <span className="material-symbols-outlined text-sm">person</span>
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
            {metrics.map((metric) => (
              <div key={metric.id} className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm relative overflow-hidden ${metric.id === 'db' ? 'border-l-4 border-l-error' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-title-md text-title-md text-on-surface">{metric.name}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{metric.description}</p>
                  </div>
                  <span className={`material-symbols-outlined ${metric.iconColor}`}>{metric.icon}</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="font-headline-lg text-headline-lg leading-none">{metric.value}</span>
                  {metric.trend && (
                    <span className={`${getTrendBadge(metric.trendDirection || 'down')} text-label-sm font-label-sm px-1.5 py-0.5 rounded flex items-center`}>
                      <span className="material-symbols-outlined text-[12px]">
                        {metric.trendDirection === 'up' ? 'arrow_upward' : 'arrow_downward'}
                      </span> {metric.trend}
                    </span>
                  )}
                </div>
                {metric.chartData && (
                  <div className="flex items-end gap-1 h-12 mt-4 opacity-80">
                    {metric.chartData.map((height, index) => (
                      <div key={index} className={`w-full rounded-t ${index === (metric.chartData?.length || 0) - 1 ? 'bg-tertiary' : 'bg-surface-container-highest'}`} style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                )}
                {metric.additionalData && (
                  <>
                    {metric.id === 'memory' && (
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[78%]"></div>
                      </div>
                    )}
                    <div className={`mt-2 ${metric.id === 'memory' ? 'flex justify-between' : 'grid grid-cols-2'} gap-2 text-label-sm font-label-sm text-outline`}>
                      {metric.additionalData.map((data, index) => (
                        <div key={index}>
                          <span className="block uppercase">{data.label}:</span>
                          <span className="font-title-lg text-title-lg">{data.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
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
                  {logs.map((log, index) => (
                    <tr key={index} className={`border-b border-outline-variant hover:bg-surface-container-low transition-colors ${index % 2 === 1 ? 'bg-surface-container-lowest' : ''}`}>
                      <td className="py-3 px-4 text-outline">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className={`${getLevelBadge(log.level)} px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase`}>
                          {log.level}
                        </span>
                      </td>
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
  );
}
