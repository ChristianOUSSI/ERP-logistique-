'use client'

import { useState, useEffect } from 'react'
import { purchaseAPI } from '@/lib/api-client'
import { useAuth } from '@/components/layout/AuthProvider'
import { FileText, Plus, Search, Calendar, Check, X, Sparkles, ShoppingBag, Loader2 } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'
import { toast } from 'sonner'

export default function PurchaseRequisitionsPage() {
  const { user } = useAuth()
  const [requisitions, setRequisitions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    priorite: 'NORMALE',
    montant_estime: '',
    devise: 'XAF',
    date_besoin: '',
    designation: '',
    quantite_demandee: '1',
    unite: 'UDB',
    prix_unitaire_estime: ''
  })

  useEffect(() => {
    fetchRequisitions()
  }, [])

  const fetchRequisitions = async () => {
    try {
      setLoading(true)
      const res = await purchaseAPI.getRequisitions()
      setRequisitions(res.data || [])
    } catch (error) {
      console.error(error)
      toast.error("Impossible de charger les fiches de besoin.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Build lines of requisition
    const lines = [
      {
        designation: formData.designation || formData.titre,
        quantite_demandee: parseInt(formData.quantite_demandee) || 1,
        unite: formData.unite,
        prix_unitaire_estime: parseFloat(formData.prix_unitaire_estime) || 0,
        montant_total_estime: (parseInt(formData.quantite_demandee) || 1) * (parseFloat(formData.prix_unitaire_estime) || 0),
        code_article: "ART-" + Math.floor(1000 + Math.random() * 9000)
      }
    ]

    const totalEst = lines.reduce((acc, curr) => acc + curr.montant_total_estime, 0)

    const payload = {
      matricule: 'PR-' + Date.now().toString().slice(-6),
      titre: formData.titre,
      description: formData.description,
      priorite: formData.priorite,
      montant_estime: totalEst || parseFloat(formData.montant_estime) || 0,
      devise: formData.devise,
      date_besoin: formData.date_besoin ? new Date(formData.date_besoin).toISOString() : null,
      lignes: lines,
      agence_id: 1 // Default agency
    }

    try {
      await purchaseAPI.createRequisition(payload)
      toast.success("Fiche de besoin créée avec succès !")
      setShowModal(false)
      fetchRequisitions()
      // Reset form
      setFormData({
        titre: '',
        description: '',
        priorite: 'NORMALE',
        montant_estime: '',
        devise: 'XAF',
        date_besoin: '',
        designation: '',
        quantite_demandee: '1',
        unite: 'UDB',
        prix_unitaire_estime: ''
      })
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.detail || "Erreur de création.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWorkflowAction = async (id: number, action: 'submit' | 'approve' | 'reject') => {
    try {
      if (action === 'submit') {
        await purchaseAPI.submitRequisition(id)
        toast.success("Fiche de besoin soumise pour approbation !")
      } else if (action === 'approve') {
        await purchaseAPI.approveRequisition(id, "Approuvé par le manager")
        toast.success("Fiche de besoin approuvée !")
      } else if (action === 'reject') {
        await purchaseAPI.rejectRequisition(id, "Rejeté - Motif à préciser")
        toast.error("Fiche de besoin rejetée.")
      }
      fetchRequisitions()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.detail || "Erreur lors du traitement.")
    }
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'CRITIQUE': return 'bg-red-100 text-red-700 border-red-200'
      case 'HAUTE': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'NORMALE': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'APPROUVEE': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'REJETEE': return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'EN_ATTENTE_APPROBATION': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'TRANSFORMEE_EN_COMMANDE': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const filteredRequisitions = requisitions.filter(r => 
    r.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.matricule.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.id - a.id)

  const isApprover = user?.roles?.some(r => ['ADMIN', 'MANAGER', 'FINANCE'].includes(r.toUpperCase()))

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-violet-600" />
            Fiches de Besoin (K-Achats)
          </h1>
          <p className="text-sm text-slate-500 mt-2">Gérez et approuvez les fiches de besoin et réquisitions d'achats.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Requisition
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par titre, matricule..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm outline-none bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="px-6 py-4">Fiche Info</th>
              <th className="px-6 py-4">Titre & Détails</th>
              <th className="px-6 py-4">Priorité</th>
              <th className="px-6 py-4">Montant Estimé</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12"><CardSkeletonLoader /></td></tr>
            ) : filteredRequisitions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-500 font-medium">
                  Aucune fiche de besoin trouvée.
                </td>
              </tr>
            ) : filteredRequisitions.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-mono font-black text-violet-600">{req.matricule}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(req.date_creation).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{req.titre}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[250px]">{req.description || 'Pas de description'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(req.priorite)}`}>
                    {req.priorite}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold font-mono text-slate-900">{parseFloat(req.montant_estime || 0).toLocaleString()} {req.devise}</div>
                  {req.lignes && req.lignes[0] && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {req.lignes[0].quantite_demandee} x {req.lignes[0].designation}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(req.statut)}`}>
                    {req.statut.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {req.statut === 'BROUILLON' && (
                      <button 
                        onClick={() => handleWorkflowAction(req.id, 'submit')}
                        className="p-1.5 hover:bg-violet-50 text-violet-600 rounded-lg transition-colors border border-violet-100 hover:border-violet-200"
                        title="Soumettre pour approbation"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    )}
                    {req.statut === 'EN_ATTENTE_APPROBATION' && isApprover && (
                      <>
                        <button 
                          onClick={() => handleWorkflowAction(req.id, 'approve')}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors border border-emerald-100 hover:border-emerald-200"
                          title="Approuver"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleWorkflowAction(req.id, 'reject')}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100 hover:border-rose-200"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-600" />
                Nouvelle Fiche de Besoin
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Titre de la Demande *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.titre}
                    onChange={e => setFormData({...formData, titre: e.target.value})}
                    placeholder="Ex: Achat consommables bureau, Réparation tracteur..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description Détaillée</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Précisez les raisons ou spécifications de la demande..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Priorité *</label>
                  <select 
                    value={formData.priorite}
                    onChange={e => setFormData({...formData, priorite: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                  >
                    <option value="BASSE">BASSE</option>
                    <option value="NORMALE">NORMALE</option>
                    <option value="HAUTE">HAUTE</option>
                    <option value="CRITIQUE">CRITIQUE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date souhaitée</label>
                  <input 
                    type="date"
                    value={formData.date_besoin}
                    onChange={e => setFormData({...formData, date_besoin: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                  />
                </div>
              </div>

              {/* Ligne d'article */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-5 h-5 text-slate-500" /> Article / Service demandé
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Désignation *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.designation}
                      onChange={e => setFormData({...formData, designation: e.target.value})}
                      placeholder="Ex: Remplacement filtre à carburant"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quantité *</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.quantite_demandee}
                      onChange={e => setFormData({...formData, quantite_demandee: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Unité</label>
                    <input 
                      type="text" 
                      value={formData.unite}
                      onChange={e => setFormData({...formData, unite: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">P.U. Estimé (XAF) *</label>
                    <input 
                      type="number" 
                      required
                      value={formData.prix_unitaire_estime}
                      onChange={e => setFormData({...formData, prix_unitaire_estime: e.target.value})}
                      placeholder="Ex: 25000"
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none bg-white text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Créer la Fiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
