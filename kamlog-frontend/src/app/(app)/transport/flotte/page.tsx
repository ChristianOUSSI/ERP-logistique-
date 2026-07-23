'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transportAPI } from '@/lib/api-client'
import VehiculeDocuments from '@/components/transport/VehiculeDocuments'
import HseBlockModal from '@/components/transport/HseBlockModal'
import CreateCamionModal from '@/components/transport/CreateCamionModal'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { Truck, Search, Plus, Calendar, ShieldAlert, BadgeCheck, FileWarning, ExternalLink, Link2, Unlink, FileText, CheckCircle2, Link, History } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'
import { toast } from 'sonner'
import HistoriqueCouplageModal from '@/components/transport/HistoriqueCouplageModal'

export default function FlottePage() {
  const queryClient = useQueryClient()
  const [selectedVehicule, setSelectedVehicule] = useState<any>(null)
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [showHseModal, setShowHseModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  
  // Association state
  const [showAssociateModal, setShowAssociateModal] = useState(false)
  const [associatingTractor, setAssociatingTractor] = useState<any>(null)
  const [selectedRemorqueId, setSelectedRemorqueId] = useState<string>('')

  const { data: rawCamions = [], isLoading: loading, refetch: fetchCamions } = useQuery({
    queryKey: ['camions'],
    queryFn: async () => {
      const res = await transportAPI.getCamions()
      const d = res.data
      return Array.isArray(d) ? d : (d?.items || (Array.isArray(res) ? res : []))
    }
  })
  const camions = Array.isArray(rawCamions) ? rawCamions : (rawCamions?.items || []);

  const associateMutation = useMutation({
    mutationFn: (data: { tracteurId: number, remorqueId: number | null }) => 
      transportAPI.associerRemorque(data.tracteurId, data.remorqueId),
    onSuccess: () => {
      toast.success("Association réussie !")
      queryClient.invalidateQueries({ queryKey: ['camions'] })
      setShowAssociateModal(false)
    },
    onError: () => {
      toast.error("Erreur lors de l'association")
    }
  })

  const dissociateMutation = useMutation({
    mutationFn: (tracteurId: number) => transportAPI.dissocierRemorque(tracteurId),
    onSuccess: () => {
      toast.success("Remorque déliée !")
      queryClient.invalidateQueries({ queryKey: ['camions'] })
    },
    onError: () => {
      toast.error("Erreur lors de la dissociation")
    }
  })

  const handleOpenDocs = (vehicule: any) => {
    setSelectedVehicule(vehicule)
    setShowDocsModal(true)
  }

  const handleOpenHse = (vehicule: any) => {
    setSelectedVehicule(vehicule)
    setShowHseModal(true)
  }

  const handleOpenHistory = (vehicule: any) => {
    setSelectedVehicule(vehicule)
    setShowHistoryModal(true)
  }

  const handleOpenAssociate = (tracteur: any) => {
    setAssociatingTractor(tracteur)
    setSelectedRemorqueId(tracteur.remorque_id?.toString() || '')
    setShowAssociateModal(true)
  }

  const handleAssociate = () => {
    associateMutation.mutate({
      tracteurId: associatingTractor.id,
      remorqueId: selectedRemorqueId ? parseInt(selectedRemorqueId) : null
    })
  }

  const handleDissociate = (tracteur: any) => {
    if (window.confirm("Voulez-vous vraiment délier cette remorque ?")) {
      dissociateMutation.mutate(tracteur.id)
    }
  }

  return (
    <ModuleLayout module="transport">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-600" />
              Gestion de la Flotte
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gérez vos tracteurs, remorques, documents et historique d'attelage.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Exporter
            </button>
            <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Nouveau Véhicule
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="px-6 py-4">Immatriculation</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Modèle & Marque</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Attelage (Remorque)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12"><CardSkeletonLoader /></td></tr>
              ) : camions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg font-medium">Aucun véhicule trouvé dans la flotte.</p>
                  </td>
                </tr>
              ) : camions.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {c.immatriculation_couplee && c.immatriculation_couplee !== c.immatriculation ? (
                      <div className="inline-flex items-center bg-slate-900 rounded-lg p-1 shadow-sm border border-slate-700">
                        <span className="px-2 py-1 text-white font-mono font-bold text-xs tracking-wider">{c.immatriculation_couplee.split(' / ')[0]}</span>
                        <div className="h-4 w-px bg-slate-700 mx-1"></div>
                        <span className="px-2 py-1 text-blue-400 font-mono font-bold text-xs tracking-wider">{c.immatriculation_couplee.split(' / ')[1]}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-800">{c.immatriculation}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      {c.type_materiel || c.type_vehicule}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{c.marque} {c.modele}</td>
                  <td className="px-6 py-4">
                    {c.statut === 'DISPONIBLE' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disponible
                      </span>
                    ) : c.statut === 'BLOQUE_HSE' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700">
                        <ShieldAlert className="w-3.5 h-3.5" /> Bloqué HSE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> {c.statut.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {c.type_materiel === 'TRACTEUR' ? (
                      c.remorque_id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Lié à ID: {c.remorque_id}</span>
                          <button onClick={() => handleDissociate(c)} className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Dissocier (Dételer)">
                            <Unlink className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleOpenAssociate(c)} className="text-blue-600 hover:text-white hover:bg-blue-600 text-xs font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all">
                          <Link2 className="w-3.5 h-3.5" /> Atteler Remorque
                        </button>
                      )
                    ) : (
                      <span className="text-slate-400 text-xs italic">N/A (Remorque)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenHistory(c)} title="Historique d'attelage" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <History className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleOpenDocs(c)} title="Documents de conformité" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FileText className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleOpenHse(c)} title="Bloquer HSE / Maintenance" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <ShieldAlert className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDocsModal && selectedVehicule && (
        <VehiculeDocuments vehicule={selectedVehicule} onClose={() => setShowDocsModal(false)} />
      )}
      
      {showHseModal && selectedVehicule && (
        <HseBlockModal
          vehicule={selectedVehicule}
          onClose={() => setShowHseModal(false)}
          onRefresh={fetchCamions}
        />
      )}

      {showHistoryModal && selectedVehicule && (
        <HistoriqueCouplageModal 
          vehicule={selectedVehicule} 
          onClose={() => setShowHistoryModal(false)} 
        />
      )}

      {/* Associate Modal */}
      {showAssociateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
              <Link2 className="w-6 h-6 text-blue-600" />
              Atteler une Remorque
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Choisissez la remorque à atteler au tracteur <span className="font-bold text-slate-800">{associatingTractor?.immatriculation}</span>.
            </p>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Remorques Disponibles</label>
              <select 
                value={selectedRemorqueId}
                onChange={(e) => setSelectedRemorqueId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-700 outline-none"
              >
                <option value="">-- Sélectionner une remorque --</option>
                {camions.filter(c => (c.type_materiel === 'SEMI_REMORQUE' || c.type_materiel === 'REMORQUE') && c.id !== associatingTractor?.id).map(r => (
                  <option key={r.id} value={r.id}>{r.immatriculation} ({r.marque})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => setShowAssociateModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors">
                Annuler
              </button>
              <button onClick={handleAssociate} disabled={!selectedRemorqueId} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
                Confirmer l'attelage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCamionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchCamions()
          }}
        />
      )}
    </ModuleLayout>
  )
}
