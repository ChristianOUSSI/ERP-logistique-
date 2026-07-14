'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { tiersAPI, financeAPI } from '@/lib/api-client'
import type { Tier } from '@/types/master-data'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Building2, Users, Briefcase, Handshake, CreditCard, X, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

// ── KPI Card component ─────────────────────────────────────────────────────────
function KpiCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-all`}>
      <div className={`absolute right-0 top-0 w-20 h-20 ${color} rounded-bl-full -z-0 opacity-50 transition-transform group-hover:scale-110`} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  )
}

// ── Modal de création ───────────────────────────────────────────────────────────
function CreateTierModal({ isOpen, onClose, onCreated }: { isOpen: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    raison_sociale: '',
    sigle_ou_enseigne: '',
    type: 'client' as 'client' | 'supplier' | 'partner',
    niu: '',
    rccm: '',
    registre_commerce: '',
    regime_fiscal: 'Réel - Grandes Entreprises',
    email: '',
    telephone: '',
    adresse_physique: '',
    ville: 'Douala',
    pays: 'Cameroun',
    autorise_acconage: false,
    autorise_transit: false,
    autorise_parc_stockage: false,
    autorise_manutention: false,
    autorise_transport: false,
    compte_collectif_syscohada: '411100',
    limite_credit_maximum: 0,
    delai_paiement_jours: 30,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await tiersAPI.createTiers({
        raison_sociale: form.raison_sociale,
        sigle_ou_enseigne: form.sigle_ou_enseigne || null,
        niu: form.niu || `NIU-${Date.now().toString().slice(-6)}`,
        rccm: form.rccm || null,
        registre_commerce: form.registre_commerce || null,
        regime_fiscal: form.regime_fiscal,
        email: form.email || null,
        telephone: form.telephone || null,
        adresse_physique: form.adresse_physique,
        adresse: form.adresse_physique, // compatibilité
        ville: form.ville,
        pays: form.pays,
        autorise_acconage: form.autorise_acconage,
        autorise_transit: form.autorise_transit,
        autorise_parc_stockage: form.autorise_parc_stockage,
        autorise_manutention: form.autorise_manutention,
        autorise_transport: form.autorise_transport,
        autorise_magasinage: form.autorise_parc_stockage, // compatibilité
        compte_collectif_syscohada: form.compte_collectif_syscohada,
        compte_syscohada: form.compte_collectif_syscohada, // compatibilité
        limite_credit_maximum: form.limite_credit_maximum,
        limite_credit_xaf: form.limite_credit_maximum, // compatibilité
        delai_paiement_jours: form.delai_paiement_jours,
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onCreated()
        onClose()
        // Reset form
        setForm({
          raison_sociale: '',
          sigle_ou_enseigne: '',
          type: 'client',
          niu: '',
          rccm: '',
          registre_commerce: '',
          regime_fiscal: 'Réel - Grandes Entreprises',
          email: '',
          telephone: '',
          adresse_physique: '',
          ville: 'Douala',
          pays: 'Cameroun',
          autorise_acconage: false,
          autorise_transit: false,
          autorise_parc_stockage: false,
          autorise_manutention: false,
          autorise_transport: false,
          compte_collectif_syscohada: '411100',
          limite_credit_maximum: 0,
          delai_paiement_jours: 30,
        })
      }, 1200)
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        const messages = detail.map((e: any) => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(', ');
        setError(`Erreur de validation : ${messages}`);
      } else {
        setError(detail || 'Erreur lors de la création du tier.');
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Nouveau Tier</h3>
                <p className="text-sm text-gray-500">Ajouter un partenaire d&apos;affaires</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Tier créé avec succès !
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Raison Sociale *</label>
                <input
                  type="text"
                  required
                  value={form.raison_sociale}
                  onChange={(e) => setForm({ ...form, raison_sociale: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="Ex: SABC Cameroun"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Sigle / Enseigne</label>
                <input
                  type="text"
                  value={form.sigle_ou_enseigne}
                  onChange={(e) => setForm({ ...form, sigle_ou_enseigne: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="Ex: SABC"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Numéro Identifiant Unique (NIU) *</label>
                <input
                  type="text"
                  required
                  value={form.niu}
                  onChange={(e) => setForm({ ...form, niu: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="Obligatoire (Cameroun)"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Registre Commerce (RCCM)</label>
                <input
                  type="text"
                  value={form.rccm}
                  onChange={(e) => setForm({ ...form, rccm: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="Ex: RC/DLA/2026/B/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Régime Fiscal</label>
                <input
                  type="text"
                  value={form.regime_fiscal}
                  onChange={(e) => setForm({ ...form, regime_fiscal: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as 'client' | 'supplier' | 'partner' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm bg-white"
                >
                  <option value="client">Client</option>
                  <option value="supplier">Fournisseur</option>
                  <option value="partner">Partenaire</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="contact@entreprise.cm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Adresse Physique</label>
              <textarea
                value={form.adresse_physique}
                onChange={(e) => setForm({ ...form, adresse_physique: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm h-16"
                placeholder="Adresse du siège social..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={form.ville}
                  onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pays</label>
                <input
                  type="text"
                  value={form.pays}
                  onChange={(e) => setForm({ ...form, pays: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Services Activés (Booleans) */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Services à la Carte (Habilitations)</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_acconage}
                    onChange={(e) => setForm({ ...form, autorise_acconage: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Acconage
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_transit}
                    onChange={(e) => setForm({ ...form, autorise_transit: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Transit (Douane)
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_parc_stockage}
                    onChange={(e) => setForm({ ...form, autorise_parc_stockage: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Parc & Stockage
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_manutention}
                    onChange={(e) => setForm({ ...form, autorise_manutention: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Manutention
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_transport}
                    onChange={(e) => setForm({ ...form, autorise_transport: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Transport Routier
                </label>
              </div>
            </div>

            {/* Paramètres Financiers */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Paramètres SAP FI & Crédit</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Compte Collectif SYSCOHADA</label>
                  <input
                    type="text"
                    value={form.compte_collectif_syscohada}
                    onChange={(e) => setForm({ ...form, compte_collectif_syscohada: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Délai Paiement (Jours)</label>
                  <input
                    type="number"
                    value={form.delai_paiement_jours}
                    onChange={(e) => setForm({ ...form, delai_paiement_jours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Limite de Crédit Maximum (FCFA)</label>
                <input
                  type="number"
                  value={form.limite_credit_maximum}
                  onChange={(e) => setForm({ ...form, limite_credit_maximum: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-mono"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Création...' : 'Créer le Tier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ── Modal de modification ───────────────────────────────────────────────────────
function EditTierModal({ isOpen, onClose, onUpdated, tier }: { isOpen: boolean; onClose: () => void; onUpdated: () => void; tier: any }) {
  const [form, setForm] = useState({
    raison_sociale: '',
    sigle_ou_enseigne: '',
    niu: '',
    rccm: '',
    registre_commerce: '',
    regime_fiscal: 'Réel - Grandes Entreprises',
    email: '',
    telephone: '',
    adresse_physique: '',
    ville: 'Douala',
    pays: 'Cameroun',
    autorise_acconage: false,
    autorise_transit: false,
    autorise_parc_stockage: false,
    autorise_manutention: false,
    autorise_transport: false,
    compte_collectif_syscohada: '411100',
    limite_credit_maximum: 0,
    delai_paiement_jours: 30,
    statut: 'ACTIF',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (tier && isOpen) {
      setForm({
        raison_sociale: tier.raison_sociale || '',
        sigle_ou_enseigne: tier.sigle_ou_enseigne || '',
        niu: tier.niu || '',
        rccm: tier.rccm || '',
        registre_commerce: tier.registre_commerce || '',
        regime_fiscal: tier.regime_fiscal || 'Réel - Grandes Entreprises',
        email: tier.email || '',
        telephone: tier.telephone || '',
        adresse_physique: tier.adresse_physique || tier.adresse || '',
        ville: tier.ville || 'Douala',
        pays: tier.pays || 'Cameroun',
        autorise_acconage: !!tier.autorise_acconage,
        autorise_transit: !!tier.autorise_transit,
        autorise_parc_stockage: !!tier.autorise_parc_stockage || !!tier.autorise_magasinage,
        autorise_manutention: !!tier.autorise_manutention,
        autorise_transport: !!tier.autorise_transport,
        compte_collectif_syscohada: tier.compte_collectif_syscohada || '411100',
        limite_credit_maximum: Number(tier.limite_credit_maximum || tier.limite_credit_xaf || 0),
        delai_paiement_jours: Number(tier.delai_paiement_jours || 30),
        statut: tier.statut || 'ACTIF',
      })
    }
  }, [tier, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await tiersAPI.updateTiers(tier.id, {
        raison_sociale: form.raison_sociale,
        sigle_ou_enseigne: form.sigle_ou_enseigne || null,
        niu: form.niu,
        rccm: form.rccm || null,
        registre_commerce: form.registre_commerce || null,
        regime_fiscal: form.regime_fiscal,
        email: form.email || null,
        telephone: form.telephone || null,
        adresse_physique: form.adresse_physique,
        adresse: form.adresse_physique, // compatibilité
        ville: form.ville,
        pays: form.pays,
        autorise_acconage: form.autorise_acconage,
        autorise_transit: form.autorise_transit,
        autorise_parc_stockage: form.autorise_parc_stockage,
        autorise_manutention: form.autorise_manutention,
        autorise_transport: form.autorise_transport,
        autorise_magasinage: form.autorise_parc_stockage, // compatibilité
        compte_collectif_syscohada: form.compte_collectif_syscohada,
        compte_syscohada: form.compte_collectif_syscohada, // compatibilité
        limite_credit_maximum: form.limite_credit_maximum,
        limite_credit_xaf: form.limite_credit_maximum, // compatibilité
        delai_paiement_jours: form.delai_paiement_jours,
        statut: form.statut,
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onUpdated()
        onClose()
      }, 1200)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors de la modification du tier.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen || !tier) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Modifier le Tier</h3>
                <p className="text-sm text-gray-500">Mettre à jour le profil de {tier.raison_sociale}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Modifications enregistrées !
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Raison Sociale *</label>
                <input
                  type="text"
                  required
                  value={form.raison_sociale}
                  onChange={(e) => setForm({ ...form, raison_sociale: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Sigle / Enseigne</label>
                <input
                  type="text"
                  value={form.sigle_ou_enseigne}
                  onChange={(e) => setForm({ ...form, sigle_ou_enseigne: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Numéro Identifiant Unique (NIU) *</label>
                <input
                  type="text"
                  required
                  value={form.niu}
                  onChange={(e) => setForm({ ...form, niu: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Registre Commerce (RCCM)</label>
                <input
                  type="text"
                  value={form.rccm}
                  onChange={(e) => setForm({ ...form, rccm: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Régime Fiscal</label>
                <input
                  type="text"
                  value={form.regime_fiscal}
                  onChange={(e) => setForm({ ...form, regime_fiscal: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Statut Compte *</label>
                <select
                  value={form.statut}
                  onChange={(e) => setForm({ ...form, statut: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm bg-white"
                >
                  <option value="EN_ATTENTE_VALIDATION">En attente validation</option>
                  <option value="ACTIF">Actif</option>
                  <option value="BLOQUE">Bloqué</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Adresse Physique</label>
              <textarea
                value={form.adresse_physique}
                onChange={(e) => setForm({ ...form, adresse_physique: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm h-16"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={form.ville}
                  onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pays</label>
                <input
                  type="text"
                  value={form.pays}
                  onChange={(e) => setForm({ ...form, pays: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Services Activés (Booleans) */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Services à la Carte (Habilitations)</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_acconage}
                    onChange={(e) => setForm({ ...form, autorise_acconage: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Acconage
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_transit}
                    onChange={(e) => setForm({ ...form, autorise_transit: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Transit (Douane)
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_parc_stockage}
                    onChange={(e) => setForm({ ...form, autorise_parc_stockage: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Parc & Stockage
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_manutention}
                    onChange={(e) => setForm({ ...form, autorise_manutention: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Manutention
                </label>
                <label className="flex items-center gap-2.5 p-2.5 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition-colors cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.autorise_transport}
                    onChange={(e) => setForm({ ...form, autorise_transport: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  Transport Routier
                </label>
              </div>
            </div>

            {/* Paramètres Financiers */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Paramètres SAP FI & Crédit</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Compte Collectif SYSCOHADA</label>
                  <input
                    type="text"
                    value={form.compte_collectif_syscohada}
                    onChange={(e) => setForm({ ...form, compte_collectif_syscohada: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Délai de Paiement (Jours)</label>
                  <input
                    type="number"
                    value={form.delai_paiement_jours}
                    onChange={(e) => setForm({ ...form, delai_paiement_jours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Limite de Crédit Maximum (FCFA)</label>
                <input
                  type="number"
                  value={form.limite_credit_maximum}
                  onChange={(e) => setForm({ ...form, limite_credit_maximum: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-mono"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ── Modal de visualisation & encours financier ─────────────────────────────────────
function ViewTierModal({ isOpen, onClose, tier }: { isOpen: boolean; onClose: () => void; tier: any }) {
  const [encoursData, setEncoursData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && tier) {
      setLoading(true)
      financeAPI.getEncours(tier.id)
        .then((res) => {
          setEncoursData(res.data)
        })
        .catch((err) => {
          console.error("Error loading credit balance:", err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setEncoursData(null)
    }
  }, [tier, isOpen])

  if (!isOpen || !tier) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{tier.raison_sociale}</h3>
                <p className="text-sm text-gray-500">Profil & Infos Financières du Tier</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Infos de base */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Code Tier</span>
                <span className="text-sm text-slate-800 font-semibold">{tier.code_tiers}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Type</span>
                <span className="text-sm text-slate-800 font-semibold capitalize">{tier.type || 'Client'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">NIU (Fiscal)</span>
                <span className="text-sm text-slate-800 font-medium">{tier.niu || ''}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Régime Fiscal</span>
                <span className="text-sm text-slate-800 font-medium">{tier.regime_fiscal || 'Réel'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Téléphone</span>
                <span className="text-sm text-slate-800 font-medium">{tier.telephone || ''}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                <span className="text-sm text-slate-800 font-medium break-all">{tier.email || ''}</span>
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adresse & Localisation</h4>
              <p className="text-sm text-slate-700">{tier.adresse_physique || tier.adresse || 'Aucune adresse enregistrée'}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div>Ville : <strong>{tier.ville || 'Douala'}</strong></div>
                <div>Pays : <strong>{tier.pays || 'Cameroun'}</strong></div>
              </div>
            </div>

            {/* Services Activés */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Services Activés</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Acconage', active: tier.autorise_acconage },
                  { label: 'Transit', active: tier.autorise_transit },
                  { label: 'Parc / Stockage', active: tier.autorise_parc_stockage || tier.autorise_magasinage },
                  { label: 'Manutention', active: tier.autorise_manutention },
                  { label: 'Transport', active: tier.autorise_transport },
                ].map((srv) => (
                  <div key={srv.label} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-white shadow-sm text-sm">
                    <span className={`w-2.5 h-2.5 rounded-full ${srv.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`}></span>
                    <span className={srv.active ? 'text-slate-800 font-medium' : 'text-slate-400 line-through'}>{srv.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Volet Financier */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Limite & Encours Financier
              </h4>

              {loading ? (
                <div className="h-20 flex items-center justify-center text-sm text-slate-500">
                  Chargement de l'encours...
                </div>
              ) : encoursData ? (
                <div className="space-y-3 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500 block">Limite de crédit</span>
                      <strong className="text-slate-800 font-mono text-base">{(encoursData.limite_credit_xaf || 0).toLocaleString()} FCFA</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Encours actuel</span>
                      <strong className="text-slate-800 font-mono text-base">{(encoursData.encours_xaf || 0).toLocaleString()} FCFA</strong>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {encoursData.limite_credit_xaf > 0 && (
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            encoursData.bloque ? 'bg-red-500' : encoursData.alerte ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(encoursData.taux_occupation || 0, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-mono">
                        <span>{Math.round(encoursData.taux_occupation || 0)}% utilisé</span>
                        <span>Délai de paiement : {tier.delai_paiement_jours || 30} jours</span>
                      </div>
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="flex gap-2 pt-1">
                    {encoursData.bloque ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Compte Bloqué (Limite Dépassée)
                      </span>
                    ) : encoursData.alerte ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Alerte Encours Élevé (&gt;90%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Compte Sain
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                  <div className="flex justify-between font-mono">
                    <span>Limite de crédit :</span>
                    <strong>{Number(tier.limite_credit_maximum || tier.limite_credit_xaf || 0).toLocaleString()} FCFA</strong>
                  </div>
                  <div className="flex justify-between font-mono mt-1">
                    <span>Délai de paiement :</span>
                    <strong>{tier.delai_paiement_jours || 30} jours</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 flex gap-3">
            <button
              onClick={onClose}
              className="w-full px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Page principale ─────────────────────────────────────────────────────────────
export default function MasterDataTiers() {
  const [tiers, setTiers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<any>(null)

  const fetchTiers = useCallback(async () => {
    try {
      const res = await tiersAPI.getTiers()
      setTiers(res.data || [])
    } catch (err) {
      console.error('Error fetching tiers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTiers()
  }, [fetchTiers])

  const handleEditTier = (row: any) => {
    setSelectedTier(row)
    setEditModalOpen(true)
  }

  const handleViewTier = (row: any) => {
    setSelectedTier(row)
    setViewModalOpen(true)
  }

  const handleDeleteTier = async (row: any) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le tier "${row.raison_sociale}" ?`)) {
      try {
        await tiersAPI.deleteTiers(row.id)
        fetchTiers()
      } catch (err) {
        console.error('Error deleting tier:', err)
        toast.error('Erreur lors de la suppression du tier.')
      }
    }
  }

  // ── KPI computations ──────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const clients = tiers.filter((t) => String(t.type || 'client').toLowerCase() === 'client').length
    const fournisseurs = tiers.filter((t) => String(t.type || 'supplier').toLowerCase() === 'supplier' || String(t.type || '').toLowerCase() === 'fournisseur').length
    const partenaires = tiers.filter((t) => String(t.type || 'partner').toLowerCase() === 'partner' || String(t.type || '').toLowerCase() === 'partenaire').length
    const totalCredit = tiers.reduce((sum, t) => sum + Number(t.limite_credit_maximum || t.limite_credit_xaf || 0), 0)
    return { total: tiers.length, clients, fournisseurs, partenaires, totalCredit }
  }, [tiers])

  const kpiCards = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiCard label="Total Tiers" value={kpis.total} icon={<Users className="w-4 h-4 text-blue-600" />} color="bg-blue-50" />
      <KpiCard label="Clients" value={kpis.clients} icon={<Briefcase className="w-4 h-4 text-emerald-600" />} color="bg-emerald-50" />
      <KpiCard label="Fournisseurs" value={kpis.fournisseurs} icon={<Handshake className="w-4 h-4 text-amber-600" />} color="bg-amber-50" />
      <KpiCard label="Crédit Total" value={`${kpis.totalCredit.toLocaleString()} FCFA`} icon={<CreditCard className="w-4 h-4 text-purple-600" />} color="bg-purple-50" />
    </div>
  )

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (val: any) => (
        <span className="font-mono text-xs px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">
          C-{String(val).padStart(4, '0')}
        </span>
      ),
    },
    {
      key: 'raison_sociale',
      label: 'Tier',
      render: (val: any, row: any) => (
        <div>
          <div className="font-semibold text-slate-900">{val || 'Sans nom'}</div>
          <div className="text-xs text-slate-500">{row.email || 'Aucun email'}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Catégorie',
      render: (val: any) => {
        const typeStr = String(val || 'client').toLowerCase();
        const colors: Record<string, string> = {
          client: 'bg-blue-50 text-blue-700 ring-blue-600/20',
          supplier: 'bg-amber-50 text-amber-700 ring-amber-600/20',
          fournisseur: 'bg-amber-50 text-amber-700 ring-amber-600/20',
          partner: 'bg-purple-50 text-purple-700 ring-purple-600/20',
          partenaire: 'bg-purple-50 text-purple-700 ring-purple-600/20',
        }
        const style = colors[typeStr] || 'bg-slate-50 text-slate-700 ring-slate-600/20'
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style}`}>
            {val ? String(val).charAt(0).toUpperCase() + String(val).slice(1) : 'Client'}
          </span>
        )
      }
    },
    {
      key: 'ville',
      label: 'Localisation',
      render: (val: any, row: any) => (
        <div className="text-sm text-slate-600">
          {val ? `${val}, ${row.pays || 'Cameroun'}` : 'Douala, Cameroun'}
        </div>
      )
    },
    {
      key: 'limite_credit_maximum',
      label: 'Crédit Max',
      render: (val: any, row: any) => {
        const numVal = Number(val || row.limite_credit_xaf || 0)
        return (
          <div className="text-sm font-medium text-slate-900 font-mono">
            {numVal > 0 ? `${numVal.toLocaleString()} XAF` : '-'}
          </div>
        )
      }
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (val: any) => {
        const isActif = String(val).toUpperCase() === 'ACTIF'
        const isBloque = String(val).toUpperCase() === 'BLOQUE'
        const badgeColor = isActif 
          ? 'bg-emerald-50 text-emerald-700' 
          : isBloque 
            ? 'bg-red-50 text-red-700' 
            : 'bg-amber-50 text-amber-700'
        const dotColor = isActif 
          ? 'bg-emerald-600' 
          : isBloque 
            ? 'bg-red-600' 
            : 'bg-amber-500'
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span> 
            {val ? String(val).replace(/_/g, ' ') : 'ACTIF'}
          </span>
        )
      }
    }
  ]

  return (
    <>
      <GenericDataPage
        title="Tiers (Partenaires)"
        description="Gestion centralisée des clients, fournisseurs et partenaires d'affaires avec habilitation de services et limites de crédit."
        icon={<Building2 className="w-6 h-6 text-emerald-600" />}
        columns={columns}
        data={tiers}
        isLoading={loading}
        onAdd={() => setCreateModalOpen(true)}
        primaryActionLabel="Nouveau Tier"
        kpiCards={kpiCards}
        onView={handleViewTier}
        onEdit={handleEditTier}
        onDelete={handleDeleteTier}
      />
      <CreateTierModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={fetchTiers}
      />
      <EditTierModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedTier(null)
        }}
        onUpdated={fetchTiers}
        tier={selectedTier}
      />
      <ViewTierModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedTier(null)
        }}
        tier={selectedTier}
      />
    </>
  )
}
