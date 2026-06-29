// src/app/(app)/master-data/suppliers/create/page.tsx - Création Profil Fournisseur K-Master Data - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SupplierProfileCreate() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [acronym, setAcronym] = useState('')
  const [entityType, setEntityType] = useState('')
  const [niu, setNiu] = useState('')
  const [rccm, setRccm] = useState('')
  const [address, setAddress] = useState('')
  const [poBox, setPoBox] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [currency, setCurrency] = useState('')
  const [creditLimit, setCreditLimit] = useState('')
  const [taxId, setTaxId] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [bankName, setBankName] = useState('')

  const handleClear = () => {
    setCompanyName('')
    setAcronym('')
    setEntityType('')
    setNiu('')
    setRccm('')
    setAddress('')
    setPoBox('')
    setCity('')
    setRegion('')
    setPhone('')
    setEmail('')
    setPaymentTerms('')
    setCurrency('')
    setCreditLimit('')
    setTaxId('')
    setBankAccount('')
    setBankName('')
  }

  const handleSave = () => {
    // Save supplier profile - will be connected to backend
    router.push('/master-data/tiers')
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
            <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-on-secondary font-headline-md font-bold">K</div>
            <div>
              <h1 className="font-headline-md text-headline-md text-secondary font-bold leading-none">KAMLOG ERP</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Master Data</p>
            </div>
          </div>
          <div className="p-4">
            <button onClick={() => router.push('/dashboard')} className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-2 px-4 rounded shadow-sm hover:bg-on-secondary-fixed-variant transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{fontVariationSettings: 'FILL 1'}}>add</span>
              Nouveau Tiers
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
                <a onClick={() => router.push('/master-data')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary bg-secondary-container font-bold font-label-caps text-label-caps active:scale-95 duration-150 relative cursor-pointer">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-secondary rounded-r-full"></div>
                  <span className="material-symbols-outlined" data-weight="fill">inventory_2</span>
                  Master Data
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/finance')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary font-label-caps text-label-caps hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer">
                  <span className="material-symbols-outlined">payments</span>
                  Finances
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
                <a onClick={() => router.push('/master-data')} className="text-on-surface-variant font-body-base text-body-base hover:text-secondary transition-all cursor-pointer">Master Data</a>
                <a onClick={() => router.push('/master-data/tiers')} className="text-on-surface-variant font-body-base text-body-base hover:text-secondary transition-all cursor-pointer">Tiers</a>
                <span className="text-on-surface font-bold">Création Profil Fournisseur</span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative focus-within:ring-2 focus-within:ring-secondary rounded">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input className="pl-8 pr-3 py-1.5 bg-surface-container-high border-none rounded text-sm w-48 focus:outline-none focus:ring-0" placeholder="Rechercher T-Code" type="text"/>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant">
                <button className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">notifications</span></button>
                <button onClick={() => router.push('/security')} className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">verified_user</span></button>
                <div onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant cursor-pointer">
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
                <span>Master Data</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span>Tiers</span>
                <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
                <span className="text-secondary font-semibold">Création Profil Fournisseur</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Création Profil Fournisseur</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Enregistrement d'un nouveau fournisseur dans le système</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleClear} className="px-3 py-1.5 border border-outline-variant rounded bg-surface text-body-sm font-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">refresh</span> Effacer
                  </button>
                  <button onClick={handleSave} className="px-3 py-1.5 bg-secondary text-on-secondary rounded text-body-sm font-body-sm shadow-sm hover:bg-on-secondary-fixed-variant transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">save</span> Enregistrer
                  </button>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm">
              {/* Section 1: Legal Identification */}
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-title-md text-title-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">business</span>
                  Identification Légale
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Raison Sociale</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Nom de l'entreprise"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Acronyme</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Ex: ABC SARL"
                      type="text"
                      value={acronym}
                      onChange={(e) => setAcronym(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Type d'Entité</label>
                    <select 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      <option value="SARL">SARL</option>
                      <option value="SA">SA</option>
                      <option value="SAS">SAS</option>
                      <option value="EURL">EURL</option>
                      <option value="Entreprise Individuelle">Entreprise Individuelle</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">NIU</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Numéro d'Identification Unique"
                      type="text"
                      value={niu}
                      onChange={(e) => setNiu(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">RCCM</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Registre du Commerce et des Crédits Mobiliers"
                      type="text"
                      value={rccm}
                      onChange={(e) => setRccm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">ID Fiscal</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Numéro d'identification fiscale"
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location & Coordinates */}
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-title-md text-title-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  Coordonnées & Localisation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Adresse</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Adresse complète"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Boîte Postale</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="BP"
                      type="text"
                      value={poBox}
                      onChange={(e) => setPoBox(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Ville</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Ville"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Région</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Région/Département"
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Téléphone</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="+225 XX XX XX XX XX"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Email</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="email@exemple.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Financial Parameters */}
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-title-md text-title-md text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">account_balance</span>
                  Paramètres Financiers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Conditions de Paiement</label>
                    <select 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      <option value="30 jours">30 jours</option>
                      <option value="45 jours">45 jours</option>
                      <option value="60 jours">60 jours</option>
                      <option value="90 jours">90 jours</option>
                      <option value="Comptant">Comptant</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Devise</label>
                    <select 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      <option value="FCFA">FCFA (FCFA)</option>
                      <option value="FCFA">Euro (FCFA)</option>
                      <option value="FCFA">Dollar US (FCFA)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Limite de Crédit</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Nom de la Banque</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="Nom de la banque"
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md font-label-md text-on-surface-variant block">Numéro de Compte Bancaire</label>
                    <input 
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="IBAN ou numéro de compte"
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
