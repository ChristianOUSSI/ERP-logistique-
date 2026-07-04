'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { tiersAPI } from '@/lib/api-client'
import { masterDataAPI } from '@/lib/api/master-data'
import type { Tier } from '@/lib/api/master-data'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Building2, Users, Briefcase, Handshake, CreditCard, X, AlertCircle, CheckCircle } from 'lucide-react'

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
    type: 'client' as 'client' | 'supplier' | 'partner',
    email: '',
    telephone: '',
    ville: '',
    region: '',
    limite_credit_xaf: 0,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await masterDataAPI.createTier({
        code_tiers: `T-${Date.now().toString().slice(-6)}`,
        raison_sociale: form.raison_sociale,
        email: form.email,
        telephone: form.telephone,
        ville: form.ville,
        pays: 'Cameroun',
        autorise_transport: true,
        autorise_transit: true,
        autorise_acconage: true,
        autorise_magasinage: true,
        limite_credit_xaf: form.limite_credit_xaf,
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onCreated()
        onClose()
        // Reset form
        setForm({ raison_sociale: '', type: 'client', email: '', telephone: '', ville: '', region: '', limite_credit_xaf: 0 })
      }, 1200)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors de la création du tier.')
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Raison Sociale *</label>
              <input
                required
                type="text"
                value={form.raison_sociale}
                onChange={(e) => setForm({ ...form, raison_sociale: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                placeholder="Nom de l'entreprise"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type *</label>
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Limite Crédit (FCFA)</label>
                <input
                  type="number"
                  value={form.limite_credit_xaf}
                  onChange={(e) => setForm({ ...form, limite_credit_xaf: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="contact@entreprise.cm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ville</label>
                <input
                  type="text"
                  value={form.ville}
                  onChange={(e) => setForm({ ...form, ville: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="Douala"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Région</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
                  placeholder="Littoral"
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

// ── Page principale ─────────────────────────────────────────────────────────────
export default function MasterDataTiers() {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

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

  // ── KPI computations ──────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const clients = tiers.filter((t) => String(t.type).toLowerCase() === 'client').length
    const fournisseurs = tiers.filter((t) => String(t.type).toLowerCase() === 'supplier' || String(t.type).toLowerCase() === 'fournisseur').length
    const partenaires = tiers.filter((t) => String(t.type).toLowerCase() === 'partner' || String(t.type).toLowerCase() === 'partenaire').length
    const totalCredit = tiers.reduce((sum, t) => sum + (t.creditLimit || 0), 0)
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
      key: 'name',
      label: 'Tier',
      render: (val: any, row: Tier) => (
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
        const typeStr = String(val).toLowerCase();
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
            {val ? String(val).charAt(0).toUpperCase() + String(val).slice(1) : 'N/A'}
          </span>
        )
      }
    },
    {
      key: 'city',
      label: 'Localisation',
      render: (val: any, row: Tier) => (
        <div className="text-sm text-slate-600">
          {val ? `${val}, ${row.region || ''}` : 'Non renseigné'}
        </div>
      )
    },
    {
      key: 'creditLimit',
      label: 'Crédit Max',
      render: (val: any) => (
        <div className="text-sm font-medium text-slate-900">
          {val ? `${val.toLocaleString()} FCFA` : '-'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Actif
        </span>
      )
    }
  ]

  return (
    <>
      <GenericDataPage
        title="Tiers (Partenaires)"
        description="Gestion centralisée des clients, fournisseurs et partenaires d'affaires."
        icon={<Building2 className="w-6 h-6 text-emerald-600" />}
        columns={columns}
        data={tiers}
        isLoading={loading}
        onAdd={() => setModalOpen(true)}
        primaryActionLabel="Nouveau Tier"
        kpiCards={kpiCards}
        onEdit={(row) => console.log('Edit tier:', row)}
        onDelete={(row) => console.log('Delete tier:', row)}
      />
      <CreateTierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchTiers}
      />
    </>
  )
}
