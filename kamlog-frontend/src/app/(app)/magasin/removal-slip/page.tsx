// src/app/(app)/magasin/removal-slip/page.tsx - Bon d'Enlèvement Mag3 vers autres magasins - De-hardcoded
'use client'

import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { magasinAPI } from '@/lib/api-client'

export default function RemovalSlipPage() {
  const router = useRouter()
  const [slipNumber, setSlipNumber] = useState('')
  const [sourceWarehouse, setSourceWarehouse] = useState('MAG3')
  const [destinationWarehouse, setDestinationWarehouse] = useState('')
  const [articleCode, setArticleCode] = useState('')
  const [articleId, setArticleId] = useState('')
  const [articleDescription, setArticleDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [customsDeclaration, setCustomsDeclaration] = useState('')
  const [reason, setReason] = useState('')
  const [authorizedBy, setAuthorizedBy] = useState('')
  const [date, setDate] = useState('')
  const [observations, setObservations] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleClear = () => {
    setSlipNumber('')
    setSourceWarehouse('MAG3')
    setDestinationWarehouse('')
    setArticleCode('')
    setArticleId('')
    setArticleDescription('')
    setQuantity('')
    setUnit('')
    setCustomsDeclaration('')
    setReason('')
    setAuthorizedBy('')
    setDate('')
    setObservations('')
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleSave = async () => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!destinationWarehouse || !articleId || !quantity || !unit || !customsDeclaration || !date) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (Destination, Article ID, Quantité, Unité, Déclaration, Date).")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        magasin_source: sourceWarehouse,
        magasin_destination: destinationWarehouse,
        article_id: Number(articleId),
        quantite: Number(quantity),
        unite: unit,
        declaration_douaniere: customsDeclaration,
        motif: reason,
        observations: observations,
        date_bon: new Date(date).toISOString(),
      }
      
      const response = await magasinAPI.createRemovalSlip(payload)
      setSlipNumber(response.numero_bon)
      setSuccessMsg(`Bon d'enlèvement créé avec succès: ${response.numero_bon}`)
      setTimeout(() => {
        router.push('/magasin/reception-mag3')
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Erreur lors de la création du bon d'enlèvement.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1';
        }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md antialiased overflow-hidden flex">
        
        <aside className="bg-surface-container-lowest border-r border-outline-variant shadow-sm fixed left-0 top-0 h-full w-[260px] flex flex-col p-[1rem] z-50">
          <div className="p-4 border-b border-outline-variant flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-error flex items-center justify-center text-on-error font-headline-md font-bold">K</div>
            <div>
              <h1 className="font-headline-md text-headline-md text-error font-bold leading-none">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">K-Magasin</p>
            </div>
          </div>
          <div className="p-4">
            <button onClick={() => router.push('/dashboard')} className="w-full bg-error text-on-error font-label-md text-label-md py-2 px-4 rounded shadow-sm hover:bg-on-error-fixed-variant transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{fontVariationSettings: 'FILL 1'}}>add</span>
              Nouvelle Opération
            </button>
          </div>
          
          <div className="mt-auto border-t border-outline-variant p-2">
            <ul className="space-y-1 px-2">
              <li>
                <a onClick={() => router.push('/support')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">help_outline</span>
                  Support
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/logout')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">logout</span>
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </aside>

        
        <div className="flex-1 flex flex-col ml-[260px] h-screen">
          
          

          {/* Main Stage */}
          <main className="flex-1 overflow-y-auto p-[1rem] bg-surface-container-low flex flex-col gap-[1rem] max-w-[1600px] mx-auto w-full">
            {/* Breadcrumbs & Header */}
            <div className="mb-2">
              <div className="flex items-center text-label-sm font-label-sm text-outline mb-2">
                <span>Magasin</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span>Mouvements</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span className="text-error font-semibold">Bon d'Enlèvement (Mag3)</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Bon d'Enlèvement - Mag3 vers autres Magasins</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Transaction pour mouvements du magasin sous douane (Mag3) vers DNW1 ou DNW2</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleClear} className="px-3 py-1.5 border border-outline-variant rounded bg-surface text-body-sm font-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">refresh</span> Effacer
                  </button>
                  <button disabled={isSubmitting} onClick={handleSave} className="px-3 py-1.5 bg-error text-on-error rounded text-body-sm font-body-sm shadow-sm hover:bg-on-error-fixed-variant transition-colors flex items-center gap-2 disabled:opacity-50">
                    <span className="material-symbols-outlined text-[18px]">save</span> 
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="p-4 bg-primary-container text-on-primary-container rounded-lg border border-primary/20 flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                {successMsg}
              </div>
            )}

            {/* Warning Banner */}
            <div className="bg-error-container border border-error/20 rounded-lg p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-error">warning</span>
              <div>
                <h3 className="font-title-md text-title-md text-on-error-container font-semibold">Magasin sous Douane</h3>
                <p className="font-body-sm text-body-sm text-on-error-container mt-1">Le Mag3 est un magasin sous douane. Les marchandises ne peuvent pas y être stockées pour une grande période. Ce bon d'enlèvement est obligatoire pour tout mouvement vers DNW1 ou DNW2.</p>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slip Number */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Numéro du Bon d'Enlèvement</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="Auto-généré"
                    type="text"
                    value={slipNumber}
                    onChange={(e) => setSlipNumber(e.target.value)}
                    disabled
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Date *</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                {/* Source Warehouse (Fixed to MAG3) */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Magasin Source</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded text-body-sm font-data-tabular text-on-surface-variant cursor-not-allowed"
                    type="text"
                    value="MAG3 (Sous Douane)"
                    disabled
                  />
                </div>

                {/* Destination Warehouse */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Magasin Destination *</label>
                  <select 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    value={destinationWarehouse}
                    onChange={(e) => setDestinationWarehouse(e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="DNW1">DNW1</option>
                    <option value="DNW2">DNW2</option>
                  </select>
                </div>

                {/* Article ID */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">ID Article (Backend) *</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="ID de l'article"
                    type="number"
                    value={articleId}
                    onChange={(e) => setArticleId(e.target.value)}
                  />
                </div>

                {/* Article Code (Optional, just UI) */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Code Article</label>
                  <div className="relative">
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                      placeholder="Ex: KA01-001"
                      type="text"
                      value={articleCode}
                      onChange={(e) => setArticleCode(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-error hover:text-error-container transition-colors">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>
                  </div>
                </div>

                {/* Article Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Description Article</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="Description de l'article"
                    type="text"
                    value={articleDescription}
                    onChange={(e) => setArticleDescription(e.target.value)}
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Quantité *</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                {/* Unit */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Unité *</label>
                  <select 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="KG">Kilogramme (KG)</option>
                    <option value="TON">Tonne (TON)</option>
                    <option value="M3">Mètre cube (M3)</option>
                    <option value="UN">Unité (UN)</option>
                    <option value="PALETTE">Palette</option>
                  </select>
                </div>

                {/* Customs Declaration */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Déclaration Douanière *</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="Numéro de déclaration douanière"
                    type="text"
                    value={customsDeclaration}
                    onChange={(e) => setCustomsDeclaration(e.target.value)}
                  />
                </div>

                {/* Reason */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Motif du Mouvement</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Expliquer la raison du mouvement"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>

                {/* Authorized By */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Autorisé Par</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="Nom de l'autorisateur"
                    type="text"
                    value={authorizedBy}
                    onChange={(e) => setAuthorizedBy(e.target.value)}
                  />
                </div>

                {/* Observations */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Observations</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Remarques supplémentaires"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-error-container border border-error/20 rounded-lg p-4">
              <h3 className="font-title-md text-title-md text-on-error-container mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">receipt_long</span>
                Résumé du Bon d'Enlèvement
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Source</span>
                  <span className="font-data-tabular font-medium">MAG3 (Sous Douane)</span>
                </div>
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Destination</span>
                  <span className="font-data-tabular font-medium">{destinationWarehouse || '-'}</span>
                </div>
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Quantité</span>
                  <span className="font-data-tabular font-medium">{quantity || '-'} {unit || ''}</span>
                </div>
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Déclaration Douane</span>
                  <span className="font-data-tabular font-medium">{customsDeclaration || '-'}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
