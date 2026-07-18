// src/app/(app)/magasin/rapports/page.tsx - Rapports Page
'use client'

import { useState, useEffect } from 'react'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { FileText, Search, Plus, Calendar, Edit, Trash2, Loader2, ClipboardList, BarChart3, PieChart, LogOut } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'
import { toast } from 'sonner'
import { magasinAPI } from '@/lib/api-client'
import jsPDF from 'jspdf'
import 'jspdf/dist/autotable'

export default function RapportsPage() {
  const [rapports, setRapports] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingRapport, setEditingRapport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchRapports()
  }, [])

  const fetchRapports = async () => {
    setLoading(true)
    try {
      // In a real app, we might fetch a list of available reports from the backend
      // For now, we'll use a hardcoded list
      const mockRapports = [
        { id: 1, type: 'stock_valuation', name: 'Valorisation du Stock', description: 'Rapport de valorisation du stock par article et entrepôt' },
        { id: 2, type: 'mouvement_analysis', name: 'Analyse des Mouvements', description: 'Analyse des mouvements de stock sur une période donnée' },
        { id: 3, type: 'client_performance', name: 'Performance des Clients', description: 'Rapport de performance des clients/fournisseurs' },
      ]
      setRapports(mockRapports)
    } catch (error) {
      console.error('Error fetching rapports:', error)
      toast.error('Erreur lors du chargement des rapports')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async (type: string, params: any) => {
    setGenerating(true)
    try {
      let res
      switch (type) {
        case 'stock_valuation':
          res = await magasinAPI.generateStockValuationReport(params)
          break
        case 'mouvement_analysis':
          res = await magasinAPI.generateMouvementAnalysisReport(params)
          break
        case 'client_performance':
          res = await magasinAPI.generateClientPerformanceReport(params)
          break
        default:
          throw new Error('Type de rapport inconnu')
      }
      setReportData(res.data)
      toast.success('Rapport généré avec succès')
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Erreur lors de la génération du rapport')
    } finally {
      setGenerating(false)
    }
  }

  const handleExportReport = async (format: 'csv' | 'json') => {
    if (!reportData) {
      toast.error('Aucun rapport à exporter')
      return
    }
    setGenerating(true)
    try {
      let res
      if (format === 'csv') {
        res = await magasinAPI.exportReportToCSV({ data: reportData, filename: `rapport_${new Date().toISOString()}.csv` })
      } else {
        res = await magasinAPI.exportReportToJSON({ data: reportData, filename: `rapport_${new Date().toISOString()}.json` })
      }
      // In a real app, we would trigger a download
      // For now, we'll just show a success message
      toast.success(`Rapport exporté en ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Erreur lors de l\'export du rapport')
    } finally {
      setGenerating(false)
    }
  }

  const filteredRapports = rapports.filter(rapport =>
    rapport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rapport.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ModuleLayout module="magasin">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">

        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              Gestion des Rapports
            </h1>
            <p className="text-sm text-slate-500 mt-2">Générez et exportez des rapports d'activité et de performance.</p>
          </div>
          <button
            onClick={() => { setEditingRapport(null); setShowModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" />
            Nouveau Rapport
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher (nom, description)..."
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
                <th className="px-6 py-4">Nom du Rapport</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12"><CardSkeletonLoader /></td></tr>
              ) : filteredRapports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500 font-medium">
                    Aucun rapport trouvé.
                  </td>
                </tr>
              ) : filteredRapports.map((rapport) => (
                <tr key={rapport.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold">{rapport.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    {rapport.type}
                  </td>
                  <td className="px-6 py-4">
                    {rapport.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingRapport(rapport); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      {reportData && !generating && (
                        <>
                          <button onClick={() => handleExportReport('csv')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FileText className="w-4 h-4" />
                            Exporter CSV
                          </button>
                          <button onClick={() => handleExportReport('json')} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FileText className="w-4 h-4" />
                            Exporter JSON
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

        {/* Report Data Display */}
        {reportData && !generating && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-6 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Résultat du Rapport</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
                  {/* We would dynamically generate headers based on reportData */}
                  {/* For simplicity, we'll assume a structure */}
                  <tr>
                    <th className="px-6 py-4">Champ 1</th>
                    <th className="px-6 py-4">Champ 2</th>
                    <th className="px-6 py-4">Champ 3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* We would map over reportData */}
                  {/* For simplicity, we'll show a placeholder */}
                  <tr>
                    <td className="px-6 py-4">Donnée 1</td>
                    <td className="px-6 py-4">Donnée 2</td>
                    <td className="px-6 py-4">Donnée 3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showModal && (
          <RapportModal
            rapport={editingRapport}
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); fetchRapports(); }}
          />
        )}
      </div>
    </ModuleLayout>
  )
}

function RapportModal({ rapport, onClose, onSuccess }: { rapport: any, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState(rapport || {
    type: 'stock_valuation',
    name: '',
    description: '',
    date_debut: '',
    date_fin: '',
    filters: ''
  })

  const [reportType, setReportType] = useState('stock_valuation')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const params = {
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        filters: formData.filters ? JSON.parse(formData.filters) : {}
      }

      await handleGenerateReport(reportType, params)
      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la génération du rapport.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {rapport ? 'Modifier le Rapport' : 'Nouveau Rapport'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Type de Rapport *</label>
            <select
              required
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            >
              <option value="stock_valuation">Valorisation du Stock</option>
              <option value="mouvement_analysis">Analyse des Mouvements</option>
              <option value="client_performance">Performance des Clients</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nom du Rapport *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="ex: Rapport Mensuel de Stock"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="ex: Rapport de valorisation du stock pour le mois de janvier"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date de Début</label>
              <input
                type="date"
                value={formData.date_debut || ''}
                onChange={e => setFormData({...formData, date_debut: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date de Fin</label>
              <input
                type="date"
                value={formData.date_fin || ''}
                onChange={e => setFormData({...formData, date_fin: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Filtres (JSON Optionnel)</label>
            <input
              type="text"
              value={formData.filters || ''}
              onChange={e => setFormData({...formData, filters: e.target.value})}
              placeholder='ex: { "article_id": 123, "magasin_id": 456 }'
              className="w-full px-4 py-2 rounded-xl border border-slt-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm">
              Générer le Rapport
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}