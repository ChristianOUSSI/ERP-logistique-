// src/app/(app)/transport/map/page.tsx - K-Transport Terminal Map Control - Fidèle 100% au HTML original
'use client'

import { TCodeSearch } from '@/components/ui/TCodeSearch'
import React, { useState, useEffect } from 'react';

export default function KTransportTerminalMapControl() {
  const [truckPos, setTruckPos] = useState(10);
  const [iotActive, setIotActive] = useState(true);

  useEffect(() => {
    if (!iotActive) return;
    const interval = setInterval(() => {
      setTruckPos((prev) => (prev + 0.5) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [iotActive]);

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .icon-fill {
          font-variation-settings: 'FILL 1';
        }
        .terminal-grid {
          background-color: #f9f9ff;
          background-image: linear-gradient(#dce2f3 1px, transparent 1px), linear-gradient(90deg, #dce2f3 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes pulse-border {
          0% { border-color: rgba(163, 103, 0, 0.4); }
          50% { border-color: rgba(163, 103, 0, 1); }
          100% { border-color: rgba(163, 103, 0, 0.4); }
        }
        .live-element {
          animation: pulse-border 3s infinite;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex">
        
        
        
        <div className="flex-1 flex flex-col min-h-screen">
          
          
          {/* Main Dashboard Stage */}
          <main className="flex-1 p-gutter flex gap-gutter overflow-hidden h-[calc(100vh-64px)]">
            {/* Left Pane: Interactive Terminal Map (Bento Grid Style) */}
            <section className="flex-1 bg-surface border border-outline-variant rounded-xl shadow-sm flex flex-col overflow-hidden relative">
              {/* Map Header */}
              <div className="flex items-center justify-between p-md border-b border-outline-variant bg-surface-container-lowest z-10">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">map</span>
                    Live Terminal Topology
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Zone Alpha - Active Dispatch</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-label-md font-label-md bg-surface-container border border-outline-variant rounded hover:bg-surface-variant transition-colors">Standard View</button>
                  <button 
                    onClick={() => setIotActive(!iotActive)}
                    className={`px-3 py-1.5 text-label-md font-label-md rounded transition-colors flex items-center gap-1 shadow-sm ${iotActive ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container border border-outline-variant text-on-surface-variant'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{iotActive ? 'sensors' : 'sensors_off'}</span> 
                    {iotActive ? 'Live IoT Feed' : 'IoT Paused'}
                  </button>
                </div>
              </div>
              {/* Map Canvas area */}
              <div className="flex-1 terminal-grid relative overflow-hidden p-lg">
                {/* Water / Dock Edge */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-primary-fixed border-t-4 border-outline-variant flex items-center px-lg gap-xl">
                  {/* Ship 1 */}
                  <div className="relative group cursor-pointer mt-4">
                    <div className="w-64 h-20 bg-surface border-2 border-outline-variant rounded-t-full flex items-center justify-center shadow-md live-element">
                      <span className="font-title-lg text-title-lg text-on-surface">MV Horizon</span>
                    </div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface border border-outline-variant rounded px-2 py-1 shadow flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      <span className="font-label-sm text-label-sm text-tertiary">Dock 1</span>
                      <span className="font-data-tabular text-data-tabular">Loading: 45%</span>
                    </div>
                  </div>
                  {/* Ship 2 (Empty berth) */}
                  <div className="w-64 h-20 border-2 border-dashed border-outline-variant rounded-t-full flex items-center justify-center opacity-50">
                    <span className="font-label-md text-label-md text-on-surface-variant">Berth 2 - Open</span>
                  </div>
                </div>
                {/* Container Yard Blocks */}
                <div className="grid grid-cols-3 gap-xl w-full h-[calc(100%-8rem)] pb-8 pt-4">
                  {/* Block A (Active Transport) */}
                  <div className="bg-surface border-2 border-tertiary rounded-lg p-sm relative shadow-sm hover:shadow-md transition-shadow cursor-crosshair">
                    <div className="absolute top-0 right-0 bg-tertiary text-on-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded-bl-lg rounded-tr-sm">Block A</div>
                    <div className="grid grid-cols-4 gap-1 h-full pt-6">
                      {/* Dummy containers */}
                      <div className="bg-tertiary-fixed border border-tertiary rounded-sm h-full w-full"></div>
                      <div className="bg-outline-variant border border-outline rounded-sm h-full w-full"></div>
                      <div className="bg-tertiary-fixed border border-tertiary rounded-sm h-full w-full"></div>
                      <div className="bg-surface-container-high border border-outline-variant rounded-sm h-3/4 mt-auto w-full"></div>
                      <div className="bg-outline-variant border border-outline rounded-sm h-full w-full"></div>
                      <div className="bg-tertiary-fixed border border-tertiary rounded-sm h-1/2 mt-auto w-full"></div>
                    </div>
                    {/* Reachstacker icon moving */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-tertiary rounded-full flex items-center justify-center shadow-lg live-element z-10">
                      <span className="material-symbols-outlined text-on-tertiary text-[18px]">forklift</span>
                    </div>
                  </div>
                  {/* Block B (Storage) */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-sm relative shadow-sm">
                    <div className="absolute top-0 right-0 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-bl-lg rounded-tr-sm">Block B</div>
                    <div className="grid grid-cols-4 gap-1 h-full pt-6 opacity-60">
                      <div className="bg-surface-dim border border-outline-variant rounded-sm h-full w-full"></div>
                      <div className="bg-surface-dim border border-outline-variant rounded-sm h-full w-full"></div>
                      <div className="bg-surface-dim border border-outline-variant rounded-sm h-full w-full"></div>
                      <div className="bg-surface-dim border border-outline-variant rounded-sm h-full w-full"></div>
                    </div>
                  </div>
                  {/* Transport Lane */}
                  <div className="col-span-3 h-12 bg-surface-container border-y-2 border-dashed border-outline-variant flex items-center px-lg mt-auto relative overflow-hidden">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest z-10 bg-surface-container/80 px-2 rounded">Main Transport Arterial</span>
                    {/* Moving truck */}
                    <div 
                      className="absolute flex items-center gap-1 text-tertiary transition-all duration-100 ease-linear z-20"
                      style={{ left: `${truckPos}%` }}
                    >
                      <span className="material-symbols-outlined">local_shipping</span>
                      <span className="font-data-tabular text-data-tabular bg-surface px-1 rounded shadow-sm border border-outline-variant text-xs">Unit 402</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Right Pane: Terminal Events & Equipment Status */}
            <aside className="w-[360px] flex flex-col gap-gutter overflow-y-auto pr-2">
              {/* Terminal Events Card */}
              <div className="bg-surface border border-outline-variant rounded-xl shadow-sm flex flex-col">
                <div className="p-4 border-b border-outline-variant bg-surface-container-lowest rounded-t-xl flex justify-between items-center">
                  <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                    Terminal Events
                  </h3>
                  <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full">Live</span>
                </div>
                <div className="p-2 flex flex-col gap-1 h-[280px] overflow-y-auto">
                  {/* Event Item: Transport related */}
                  <div className="p-3 bg-tertiary-fixed bg-opacity-20 border-l-2 border-tertiary rounded flex gap-3 hover:bg-surface-container-low transition-colors cursor-default">
                    <div className="mt-0.5">
                      <span className="material-symbols-outlined text-tertiary text-[18px]">local_shipping</span>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">Truck 402 Arrived at Block A</p>
                      <p className="font-data-tabular text-data-tabular text-on-surface-variant text-[11px] mt-1">10:42 AM • T-Code: 8992-B</p>
                    </div>
                  </div>
                  {/* Event Item: Warning */}
                  <div className="p-3 hover:bg-surface-container border-l-2 border-error rounded flex gap-3 transition-colors cursor-default">
                    <div className="mt-0.5">
                      <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">Crane 3 Speed Limit Alert</p>
                      <p className="font-data-tabular text-data-tabular text-on-surface-variant text-[11px] mt-1">10:38 AM • Wind conditions</p>
                    </div>
                  </div>
                  {/* Event Item: Info */}
                  <div className="p-3 hover:bg-surface-container border-l-2 border-primary rounded flex gap-3 transition-colors cursor-default">
                    <div className="mt-0.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">sailing</span>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">MV Horizon Mooring Complete</p>
                      <p className="font-data-tabular text-data-tabular text-on-surface-variant text-[11px] mt-1">10:15 AM • Berth 1</p>
                    </div>
                  </div>
                  {/* Event Item: Routine */}
                  <div className="p-3 hover:bg-surface-container border-l-2 border-outline-variant rounded flex gap-3 transition-colors cursor-default">
                    <div className="mt-0.5">
                      <span className="material-symbols-outlined text-outline text-[18px]">inventory_2</span>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface font-medium">Container CX-909 Staged</p>
                      <p className="font-data-tabular text-data-tabular text-on-surface-variant text-[11px] mt-1">10:05 AM • Block B</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Equipment Status Card */}
              <div className="bg-surface border border-outline-variant rounded-xl shadow-sm flex flex-col flex-1">
                <div className="p-4 border-b border-outline-variant bg-surface-container-lowest rounded-t-xl flex justify-between items-center">
                  <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">engineering</span>
                    Equipment Status
                  </h3>
                  <button className="material-symbols-outlined text-outline hover:text-primary transition-colors text-[20px]">more_vert</button>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {/* Category: Reachstackers */}
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-variant pb-1 flex justify-between">
                      Reachstackers
                      <span className="text-tertiary">3/4 Active</span>
                    </h4>
                    <div className="flex flex-col gap-2">
                      {/* Eq 1 */}
                      <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-tertiary live-element"></div>
                          <span className="font-data-tabular text-data-tabular font-medium">RS-01</span>
                        </div>
                        <span className="font-label-sm text-label-sm bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded">Active - Block A</span>
                      </div>
                      {/* Eq 2 */}
                      <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-tertiary live-element"></div>
                          <span className="font-data-tabular text-data-tabular font-medium">RS-02</span>
                        </div>
                        <span className="font-label-sm text-label-sm bg-tertiary-fixed text-tertiary px-2 py-0.5 rounded">Active - Berth 1</span>
                      </div>
                      {/* Eq 3 (Offline) */}
                      <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-outline-variant opacity-70">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-error"></div>
                          <span className="font-data-tabular text-data-tabular font-medium text-on-surface-variant">RS-03</span>
                        </div>
                        <span className="font-label-sm text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">Maintenance</span>
                      </div>
                    </div>
                  </div>
                  {/* Category: Ship-to-Shore Cranes */}
                  <div className="mt-2">
                    <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 border-b border-outline-variant pb-1 flex justify-between">
                      STS Cranes
                      <span className="text-primary">2/2 Active</span>
                    </h4>
                    <div className="flex flex-col gap-2">
                      {/* Crane 1 */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-surface-container-lowest border border-outline-variant">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary live-element"></div>
                            <span className="font-data-tabular text-data-tabular font-medium">STS-North</span>
                          </div>
                          <span className="font-data-tabular text-data-tabular text-[11px] text-on-surface-variant">24 moves/hr</span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-1">
                          <div className="bg-primary h-full w-[80%]"></div>
                        </div>
                      </div>
                      {/* Crane 2 */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-surface-container-lowest border border-outline-variant">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary live-element"></div>
                            <span className="font-data-tabular text-data-tabular font-medium">STS-South</span>
                          </div>
                          <span className="font-data-tabular text-data-tabular text-[11px] text-on-surface-variant">18 moves/hr</span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-1">
                          <div className="bg-primary h-full w-[60%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  )
}
