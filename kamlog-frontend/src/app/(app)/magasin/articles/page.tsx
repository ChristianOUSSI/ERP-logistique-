'use client'

import { useState, useEffect } from 'react'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { Package, Search, Plus, Edit, Trash2, Layers, HardHat } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('MARCHANDISE')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/magasin/articles', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) setArticles(await res.json())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment désactiver cet article ?')) return
    try {
      const res = await fetch(`http://localhost:8000/api/magasin/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) fetchArticles()
    } catch (error) {
      console.error(error)
    }
  }

  const filteredArticles = articles.filter(a => {
    const isAchat = a.categorie === 'EQUIPEMENT' || a.categorie === 'PIECES_DETACHEES' || a.categorie === 'MOBILIER_BUREAU_INFORMATIQUE';
    const matchType = filterType === 'ACHAT' ? isAchat : !isAchat;
    const matchSearch = a.code_article.includes(searchQuery) || a.nom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  })

  return (
    <ModuleLayout module="magasin">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              Référentiel des Articles
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gérez les codes numériques des marchandises et des achats internes.</p>
          </div>
          <button 
            onClick={() => { setEditingArticle(null); setShowModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" />
            Créer un Article
          </button>
        </div>

        {/* Tabs & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setFilterType('MARCHANDISE')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 justify-center ${filterType === 'MARCHANDISE' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Layers className="w-4 h-4" /> Marchandises Client
            </button>
            <button 
              onClick={() => setFilterType('ACHAT')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 justify-center ${filterType === 'ACHAT' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <HardHat className="w-4 h-4" /> Matériel & Achat Interne
            </button>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher (Code, Nom)..." 
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
                <th className="px-6 py-4">Code Article</th>
                <th className="px-6 py-4">Nom du produit</th>
                <th className="px-6 py-4">Unité</th>
                <th className="px-6 py-4">Dimensions</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12"><CardSkeletonLoader /></td></tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500 font-medium">
                    Aucun article trouvé dans cette catégorie.
                  </td>
                </tr>
              ) : filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-base">{article.code_article}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{article.nom}</div>
                    <div className="text-xs text-slate-500">{article.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {article.unite_mesure}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {article.poids_unitaire && <div>{article.poids_unitaire} kg/u</div>}
                    {article.volume_unitaire && <div>{article.volume_unitaire} m³/u</div>}
                    {!article.poids_unitaire && !article.volume_unitaire && '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingArticle(article); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
          <ArticleModal 
            article={editingArticle} 
            onClose={() => setShowModal(false)} 
            onSuccess={() => { setShowModal(false); fetchArticles(); }} 
            filterType={filterType}
          />
        )}
      </div>
    </ModuleLayout>
  )
}

function ArticleModal({ article, onClose, onSuccess, filterType }: { article: any, onClose: () => void, onSuccess: () => void, filterType: string }) {
  const [formData, setFormData] = useState(article || {
    code_article: '',
    nom: '',
    description: '',
    categorie: filterType === 'ACHAT' ? 'EQUIPEMENT' : 'ALIMENTAIRE',
    unite_mesure: 'KG',
    poids_unitaire: '',
    volume_unitaire: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ensure code is numeric
    if (!/^\d+$/.test(formData.code_article)) {
      alert("Le code article doit être uniquement numérique (ex: 1234567).")
      return
    }

    const payload = {
      ...formData,
      poids_unitaire: formData.poids_unitaire ? parseFloat(formData.poids_unitaire) : null,
      volume_unitaire: formData.volume_unitaire ? parseFloat(formData.volume_unitaire) : null,
    }

    try {
      const url = article ? `http://localhost:8000/api/magasin/articles/${article.id}` : `http://localhost:8000/api/magasin/articles`
      const method = article ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload)
      })
      if (res.ok) onSuccess()
      else alert("Erreur lors de l'enregistrement.")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            {article ? 'Modifier l\'Article' : 'Nouveau Code Article'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Code Article (Chiffres uniquement) *</label>
            <input 
              type="text" 
              pattern="\d+"
              required
              value={formData.code_article}
              onChange={e => setFormData({...formData, code_article: e.target.value.replace(/\D/g, '')})}
              placeholder="ex: 1234567"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nom du Produit *</label>
            <input 
              type="text" 
              required
              value={formData.nom}
              onChange={e => setFormData({...formData, nom: e.target.value})}
              placeholder="ex: Riz Bella Luna 50 Kg"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Unité de Mesure</label>
              <select 
                value={formData.unite_mesure}
                onChange={e => setFormData({...formData, unite_mesure: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="UDB">Cartons/Sacs (UDB)</option>
                <option value="KG">Kilogrammes (Kg)</option>
                <option value="LITRE">Litres</option>
                <option value="UNITE">Unité</option>
                <option value="M3">Mètre cube (M3)</option>
                <option value="TONNE">Tonne</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Catégorie</label>
              <select 
                value={formData.categorie}
                onChange={e => setFormData({...formData, categorie: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                {filterType === 'ACHAT' ? (
                  <>
                    <option value="EQUIPEMENT">Equipement</option>
                    <option value="PIECES_DETACHEES">Pièces détachées</option>
                    <option value="MOBILIER_BUREAU_INFORMATIQUE">Mobilier & Bureau</option>
                  </>
                ) : (
                  <>
                    <option value="ALIMENTAIRE">Alimentaire</option>
                    <option value="VRAC">Vrac</option>
                    <option value="PRODUITS_DANGEREUX">Produits Dangereux</option>
                    <option value="PRODUITS_FINIS">Produits Finis</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optionnel)</label>
            <input 
              type="text" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
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
