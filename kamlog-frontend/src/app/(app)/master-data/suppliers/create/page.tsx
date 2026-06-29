// src/app/(app)/master-data/suppliers/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { masterDataAPI } from '@/lib/api/master-data'

export default function SupplierProfileCreate() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    raison_sociale: '',
    acronyme: '',
    type_entite: '',
    niu: '',
    rccm: '',
    id_fiscal: '',
    adresse: '',
    boite_postale: '',
    ville: '',
    region: '',
    telephone: '',
    email: '',
    conditions_paiement: '',
    devise: 'XAF',
    limite_credit_xaf: '0',
    nom_banque: '',
    compte_bancaire: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleClear = () => {
    setFormData({
      raison_sociale: '',
      acronyme: '',
      type_entite: '',
      niu: '',
      rccm: '',
      id_fiscal: '',
      adresse: '',
      boite_postale: '',
      ville: '',
      region: '',
      telephone: '',
      email: '',
      conditions_paiement: '',
      devise: 'XAF',
      limite_credit_xaf: '0',
      nom_banque: '',
      compte_bancaire: ''
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const payload: any = {
        ...formData,
        code_fournisseur: `FRN-${Date.now().toString().slice(-6)}`,
        limite_credit_xaf: parseFloat(formData.limite_credit_xaf) || 0,
        pays: 'Cameroun'
      }
      await masterDataAPI.createSupplier(payload)
      router.push('/master-data/tiers')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Une erreur est survenue lors de la création du fournisseur.')
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
        
        <div className="flex-1 flex flex-col h-screen">
          
          

          {/* Main Stage */}
          <main className="flex-1 overflow-y-auto p-[1rem] bg-surface-container-low flex flex-col gap-[1rem] max-w-[1600px] mx-auto w-full">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
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
                    <button type="button" onClick={handleClear} className="px-3 py-1.5 border border-outline-variant rounded bg-surface text-body-sm font-body-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">refresh</span> Effacer
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-secondary text-on-secondary rounded text-body-sm font-body-sm shadow-sm hover:bg-on-secondary-fixed-variant transition-colors flex items-center gap-2 disabled:opacity-50">
                      <span className="material-symbols-outlined text-[18px]">{isSubmitting ? 'sync' : 'save'}</span> {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
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
                      <label className="font-label-md font-label-md text-on-surface-variant block">Raison Sociale *</label>
                      <input 
                        required
                        name="raison_sociale"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Nom de l'entreprise"
                        type="text"
                        value={formData.raison_sociale}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Acronyme</label>
                      <input 
                        name="acronyme"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Ex: ABC SARL"
                        type="text"
                        value={formData.acronyme}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Type d'Entité</label>
                      <select 
                        name="type_entite"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        value={formData.type_entite}
                        onChange={handleChange}
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
                      <label className="font-label-md font-label-md text-on-surface-variant block">NIU *</label>
                      <input 
                        required
                        name="niu"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Numéro d'Identification Unique"
                        type="text"
                        value={formData.niu}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">RCCM</label>
                      <input 
                        name="rccm"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Registre du Commerce et des Crédits Mobiliers"
                        type="text"
                        value={formData.rccm}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">ID Fiscal</label>
                      <input 
                        name="id_fiscal"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Numéro d'identification fiscale"
                        type="text"
                        value={formData.id_fiscal}
                        onChange={handleChange}
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
                        name="adresse"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Adresse complète"
                        type="text"
                        value={formData.adresse}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Boîte Postale</label>
                      <input 
                        name="boite_postale"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="BP"
                        type="text"
                        value={formData.boite_postale}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Ville</label>
                      <input 
                        name="ville"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Ville"
                        type="text"
                        value={formData.ville}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Région</label>
                      <input 
                        name="region"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Région/Département"
                        type="text"
                        value={formData.region}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Téléphone</label>
                      <input 
                        name="telephone"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="+237 XX XX XX XX XX"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Email</label>
                      <input 
                        name="email"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="email@exemple.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="conditions_paiement"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        value={formData.conditions_paiement}
                        onChange={handleChange}
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
                        name="devise"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        value={formData.devise}
                        onChange={handleChange}
                      >
                        <option value="XAF">FCFA</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Limite de Crédit</label>
                      <input 
                        name="limite_credit_xaf"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        value={formData.limite_credit_xaf}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Nom de la Banque</label>
                      <input 
                        name="nom_banque"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Nom de la banque"
                        type="text"
                        value={formData.nom_banque}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-md font-label-md text-on-surface-variant block">Numéro de Compte Bancaire</label>
                      <input 
                        name="compte_bancaire"
                        className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-body-sm font-data-tabular focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="IBAN ou numéro de compte"
                        type="text"
                        value={formData.compte_bancaire}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </>
  )
}
