// src/app/(app)/audit/dashboard/health/page.tsx - Audit System Health Monitor 1 - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuditHealthMonitor() {
  const router = useRouter()

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1, wght 400, GRAD 0, opsz 24';
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #E5E7EB 1px, transparent 1px),
                              linear-gradient(to bottom, #E5E7EB 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .dash-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .dash-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md h-screen flex overflow-hidden">
        
        
        
        <aside className="bg-surface-container-low fixed left-0 top-0 h-full flex flex-col pt-14 z-40 h-full w-60 border-r border-outline-variant hidden md:flex">
          {/* Header Profile Area */}
          <div className="p-4 border-b border-outline-variant flex items-center gap-3">
            <img alt="Audit Officer Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-secondary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE53cMy-a4LsNY3roGazi5bhIzvs01R1p3ymXkobE6eWluBN76Hqw7AwvGpZNwz9fs4WI9qRgDtcttsclFjFgGlTTnJClYVErPMOUsVEGBpjYuJ7Vz6S4fuqIKQ2f0pigLOrrD6hJJA5YORjW0rCSNluuSJkTxAKlSgS_h_PNd_l3NfEDJHZsG96ujq1zbGCL7ArAj3LrIcRQC7kEdCOXk6XEFIoF3ktbct9tAGYyaNT9e0tBDAsGLbtM5lSKBSMgtxQaC0nXijyE"/>
            <div>
              <div className="font-title-md text-title-md text-on-surface">Audit & Security</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">Module: K-AUDIT</div>
            </div>
          </div>
          {/* Main Navigation */}
          
          {/* CTA & Footer */}
          <div className="p-4 border-t border-outline-variant space-y-4">
            <button className="w-full bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-md text-label-md py-2 rounded transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">summarize</span>
              Generate Forensic Report
            </button>
            <div className="space-y-1">
              <a onClick={() => router.push('/settings')} className="flex items-center text-on-surface-variant px-2 py-2 hover:bg-surface-container transition-all duration-150 ease-in-out rounded cursor-pointer">
                <span className="material-symbols-outlined mr-3 text-[18px]">settings</span>
                <span className="font-label-md text-label-md">Settings</span>
              </a>
              <a onClick={() => router.push('/support')} className="flex items-center text-on-surface-variant px-2 py-2 hover:bg-surface-container transition-all duration-150 ease-in-out rounded cursor-pointer">
                <span className="material-symbols-outlined mr-3 text-[18px]">help</span>
                <span className="font-label-md text-label-md">Support</span>
              </a>
            </div>
          </div>
        </aside>
        {/* Main Content Canvas */}
        <main className="flex-1 ml-0 md:ml-60 mt-14 p-[1rem] overflow-y-auto bg-surface-container-low relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0"></div>
          <div className="max-w-[1600px] mx-auto relative z-10 space-y-[1.5rem]">
            {/* Breadcrumbs & Page Header */}
            <div className="flex justify-between items-end mb-[1.5rem]">
              <div>
                
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Forensic Audit Dashboard</h1>
              </div>
              <div className="flex gap-[0.5rem]">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1rem]">
              {/* System Health Monitor (Wide) */}
              <div className="lg:col-span-8 dash-card bg-surface-container-lowest border border-outline-variant rounded-lg p-[1rem]">
                <div className="flex justify-between items-center mb-[1rem] pb-[0.25rem] border-b border-surface-variant">
                  <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">monitor_heart</span>
                    Module Health Monitor
                  </h2>
                  <button onClick={() => router.push('/audit/dashboard/health/details')} className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer">View Details</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[0.5rem]">
                  {/* Module Status Cards */}
                  <div className="bg-surface border border-outline-variant rounded p-3 text-center">
                    <div className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">K-Transport</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[32px] text-secondary">local_shipping</span>
                    </div>
                    <div className="inline-flex items-center justify-center px-2 py-0.5 bg-[#d1fae5] text-[#047857] rounded text-[10px] font-bold uppercase tracking-wider">
                      Online
                    </div>
                    <div className="mt-2 font-data-tabular text-data-tabular text-on-surface-variant">Uptime: 99.9%</div>
                  </div>
                  <div className="bg-surface border border-outline-variant rounded p-3 text-center">
                    <div className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">K-Magasin</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[32px] text-secondary">warehouse</span>
                    </div>
                    <div className="inline-flex items-center justify-center px-2 py-0.5 bg-[#d1fae5] text-[#047857] rounded text-[10px] font-bold uppercase tracking-wider">
                      Online
                    </div>
                    <div className="mt-2 font-data-tabular text-data-tabular text-on-surface-variant">Uptime: 99.8%</div>
                  </div>
                  <div className="bg-surface border border-outline-variant rounded p-3 text-center ring-2 ring-error/50">
                    <div className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">K-Finance</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[32px] text-error">account_balance</span>
                    </div>
                    <div className="inline-flex items-center justify-center px-2 py-0.5 bg-[#fee2e2] text-[#b91c1c] rounded text-[10px] font-bold uppercase tracking-wider">
                      Sync Delay
                    </div>
                    <div className="mt-2 font-data-tabular text-data-tabular text-error">-45s lag detected</div>
                  </div>
                  <div className="bg-surface border border-outline-variant rounded p-3 text-center">
                    <div className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">K-Parc</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[32px] text-secondary">directions_car</span>
                    </div>
                    <div className="inline-flex items-center justify-center px-2 py-0.5 bg-[#d1fae5] text-[#047857] rounded text-[10px] font-bold uppercase tracking-wider">
                      Online
                    </div>
                    <div className="mt-2 font-data-tabular text-data-tabular text-on-surface-variant">Uptime: 100%</div>
                  </div>
                </div>
              </div>
              {/* MFA Compliance (Square) */}
              <div className="lg:col-span-4 dash-card bg-surface-container-lowest border border-outline-variant rounded-lg p-[1rem] flex flex-col">
                <div className="flex justify-between items-center mb-[1rem] pb-[0.25rem] border-b border-surface-variant">
                  <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">fingerprint</span>
                    MFA Compliance
                  </h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  {/* Simulated Donut Chart */}
                  <div className="w-32 h-32 rounded-full border-8 border-surface-variant relative flex items-center justify-center">
                    {/* Visual trick for chart */}
                    <div className="absolute inset-0 rounded-full border-8 border-secondary border-r-transparent border-b-transparent transform rotate-45"></div>
                    <div className="absolute inset-0 rounded-full border-8 border-secondary border-t-transparent border-l-transparent transform -rotate-45"></div>
                    <div className="text-center">
                      <div className="font-headline-lg text-headline-lg text-on-surface">92%</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">Compliant</div>
                    </div>
                  </div>
                  <div className="mt-[1rem] w-full space-y-2">
                    <div className="flex justify-between font-label-md text-label-md">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-secondary rounded-full"></span> Active MFA</span>
                      <span className="font-data-tabular">1,452 users</span>
                    </div>
                    <div className="flex justify-between font-label-md text-label-md">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-surface-variant rounded-full"></span> Pending/Inactive</span>
                      <span className="font-data-tabular text-error">128 users</span>
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
