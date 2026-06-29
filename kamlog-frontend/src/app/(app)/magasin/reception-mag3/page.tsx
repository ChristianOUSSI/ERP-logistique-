// src/app/(app)/magasin/reception-mag3/page.tsx
'use client'

import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { magasinAPI } from '@/lib/api-client'

export default function ReceptionMag3Page() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [receptionNumber, setReceptionNumber] = useState('')
  const [removalSlipNumber, setRemovalSlipNumber] = useState('')
  const [removalSlipId, setRemovalSlipId] = useState<number | ''>('')
  
  const [sourceWarehouse, setSourceWarehouse] = useState('MAG3')
  const [destinationWarehouse, setDestinationWarehouse] = useState('')
  const [articleCode, setArticleCode] = useState('')
  const [articleId, setArticleId] = useState<number | ''>('')
  const [articleDescription, setArticleDescription] = useState('')
  const [expectedQuantity, setExpectedQuantity] = useState('')
  const [receivedQuantity, setReceivedQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [customsDeclaration, setCustomsDeclaration] = useState('')
  const [receivedBy, setReceivedBy] = useState('')
  const [date, setDate] = useState('')
  const [observations, setObservations] = useState('')
  const [status, setStatus] = useState<'EN_ATTENTE' | 'EN_COURS' | 'COMPLETEE' | 'ANNULEE'>('EN_ATTENTE')

  const handleClear = () => {
    setReceptionNumber('')
    setRemovalSlipNumber('')
    setRemovalSlipId('')
    setSourceWarehouse('MAG3')
    setDestinationWarehouse('')
    setArticleCode('')
    setArticleId('')
    setArticleDescription('')
    setExpectedQuantity('')
    setReceivedQuantity('')
    setUnit('')
    setCustomsDeclaration('')
    setReceivedBy('')
    setDate('')
    setObservations('')
    setStatus('EN_ATTENTE')
    setErrorMsg('')
    setSuccessMsg('')
  }

  // Simulating fetching a removal slip by its number
  const handleSearchRemovalSlip = async () => {
    // In a full implementation, you would query the backend: /api/magasin/removal-slips?numero_bon=...
    // For now, we simulate finding the removal slip
    if (removalSlipNumber) {
      setRemovalSlipId(1) // Mock ID
      setDestinationWarehouse('DNW1')
      setArticleId(101)
      setArticleCode('ART-101')
      setArticleDescription('Test Article from Mag3')
      setExpectedQuantity('100')
      setUnit('Cartons')
      setCustomsDeclaration('DOU-789')
      setSuccessMsg(`Bon d'enlèvement ${removalSlipNumber} trouvé.`)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleSave = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    
    if (!removalSlipId || !date || !receivedQuantity || !articleId || !destinationWarehouse) {
      setErrorMsg("Veuillez remplir les champs obligatoires (ID Bon, Date, Quantité Reçue, Magasin Destination).")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        removal_slip_id: Number(removalSlipId),
        magasin_source: 'MAG3',
        magasin_destination: destinationWarehouse,
        article_id: Number(articleId),
        quantite_attendue: Number(expectedQuantity || 0),
        quantite_recue: Number(receivedQuantity),
        unite: unit || 'UNIT',
        declaration_douaniere: customsDeclaration,
        date_reception: new Date(date).toISOString(),
        observations: observations,
        statut: status,
        recu_par: receivedBy
      }

      await magasinAPI.createReceptionMag3(payload)
      setSuccessMsg("Réception Mag3 enregistrée avec succès.")
      setTimeout(() => {
        router.push('/magasin/history')
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Erreur lors de l'enregistrement de la réception.")
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
                <span>Réceptions</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span className="text-error font-semibold">Réception Mag3</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Réception - Mag3 vers autres Magasins</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Réception des marchandises quittant le magasin sous douane (Mag3) vers DNW1 ou DNW2</p>
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

            {/* Info Banner */}
            <div className="bg-primary-container border border-primary/20 rounded-lg p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">info</span>
              <div>
                <h3 className="font-title-md text-title-md text-on-primary-container font-semibold">Réception après Bon d'Enlèvement</h3>
                <p className="font-body-sm text-body-sm text-on-primary-container mt-1">Cette réception est effectuée après l'émission du bon d'enlèvement et lorsque les marchandises quittent effectivement le Mag3 pour DNW1 ou DNW2.</p>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reception Number */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Numéro de Réception</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="Auto-généré ou Ex: REC-2023-001"
                    type="text"
                    value={receptionNumber}
                    onChange={(e) => setReceptionNumber(e.target.value)}
                  />
                </div>

                {/* Removal Slip Number */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Numéro du Bon d'Enlèvement *</label>
                  <div className="relative">
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                      placeholder="Ex: BE-2023-001"
                      type="text"
                      value={removalSlipNumber}
                      onChange={(e) => setRemovalSlipNumber(e.target.value)}
                    />
                    <button onClick={handleSearchRemovalSlip} className="absolute right-2 top-1/2 -translate-y-1/2 text-error hover:text-error-container transition-colors">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Date de Réception *</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Statut</label>
                  <select 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="EN_COURS">Partielle / En cours</option>
                    <option value="COMPLETEE">Complète</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
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

                {/* Article Code */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Code Article</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="text"
                    value={articleCode}
                    onChange={(e) => setArticleCode(e.target.value)}
                  />
                </div>

                {/* Article ID (Hidden for UI, but let's show for dev) */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">ID Article (Backend) *</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="number"
                    value={articleId}
                    onChange={(e) => setArticleId(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>

                {/* Article Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Description Article</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="text"
                    value={articleDescription}
                    onChange={(e) => setArticleDescription(e.target.value)}
                  />
                </div>

                {/* Expected Quantity */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Quantité Attendue</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="number"
                    step="0.01"
                    value={expectedQuantity}
                    onChange={(e) => setExpectedQuantity(e.target.value)}
                  />
                </div>

                {/* Received Quantity */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Quantité Reçue *</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={receivedQuantity}
                    onChange={(e) => setReceivedQuantity(e.target.value)}
                  />
                </div>

                {/* Unit */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Unité</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>

                {/* Customs Declaration */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Déclaration Douanière</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="text"
                    value={customsDeclaration}
                    onChange={(e) => setCustomsDeclaration(e.target.value)}
                  />
                </div>

                {/* Received By */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Reçu Par</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    placeholder="Nom du réceptionnaire"
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                  />
                </div>

                {/* Observations */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Observations</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Remarques sur la réception"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-error-container border border-error/20 rounded-lg p-4">
              <h3 className="font-title-md text-title-md text-on-error-container mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">fact_check</span>
                Résumé de la Réception
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Bon d'Enlèvement</span>
                  <span className="font-data-tabular font-medium">{removalSlipNumber || '-'}</span>
                </div>
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Quantité Attendue</span>
                  <span className="font-data-tabular font-medium">{expectedQuantity || '-'} {unit || ''}</span>
                </div>
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Quantité Reçue</span>
                  <span className="font-data-tabular font-medium">{receivedQuantity || '-'} {unit || ''}</span>
                </div>
                <div>
                  <span className="block text-on-error-container/70 text-[11px] uppercase tracking-wider">Statut</span>
                  <span className={`font-data-tabular font-medium ${status === 'COMPLETEE' ? 'text-primary' : status === 'EN_COURS' ? 'text-tertiary' : 'text-secondary'}`}>
                    {status === 'COMPLETEE' ? 'Complète' : status === 'EN_COURS' ? 'Partielle' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
