'use client'

import { useState, useEffect } from 'react'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { FileText, Search, Plus, Calendar, Edit, Ship, PackageSearch, Package } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'
import { transportAPI } from '@/lib/api-client' // Assuming we can use general fetch if needed

export default function DeclarationsPage() {
  const [declarations, setDeclarations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeclarations()
  }, [])

  const fetchDeclarations = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/magasin/declarations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) setDeclarations(await res.json())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDeclarations = declarations.filter(d => 
    d.numero_bl.includes(searchQuery) || 
    d.code_article.includes(searchQuery) ||
    d.client?.nom.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.id - a.id)

  return (
    <ModuleLayout module="magasin">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Ship className="w-8 h-8 text-blue-600" />
              Déclarations Marchandises
            </h1>
            <p className="text-sm text-slate-500 mt-2">Déclarez les marchandises arrivées au port avant stockage.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Déclaration
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher (BL, Code Article, Client)..." 
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
                <th className="px-6 py-4">BL & Navire</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Marchandise Déclarée</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12"><CardSkeletonLoader /></td></tr>
              ) : filteredDeclarations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500 font-medium">
                    Aucune déclaration trouvée.
                  </td>
                </tr>
              ) : filteredDeclarations.map((decl) => (
                <tr key={decl.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-black text-blue-600">{decl.numero_bl}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(decl.date_declaration).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{decl.client?.nom} {decl.client?.prenom}</div>
                    <div className="text-xs text-slate-500">{decl.client?.raison_sociale}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">
                          Code: <span className="text-blue-600 font-mono">{decl.code_article}</span>
                        </div>
                        {decl.lignes && decl.lignes[0] && (
                          <div className="text-sm font-medium text-slate-600 mt-1">
                            Qté totale : <strong className="text-slate-900">{parseFloat(decl.lignes[0].quantite_declaree)} {decl.lignes[0].unite_mesure}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      decl.statut === 'VALIDEE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {decl.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <DeclarationModal 
            onClose={() => setShowModal(false)} 
            onSuccess={() => { setShowModal(false); fetchDeclarations(); }} 
          />
        )}
      </div>
    </ModuleLayout>
  )
}

function DeclarationModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    numero_bl: '',
    client_id: '',
    code_article: '',
    quantite_declaree: ''
  })
  
  const [clients, setClients] = useState<any[]>([])
  const [articleInfo, setArticleInfo] = useState<any>(null)
  const [articleError, setArticleError] = useState('')

  useEffect(() => {
    // Fetch clients
    fetch('http://localhost:8000/api/magasin/clients', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(setClients).catch(console.error)
  }, [])

  // Auto-fill product info based on code_article
  useEffect(() => {
    if (formData.code_article.length === 7) {
      fetch(`http://localhost:8000/api/magasin/articles/by-code/${formData.code_article}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(async r => {
        if (!r.ok) throw new Error("Article introuvable")
        return r.json()
      })
      .then(data => {
        setArticleInfo(data)
        setArticleError('')
      })
      .catch(e => {
        setArticleInfo(null)
        setArticleError(e.message)
      })
    } else {
      setArticleInfo(null)
      setArticleError('')
    }
  }, [formData.code_article])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!articleInfo) {
      alert("Code article invalide.")
      return
    }

    const payload = {
      client_id: parseInt(formData.client_id),
      numero_bl: formData.numero_bl,
      code_article: formData.code_article,
      statut: "VALIDEE",
      lignes: [
        {
          article_id: articleInfo.id,
          quantite_declaree: parseFloat(formData.quantite_declaree),
          unite_mesure: articleInfo.unite_mesure
        }
      ]
    }

    try {
      const res = await fetch(`http://localhost:8000/api/magasin/declarations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) onSuccess()
      else {
        const errorData = await res.json()
        alert(`Erreur: ${errorData.detail || "Erreur inconnue"}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Nouvelle Déclaration
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Numéro BL *</label>
              <input 
                type="text" 
                required
                value={formData.numero_bl}
                onChange={e => setFormData({...formData, numero_bl: e.target.value})}
                placeholder="Ex: BL-2026-001"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Client *</label>
              <select 
                required
                value={formData.client_id}
                onChange={e => setFormData({...formData, client_id: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="">Sélectionner un client...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
              <PackageSearch className="w-5 h-5 text-slate-500" /> Marchandise (Auto-remplissage)
            </h3>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Code Article (7 chiffres) *</label>
              <input 
                type="text" 
                required
                pattern="\d{7}"
                maxLength={7}
                value={formData.code_article}
                onChange={e => setFormData({...formData, code_article: e.target.value.replace(/\D/g, '')})}
                placeholder="Saisissez le code numérique..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-lg bg-white"
              />
              {articleError && <p className="text-red-500 text-xs mt-1 font-bold">{articleError}</p>}
            </div>

            {/* Auto-filled Product Name */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 min-h-[60px] flex items-center">
              {articleInfo ? (
                <div className="flex flex-col">
                  <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Produit trouvé</span>
                  <span className="text-lg font-black text-slate-900">{articleInfo.nom}</span>
                </div>
              ) : (
                <span className="text-slate-400 text-sm italic">Le nom du produit s'affichera ici automatiquement...</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Quantité Totale 
                {articleInfo && <span className="text-blue-600 ml-1">(en {articleInfo.unite_mesure})</span>} *
              </label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  step="0.001"
                  required
                  disabled={!articleInfo}
                  value={formData.quantite_declaree}
                  onChange={e => setFormData({...formData, quantite_declaree: e.target.value})}
                  placeholder="Ex: 500"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400 text-lg font-bold"
                />
                {articleInfo && (
                  <div className="flex items-center px-4 bg-slate-200 text-slate-700 font-bold rounded-xl">
                    {articleInfo.unite_mesure}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
            <button 
              type="submit" 
              disabled={!articleInfo}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer la Déclaration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
