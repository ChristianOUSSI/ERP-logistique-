'use client'

import { useState } from 'react'

interface Vehicle {
  id: string
  type: string
  status: 'in_transit' | 'loading' | 'alert' | 'locked'
  fuelLevel: number
  odometer: string
  maintenance: string
}

interface FuelLog {
  vehicleId: string
  dateTime: string
  amount: string
  operator: string
  efficiency: string
  status: 'verified' | 'flagged'
}

export default function GestionDeLaFlottePage() {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'K-FLT-4402',
      type: 'Container Hauler',
      status: 'in_transit',
      fuelLevel: 78,
      odometer: '124,502 km',
      maintenance: '12d left'
    },
    {
      id: 'K-FLT-8821',
      type: 'Heavy Duty Cab',
      status: 'alert',
      fuelLevel: 12,
      odometer: '89,231 km',
      maintenance: 'Locked'
    },
    {
      id: 'K-FLT-3390',
      type: 'Cargo Sprinter',
      status: 'loading',
      fuelLevel: 92,
      odometer: '45,110 km',
      maintenance: '5,000 km'
    }
  ])

  const [fuelLogs] = useState<FuelLog[]>([
    {
      vehicleId: 'K-FLT-4402',
      dateTime: '2023-10-24 11:45',
      amount: '342.50 L',
      operator: 'Jean Dupont',
      efficiency: 'Optimal',
      status: 'verified'
    },
    {
      vehicleId: 'K-FLT-8821',
      dateTime: '2023-10-24 10:12',
      amount: '115.00 L',
      operator: 'Marc Leroy',
      efficiency: '-14.2%',
      status: 'flagged'
    },
    {
      vehicleId: 'K-FLT-3390',
      dateTime: '2023-10-24 09:55',
      amount: '520.12 L',
      operator: 'Sarra S.',
      efficiency: 'Standard',
      status: 'verified'
    },
    {
      vehicleId: 'K-FLT-2210',
      dateTime: '2023-10-24 08:30',
      amount: '280.40 L',
      operator: 'Jean Dupont',
      efficiency: 'Optimal',
      status: 'verified'
    }
  ])

  const [showAlert, setShowAlert] = useState(true)

  const getStatusBadge = (status: Vehicle['status']) => {
    switch (status) {
      case 'in_transit':
        return <span className="bg-secondary/10 text-secondary text-label-sm px-xs py-0.5 rounded font-bold">In Transit</span>
      case 'loading':
        return <span className="bg-primary-container/10 text-primary text-label-sm px-xs py-0.5 rounded font-bold">Loading</span>
      case 'alert':
        return null
      case 'locked':
        return null
    }
  }

  const getEfficiencyClass = (efficiency: string) => {
    if (efficiency.startsWith('-')) return 'text-error font-bold'
    if (efficiency === 'Optimal') return 'text-secondary font-bold'
    return 'text-on-surface-variant font-bold'
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1';
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c2c6d6; border-radius: 2px; }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
      <div className="bg-surface-container-low text-on-surface">
        
        

        
        

        {/* Main Content Stage */}
        <main className="pt-16 min-h-screen">
          <div className="p-lg max-w-[1600px] mx-auto space-y-lg">
            {/* Breadcrumbs & Title */}
            <div className="flex flex-col gap-xxs">
              
              <div className="flex justify-between items-end">
                <h1 className="text-headline-md font-headline-md text-on-surface">K-Parc: Fleet Intelligence</h1>
                <div className="flex gap-xs">
                  <button className="bg-primary text-on-primary px-md py-xs rounded text-label-md font-label-md flex items-center gap-xs hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Register Vehicle
                  </button>
                </div>
              </div>
            </div>

            {/* CRITICAL ALERT BANNER */}
            {showAlert && (
              <div className="bg-error-container border border-error p-md rounded-lg flex items-center gap-md relative overflow-hidden group">
                <div className="absolute inset-0 shimmer opacity-10"></div>
                <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center text-on-error shrink-0 animate-pulse">
                  <span className="material-symbols-outlined text-[28px] fill">warning</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-on-error-container font-bold text-title-md">Fuel Siphoning Detected</h2>
                  <p className="text-on-error-container text-body-sm opacity-90">Anomalous fuel drop detected on Vehicle <strong>K-FLT-8821</strong> (Volvo FH16) at Warehouse Section C. Timestamp: 14:32:01. Security protocol initiated.</p>
                </div>
                <div className="flex gap-sm">
                  <button className="bg-error text-on-error px-md py-xs rounded-lg text-label-md font-label-md hover:bg-opacity-80 transition-all">Dispatch Response</button>
                  <button onClick={() => setShowAlert(false)} className="border border-error text-error px-md py-xs rounded-lg text-label-md font-label-md hover:bg-error hover:text-on-error transition-all">Dismiss</button>
                </div>
              </div>
            )}

            {/* Fleet Overview Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
              {/* Vehicle Card 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:border-secondary transition-all group flex flex-col justify-between">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-tighter">Container Hauler</span>
                    <h3 className="text-title-md font-bold text-on-surface">K-FLT-4402</h3>
                  </div>
                  {getStatusBadge(vehicles[0].status)}
                </div>
                <div className="space-y-sm mb-lg">
                  <div className="flex justify-between items-end">
                    <span className="text-body-sm text-on-surface-variant">Fuel Level</span>
                    <span className="text-title-md font-bold text-secondary">{vehicles[0].fuelLevel}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{width: `${vehicles[0].fuelLevel}%`}}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-surface-container-low p-xs rounded">
                    <span className="text-label-sm text-on-surface-variant block">Odometer</span>
                    <span className="font-data-tabular text-body-md font-bold">{vehicles[0].odometer}</span>
                  </div>
                  <div className="bg-surface-container-low p-xs rounded">
                    <span className="text-label-sm text-on-surface-variant block">Maint.</span>
                    <span className="text-body-md font-bold text-on-surface">{vehicles[0].maintenance}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Card 2 - Alert State */}
              <div className="bg-surface-container-lowest border-2 border-error/50 p-md rounded-xl shadow-lg relative flex flex-col justify-between">
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                </div>
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-tighter">Heavy Duty Cab</span>
                    <h3 className="text-title-md font-bold text-on-surface">K-FLT-8821</h3>
                  </div>
                </div>
                <div className="space-y-sm mb-lg">
                  <div className="flex justify-between items-end">
                    <span className="text-body-sm text-error font-bold">Critical Alert</span>
                    <span className="text-title-md font-bold text-error">{vehicles[1].fuelLevel}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-error-container rounded-full overflow-hidden">
                    <div className="h-full bg-error" style={{width: `${vehicles[1].fuelLevel}%`}}></div>
                  </div>
                  <span className="text-label-sm text-error italic">Fuel loss detected!</span>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-error-container/20 p-xs rounded">
                    <span className="text-label-sm text-on-surface-variant block">Odometer</span>
                    <span className="font-data-tabular text-body-md font-bold">{vehicles[1].odometer}</span>
                  </div>
                  <div className="bg-error-container/20 p-xs rounded">
                    <span className="text-label-sm text-on-surface-variant block">Status</span>
                    <span className="text-body-md font-bold text-error">Locked</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Card 3 */}
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:border-secondary transition-all group flex flex-col justify-between">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-tighter">Cargo Sprinter</span>
                    <h3 className="text-title-md font-bold text-on-surface">K-FLT-3390</h3>
                  </div>
                  {getStatusBadge(vehicles[2].status)}
                </div>
                <div className="space-y-sm mb-lg">
                  <div className="flex justify-between items-end">
                    <span className="text-body-sm text-on-surface-variant">Fuel Level</span>
                    <span className="text-title-md font-bold text-secondary">{vehicles[2].fuelLevel}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{width: `${vehicles[2].fuelLevel}%`}}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  <div className="bg-surface-container-low p-xs rounded">
                    <span className="text-label-sm text-on-surface-variant block">Odometer</span>
                    <span className="font-data-tabular text-body-md font-bold">{vehicles[2].odometer}</span>
                  </div>
                  <div className="bg-surface-container-low p-xs rounded">
                    <span className="text-label-sm text-on-surface-variant block">Maint.</span>
                    <span className="text-body-md font-bold text-on-surface">{vehicles[2].maintenance}</span>
                  </div>
                </div>
              </div>

              {/* Live Map/Location View */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden relative min-h-[180px]">
                <div className="absolute inset-0 bg-surface-container-highest">
                  <div className="w-full h-full opacity-40 grayscale"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">
                    <span className="material-symbols-outlined text-[48px] fill">location_on</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md p-xs flex justify-between items-center border-t border-outline-variant">
                  <span className="text-label-sm font-bold text-on-surface">Active Terminal 4</span>
                  <span className="text-label-sm text-secondary">12 Vehicles Active</span>
                </div>
              </div>
            </div>

            {/* Data Tables Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg">
              {/* Consumption Logs Table */}
              <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col overflow-hidden">
                <div className="px-md py-sm border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                  <h3 className="text-title-md font-bold flex items-center gap-xs">
                    <span className="material-symbols-outlined text-secondary">local_gas_station</span>
                    Fuel Consumption Logs
                  </h3>
                  <div className="flex gap-xs">
                    <button className="material-symbols-outlined text-[18px] p-1 hover:bg-surface-container-highest rounded">filter_list</button>
                    <button className="material-symbols-outlined text-[18px] p-1 hover:bg-surface-container-highest rounded">download</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        <th className="text-left py-xs px-md text-label-sm font-label-sm text-on-surface-variant uppercase">Vehicle ID</th>
                        <th className="text-left py-xs px-md text-label-sm font-label-sm text-on-surface-variant uppercase">Date/Time</th>
                        <th className="text-left py-xs px-md text-label-sm font-label-sm text-on-surface-variant uppercase">Amount (L)</th>
                        <th className="text-left py-xs px-md text-label-sm font-label-sm text-on-surface-variant uppercase">Operator</th>
                        <th className="text-left py-xs px-md text-label-sm font-label-sm text-on-surface-variant uppercase">Efficiency</th>
                        <th className="text-left py-xs px-md text-label-sm font-label-sm text-on-surface-variant uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {fuelLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-surface-container-low transition-colors group">
                          <td className="py-xs px-md font-bold text-body-sm">{log.vehicleId}</td>
                          <td className="py-xs px-md font-data-tabular text-body-sm">{log.dateTime}</td>
                          <td className="py-xs px-md font-data-tabular text-body-sm">{log.amount}</td>
                          <td className="py-xs px-md text-body-sm">{log.operator}</td>
                          <td className="py-xs px-md text-body-sm">
                            <span className={getEfficiencyClass(log.efficiency)}>{log.efficiency}</span>
                          </td>
                          <td className="py-xs px-md">
                            <span className={`inline-flex items-center gap-xs px-xs py-0.5 rounded-full text-label-sm ${
                              log.status === 'verified' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'verified' ? 'bg-secondary' : 'bg-error'}`}></span>
                              {log.status === 'verified' ? 'Verified' : 'Flagged'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Repair History Sidebar */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col overflow-hidden">
                <div className="px-md py-sm border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="text-title-md font-bold flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">build</span>
                    Repair History
                  </h3>
                  <a className="text-primary text-label-sm hover:underline" href="#">View All</a>
                </div>
                <div className="p-md space-y-md custom-scrollbar overflow-y-auto max-h-[400px]">
                  {/* History Item 1 */}
                  <div className="flex gap-md group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-[18px]">engineering</span>
                      </div>
                      <div className="w-0.5 h-full bg-outline-variant"></div>
                    </div>
                    <div className="pb-md">
                      <div className="flex justify-between items-center">
                        <span className="text-label-md font-bold">K-FLT-4402</span>
                        <span className="text-label-sm text-on-surface-variant">Oct 20</span>
                      </div>
                      <p className="text-body-sm font-bold">Brake Pad Replacement</p>
                      <p className="text-body-sm text-on-surface-variant italic">Routine maintenance. All units replaced.</p>
                      <div className="mt-xs flex items-center gap-xs">
                        <span className="bg-surface-container text-on-surface-variant px-xs py-0.5 rounded text-label-sm">FCFA1,240.00</span>
                        <span className="text-secondary material-symbols-outlined text-[14px] fill">check_circle</span>
                      </div>
                    </div>
                  </div>
                  {/* History Item 2 */}
                  <div className="flex gap-md group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center text-error border border-error/20">
                        <span className="material-symbols-outlined text-[18px]">no_crash</span>
                      </div>
                      <div className="w-0.5 h-full bg-outline-variant"></div>
                    </div>
                    <div className="pb-md">
                      <div className="flex justify-between items-center">
                        <span className="text-label-md font-bold">K-FLT-1102</span>
                        <span className="text-label-sm text-on-surface-variant">Oct 18</span>
                      </div>
                      <p className="text-body-sm font-bold">Hydraulic Leakage Repair</p>
                      <p className="text-body-sm text-on-surface-variant italic">Emergency repair at Dock A.</p>
                      <div className="mt-xs flex items-center gap-xs">
                        <span className="bg-surface-container text-on-surface-variant px-xs py-0.5 rounded text-label-sm">FCFA3,800.00</span>
                        <span className="text-secondary material-symbols-outlined text-[14px] fill">check_circle</span>
                      </div>
                    </div>
                  </div>
                  {/* History Item 3 */}
                  <div className="flex gap-md group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
                      </div>
                      <div className="w-0.5 h-full bg-outline-variant group-last:hidden"></div>
                    </div>
                    <div className="pb-md">
                      <div className="flex justify-between items-center">
                        <span className="text-label-md font-bold">K-FLT-9900</span>
                        <span className="text-label-sm text-on-surface-variant">Oct 15</span>
                      </div>
                      <p className="text-body-sm font-bold">Software Calibration</p>
                      <p className="text-body-sm text-on-surface-variant italic">System-wide OTA update.</p>
                      <div className="mt-xs flex items-center gap-xs">
                        <span className="bg-surface-container text-on-surface-variant px-xs py-0.5 rounded text-label-sm">FCFA0.00</span>
                        <span className="text-secondary material-symbols-outlined text-[14px] fill">check_circle</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Analytics Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div className="bg-surface-container-highest/30 p-md rounded-lg flex items-center gap-md">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[32px]">speed</span>
                </div>
                <div>
                  <span className="block text-label-sm text-on-surface-variant">Fleet Availability</span>
                  <span className="text-title-lg font-black">94.2%</span>
                  <span className="text-label-sm text-secondary font-bold">↑ 2.1% from last month</span>
                </div>
              </div>
              <div className="bg-surface-container-highest/30 p-md rounded-lg flex items-center gap-md">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[32px]">euro_symbol</span>
                </div>
                <div>
                  <span className="block text-label-sm text-on-surface-variant">Avg. Cost per km</span>
                  <span className="text-title-lg font-black">FCFA0.84</span>
                  <span className="text-label-sm text-error font-bold">↑ FCFA0.05 from last month</span>
                </div>
              </div>
              <div className="bg-surface-container-highest/30 p-md rounded-lg flex items-center gap-md">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[32px]">co2</span>
                </div>
                <div>
                  <span className="block text-label-sm text-on-surface-variant">Carbon Footprint</span>
                  <span className="text-title-lg font-black">1.2 tCO2e</span>
                  <span className="text-label-sm text-secondary font-bold">↓ 8% from last month</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Action for Quick Report */}
        <button className="fixed bottom-lg right-lg w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center group z-50">
          <span className="material-symbols-outlined text-[28px] fill">add_chart</span>
          <span className="absolute right-full mr-md bg-secondary text-on-secondary px-md py-xs rounded text-label-md font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Quick Report</span>
        </button>
      </div>
    </>
  )
}
