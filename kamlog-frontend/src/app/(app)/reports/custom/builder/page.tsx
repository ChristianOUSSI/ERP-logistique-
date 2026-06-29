// src/app/(app)/reports/custom/builder/page.tsx - Rapports Générateur de Rapports Personnalisés - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomReportBuilder() {
  const router = useRouter()
  const [module, setModule] = useState('transport')
  const [searchColumns, setSearchColumns] = useState('')
  const [startDate, setStartDate] = useState('2023-10-01')
  const [endDate, setEndDate] = useState('2023-10-31')
  const [selectedFields, setSelectedFields] = useState(['ot_number', 'creation_date', 'client_id', 'total_amount', 'status'])
  const [visualization, setVisualization] = useState('table')
  const [exportFormat, setExportFormat] = useState('excel')
  const [scheduleReport, setScheduleReport] = useState(false)

  const fields = [
    { id: 'ot_number', label: 'OT Number (Primary)' },
    { id: 'creation_date', label: 'Creation Date' },
    { id: 'client_id', label: 'Client ID' },
    { id: 'total_amount', label: 'Total Amount' },
    { id: 'status', label: 'Status' },
    { id: 'driver_name', label: 'Driver Name' },
    { id: 'vehicle_reg', label: 'Vehicle Reg' }
  ]

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    )
  }

  const handleSaveTemplate = () => {
    // Save template - will be connected to backend
    router.push('/reports/templates/library')
  }

  const handleGenerateReport = () => {
    // Generate report - will be connected to backend
  }

  const sampleData = [
    { otNumber: 'TR-2023-8841', date: '2023-10-24 08:15', clientId: 'C-99201 (Maersk)', amount: 'FCFA 4,500.00', status: 'Completed' },
    { otNumber: 'TR-2023-8842', date: '2023-10-24 09:30', clientId: 'C-44120 (CMA CGM)', amount: 'FCFA 1,250.00', status: 'In Transit' },
    { otNumber: 'TR-2023-8843', date: '2023-10-24 10:05', clientId: 'C-11094 (MSC)', amount: 'FCFA 8,900.00', status: 'Delayed' },
    { otNumber: 'TR-2023-8844', date: '2023-10-24 11:20', clientId: 'C-99201 (Maersk)', amount: 'FCFA 3,100.00', status: 'In Transit' },
    { otNumber: 'TR-2023-8845', date: '2023-10-24 13:45', clientId: 'C-88321 (Hapag-Lloyd)', amount: 'FCFA 5,600.00', status: 'Completed' }
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      'Completed': 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]',
      'In Transit': 'bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]',
      'Delayed': 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
    }
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[11px] font-bold uppercase tracking-wider ${styles[status as keyof typeof styles] || styles['In Transit']}`}>
        {status}
      </span>
    )
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #727785;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface h-screen overflow-hidden flex">
        {/* SideNavBar */}
        <nav className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-[1rem] z-50">
          <div className="mb-[2rem] flex items-center gap-[0.25rem]">
            <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: 'FILL 1'}}>corporate_fare</span>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-tight">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Port Operations</p>
            </div>
          </div>
          <button className="bg-primary text-on-primary w-full py-[0.5rem] px-[1rem] rounded hover:bg-primary-fixed-variant transition-colors flex items-center justify-center gap-[0.25rem] mb-[1.5rem] active:scale-95 duration-150 shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="font-label-md text-label-md">Nouvelle Opération</span>
          </button>
          <ul className="flex-1 flex flex-col gap-[0.25rem]">
            <li>
              <a onClick={() => router.push('/dashboard')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="font-label-md text-label-md uppercase">Tableau de bord</span>
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/transport')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                <span className="material-symbols-outlined">local_shipping</span>
                <span className="font-label-md text-label-md uppercase">Transport</span>
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/finance')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                <span className="material-symbols-outlined">payments</span>
                <span className="font-label-md text-label-md uppercase">Finances</span>
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/parc')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                <span className="material-symbols-outlined">minor_crash</span>
                <span className="font-label-md text-label-md uppercase">Parc Automobile</span>
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/settings')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                <span className="material-symbols-outlined">settings</span>
                <span className="font-label-md text-label-md uppercase">Paramètres</span>
              </a>
            </li>
          </ul>
          <ul className="mt-auto flex flex-col gap-[0.25rem] pt-[1rem] border-t border-outline-variant">
            <li>
              <a onClick={() => router.push('/support')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                <span className="material-symbols-outlined">help_outline</span>
                <span className="font-label-md text-label-md uppercase">Support</span>
              </a>
            </li>
            <li>
              <a onClick={() => router.push('/logout')} className="flex items-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] rounded text-secondary hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                <span className="material-symbols-outlined">logout</span>
                <span className="font-label-md text-label-md uppercase">Déconnexion</span>
              </a>
            </li>
          </ul>
        </nav>
        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col ml-[260px] w-[calc(100%-260px)] h-full">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem]">
            <div className="flex items-center gap-[1rem] h-full">
              <span className="font-title-md text-title-md text-on-surface font-black">KAMLOG EM-ERP</span>
              <nav className="hidden md:flex h-full ml-[1rem]">
                <ul className="flex items-center gap-[1rem] h-full">
                  <li className="h-full flex items-center">
                    <a onClick={() => router.push('/master-data/articles')} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all focus-within:ring-2 focus-within:ring-primary h-full flex items-center px-[0.25rem] cursor-pointer">Articles</a>
                  </li>
                  <li className="h-full flex items-center">
                    <a onClick={() => router.push('/master-data/clients')} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all focus-within:ring-2 focus-within:ring-primary h-full flex items-center px-[0.25rem] cursor-pointer">Clients</a>
                  </li>
                  <li className="h-full flex items-center">
                    <a onClick={() => router.push('/magasin')} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all focus-within:ring-2 focus-within:ring-primary h-full flex items-center px-[0.25rem] cursor-pointer">Stocks</a>
                  </li>
                  <li className="h-full flex items-center">
                    <a onClick={() => router.push('/reports')} className="font-body-md text-body-md text-primary border-b-2 border-primary h-full flex items-center px-[0.25rem] font-medium cursor-pointer">Rapports</a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center gap-[1rem]">
              <div className="relative hidden lg:block">
                <span className="material-symbols-outlined absolute left-[0.5rem] top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input className="pl-[1rem] pr-[0.5rem] py-[0.25rem] bg-surface-container-highest border-none rounded text-body-sm focus:ring-2 focus:ring-primary w-48 transition-all" placeholder="Rechercher T-Code" type="text"/>
              </div>
              <div className="flex items-center gap-[0.25rem] text-on-surface-variant">
                <button className="p-[0.25rem] hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-md">notifications</span>
                </button>
                <button onClick={() => router.push('/security')} className="p-[0.25rem] hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-md">verified_user</span>
                </button>
                <button onClick={() => router.push('/profile')} className="p-[0.25rem] hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-md">account_circle</span>
                </button>
              </div>
            </div>
          </header>
          {/* Page Content Canvas */}
          <main className="flex-1 p-[1rem] flex flex-col gap-[1rem] overflow-hidden bg-surface-container-low relative">
            {/* Breadcrumbs & Header */}
            <div className="flex justify-between items-end flex-shrink-0">
              <div>
                <div className="flex items-center gap-[0.25rem] text-on-surface-variant font-label-sm text-label-sm mb-[0.25rem]">
                  <span>Rapports</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-primary font-medium">Custom Report Builder</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Data Explorer</h2>
              </div>
              <div className="flex gap-[0.5rem]">
                <button onClick={() => router.push('/reports/templates/library')} className="flex items-center gap-[0.25rem] px-[0.5rem] py-[0.25rem] border border-outline-variant bg-surface-container-lowest rounded text-body-sm font-medium hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  Recent Reports
                </button>
              </div>
            </div>
            {/* Builder Layout (3 Panes) */}
            <div className="flex-1 flex gap-[1rem] min-h-0">
              {/* Pane 1: Configuration Sidebar */}
              <div className="w-[280px] bg-surface-container-lowest border border-outline-variant rounded flex flex-col flex-shrink-0 shadow-sm relative z-10 overflow-hidden">
                <div className="p-[0.5rem] border-b border-outline-variant bg-surface flex items-center justify-between">
                  <h3 className="font-title-md text-title-md">Configuration</h3>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">tune</span>
                </div>
                <div className="flex-1 overflow-y-auto p-[0.5rem] flex flex-col gap-[1.5rem]">
                  {/* Step 1 */}
                  <div>
                    <div className="flex items-center gap-[0.25rem] mb-[0.25rem]">
                      <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm">1</div>
                      <h4 className="font-body-sm text-body-sm font-semibold">Select Module</h4>
                    </div>
                    <select 
                      className="w-full bg-surface-container-highest border-none rounded text-body-sm p-[0.25rem] focus:ring-2 focus:ring-primary cursor-pointer"
                      value={module}
                      onChange={(e) => setModule(e.target.value)}
                    >
                      <option value="transport">Transport Operations</option>
                      <option value="magasin">Magasin Inventory</option>
                      <option value="finance">Finance Ledgers</option>
                      <option value="parc">Parc Fleet Status</option>
                    </select>
                  </div>
                  {/* Step 2 */}
                  <div>
                    <div className="flex items-center gap-[0.25rem] mb-[0.25rem]">
                      <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm">2</div>
                      <h4 className="font-body-sm text-body-sm font-semibold">Fields & Data</h4>
                    </div>
                    <div className="relative mb-[0.25rem]">
                      <span className="material-symbols-outlined absolute left-[0.25rem] top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
                      <input 
                        className="w-full pl-[1rem] pr-[0.25rem] py-1 bg-surface border border-outline-variant rounded text-body-sm focus:border-primary focus:ring-1 focus:ring-primary" 
                        placeholder="Filter columns..." 
                        type="text"
                        value={searchColumns}
                        onChange={(e) => setSearchColumns(e.target.value)}
                      />
                    </div>
                    <div className="border border-outline-variant rounded bg-surface h-48 overflow-y-auto p-[0.25rem] flex flex-col gap-1">
                      {fields.map((field) => (
                        <label key={field.id} className="flex items-center gap-[0.25rem] p-1 hover:bg-surface-container-high rounded cursor-pointer">
                          <input 
                            checked={selectedFields.includes(field.id)} 
                            className="rounded-sm border-outline-variant text-primary focus:ring-primary w-3.5 h-3.5" 
                            type="checkbox"
                            onChange={() => toggleField(field.id)}
                          />
                          <span className="font-data-tabular text-data-tabular">{field.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div>
                    <div className="flex items-center gap-[0.25rem] mb-[0.25rem]">
                      <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm">3</div>
                      <h4 className="font-body-sm text-body-sm font-semibold">Filters</h4>
                    </div>
                    <div className="flex flex-col gap-[0.25rem]">
                      <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Date Range</label>
                        <div className="flex gap-[0.25rem]">
                          <input 
                            className="w-full bg-surface-container-highest border-none rounded text-body-sm p-1.5 focus:ring-2 focus:ring-primary" 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                          <input 
                            className="w-full bg-surface-container-highest border-none rounded text-body-sm p-1.5 focus:ring-2 focus:ring-primary" 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Status (Multi)</label>
                        <div className="bg-surface-container-highest rounded p-1.5 flex flex-wrap gap-1 min-h-[36px] items-center">
                          <span className="bg-surface border border-outline-variant text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                            Completed <button className="material-symbols-outlined text-[12px] hover:text-error">close</button>
                          </span>
                          <span className="bg-surface border border-outline-variant text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                            In Transit <button className="material-symbols-outlined text-[12px] hover:text-error">close</button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Pane 2: Live Preview Stage */}
              <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded shadow-sm flex flex-col min-w-0">
                {/* Preview Toolbar */}
                <div className="p-[0.5rem] border-b border-outline-variant bg-surface flex justify-between items-center">
                  <div className="flex items-center gap-[0.5rem]">
                    <span className="material-symbols-outlined text-primary text-[20px]">table_chart</span>
                    <h3 className="font-title-md text-title-md font-semibold">Data Preview</h3>
                    <span className="bg-surface-container-high text-on-surface-variant text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ml-[0.25rem] tracking-wider">Live Sample</span>
                  </div>
                  <div className="flex gap-[0.25rem]">
                    <button className="p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded transition-colors" title="Refresh Data">
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </button>
                    <div className="w-px h-5 bg-outline-variant mx-1 self-center"></div>
                    <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded transition-colors" title="Density">
                      <span className="material-symbols-outlined text-[18px]">density_small</span>
                    </button>
                    <button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded transition-colors" title="Filter">
                      <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    </button>
                  </div>
                </div>
                {/* High Density Table Container */}
                <div className="flex-1 overflow-auto bg-surface-container-lowest">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant shadow-sm z-10">
                      <tr>
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant font-semibold cursor-pointer hover:bg-surface-container-highest select-none group">
                          <div className="flex items-center gap-1">
                            OT Number
                            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100">arrow_downward</span>
                          </div>
                        </th>
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant font-semibold cursor-pointer hover:bg-surface-container-highest select-none group">
                          <div className="flex items-center gap-1">
                            Date
                          </div>
                        </th>
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant font-semibold cursor-pointer hover:bg-surface-container-highest select-none group">
                          <div className="flex items-center gap-1">
                            Client ID
                          </div>
                        </th>
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant font-semibold cursor-pointer hover:bg-surface-container-highest select-none group text-right">
                          <div className="flex items-center justify-end gap-1">
                            Total Amount
                          </div>
                        </th>
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant font-semibold cursor-pointer hover:bg-surface-container-highest select-none group">
                          <div className="flex items-center gap-1">
                            Status
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-data-tabular text-data-tabular">
                      {sampleData.map((row, index) => (
                        <tr key={index} className={`border-b border-outline-variant hover:bg-surface-container-high transition-colors group ${index % 2 === 1 ? 'bg-surface' : ''}`}>
                          <td className="py-1.5 px-3 text-primary font-medium">{row.otNumber}</td>
                          <td className="py-1.5 px-3 text-on-surface-variant">{row.date}</td>
                          <td className="py-1.5 px-3">{row.clientId}</td>
                          <td className="py-1.5 px-3 text-right">{row.amount}</td>
                          <td className="py-1.5 px-3">{getStatusBadge(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Table Footer / Pagination pseudo */}
                <div className="border-t border-outline-variant bg-surface p-1.5 flex justify-between items-center text-on-surface-variant">
                  <span className="font-label-sm text-label-sm">Showing sample 5 of 1,240 records</span>
                  <div className="text-[12px] flex items-center gap-1">
                    Data latency: <span className="text-[#059669] font-medium flex items-center"><span className="w-1.5 h-1.5 bg-[#059669] rounded-full mr-1 animate-pulse"></span>Live</span>
                  </div>
                </div>
              </div>
              {/* Pane 3: Output & Export */}
              <div className="w-[260px] bg-surface-container-lowest border border-outline-variant rounded flex flex-col flex-shrink-0 shadow-sm relative z-10">
                <div className="p-[0.5rem] border-b border-outline-variant bg-surface flex items-center justify-between">
                  <h3 className="font-title-md text-title-md">Output Settings</h3>
                </div>
                <div className="p-[0.5rem] flex flex-col gap-[1.5rem]">
                  {/* Step 4 */}
                  <div>
                    <div className="flex items-center gap-[0.25rem] mb-[0.5rem]">
                      <div className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm">4</div>
                      <h4 className="font-body-sm text-body-sm font-semibold">Visualizations</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-[0.25rem]">
                      <button 
                        onClick={() => setVisualization('table')}
                        className={`aspect-square flex flex-col items-center justify-center gap-1 border-2 rounded transition-colors ${visualization === 'table' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary'}`}
                      >
                        <span className="material-symbols-outlined">table</span>
                        <span className="text-[10px] font-semibold uppercase">Table</span>
                      </button>
                      <button 
                        onClick={() => setVisualization('bar')}
                        className={`aspect-square flex flex-col items-center justify-center gap-1 border-2 rounded transition-colors ${visualization === 'bar' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary'}`}
                      >
                        <span className="material-symbols-outlined">bar_chart</span>
                        <span className="text-[10px] font-semibold uppercase">Bar</span>
                      </button>
                      <button 
                        onClick={() => setVisualization('pie')}
                        className={`aspect-square flex flex-col items-center justify-center gap-1 border-2 rounded transition-colors ${visualization === 'pie' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary'}`}
                      >
                        <span className="material-symbols-outlined">pie_chart</span>
                        <span className="text-[10px] font-semibold uppercase">Pie</span>
                      </button>
                    </div>
                  </div>
                  <hr className="border-outline-variant"/>
                  <div>
                    <h4 className="font-body-sm text-body-sm font-semibold mb-[0.5rem]">Export Format</h4>
                    <div className="flex flex-col gap-[0.25rem]">
                      <label className="flex items-center gap-[0.5rem] p-1.5 border border-outline-variant rounded bg-surface hover:bg-surface-container-high cursor-pointer transition-colors">
                        <input 
                          checked={exportFormat === 'excel'} 
                          className="text-primary focus:ring-primary w-3.5 h-3.5 border-outline-variant" 
                          name="export" 
                          type="radio"
                          onChange={() => setExportFormat('excel')}
                        />
                        <span className="material-symbols-outlined text-[18px] text-[#107c41]">description</span>
                        <span className="font-body-sm text-body-sm font-medium">Excel (.xlsx)</span>
                      </label>
                      <label className="flex items-center gap-[0.5rem] p-1.5 border border-outline-variant rounded hover:bg-surface-container-high cursor-pointer transition-colors">
                        <input 
                          checked={exportFormat === 'pdf'} 
                          className="text-primary focus:ring-primary w-3.5 h-3.5 border-outline-variant" 
                          name="export" 
                          type="radio"
                          onChange={() => setExportFormat('pdf')}
                        />
                        <span className="material-symbols-outlined text-[18px] text-[#b30b00]">picture_as_pdf</span>
                        <span className="font-body-sm text-body-sm font-medium">PDF Document</span>
                      </label>
                      <label className="flex items-center gap-[0.5rem] p-1.5 border border-outline-variant rounded hover:bg-surface-container-high cursor-pointer transition-colors">
                        <input 
                          checked={exportFormat === 'json'} 
                          className="text-primary focus:ring-primary w-3.5 h-3.5 border-outline-variant" 
                          name="export" 
                          type="radio"
                          onChange={() => setExportFormat('json')}
                        />
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">data_object</span>
                        <span className="font-body-sm text-body-sm font-medium">JSON Data</span>
                      </label>
                    </div>
                  </div>
                  <hr className="border-outline-variant"/>
                  <div className="flex items-center justify-between p-[0.25rem] bg-surface-container-highest rounded border border-outline-variant">
                    <div>
                      <span className="font-body-sm text-body-sm font-semibold block">Schedule Report</span>
                      <span className="text-[11px] text-on-surface-variant block">Run automatically</span>
                    </div>
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => setScheduleReport(!scheduleReport)}
                      className={`${scheduleReport ? 'bg-primary' : 'bg-outline-variant'} relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                      type="button"
                    >
                      <span className={`${scheduleReport ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Action Bar (Bottom) */}
            <div className="mt-auto pt-[1rem] border-t border-outline-variant flex justify-between items-center bg-surface-container-low flex-shrink-0">
              <div className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Estimated generation time: ~4 seconds based on current dataset.
              </div>
              <div className="flex gap-[1rem]">
                <button onClick={handleSaveTemplate} className="px-[1rem] py-[0.5rem] border border-outline-variant bg-surface-container-lowest text-on-surface rounded font-title-sm text-title-sm font-medium hover:bg-surface-container-high transition-colors flex items-center gap-[0.25rem]">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Template
                </button>
                <button onClick={handleGenerateReport} className="px-[2rem] py-[0.5rem] bg-primary text-on-primary rounded font-title-sm text-title-sm font-bold hover:bg-primary-fixed-variant transition-colors shadow-sm flex items-center gap-[0.25rem]">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  Generate Full Report
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
