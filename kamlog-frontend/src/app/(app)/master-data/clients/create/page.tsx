// src/app/(app)/master-data/clients/create/page.tsx - KC34 Création Profil Client Master Data - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientCreate() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [acronym, setAcronym] = useState('')
  const [entityType, setEntityType] = useState('')
  const [niu, setNiu] = useState('')
  const [rccm, setRccm] = useState('')
  const [address, setAddress] = useState('')
  const [poBox, setPoBox] = useState('')
  const [city, setCity] = useState('douala')
  const [region, setRegion] = useState('littoral')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [currency, setCurrency] = useState('xaf')
  const [creditLimit, setCreditLimit] = useState('0')

  const handleCancel = () => {
    router.push('/master-data/clients')
  }

  const handleSave = () => {
    // Save client profile - will be connected to backend
    router.push('/master-data/clients')
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 1, wght 400, GRAD 0, opsz 24';
        }
        .kamlog-input {
          @apply w-full h-8 px-2 font-body-sm text-body-sm border border-outline-variant rounded bg-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors;
        }
        .kamlog-label {
          @apply block font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider;
        }
        .kamlog-section-title {
          @apply font-title-md text-title-md text-on-surface flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant;
        }
        .accent-master-data {
          @apply text-secondary;
        }
        .bg-master-data-light {
          @apply bg-secondary-container text-on-secondary-container;
        }
      `}</style>
      <div className="text-on-background min-h-screen flex overflow-hidden">
        {/* SideNavBar */}
        <nav className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col p-[1rem] z-50">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container font-bold text-xl shadow-sm">K</div>
              <div>
                <h1 className="font-headline-md text-headline-md text-primary font-bold">KAMLOG ERP</h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Port Operations</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-primary hover:bg-primary-fixed-variant text-on-primary font-title-md text-title-md py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 mb-6 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nouvelle Opération
          </button>
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <a onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md cursor-pointer">
                  <span className="material-symbols-outlined">dashboard</span>
                  Tableau de bord
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/transport')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md cursor-pointer">
                  <span className="material-symbols-outlined">local_shipping</span>
                  Transport
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/finance')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md cursor-pointer">
                  <span className="material-symbols-outlined">payments</span>
                  Finances
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/parc')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md cursor-pointer">
                  <span className="material-symbols-outlined">minor_crash</span>
                  Parc Automobile
                </a>
              </li>
              <li>
                {/* Active Item */}
                <a onClick={() => router.push('/master-data')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary bg-secondary-container font-bold hover:bg-surface-container-high transition-colors font-body-md text-body-md border-l-4 border-secondary cursor-pointer">
                  <span className="material-symbols-outlined text-secondary">database</span>
                  Master Data
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/settings')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md cursor-pointer">
                  <span className="material-symbols-outlined">settings</span>
                  Paramètres
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-auto pt-4 border-t border-outline-variant">
            <ul className="space-y-1">
              <li>
                <a onClick={() => router.push('/support')} className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors font-body-sm text-body-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">help_outline</span>
                  Support
                </a>
              </li>
              <li>
                <a onClick={() => router.push('/logout')} className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors font-body-sm text-body-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Déconnexion
                </a>
              </li>
            </ul>
          </div>
        </nav>
        {/* Main Content Area */}
        <div className="ml-[260px] flex-1 flex flex-col h-screen overflow-hidden">
          {/* TopNavBar */}
          <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-[64px] px-[1rem] shrink-0">
            <div className="flex items-center gap-6">
              <span className="font-title-sm text-title-sm text-on-surface font-black">KAMLOG EM-ERP</span>
              <nav className="hidden md:flex gap-1 h-full items-end">
                <a onClick={() => router.push('/master-data/articles')} className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base px-3 py-4 border-b-2 border-transparent cursor-pointer">Articles</a>
                <a onClick={() => router.push('/master-data/clients')} className="text-primary border-b-2 border-primary pb-1 font-body-base text-body-base px-3 py-4 cursor-pointer">Clients</a>
                <a onClick={() => router.push('/magasin')} className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base px-3 py-4 border-b-2 border-transparent cursor-pointer">Stocks</a>
                <a onClick={() => router.push('/reports')} className="text-on-surface-variant hover:text-primary transition-all font-body-base text-body-base px-3 py-4 border-b-2 border-transparent cursor-pointer">Rapports</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {/* Global Search / T-Code */}
              <div className="relative focus-within:ring-2 focus-within:ring-primary rounded-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">search</span>
                <input className="w-64 h-9 pl-9 pr-3 bg-surface-container-lowest border border-outline-variant rounded-md font-body-sm text-body-sm focus:outline-none" placeholder="Rechercher T-Code" type="text"/>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-surface-container px-1.5 rounded text-xs text-on-surface-variant font-medium border border-outline-variant">⌘K</div>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                <button onClick={() => router.push('/security')} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </button>
                <div onClick={() => router.push('/profile')} className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center ml-2 border border-outline-variant cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                </div>
              </div>
            </div>
          </header>
          {/* Page Canvas */}
          <main className="flex-1 overflow-y-auto p-[1rem] bg-surface-container-low">
            <div className="max-w-[1200px] mx-auto">
              {/* Breadcrumbs & Header Context */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant mb-2">
                  <span className="material-symbols-outlined text-[14px]">database</span>
                  <span>Master Data</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span>Clients</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-secondary font-medium">Création Profil</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary-container rounded flex items-center justify-center text-secondary border border-secondary/20 shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">domain_add</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Nouveau Client Corporate</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-surface-container-high px-2 py-0.5 rounded text-xs font-mono text-on-surface-variant border border-outline-variant">T-Code: KC34</span>
                        <span className="bg-master-data-light px-2 py-0.5 rounded text-xs font-medium border border-secondary/30">Mode Brouillon</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded hover:bg-surface-container transition-colors font-title-sm text-title-sm flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                      Annuler
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-secondary text-on-secondary rounded hover:bg-on-secondary-fixed-variant transition-colors font-title-sm text-title-sm flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Enregistrer Profil
                    </button>
                  </div>
                </div>
              </div>
              {/* Bento Grid Layout for Forms */}
              <div className="grid grid-cols-12 gap-[1rem]">
                {/* Left Column: Primary Data (8 cols) */}
                <div className="col-span-12 xl:col-span-8 space-y-[1rem]">
                  {/* Identification Section */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-[1rem] shadow-sm">
                    <h3 className="kamlog-section-title">
                      <span className="material-symbols-outlined text-[20px] accent-master-data">badge</span>
                      Identification Légale
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="kamlog-label">Raison Sociale / Nom de l'entreprise *</label>
                        <input className="kamlog-input" placeholder="Ex: BOLLORÉ TRANSPORT & LOGISTICS CAMEROUN SA" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
                      </div>
                      <div>
                        <label className="kamlog-label">Sigle / Acronyme</label>
                        <input className="kamlog-input" placeholder="Ex: BTL" type="text" value={acronym} onChange={(e) => setAcronym(e.target.value)}/>
                      </div>
                      <div>
                        <label className="kamlog-label">Type d'entité *</label>
                        <select className="kamlog-input" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                          <option value="">Sélectionner...</option>
                          <option value="sa">Société Anonyme (SA)</option>
                          <option value="sarl">Société à Responsabilité Limitée (SARL)</option>
                          <option value="succursale">Succursale</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div className="col-span-2 mt-2">
                        <div className="flex gap-4 p-3 bg-surface-container-lowest border border-outline-variant rounded bg-yellow-50">
                          <div className="flex-1">
                            <label className="kamlog-label text-tertiary-container">Numéro d'Identifiant Unique (NIU) *</label>
                            <div className="relative">
                              <input className="kamlog-input border-tertiary-container/30 focus:border-tertiary-container focus:ring-tertiary-container font-mono" placeholder="M000000000000X" type="text" value={niu} onChange={(e) => setNiu(e.target.value)}/>
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-outline font-mono">Format CM</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="kamlog-label">Registre du Commerce (RCCM) *</label>
                            <input className="kamlog-input font-mono" placeholder="RC/DLA/20.../B/..." type="text" value={rccm} onChange={(e) => setRccm(e.target.value)}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Address Section */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-[1rem] shadow-sm">
                    <h3 className="kamlog-section-title">
                      <span className="material-symbols-outlined text-[20px] accent-master-data">location_on</span>
                      Localisation & Coordonnées (Cameroun)
                    </h3>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-8">
                        <label className="kamlog-label">Siège Social / Adresse Physique *</label>
                        <input className="kamlog-input" placeholder="Boulevard de la République, Akwa..." type="text" value={address} onChange={(e) => setAddress(e.target.value)}/>
                      </div>
                      <div className="col-span-4">
                        <label className="kamlog-label">Boîte Postale (BP)</label>
                        <input className="kamlog-input" placeholder="BP 4080" type="text" value={poBox} onChange={(e) => setPoBox(e.target.value)}/>
                      </div>
                      <div className="col-span-6">
                        <label className="kamlog-label">Ville *</label>
                        <select className="kamlog-input" value={city} onChange={(e) => setCity(e.target.value)}>
                          <option value="douala">Douala</option>
                          <option value="yaounde">Yaoundé</option>
                          <option value="kribi">Kribi</option>
                          <option value="bafoussam">Bafoussam</option>
                          <option value="garoua">Garoua</option>
                        </select>
                      </div>
                      <div className="col-span-6">
                        <label className="kamlog-label">Région *</label>
                        <select className="kamlog-input bg-surface-container-lowest" disabled value={region}>
                          <option value="littoral">Littoral</option>
                        </select>
                      </div>
                      <div className="col-span-6">
                        <label className="kamlog-label">Téléphone Standard *</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-r-0 border-outline-variant bg-surface-container-lowest text-on-surface-variant text-sm rounded-l">+237</span>
                          <input className="kamlog-input rounded-l-none" placeholder="233 XX XX XX" type="text" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label className="kamlog-label">Email Principal Entreprise *</label>
                        <input className="kamlog-input" placeholder="contact@entreprise.cm" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Column: Commercial & Settings (4 cols) */}
                <div className="col-span-12 xl:col-span-4 space-y-[1rem]">
                  {/* Commercial Parameters */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-[1rem] shadow-sm">
                    <h3 className="kamlog-section-title">
                      <span className="material-symbols-outlined text-[20px] accent-master-data">account_balance_wallet</span>
                      Paramètres Financiers
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="kamlog-label">Conditions de Paiement *</label>
                        <select className="kamlog-input" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                          <option value="">Sélectionner...</option>
                          <option value="comptant">Comptant (À la commande)</option>
                          <option value="15j">15 Jours fin de mois</option>
                          <option value="30j">30 Jours nets</option>
                          <option value="45j">45 Jours nets</option>
                        </select>
                      </div>
                      <div>
                        <label className="kamlog-label">Devise de Facturation *</label>
                        <select className="kamlog-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          <option value="xaf">XAF (Franc CFA CEMAC)</option>
                          <option value="eur">EUR (Euro)</option>
                          <option value="usd">USD (Dollar US)</option>
                        </select>
                      </div>
                      <div className="pt-2 border-t border-outline-variant mt-2">
                        <label className="kamlog-label text-error">Limite de Crédit Autorisée (XAF)</label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant font-mono">FCFA</span>
                          <input className="kamlog-input pl-12 text-right font-mono font-medium text-error focus:ring-error focus:border-error" placeholder="0" type="text" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)}/>
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">Nécessite une approbation du DAF si &gt; 1M XAF.</p>
                      </div>
                    </div>
                  </div>
                  {/* Key Contacts Mini-Table */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-[1rem] shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant">
                      <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] accent-master-data">contacts</span>
                        Contacts Principaux
                      </h3>
                      <button className="text-secondary hover:bg-secondary-container p-1 rounded transition-colors" title="Ajouter un contact">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      </button>
                    </div>
                    <div className="border border-outline-variant rounded overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase font-medium border-b border-outline-variant">
                          <tr>
                            <th className="px-2 py-1.5 w-1/3">Rôle</th>
                            <th className="px-2 py-1.5">Nom & Contact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                          <tr className="bg-white">
                            <td className="px-2 py-2 text-xs font-medium text-on-surface">Dir. Général</td>
                            <td className="px-2 py-2">
                              <input className="w-full text-xs p-1 border border-outline-variant rounded" placeholder="Nom..." type="text"/>
                            </td>
                          </tr>
                          <tr className="bg-surface-container-lowest">
                            <td className="px-2 py-2 text-xs font-medium text-on-surface">Resp. Logistique</td>
                            <td className="px-2 py-2">
                              <input className="w-full text-xs p-1 border border-outline-variant rounded" placeholder="Nom..." type="text"/>
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-2 py-2 text-xs font-medium text-on-surface">Comptabilité</td>
                            <td className="px-2 py-2">
                              <input className="w-full text-xs p-1 border border-outline-variant rounded" placeholder="Nom..." type="text"/>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
