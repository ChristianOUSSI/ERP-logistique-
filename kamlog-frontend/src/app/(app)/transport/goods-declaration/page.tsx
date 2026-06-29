// src/app/(app)/transport/goods-declaration/page.tsx - Déclaration de Marchandises K-Transport - Fidèle 100% au HTML original
'use client'


import { TCodeSearch } from '@/components/ui/TCodeSearch'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GoodsDeclaration() {
  const router = useRouter()
  const [articleCode, setArticleCode] = useState('')
  const [transitCode, setTransitCode] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [weight, setWeight] = useState('')
  const [value, setValue] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [containerNumber, setContainerNumber] = useState('')
  const [observations, setObservations] = useState('')

  const handleClear = () => {
    setArticleCode('')
    setTransitCode('')
    setDescription('')
    setQuantity('')
    setUnit('')
    setWeight('')
    setValue('')
    setOrigin('')
    setDestination('')
    setContainerNumber('')
    setObservations('')
  }

  const handleSave = () => {
    // Save goods declaration - will be connected to backend
    // Uses article code from master data (transit code)
    router.push('/transport/containers')
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
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-on-primary font-headline-md font-bold">K</div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary font-bold leading-none">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Port Operations</p>
            </div>
          </div>
          <div className="p-4">
            <button onClick={() => router.push('/dashboard')} className="w-full bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded shadow-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2">
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
                <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-3 py-2 rounded text-primary bg-secondary-container font-bold font-label-caps text-label-caps active:scale-95 duration-150 relative cursor-pointer">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-primary rounded-r-full"></div>
                  <span className="material-symbols-outlined" data-weight="fill">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/finance')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">payments</span>
                  Finances
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/parc')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">minor_crash</span>
                  Parc Automobile
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/magasin')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">warehouse</span>
                  Magasin
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
                <a onClick={() => router.push('/transport')} className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all cursor-pointer">Transport</a>
                <a onClick={() => router.push('/transport/containers')} className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-all cursor-pointer">Opérations</a>
                <span className="text-on-surface font-bold">Déclaration de Marchandises</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <TCodeSearch />
              <div className="flex items-center gap-3 text-on-surface-variant">
                <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                <button onClick={() => router.push('/security')} className="hover:text-primary transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
                <div onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden border border-outline-variant cursor-pointer">
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
                <span>Transport</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span>Opérations</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span className="text-primary font-semibold">Déclaration de Marchandises</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Déclaration de Marchandises</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Enregistrement des marchandises avec code article et code transit</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleClear} className="px-3 py-1.5 border border-outline-variant rounded bg-surface text-body-sm font-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">refresh</span> Effacer
                  </button>
                  <button onClick={handleSave} className="px-3 py-1.5 bg-primary text-on-primary rounded text-body-sm font-body-sm shadow-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">save</span> Enregistrer
                  </button>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Article Code (from Master Data) */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Code Article (Transit)</label>
                  <div className="relative">
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: KA01-001"
                      type="text"
                      value={articleCode}
                      onChange={(e) => setArticleCode(e.target.value)}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-container transition-colors">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Code article déclaré au départ pour la déclaration de marchandise</p>
                </div>

                {/* Transit Code */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Code Transit</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: TR-2023-001"
                    type="text"
                    value={transitCode}
                    onChange={(e) => setTransitCode(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Description détaillée de la marchandise"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Quantité</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                {/* Unit */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Unité</label>
                  <select 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

                {/* Weight */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Poids (KG)</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                {/* Value */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Valeur (FCFA)</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>

                {/* Origin */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Origine</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Pays d'origine"
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Destination</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Pays de destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                {/* Container Number */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Numéro de Conteneur (Optionnel)</label>
                  <input 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: ABCD1234567"
                    type="text"
                    value={containerNumber}
                    onChange={(e) => setContainerNumber(e.target.value)}
                  />
                </div>

                {/* Observations */}
                <div className="space-y-2 md:col-span-2">
                  <label className="font-label-md font-label-md text-on-surface-variant block">Observations</label>
                  <textarea 
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Remarques supplémentaires"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-primary-container border border-primary/20 rounded-lg p-4">
              <h3 className="font-title-md text-title-md text-on-primary-container mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                Résumé de la Déclaration
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block text-on-primary-container/70 text-[11px] uppercase tracking-wider">Code Article</span>
                  <span className="font-data-tabular font-medium">{articleCode || '-'}</span>
                </div>
                <div>
                  <span className="block text-on-primary-container/70 text-[11px] uppercase tracking-wider">Code Transit</span>
                  <span className="font-data-tabular font-medium">{transitCode || '-'}</span>
                </div>
                <div>
                  <span className="block text-on-primary-container/70 text-[11px] uppercase tracking-wider">Quantité</span>
                  <span className="font-data-tabular font-medium">{quantity || '-'} {unit || ''}</span>
                </div>
                <div>
                  <span className="block text-on-primary-container/70 text-[11px] uppercase tracking-wider">Valeur</span>
                  <span className="font-data-tabular font-medium">{value ? `${Number(value).toLocaleString()} FCFA` : '-'}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
