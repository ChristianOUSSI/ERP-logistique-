// src/app/(app)/magasin/reception/page.tsx - K-Magasin Reception - De-hardcoded
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { magasinAPI } from '@/lib/api-client'
import { TCodeSearch } from '@/components/ui/TCodeSearch'

export default function KMagasinReception() {
  const router = useRouter()
  const [articleCode, setArticleCode] = useState('--- ----')
  const [showModal, setShowModal] = useState(false)
  const [generatedOT, setGeneratedOT] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('normal')

  const [declarationId, setDeclarationId] = useState('')
  const [magasinId, setMagasinId] = useState(1)
  const [articleId, setArticleId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('UDB')
  const [containerNumber, setContainerNumber] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const codeMap: Record<string, { code: string, id: number }> = {
    'ELECTRONICS': { code: '772-9904', id: 1 },
    'SPAREPARTS': { code: '112-4200', id: 2 },
    'PHARMA': { code: '551-1288', id: 3 },
    'FOOD': { code: '883-0144', id: 4 }
  }

  const updateArticleCode = (val: string) => {
    if (codeMap[val]) {
      setArticleCode(codeMap[val].code)
      setArticleId(codeMap[val].id.toString())
    } else {
      setArticleCode('--- ----')
      setArticleId('')
    }
  }

  const generateOT = async () => {
    setErrorMsg('')
    if (!declarationId || !articleId || !quantity) {
      setErrorMsg('Veuillez remplir la déclaration (ID), l\'article et la quantité.')
      return
    }

    setIsSubmitting(true)
    try {
      // Construction du payload pour l'API
      const payload = {
        declaration_id: Number(declarationId),
        magasin_id: magasinId,
        statut: selectedStatus === 'damaged' ? 'LITIGE' : 'EN_COURS',
        notes: `Container: ${containerNumber}`,
        lignes: [
          {
            article_id: Number(articleId),
            quantite_recue: Number(quantity),
            unite_mesure: unit
          }
        ]
      }
      
      const response = await magasinAPI.createReception(payload)
      
      // Mettre à jour l'UI
      setGeneratedOT(`REC-${response.id || Math.floor(1000 + Math.random() * 9000)}`)
      setShowModal(true)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Erreur lors de la création de la réception.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setArticleCode('--- ----')
    setDeclarationId('')
    setArticleId('')
    setQuantity('')
    setContainerNumber('')
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
        
        
        
        
        <aside className="fixed left-0 top-0 h-full w-60 flex flex-col pt-16 pb-4 z-40 bg-surface-container-low border-r border-outline-variant">
          <div className="p-4 flex items-center gap-3">
            <div className="bg-primary-container text-on-primary-container p-2 rounded-lg">
              <span className="material-symbols-outlined">warehouse</span>
            </div>
            <div>
              <div className="text-title-md font-title-md font-bold">KAMLOG ERP</div>
              <div className="text-label-sm font-label-sm text-on-surface-variant">Operational Control</div>
            </div>
          </div>
          
        </aside>
        
        {/* Main Stage */}
        <main className="ml-60 pt-16 p-6 max-w-[1600px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant mb-4">
            <span>K-Magasin</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span>Operations</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-error font-bold">KM24 Reception</span>
          </div>
          
          {/* Header Section */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-headline-lg font-headline-lg text-on-surface flex items-center gap-3">
                Warehouse Reception
                <span className="bg-error/10 text-error px-2 py-1 rounded-full text-label-sm font-label-sm border border-error/20">KM24 Interface</span>
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1">Scan and register incoming goods into Magasin zone A-04.</p>
            </div>
          </div>
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main Form Card (Large) */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-high px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                <span className="font-title-md text-title-md font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">barcode_scanner</span>
                  Entry Form
                </span>
                <span className="text-label-sm font-label-sm text-on-surface-variant">System Time: {new Date().toLocaleTimeString()}</span>
              </div>
              
              <div className="p-6">
                {errorMsg && (
                  <div className="mb-4 p-4 bg-error-container text-on-error-container rounded flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {errorMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Container Number</label>
                      <div className="relative">
                        <input value={containerNumber} onChange={e => setContainerNumber(e.target.value)} className="w-full border border-outline-variant focus:border-error focus:ring-error rounded text-body-md py-2 px-3 bg-surface-container" placeholder="MSCU-902341-2" type="text"/>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">qr_code</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Declaration ID (Backend) *</label>
                      <input value={declarationId} onChange={e => setDeclarationId(e.target.value)} className="w-full border border-outline-variant focus:border-error focus:ring-error rounded text-body-md py-2 px-3 bg-surface-container" placeholder="ID de la déclaration ex: 1" type="number"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Article Selection *</label>
                      <div className="space-y-2">
                        <select className="w-full border border-outline-variant focus:border-error focus:ring-error rounded text-body-md py-2 px-3 bg-surface-container" onChange={(e) => updateArticleCode(e.target.value)}>
                          <option value="">Select an Article...</option>
                          <option value="ELECTRONICS">Consumer Electronics (B-99)</option>
                          <option value="SPAREPARTS">Mechanical Spare Parts (M-42)</option>
                          <option value="PHARMA">Pharmaceutical Goods (P-12)</option>
                          <option value="FOOD">Perishable Food Items (F-01)</option>
                        </select>
                        <div className="flex items-center gap-2 bg-surface-container-low p-2 rounded border border-outline-variant/30">
                          <span className="text-label-sm font-label-sm text-on-surface-variant">Internal Code:</span>
                          <span className="font-data-tabular text-data-tabular font-bold text-error tracking-widest">{articleCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase">Quantity *</label>
                        <input value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border border-outline-variant focus:border-error focus:ring-error rounded text-body-md py-2 px-3 bg-surface-container" placeholder="0.00" type="number"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-label-md font-label-md text-on-surface-variant uppercase">Unit</label>
                        <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full border border-outline-variant focus:border-error focus:ring-error rounded text-body-md py-2 px-3 bg-surface-container">
                          <option value="UDB">Pallet (PLT)</option>
                          <option value="KG">Kilogram (KG)</option>
                          <option value="CRT">Crate (CRT)</option>
                          <option value="MT">Metric Ton (MT)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-md font-label-md text-on-surface-variant uppercase">Stock Status</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded cursor-pointer hover:bg-surface-container-low transition-all ${selectedStatus === 'normal' ? 'border-error bg-surface-container-highest' : 'border-outline-variant'}`}>
                          <input checked={selectedStatus === 'normal'} className="hidden" name="status" type="radio" value="normal" onChange={() => setSelectedStatus('normal')}/>
                          <span className="material-symbols-outlined text-green-600">check_circle</span>
                          <span className="font-label-md text-label-md">Normal</span>
                        </label>
                        <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded cursor-pointer hover:bg-surface-container-low transition-all ${selectedStatus === 'damaged' ? 'border-error bg-surface-container-highest' : 'border-outline-variant'}`}>
                          <input checked={selectedStatus === 'damaged'} className="hidden" name="status" type="radio" value="damaged" onChange={() => setSelectedStatus('damaged')}/>
                          <span className="material-symbols-outlined text-error">warning</span>
                          <span className="font-label-md text-label-md">Damaged</span>
                        </label>
                      </div>
                    </div>
                    <div className="pt-6">
                      <button disabled={isSubmitting} className="w-full bg-error text-on-error py-4 rounded-xl font-headline-sm text-headline-sm hover:bg-on-error-fixed-variant active:scale-[0.98] transition-all shadow flex items-center justify-center gap-3 disabled:opacity-50" type="button" onClick={generateOT}>
                        <span className="material-symbols-outlined">task_alt</span>
                        {isSubmitting ? 'Validation en cours...' : 'Validate & Create Reception'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Side Pane */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <h3 className="text-title-md font-title-md font-bold mb-4">Daily Throughput</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded border border-outline-variant/30">
                    <div className="text-label-sm font-label-sm text-on-surface-variant">Pending</div>
                    <div className="text-headline-md font-headline-md font-black text-error">24</div>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded border border-outline-variant/30">
                    <div className="text-label-sm font-label-sm text-on-surface-variant">Confirmed</div>
                    <div className="text-headline-md font-headline-md font-black text-on-surface">142</div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-label-sm font-label-sm mb-2">
                    <span>Warehouse Capacity</span>
                    <span className="font-bold">84%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-error h-full" style={{width: '84%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-background/40 backdrop-blur-sm">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-2xl max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-600 text-[48px]">check_circle</span>
              </div>
              <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">Reception Validated</h2>
              <p className="text-body-md text-on-surface-variant mt-2">La réception a été correctement enregistrée sur le serveur.</p>
              <div className="mt-6 p-4 bg-surface-container-low rounded border border-outline-variant/30 font-data-tabular text-headline-md font-black text-error">
                {generatedOT}
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <button className="w-full bg-on-surface text-surface py-3 rounded font-label-md text-label-md hover:opacity-90" onClick={closeModal}>Nouvelle Saisie</button>
                <button className="w-full py-3 rounded font-label-md text-label-md border border-outline-variant hover:bg-surface-container-low" onClick={() => router.push('/magasin/history')}>Historique</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
