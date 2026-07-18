// src/app/(app)/magasin/magasins/page.tsx - Magasins (Entrepôts) Management
'use client'

import { useState, useEffect } from 'react'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { Warehouse, Search, Plus, Edit, Trash2, MapPin, Loader2 } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'
import { toast } from 'sonner'
import { magasinAPI } from '@/lib/api-client'

export default function MagasinsPage() {
  const [magasins, setMagasins] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingMagasin, setEditingMagasin] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMagasins()
  }, [])

  const fetchMagasins = async () => {
    setLoading(true)
    try {
      const res = await magasinAPI.getMagasins({
        search: searchQuery
      })
      setMagasins(res.data)
    } catch (error) {
      console.error('Error fetching magasins:', error)
      toast.error('Erreur lors du chargement des magasins')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment désactiver ce magasin ?')) return
    try {
      await magasinAPI.deleteMagasin(id)
      toast.success('Magasin désactivé avec succès')
      fetchMagasins()
    } catch (error) {
      console.error('Error deleting magasin:', error)
      toast.error('Erreur lors de la désactivation du magasin')
    }
  }

  const filteredMagasins = magasins.filter(magasin =>
    magasin.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    magasin.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    magasin.ville?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ModuleLayout module="magasin">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Warehouse className="w-8 h-8 text-blue-600" />
              Gestion des Magasins (Entrepôts)
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gérez vos entrepôts et leurs caractéristiques.</p>
          </div>
          <button
            onClick={() => { setEditingMagasin(null); setShowModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" />
            Nouveau Magasin
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher (code, nom, ville)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm outline-none bg-slate-50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Ville</th>
                <th className="px-6 py-4">Capacité (m³)</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12"><Loader2 className="h-5 w-5 animate-spin" /></td></tr>
              ) : filteredMagasins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500 font-medium">
                    Aucun magasin trouvé.
                  </td>
                </tr>
              ) : filteredMagasins.map((magasin) => (
                <tr key={magasin.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono">{magasin.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold">{magasin.nom}</span>
                  </td>
                  <td className="px-6 py-4">
                    {magasin.ville || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {magasin.capacite_max_m3?.toFixed(2) || '-'}

                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold ${magasin.actif ? 'text-green-600' : 'text-red-500'}`}>
                      {magasin.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingMagasin(magasin); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(magasin.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <MagasinModal
            magasin={editingMagasin}
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); fetchMagasins(); }}
          />
        )}
      </div>
    </ModuleLayout>
  )
}

function MagasinModal({ magasin, onClose, onSuccess }: { magasin: any, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState(magasin || {
    code: '',
    nom: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: '',
    telephone: '',
    email: '',
    capacite_max_m3: '',
    actif: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
        capacite_max_m3: formData.capacite_max_m3 ? parseFloat(formData.capacite_max_m3) : null,
        actif: formData.actif === true || formData.actif === 'true' ? true : false
      }

      const url = magasin
        ? `/api/magasin/magasins/${magasin.id}`
        : `/api/magasin/magasins`
      const method = magasin ? 'PUT' : 'POST'

      const res = await magasinAPI[magasin ? 'updateMagasin' : 'createMagasin'](
        magasin ? { id: magasin.id, ...payload } : payload
      )

      if (res.data) {
        onSuccess()
      } else {
        toast.error("Erreur lors de l'enregistrement.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'enregistrement.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-blue-600" />
            {magasin ? 'Modifier le Magasin' : 'Nouveau Magasin'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Code *</label>
              <input
                type="text"
                required
                value={formData.code || ''}
                onChange={e => setFormData({...formData, code: e.target.value})}
                placeholder="ex: MAG001"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={formData.nom || ''}
                onChange={e => setFormData({...formData, nom: e.target.value})}
                placeholder="ex: Entrepôt Principal"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Adresse *</label>
            <input
              type="text"
              required
              value={formData.adresse || ''}
              onChange={e => setFormData({...formData, adresse: e.target.value})}
              placeholder="ex: 123 Rue de l'Industrie"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Ville *</label>
              <input
                type="text"
                required
                value={formData.ville || ''}
                onChange={e => setFormData({...formData, ville: e.target.value})}
                placeholder="ex: Douala"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Code Postal</label>
              <input
                type="text"
                value={formData.code_postal || ''}
                onChange={e => setFormData({...formData, code_postal: e.target.value})}
                placeholder="ex: 12345"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Pays</label>
              <input
                type="text"
                value={formData.pays || ''}
                onChange={e => setFormData({...formData, pays: e.target.value})}
                placeholder="ex: Cameroun"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={formData.telephone || ''}
                onChange={e => setFormData({...formData, telephone: e.target.value})}
                placeholder="ex: +237 123 45 67 89"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="text"
              value={formData.email || ''}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="ex: entrepot@example.com"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Capacité maximale (m³)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.capacite_max_m3 || ''}
                onChange={e => setFormData({...formData, capacite_max_m3: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Actif</label>
              <select
                value={formData.actif ? 'true' : 'false'}
                onChange={e => setFormData({...formData, actif: e.target.value === 'true'})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}