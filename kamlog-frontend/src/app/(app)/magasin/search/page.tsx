// src/app/(app)/magasin/search/page.tsx - K-Magasin Advanced Stock Search - Fidèle 100% au HTML original
'use client'

export default function KMagasinAdvancedStockSearch() {
  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 10px;
        }
        .active-module-indicator {
          border-left: 4px solid #EF4444;
        }
        .table-zebra tr:nth-child(even) {
          background-color: #f9fafb;
        }
      `}</style>
      <div className="text-on-surface">
        {/* Top Navigation Bar */}
        
        {/* Side Navigation Bar */}
        <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container border-r border-outline-variant">
          <div className="p-md border-b border-outline-variant flex items-center gap-sm">
            <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined icon-filled">warehouse</span>
            </div>
            <div>
              <div className="text-title-md font-title-md font-bold text-primary">K-Magasin</div>
              <div className="text-label-md font-label-md text-on-surface-variant opacity-70">Operational Control</div>
            </div>
          </div>
          
          <div className="px-md pt-md border-t border-outline-variant space-y-1">
            <a className="flex items-center gap-md py-2 text-on-surface-variant hover:text-primary transition-colors" href="/settings/system/audit-health">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-label-md font-label-md">Settings</span>
            </a>
            <a className="flex items-center gap-md py-2 text-on-surface-variant hover:text-error transition-colors" href="/login">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="text-label-md font-label-md">Logout</span>
            </a>
          </div>
        </aside>
        {/* Main Content Area */}
        <main className="ml-60 pt-16 min-h-screen">
          <div className="max-w-[1600px] mx-auto p-lg space-y-lg">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant opacity-60">
              <span>Modules</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Magasin</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-kmagasin-primary font-bold">Advanced Stock Search</span>
            </div>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              <div>
                <h1 className="text-headline-md font-headline-md text-on-surface">Advanced Stock Search</h1>
                <p className="text-body-sm font-body-sm text-on-surface-variant">Real-time inventory analysis across multiple warehouse nodes.</p>
              </div>
              <div className="flex items-center gap-sm">
                <button className="flex items-center gap-xs px-md py-2 bg-white border border-outline-variant rounded hover:bg-surface-container-low transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  <span className="text-label-md font-label-md">Reset Filters</span>
                </button>
                <button className="flex items-center gap-xs px-md py-2 bg-kmagasin-primary text-white rounded hover:opacity-90 transition-opacity shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                  <span className="text-label-md font-label-md uppercase tracking-wider">Export PDF</span>
                </button>
              </div>
            </div>
            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-md bg-white p-lg border border-outline-variant rounded shadow-sm">
              {/* Multi-select Magasins */}
              <div className="space-y-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase">Warehouses (Magasins)</label>
                <div className="flex flex-wrap gap-xs p-xs border border-outline-variant rounded min-h-[40px] items-center">
                  <span className="bg-kmagasin-primary/10 text-kmagasin-primary text-label-md px-2 py-0.5 rounded flex items-center gap-1">MAG 3 <span className="material-symbols-outlined text-xs cursor-pointer">close</span></span>
                  <span className="bg-kmagasin-primary/10 text-kmagasin-primary text-label-md px-2 py-0.5 rounded flex items-center gap-1">DNW1 <span className="material-symbols-outlined text-xs cursor-pointer">close</span></span>
                  <span className="bg-kmagasin-primary/10 text-kmagasin-primary text-label-md px-2 py-0.5 rounded flex items-center gap-1">DNW2 <span className="material-symbols-outlined text-xs cursor-pointer">close</span></span>
                  <input className="border-none focus:ring-0 text-label-md flex-1 min-w-[50px] p-0" placeholder="+ Add" type="text"/>
                </div>
              </div>
              {/* Category */}
              <div className="space-y-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase">Category</label>
                <select className="w-full border-outline-variant rounded text-label-md focus:ring-kmagasin-primary focus:border-kmagasin-primary">
                  <option>All Categories</option>
                  <option selected>Alimentaire</option>
                  <option>Electronique</option>
                  <option>Construction</option>
                </select>
              </div>
              {/* Status */}
              <div className="space-y-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase">Status</label>
                <div className="flex items-center gap-xs">
                  <label className="flex items-center gap-xs cursor-pointer">
                    <input checked className="rounded text-kmagasin-primary focus:ring-kmagasin-primary border-outline-variant" type="checkbox"/>
                    <span className="text-label-md font-label-md">Normal</span>
                  </label>
                  <label className="flex items-center gap-xs cursor-pointer">
                    <input className="rounded text-kmagasin-primary focus:ring-kmagasin-primary border-outline-variant" type="checkbox"/>
                    <span className="text-label-md font-label-md">Mouillé</span>
                  </label>
                </div>
              </div>
              {/* Date Range */}
              <div className="space-y-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant uppercase">Last Movement Period</label>
                <div className="grid grid-cols-2 gap-xs">
                  <input className="w-full border-outline-variant rounded text-label-md focus:ring-kmagasin-primary" type="date"/>
                  <input className="w-full border-outline-variant rounded text-label-md focus:ring-kmagasin-primary" type="date"/>
                </div>
              </div>
            </div>
            {/* Results Section */}
            <div className="bg-white border border-outline-variant rounded shadow-sm overflow-hidden flex flex-col">
              <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-kmagasin-primary">inventory</span>
                  <span className="text-title-md font-title-md">Inventory Result Set</span>
                  <span className="bg-surface-container-highest text-on-surface-variant text-label-sm px-2 py-0.5 rounded">128 Items Found</span>
                </div>
                <div className="flex items-center gap-md">
                  <div className="flex border border-outline-variant rounded overflow-hidden">
                    <button className="p-1.5 bg-surface-container-high border-r border-outline-variant">
                      <span className="material-symbols-outlined text-[18px]">view_list</span>
                    </button>
                    <button className="p-1.5 hover:bg-surface-container-high">
                      <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left table-zebra">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant text-label-sm font-label-sm text-on-surface-variant uppercase">
                      <th className="px-md py-3 font-semibold">Article Code</th>
                      <th className="px-md py-3 font-semibold">Name</th>
                      <th className="px-md py-3 font-semibold text-right">Qty (Units)</th>
                      <th className="px-md py-3 font-semibold">Warehouse</th>
                      <th className="px-md py-3 font-semibold">Status</th>
                      <th className="px-md py-3 font-semibold text-center">Last Updated</th>
                      <th className="px-md py-3 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-sm">
                    <tr>
                      <td className="px-md py-3 font-data-tabular">ART-20993-A</td>
                      <td className="px-md py-3 font-medium">Farine de Froment T55 - 25kg</td>
                      <td className="px-md py-3 text-right font-data-tabular font-bold">1,420</td>
                      <td className="px-md py-3">MAG 3 / Zone B</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">NORMAL</span>
                      </td>
                      <td className="px-md py-3 text-center text-on-surface-variant">2023-10-27 14:30</td>
                      <td className="px-md py-3 text-center">
                        <button className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-md py-3 font-data-tabular text-kmagasin-primary">ART-88210-X</td>
                      <td className="px-md py-3 font-medium">Huile Végétale Raffinée - 5L</td>
                      <td className="px-md py-3 text-right font-data-tabular font-bold">450</td>
                      <td className="px-md py-3">DNW1 / Section 04</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-kmagasin-primary">MOUILLÉ</span>
                      </td>
                      <td className="px-md py-3 text-center text-on-surface-variant">2023-10-27 09:12</td>
                      <td className="px-md py-3 text-center">
                        <button className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-md py-3 font-data-tabular">ART-55112-C</td>
                      <td className="px-md py-3 font-medium">Sucre Semoule Industriel</td>
                      <td className="px-md py-3 text-right font-data-tabular font-bold">2,100</td>
                      <td className="px-md py-3">MAG 3 / Zone A</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">NORMAL</span>
                      </td>
                      <td className="px-md py-3 text-center text-on-surface-variant">2023-10-26 16:45</td>
                      <td className="px-md py-3 text-center">
                        <button className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-md py-3 font-data-tabular">ART-12344-B</td>
                      <td className="px-md py-3 font-medium">Sel Raffiné Extra-Fin</td>
                      <td className="px-md py-3 text-right font-data-tabular font-bold">980</td>
                      <td className="px-md py-3">DNW2 / Hall B</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-700">DAMAGED</span>
                      </td>
                      <td className="px-md py-3 text-center text-on-surface-variant">2023-10-25 11:20</td>
                      <td className="px-md py-3 text-center">
                        <button className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-md py-3 font-data-tabular">ART-77621-M</td>
                      <td className="px-md py-3 font-medium">Lait Entier en Poudre - 25kg</td>
                      <td className="px-md py-3 text-right font-data-tabular font-bold">5,400</td>
                      <td className="px-md py-3">MAG 3 / Zone C</td>
                      <td className="px-md py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">NORMAL</span>
                      </td>
                      <td className="px-md py-3 text-center text-on-surface-variant">2023-10-27 15:55</td>
                      <td className="px-md py-3 text-center">
                        <button className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-md bg-surface-container-low border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md">
                <div className="text-label-md font-label-md text-on-surface-variant">Showing 1 to 5 of 128 results</div>
                <div className="flex items-center gap-xs">
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-white disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-kmagasin-primary text-white rounded font-bold text-label-md">1</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-white font-bold text-label-md">2</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-white font-bold text-label-md">3</button>
                  <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-white">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
            {/* Dashboard Analytics Preview (Bento Section) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div className="col-span-1 md:col-span-1 bg-white border border-outline-variant rounded p-lg flex flex-col justify-between relative overflow-hidden group">
                <div className="z-10">
                  <div className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-xs">Warehouse Capacity</div>
                  <div className="text-headline-sm font-headline-sm text-kmagasin-primary">82.4% Full</div>
                  <div className="mt-md w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-kmagasin-primary h-full w-[82.4%]"></div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[80px]">warehouse</span>
                </div>
              </div>
              <div className="col-span-1 md:col-span-1 bg-white border border-outline-variant rounded p-lg flex flex-col justify-between relative overflow-hidden group">
                <div className="z-10">
                  <div className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-xs">Alert Status</div>
                  <div className="text-headline-sm font-headline-sm text-orange-600">3 Critical Flags</div>
                  <p className="text-body-sm text-on-surface-variant mt-xs">Humidity spikes detected in Zone B.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[80px]">warning</span>
                </div>
              </div>
              <div className="col-span-1 md:col-span-1 bg-kmagasin-primary text-white border border-kmagasin-primary rounded p-lg flex flex-col justify-between relative overflow-hidden group">
                <div className="z-10">
                  <div className="text-label-sm font-label-sm text-white/70 uppercase mb-xs">Quick Search T-Code</div>
                  <div className="text-headline-sm font-headline-sm">STK-SCAN</div>
                  <button className="mt-md px-md py-2 bg-white text-kmagasin-primary rounded text-label-md font-bold hover:bg-surface-container-low transition-colors">Start Handheld Scan</button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[80px]">barcode_scanner</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* Footer Identity */}
        <footer className="ml-60 p-lg text-center text-label-md font-label-md text-on-surface-variant opacity-50">
          © 2023 KAMLOG ENTERPRISE LOGISTICS. Module: K-MAGASIN V4.2.1
        </footer>
      </div>
    </>
  )
}
