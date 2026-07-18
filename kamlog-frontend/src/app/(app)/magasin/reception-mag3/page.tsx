'use client'

import React, { useState, useEffect } from 'react'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { PackageOpen, Search, ArrowRightCircle, Warehouse, Box, AlertCircle } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'
import { magasinAPI } from '@/lib/api-client'

export default function ReceptionsMultiMagasinsPage() {
  const [declarations, setDeclarations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  
  const [currentMagasin, setCurrentMagasin] = useState<any>(null)
  const [magasins, setMagasins] = useState<any[]>([])
  
  const [selectedDecl, setSelectedDecl] = useState<any>(null)

  useEffect(() => {
    fetchDeclarations()
  }, [])

  const fetchDeclarations = async () => {
    try {
      const [declRes, magRes] = await Promise.all([
        magasinAPI.getDeclarations().catch(() => ({ data: [] })),
        magasinAPI.getMagasins().catch(() => ({ data: [] }))
      ])
      setDeclarations(declRes.data || [])
      setMagasins(magRes.data || [])
      if (magRes.data && magRes.data.length > 0) {
        setCurrentMagasin(magRes.data[0])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDeclarations = declarations.filter(d => 
    d.numero_bl.includes(searchQuery) || d.code_article.includes(searchQuery)
  )

  return (
    <ModuleLayout module="magasin">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <PackageOpen className="w-8 h-8 text-blue-600" />
              Réception Multi-Magasins
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gérez les réceptions partielles et visualisez le dispatching inter-entrepôts.</p>
          </div>
          
          {/* Simulation du magasinier actif */}
          <div className="bg-slate-900 text-white p-1 rounded-xl flex items-center shadow-lg">
            {magasins.map(m => (
              <button 
                key={m.id}
                onClick={() => setCurrentMagasin(m)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentMagasin?.id === m.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {m.nom}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: List of Declarations */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher BL ou Code..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm outline-none shadow-sm"
              />
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col max-h-[600px]">
              <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-800">
                Déclarations à recevoir
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {loading ? <CardSkeletonLoader /> : filteredDeclarations.map(decl => (
                  <button 
                    key={decl.id}
                    onClick={() => setSelectedDecl(decl)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedDecl?.id === decl.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono font-black text-blue-700">{decl.numero_bl}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">{decl.statut}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <PackageOpen className="w-3.5 h-3.5 text-slate-400" /> {decl.code_article}
                    </div>
                    {decl.lignes && decl.lignes[0] && (
                      <div className="text-xs text-slate-500">
                        Qté Totale: <strong className="text-slate-700">{parseFloat(decl.lignes[0].quantite_declaree)}</strong> {decl.lignes[0].unite_mesure}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reception Details & Action */}
          <div className="lg:col-span-2">
            {selectedDecl ? (
              <ReceptionDashboard declaration={selectedDecl} currentMagasin={currentMagasin} onRefresh={fetchDeclarations} />
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400">
                <Warehouse className="w-16 h-16 mb-4 text-slate-300" />
                <p className="font-medium">Sélectionnez une déclaration pour procéder à la réception.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </ModuleLayout>
  )
}

function ReceptionDashboard({ declaration, currentMagasin, onRefresh }: { declaration: any, currentMagasin: any, onRefresh: () => void }) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [quantiteSaisie, setQuantiteSaisie] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchSummary = React.useCallback(async () => {
    try {
      const res = await magasinAPI.getDeclarationReceptionsSummary(declaration.id)
      setSummary(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [declaration.id])

  useEffect(() => {
    setLoading(true)
    fetchSummary()
  }, [fetchSummary, currentMagasin?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    const qty = parseFloat(quantiteSaisie)
    if (qty > summary.reste_a_recevoir) {
      setErrorMsg("Impossible de recevoir plus que le reste déclaré !")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        declaration_id: declaration.id,
        magasin_id: currentMagasin.id,
        statut: "COMPLETEE",
        lignes: [
          {
            article_id: declaration.lignes[0].article_id,
            quantite_recue: qty,
            unite_mesure: declaration.lignes[0].unite_mesure
          }
        ]
      }
      
      await magasinAPI.completeReception(payload)
      setQuantiteSaisie('')
      fetchSummary()
      onRefresh()
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Erreur lors de la réception")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !summary) return <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>

  const myRec = summary.receptions_par_magasin[currentMagasin.nom] || 0
  const otherRec = summary.total_recu - myRec

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Overview Stats */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 text-white/5 pointer-events-none">
          <Warehouse className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-lg text-xs font-black tracking-widest">{declaration.numero_bl}</span>
            <span className="text-slate-400 text-sm font-medium">Code Article: <strong className="text-white">{declaration.code_article}</strong></span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Déclaré (Total)</p>
              <h3 className="text-2xl font-black text-white">{summary.quantite_declaree}</h3>
            </div>
            <div className="bg-blue-500/20 rounded-2xl p-4 backdrop-blur-sm border border-blue-500/30">
              <p className="text-blue-200 text-xs font-bold uppercase mb-1">Mon Magasin ({currentMagasin.nom})</p>
              <h3 className="text-2xl font-black text-blue-100">{myRec}</h3>
            </div>
            <div className="bg-slate-800 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Autres Magasins</p>
              <h3 className="text-2xl font-black text-white">{otherRec}</h3>
            </div>
            <div className="bg-emerald-500/20 rounded-2xl p-4 backdrop-blur-sm border border-emerald-500/30">
              <p className="text-emerald-200 text-xs font-bold uppercase mb-1">Reste à Recevoir</p>
              <h3 className="text-2xl font-black text-emerald-400">{summary.reste_a_recevoir}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Reception Action */}
      {summary.reste_a_recevoir > 0 ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <ArrowRightCircle className="w-5 h-5 text-blue-600" /> Saisir une réception
          </h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Quantité réceptionnée ({declaration.lignes[0]?.unite_mesure})</label>
                <input 
                  type="number" 
                  step="0.001"
                  required
                  value={quantiteSaisie}
                  onChange={e => setQuantiteSaisie(e.target.value)}
                  placeholder={`Max: ${summary.reste_a_recevoir}`}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 outline-none text-2xl font-black text-slate-800 bg-slate-50 transition-colors"
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all mt-6 sm:mt-0"
              >
                {submitting ? 'Traitement...' : 'Valider'}
              </button>
            </div>
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {errorMsg}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <h3 className="font-black text-xl text-emerald-800 mb-2">Marchandise entièrement réceptionnée</h3>
          <p className="text-emerald-600 font-medium text-sm">Le total des réceptions à travers tous les magasins a atteint la quantité déclarée initiale ({summary.quantite_declaree}).</p>
        </div>
      )}

      {/* Break down of other magasins */}
      {Object.keys(summary.receptions_par_magasin).length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Box className="w-5 h-5 text-slate-400" /> Détail du stockage par entrepôt
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {Object.entries(summary.receptions_par_magasin).map(([nomMag, qte]) => (
              <div key={nomMag} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="font-bold text-slate-700">{nomMag}</span>
                <span className="font-black text-slate-900 bg-white px-2 py-1 rounded-md shadow-sm">{String(qte)}</span>
              </div>
            ))}
          </div>
          
          {/* History */}
          <HistoryTable declarationId={declaration.id} currentMagasinId={currentMagasin.id} refreshTrigger={summary} />
        </div>
      )}

    </div>
  )
}

function HistoryTable({ declarationId, currentMagasinId, refreshTrigger }: { declarationId: number, currentMagasinId: number, refreshTrigger: any }) {
  const [history, setHistory] = useState<any[]>([])
  
  useEffect(() => {
    magasinAPI.getDeclarationReceptionsHistory(declarationId)
      .then(res => setHistory(res.data.historique || []))
      .catch(console.error)
  }, [declarationId, refreshTrigger])

  if (history.length === 0) return null;

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <h4 className="text-sm font-bold text-slate-800 mb-4">Historique des mouvements liés à ce BL</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Date</th>
              <th className="px-4 py-2">Magasin</th>
              <th className="px-4 py-2">Quantité</th>
              <th className="px-4 py-2">Lot</th>
              <th className="px-4 py-2 rounded-tr-lg">Par</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((h, i) => (
              <tr key={i} className={h.magasin_id === currentMagasinId ? 'bg-blue-50/30' : ''}>
                <td className="px-4 py-3 text-slate-600">{new Date(h.date_reception).toLocaleString()}</td>
                <td className="px-4 py-3 font-bold text-slate-800">{h.magasin_nom}</td>
                <td className="px-4 py-3 font-black text-slate-900">{h.quantite_recue} <span className="text-xs text-slate-400">{h.unite_mesure}</span></td>
                <td className="px-4 py-3 text-slate-500">{h.numero_lot || '-'}</td>
                <td className="px-4 py-3 text-slate-600 text-xs">{h.recu_par}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
