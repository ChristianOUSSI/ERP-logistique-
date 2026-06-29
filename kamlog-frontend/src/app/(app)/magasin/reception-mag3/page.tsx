// src/app/(app)/magasin/reception-mag3/page.tsx - Réception Marchandises Mag3 vers autres magasins - Fidèle 100% au HTML original
'use client'


import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReceptionMag3Page() {
  const router = useRouter()
  const [receptionNumber, setReceptionNumber] = useState('')
  const [removalSlipNumber, setRemovalSlipNumber] = useState('')
  const [sourceWarehouse, setSourceWarehouse] = useState('MAG3')
  const [destinationWarehouse, setDestinationWarehouse] = useState('')
  const [articleCode, setArticleCode] = useState('')
  const [articleDescription, setArticleDescription] = useState('')
  const [expectedQuantity, setExpectedQuantity] = useState('')
  const [receivedQuantity, setReceivedQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [customsDeclaration, setCustomsDeclaration] = useState('')
  const [receivedBy, setReceivedBy] = useState('')
  const [date, setDate] = useState('')
  const [observations, setObservations] = useState('')
  const [status, setStatus] = useState<'pending' | 'partial' | 'complete'>('pending')

  const handleClear = () => {
    setReceptionNumber('')
    setRemovalSlipNumber('')
    setSourceWarehouse('MAG3')
    setDestinationWarehouse('')
    setArticleCode('')
    setArticleDescription('')
    setExpectedQuantity('')
    setReceivedQuantity('')
    setUnit('')
    setCustomsDeclaration('')
    setReceivedBy('')
    setDate('')
    setObservations('')
    setStatus('pending')
  }

  const handleSave = () => {
    // Save reception - will be connected to backend
    // This reception happens when goods leave mag3 to DNW1 or DNW2
    router.push('/magasin/reception')
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
        {/* SideNavBar */}
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
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              <li>
                <a onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">dashboard</span>
                  Tableau de bord
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/magasin')} className="flex items-center gap-3 px-3 py-2 rounded text-error bg-error-container font-bold font-label-caps text-label-caps active:scale-95 duration-150 relative cursor-pointer">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-error rounded-r-full"></div>
                  <span className="material-symbols-outlined" data-weight="fill">warehouse</span>
                  Magasin
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/parc')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">minor_crash</span>
                  Parc Automobile
                </a>
              </li>
            </ul>
          </nav>
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

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col ml-[260px] h-screen">
          {/* TopNavBar */}
          <header className="bg-surface sticky top-0 w-full z-40 border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem] shrink-0">
            <div className="flex items-center gap-6">
              <span className="font-title-sm text-title-sm text-on-surface font-black tracking-tight">KAMLOG EM-ERP</span>
              <nav className="hidden md:flex gap-6">
                <a onClick={() => router.push('/magasin')} className="text-on-surface-variant font-body-base text-body-base hover:text-error transition-all cursor-pointer">Magasin</a>
                <a onClick={() => router.push('/magasin/reception')} className="text-on-surface-variant font-body-base text-body-base hover:text-error transition-all cursor-pointer">Réceptions</a>
                <span className="text-on-surface font-bold">Réception Mag3</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <TCodeSearch />
              <div className="flex items-center gap-3 text-on-surface-variant">
                <button className="hover:text-error transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                <button onClick={() => router.push('/security')} className="hover:text-error transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
                <div onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center overflow-hidden border border-outline-variant cursor-pointer">
                  <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd0RGFdOgK86gkkc_yA-0pmtg7UfB_cBJFXgfySVDP67sNmIpf6KvRYjz3vFuUIWR-LqgldQdm4DiIeAcpGDPcnrisGZF3wEV7v2DN04zo1rzJcoXME8dHrt9fCy7a2ityJu73k4CCp5aYK9kagrjZ-hg2WFVdewkcjf6aeVlfzzeXNtNL7m1c3J2jznBnjHBmjmjtsbF-93k_OMsNkCIA1j2u91ArMbL-rsDS8TWsBdIPqQlezb5u5YvP3th1PvcRbIzbyMDoZfbo"/>
                </div>
              </div>
            </div>
          </header>

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
                  <button onClick={handleSave} className="px-3 py-1.5 bg-error text-on-error rounded text-body-sm font-body-sm shadow-sm hover:bg-on-error-fixed-variant transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">save</span> Enregistrer
                  </button>
                </div>
              </div>
            </div>

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
                    placeholder="Ex: REC-2023-001"
                    type="text"
                    value={receptionNumber}
                    onChange={(e) => setReceptionNumber(e.target.value)}
                  />
                </div>

                {/* Removal Slip Number */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Numéro du Bon d'Enlèvement</label>
                  <div className="relative">
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                      placeholder="Ex: BE-2023-001"
                      type="text"
                      value={removalSlipNumber}
                      onChange={(e) => setRemovalSlipNumber(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-error hover:text-error-container transition-colors">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Date de Réception</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    type="date"
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
                    <option value="pending">En attente</option>
                    <option value="partial">Partielle</option>
                    <option value="complete">Complète</option>
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
                  <label className="font-label-md font-label-md text-on-surface-variant block">Magasin Destination</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded text-body-sm font-data-tabular text-on-surface-variant cursor-not-allowed"
                    type="text"
                    value={destinationWarehouse}
                    disabled
                  />
                </div>

                {/* Article Code */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Code Article</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded text-body-sm font-data-tabular text-on-surface-variant cursor-not-allowed"
                    type="text"
                    value={articleCode}
                    disabled
                  />
                </div>

                {/* Article Description */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Description Article</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded text-body-sm text-on-surface-variant cursor-not-allowed"
                    type="text"
                    value={articleDescription}
                    disabled
                  />
                </div>

                {/* Expected Quantity */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Quantité Attendue</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded text-body-sm font-data-tabular text-on-surface-variant cursor-not-allowed"
                    type="text"
                    value={expectedQuantity}
                    disabled
                  />
                </div>

                {/* Received Quantity */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Quantité Reçue</label>
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
                    className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded text-body-sm text-on-surface-variant cursor-not-allowed"
                    type="text"
                    value={unit}
                    disabled
                  />
                </div>

                {/* Customs Declaration */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Déclaration Douanière</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded text-body-sm font-data-tabular text-on-surface-variant cursor-not-allowed"
                    type="text"
                    value={customsDeclaration}
                    disabled
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
                  <span className={`font-data-tabular font-medium ${status === 'complete' ? 'text-primary' : status === 'partial' ? 'text-tertiary' : 'text-secondary'}`}>
                    {status === 'complete' ? 'Complète' : status === 'partial' ? 'Partielle' : 'En attente'}
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
