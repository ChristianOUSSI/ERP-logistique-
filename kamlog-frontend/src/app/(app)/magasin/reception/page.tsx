// src/app/(app)/magasin/reception/page.tsx - K-Magasin Reception - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'

export default function KMagasinReception() {
  const [articleCode, setArticleCode] = useState('--- ----')
  const [showModal, setShowModal] = useState(false)
  const [generatedOT, setGeneratedOT] = useState('OT-2026-XXXXX')
  const [selectedStatus, setSelectedStatus] = useState('normal')

  const codeMap: Record<string, string> = {
    'ELECTRONICS': '772-9904',
    'SPAREPARTS': '112-4200',
    'PHARMA': '551-1288',
    'FOOD': '883-0144'
  }

  const updateArticleCode = (val: string) => {
    setArticleCode(codeMap[val] || '--- ----')
  }

  const generateOT = () => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000)
    const otNumber = `OT-2026-${randomSuffix}`
    setGeneratedOT(otNumber)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setArticleCode('--- ----')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c2c6d6;
          border-radius: 10px;
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen">
        {/* TopNavBar */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-lg h-16 bg-surface-container-low border-b border-outline-variant">
          <div className="flex items-center gap-xl">
            <span className="text-title-lg font-title-lg font-bold text-primary">KAMLOG EM-ERP</span>
            <nav className="hidden md:flex gap-md">
              <a className="text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors px-xs py-1" href="#">Alerts</a>
              <a className="text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors px-xs py-1" href="#">MFA Status</a>
              <a className="text-label-md font-label-md text-primary border-b-2 border-primary pb-1" href="#">Modules</a>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative flex items-center bg-surface-container-high px-sm py-1 rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant mr-xs">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-body-sm w-48" placeholder="T-Code Search (e.g. KM24)" type="text"/>
            </div>
            <button className="material-symbols-outlined p-xs text-on-surface-variant hover:bg-surface-container-high transition-colors">notifications</button>
            <button className="material-symbols-outlined p-xs text-on-surface-variant hover:bg-surface-container-high transition-colors">security</button>
            <button className="material-symbols-outlined p-xs text-on-surface-variant hover:bg-surface-container-high transition-colors">apps</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
              <img alt="User Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhXyT5Ezo1_4DE8fDHXwAXU2PQbfpETqqbnLhWqg5-5L222krH67YRlhBUNtlgtQQjzw7bBp0iUxuan4CZppLyHE5whJdltEjF1S_tgQ5nnKbCzVKq0IOe3Nd_YkGzNTS3z93dgA1TQBa35Y7if8L9HnojwrMZg6qjucbQ3gFh8_a-zhlBiztJJ7eKN_Fs2wslpX0WZUEetQUo8l47BlTFc6HNevFBlj8hbjyjqBXui8LpKATlH7CT0KwgN4n-d5kVhQ1APELES5Y"/>
            </div>
          </div>
        </header>
        {/* SideNavBar */}
        <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-md z-40 bg-surface-container-low border-r border-outline-variant">
          <div className="p-md flex items-center gap-sm">
            <div className="bg-primary-container text-on-primary-container p-xs rounded-lg">
              <span className="material-symbols-outlined">warehouse</span>
            </div>
            <div>
              <div className="text-title-md font-title-md font-bold">KAMLOG ERP</div>
              <div className="text-label-sm font-label-sm text-on-surface-variant">Operational Control</div>
            </div>
          </div>
          <nav className="mt-md flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-md mb-xs text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Logistics Modules</div>
            <a className="flex items-center gap-sm px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="font-label-md text-label-md">Transport</span>
            </a>
            <a className="flex items-center gap-sm px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">payments</span>
              <span className="font-label-md text-label-md">Finance</span>
            </a>
            <a className="flex items-center gap-sm px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="font-label-md text-label-md">Parc</span>
            </a>
            <a className="flex items-center gap-sm px-md py-3 text-km-red font-bold border-l-4 border-km-red bg-surface-container-highest transition-all" href="#">
              <span className="material-symbols-outlined">warehouse</span>
              <span className="font-label-md text-label-md">Magasin</span>
            </a>
            <a className="flex items-center gap-sm px-md py-3 text-on-surface-variant hover:bg-surface-container-high transition-all" href="#">
              <span className="material-symbols-outlined">history_edu</span>
              <span className="font-label-md text-label-md">Audit</span>
            </a>
          </nav>
          <div className="p-md border-t border-outline-variant">
            <a className="flex items-center gap-sm px-md py-2 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </a>
            <a className="flex items-center gap-sm px-md py-2 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg" href="#">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-md text-label-md">Logout</span>
            </a>
          </div>
        </aside>
        {/* Main Stage */}
        <main className="ml-60 pt-16 p-lg max-w-max-width mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-xxs text-label-sm font-label-sm text-on-surface-variant mb-md">
            <span>K-Magasin</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>Operations</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-km-red font-bold">KM24 Reception</span>
          </div>
          {/* Header Section */}
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h1 className="text-headline-lg font-headline-lg text-on-surface flex items-center gap-sm">
                Warehouse Reception
                <span className="bg-km-red/10 text-km-red px-sm py-xxs rounded-full text-label-sm font-label-sm border border-km-red/20">KM24 Interface</span>
              </h1>
              <p className="text-body-md text-on-surface-variant mt-xxs">Scan and register incoming goods into Magasin zone A-04.</p>
            </div>
            <div className="flex gap-sm">
              <button className="flex items-center gap-xs px-md py-2 border border-outline-variant hover:bg-surface-container-high transition-all rounded-lg font-label-md text-label-md">
                <span className="material-symbols-outlined text-[18px]">print</span>
                Print Manifest
              </button>
              <button className="flex items-center gap-xs px-md py-2 border border-outline-variant hover:bg-surface-container-high transition-all rounded-lg font-label-md text-label-md">
                <span className="material-symbols-outlined text-[18px]">help</span>
                Support
              </button>
            </div>
          </div>
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-lg">
            {/* Main Form Card (Large) */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high px-lg py-md border-b border-outline-variant flex justify-between items-center">
                <span className="font-title-md text-title-md font-bold flex items-center gap-xs">
                  <span className="material-symbols-outlined text-km-red">barcode_scanner</span>
                  Entry Form
                </span>
                <span className="text-label-sm font-label-sm text-on-surface-variant">System Time: 14:23:45</span>
              </div>
              <form className="p-lg">
                <div className="grid grid-cols-2 gap-xl">
                  {/* Left Column */}
                  <div className="space-y-lg">
                    <div className="space-y-xxs">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Container Number</label>
                      <div className="relative">
                        <input className="w-full border-outline-variant focus:border-km-red focus:ring-km-red rounded-lg text-body-md py-sm pl-md" placeholder="MSCU-902341-2" type="text"/>
                        <span className="absolute right-md top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">qr_code</span>
                      </div>
                    </div>
                    <div className="space-y-xxs">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Declaration Ref</label>
                      <input className="w-full border-outline-variant focus:border-km-red focus:ring-km-red rounded-lg text-body-md py-sm pl-md" placeholder="DEC-MAG-2026-883" type="text"/>
                    </div>
                    <div className="space-y-xxs">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Article Selection</label>
                      <div className="space-y-xs">
                        <select className="w-full border-outline-variant focus:border-km-red focus:ring-km-red rounded-lg text-body-md py-sm" onChange={(e) => updateArticleCode(e.target.value)}>
                          <option value="">Select an Article...</option>
                          <option value="ELECTRONICS">Consumer Electronics (B-99)</option>
                          <option value="SPAREPARTS">Mechanical Spare Parts (M-42)</option>
                          <option value="PHARMA">Pharmaceutical Goods (P-12)</option>
                          <option value="FOOD">Perishable Food Items (F-01)</option>
                        </select>
                        <div className="flex items-center gap-xs bg-surface-container-low p-xs rounded-lg border border-outline-variant/30">
                          <span className="text-label-sm font-label-sm text-on-surface-variant">Internal Code:</span>
                          <span className="font-data-tabular text-data-tabular font-bold text-km-red tracking-widest">{articleCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-lg">
                    <div className="grid grid-cols-2 gap-md">
                      <div className="space-y-xxs">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase">Quantity</label>
                        <input className="w-full border-outline-variant focus:border-km-red focus:ring-km-red rounded-lg text-body-md py-sm" placeholder="0.00" type="number"/>
                      </div>
                      <div className="space-y-xxs">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase">Unit</label>
                        <select className="w-full border-outline-variant focus:border-km-red focus:ring-km-red rounded-lg text-body-md py-sm">
                          <option>Pallet (PLT)</option>
                          <option>Kilogram (KG)</option>
                          <option>Crate (CRT)</option>
                          <option>Metric Ton (MT)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-xxs">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Stock Status</label>
                      <div className="flex gap-md">
                        <label className={`flex-1 flex items-center justify-center gap-xs p-md border-2 rounded-lg cursor-pointer hover:bg-surface-container-low transition-all ${selectedStatus === 'normal' ? 'border-km-red bg-surface-container-highest' : 'border-outline-variant'}`}>
                          <input checked={selectedStatus === 'normal'} className="hidden" name="status" type="radio" value="normal" onChange={() => setSelectedStatus('normal')}/>
                          <span className="material-symbols-outlined text-green-600">check_circle</span>
                          <span className="font-label-md text-label-md">Normal</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-xs p-md border-2 rounded-lg cursor-pointer hover:bg-surface-container-low transition-all ${selectedStatus === 'damaged' ? 'border-km-red bg-surface-container-highest' : 'border-outline-variant'}`}>
                          <input checked={selectedStatus === 'damaged'} className="hidden" name="status" type="radio" value="damaged" onChange={() => setSelectedStatus('damaged')}/>
                          <span className="material-symbols-outlined text-km-red">warning</span>
                          <span className="font-label-md text-label-md">Damaged</span>
                        </label>
                      </div>
                    </div>
                    <div className="pt-lg">
                      <button className="w-full bg-km-red text-on-primary py-lg rounded-xl font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-md" type="button" onClick={generateOT}>
                        <span className="material-symbols-outlined">task_alt</span>
                        Validate & Create OT
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/* Stats & Context Side Pane */}
            <div className="col-span-12 lg:col-span-4 space-y-lg">
              {/* Status Dashboard */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
                <h3 className="text-title-md font-title-md font-bold mb-md">Daily Throughput</h3>
                <div className="grid grid-cols-2 gap-md">
                  <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                    <div className="text-label-sm font-label-sm text-on-surface-variant">Pending OT</div>
                    <div className="text-headline-md font-headline-md font-black text-km-red">24</div>
                  </div>
                  <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                    <div className="text-label-sm font-label-sm text-on-surface-variant">Confirmed</div>
                    <div className="text-headline-md font-headline-md font-black text-on-surface">142</div>
                  </div>
                </div>
                <div className="mt-lg">
                  <div className="flex justify-between text-label-sm font-label-sm mb-xs">
                    <span>Warehouse Capacity</span>
                    <span className="font-bold">84%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-km-red h-full" style={{width: '84%'}}></div>
                  </div>
                </div>
              </div>
              {/* Recent Activity Feed */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[320px]">
                <div className="px-md py-sm bg-surface-container-high border-b border-outline-variant font-title-md text-title-md font-bold">Recent Receipts</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant">
                      <tr>
                        <th className="px-md py-xxs text-label-sm font-label-sm text-on-surface-variant">OT#</th>
                        <th className="px-md py-xxs text-label-sm font-label-sm text-on-surface-variant">Article</th>
                        <th className="px-md py-xxs text-label-sm font-label-sm text-on-surface-variant text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-xs font-data-tabular text-data-tabular">OT-99231</td>
                        <td className="px-md py-xs text-body-sm">Electronics</td>
                        <td className="px-md py-xs text-right"><span className="bg-green-100 text-green-700 px-xs py-[2px] rounded text-label-sm">OK</span></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-xs font-data-tabular text-data-tabular">OT-99230</td>
                        <td className="px-md py-xs text-body-sm">Spare Parts</td>
                        <td className="px-md py-xs text-right"><span className="bg-red-100 text-red-700 px-xs py-[2px] rounded text-label-sm">DMG</span></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-xs font-data-tabular text-data-tabular">OT-99229</td>
                        <td className="px-md py-xs text-body-sm">Pharma</td>
                        <td className="px-md py-xs text-right"><span className="bg-green-100 text-green-700 px-xs py-[2px] rounded text-label-sm">OK</span></td>
                      </tr>
                      <tr className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-xs font-data-tabular text-data-tabular">OT-99228</td>
                        <td className="px-md py-xs text-body-sm">Food</td>
                        <td className="px-md py-xs text-right"><span className="bg-green-100 text-green-700 px-xs py-[2px] rounded text-label-sm">OK</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Visual Contextual Help Section (Graphic) */}
          <section className="mt-lg grid grid-cols-3 gap-lg">
            <div className="col-span-3 lg:col-span-1 h-48 bg-surface-container-highest rounded-xl border border-outline-variant overflow-hidden relative">
              <div className="relative z-10 p-lg h-full flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-km-red text-headline-sm">qr_code_scanner</span>
                  <h4 className="text-title-md font-title-md mt-xs font-bold">Auto-Validation</h4>
                </div>
                <p className="text-body-sm text-on-surface-variant">System checks declaration integrity in real-time with K-Finance servers.</p>
              </div>
            </div>
            <div className="col-span-3 lg:col-span-2 rounded-xl border border-outline-variant overflow-hidden bg-surface-container-highest relative h-48">
              <img alt="Warehouse Floor Plan" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA62SIH9_E-pAMHchQFYopPi0bP218yI_6jh7mE14lzfr9fwM5jKjtHPKdY9xgxlBWNfSS2BdY4LHMg97X1GgDj82qHXbekqj4t-BGYq5gKgNEIpDyTMRTrGcGg7u9Y2-UFaPPT_NAkd1LFNdgCxj6QjG1RM0zoLYjblz3kmtwnhL48hiTg7Fyou8N2lLi_5KbOeelP0H1PfYL3vQPxgywmytipn4hY2Y-ooF-4OFkmDo8uHWlhpHyuy3pYqzYeiFZmbuDU-GNEdc8"/>
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-highest via-transparent to-transparent p-lg flex flex-col justify-center">
                <h4 className="text-title-lg font-title-lg font-black text-km-red">Live Magasin Zone B-9</h4>
                <p className="text-body-md text-on-surface-variant max-w-sm">Active unloading zone for MSCU carriers. Ensure all safety protocols are followed before initiating scan.</p>
              </div>
            </div>
          </section>
        </main>
        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-2xl max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-lg">
                <span className="material-symbols-outlined text-green-600 text-[48px]">check_circle</span>
              </div>
              <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">Reception Validated</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">Order of Transfer (OT) has been successfully generated.</p>
              <div className="mt-xl p-md bg-surface-container-low rounded-lg border border-outline-variant/30 font-data-tabular text-headline-md font-black text-km-red">
                {generatedOT}
              </div>
              <div className="mt-xl flex flex-col gap-sm">
                <button className="w-full bg-on-surface text-surface py-md rounded-lg font-label-md text-label-md" onClick={closeModal}>Proceed to Next Scan</button>
                <button className="w-full py-md rounded-lg font-label-md text-label-md border border-outline-variant" onClick={closeModal}>Print OT Document</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
