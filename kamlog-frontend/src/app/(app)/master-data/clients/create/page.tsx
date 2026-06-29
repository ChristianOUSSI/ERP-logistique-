// src/app/(app)/master-data/clients/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { masterDataAPI } from '@/lib/api/master-data'

export default function ClientCreate() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  const [formData, setFormData] = useState({
    companyName: '',
    acronym: '',
    entityType: '',
    niu: '',
    rccm: '',
    address: '',
    poBox: '',
    city: 'douala',
    region: 'littoral',
    phone: '',
    email: '',
    paymentTerms: '',
    currency: 'xaf',
    creditLimit: '0'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCancel = () => {
    router.push('/master-data/tiers') // Changed back to tiers where the listing is
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      await masterDataAPI.createClientProfile(formData)
      router.push('/master-data/tiers')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Une erreur est survenue lors de la création.')
    } finally {
      setIsSubmitting(false)
    }
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
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ">
          
          
          {/* Page Canvas */}
          <main className="flex-1 overflow-y-auto p-[1rem] bg-surface-container-low">
            <div className="max-w-[1200px] mx-auto">
              <form onSubmit={handleSave}>
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
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={handleCancel} className="px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded hover:bg-surface-container transition-colors font-title-sm text-title-sm flex items-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                        Annuler
                      </button>
                      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-secondary text-on-secondary rounded hover:bg-on-secondary-fixed-variant transition-colors font-title-sm text-title-sm flex items-center gap-2 shadow-sm disabled:opacity-50">
                        <span className="material-symbols-outlined text-[18px]">{isSubmitting ? 'sync' : 'save'}</span>
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer Profil'}
                      </button>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {errorMsg}
                  </div>
                )}

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
                          <input required name="companyName" className="kamlog-input" placeholder="Ex: BOLLORÉ TRANSPORT & LOGISTICS CAMEROUN SA" type="text" value={formData.companyName} onChange={handleChange}/>
                        </div>
                        <div>
                          <label className="kamlog-label">Sigle / Acronyme</label>
                          <input name="acronym" className="kamlog-input" placeholder="Ex: BTL" type="text" value={formData.acronym} onChange={handleChange}/>
                        </div>
                        <div>
                          <label className="kamlog-label">Type d'entité *</label>
                          <select required name="entityType" className="kamlog-input" value={formData.entityType} onChange={handleChange}>
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
                                <input required name="niu" className="kamlog-input border-tertiary-container/30 focus:border-tertiary-container focus:ring-tertiary-container font-mono" placeholder="M000000000000X" type="text" value={formData.niu} onChange={handleChange}/>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-outline font-mono">Format CM</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <label className="kamlog-label">Registre du Commerce (RCCM) *</label>
                              <input required name="rccm" className="kamlog-input font-mono" placeholder="RC/DLA/20.../B/..." type="text" value={formData.rccm} onChange={handleChange}/>
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
                          <input required name="address" className="kamlog-input" placeholder="Boulevard de la République, Akwa..." type="text" value={formData.address} onChange={handleChange}/>
                        </div>
                        <div className="col-span-4">
                          <label className="kamlog-label">Boîte Postale (BP)</label>
                          <input name="poBox" className="kamlog-input" placeholder="BP 4080" type="text" value={formData.poBox} onChange={handleChange}/>
                        </div>
                        <div className="col-span-6">
                          <label className="kamlog-label">Ville *</label>
                          <select required name="city" className="kamlog-input" value={formData.city} onChange={handleChange}>
                            <option value="douala">Douala</option>
                            <option value="yaounde">Yaoundé</option>
                            <option value="kribi">Kribi</option>
                            <option value="bafoussam">Bafoussam</option>
                            <option value="garoua">Garoua</option>
                          </select>
                        </div>
                        <div className="col-span-6">
                          <label className="kamlog-label">Région *</label>
                          <select name="region" className="kamlog-input bg-surface-container-lowest" disabled value={formData.region}>
                            <option value="littoral">Littoral</option>
                          </select>
                        </div>
                        <div className="col-span-6">
                          <label className="kamlog-label">Téléphone Standard *</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 border border-r-0 border-outline-variant bg-surface-container-lowest text-on-surface-variant text-sm rounded-l">+237</span>
                            <input required name="phone" className="kamlog-input rounded-l-none" placeholder="233 XX XX XX" type="text" value={formData.phone} onChange={handleChange}/>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <label className="kamlog-label">Email Principal Entreprise *</label>
                          <input required name="email" className="kamlog-input" placeholder="contact@entreprise.cm" type="email" value={formData.email} onChange={handleChange}/>
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
                          <select required name="paymentTerms" className="kamlog-input" value={formData.paymentTerms} onChange={handleChange}>
                            <option value="">Sélectionner...</option>
                            <option value="comptant">Comptant (À la commande)</option>
                            <option value="15j">15 Jours fin de mois</option>
                            <option value="30j">30 Jours nets</option>
                            <option value="45j">45 Jours nets</option>
                          </select>
                        </div>
                        <div>
                          <label className="kamlog-label">Devise de Facturation *</label>
                          <select name="currency" className="kamlog-input" value={formData.currency} onChange={handleChange}>
                            <option value="xaf">FCFA (Franc CFA CEMAC)</option>
                          </select>
                        </div>
                        <div className="pt-2 border-t border-outline-variant mt-2">
                          <label className="kamlog-label text-error">Limite de Crédit Autorisée (FCFA)</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant font-mono">FCFA</span>
                            <input name="creditLimit" className="kamlog-input pl-12 text-right font-mono font-medium text-error focus:ring-error focus:border-error" placeholder="0" type="number" value={formData.creditLimit} onChange={handleChange}/>
                          </div>
                          <p className="text-[10px] text-on-surface-variant mt-1 leading-tight">Nécessite une approbation du DAF si &gt; 1M FCFA.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
