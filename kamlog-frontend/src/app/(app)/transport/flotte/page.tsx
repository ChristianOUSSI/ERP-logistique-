'use client'

import React, { useEffect, useState } from 'react'
import { transportAPI } from '@/lib/api-client'
import VehiculeDocuments from '@/components/transport/VehiculeDocuments'
import HseBlockModal from '@/components/transport/HseBlockModal'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { Truck, Link, Unlink, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react'
import { CardSkeletonLoader } from '@/components/ui/Loaders'

export default function FlottePage() {
  const [camions, setCamions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicule, setSelectedVehicule] = useState<any>(null)
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [showHseModal, setShowHseModal] = useState(false)
  
  // Association state
  const [showAssociateModal, setShowAssociateModal] = useState(false)
  const [associatingTractor, setAssociatingTractor] = useState<any>(null)
  const [selectedRemorqueId, setSelectedRemorqueId] = useState<string>('')

  const fetchCamions = async () => {
    try {
      const res = await transportAPI.getCamions()
      setCamions(res.data || [])
    } catch (err) {
      console.error("Erreur de chargement de la flotte", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCamions()
  }, [])

  const handleOpenDocs = (vehicule: any) => {
    setSelectedVehicule(vehicule)
    setShowDocsModal(true)
  }

  const handleOpenHse = (vehicule: any) => {
    setSelectedVehicule(vehicule)
    setShowHseModal(true)
  }

  const handleOpenAssociate = (tracteur: any) => {
    setAssociatingTractor(tracteur)
    setSelectedRemorqueId(tracteur.remorque_id?.toString() || '')
    setShowAssociateModal(true)
  }

  const handleAssociate = async () => {
    try {
      await transportAPI.associerRemorque(associatingTractor.id, selectedRemorqueId ? parseInt(selectedRemorqueId) : null)
      alert("Association réussie !")
      setShowAssociateModal(false)
      fetchCamions()
    } catch (error) {
      console.error(error)
      alert("Erreur lors de l'association")
    }
  }

  const handleDissociate = async (tracteur: any) => {
    if (!window.confirm("Voulez-vous vraiment délier cette remorque ?")) return
    try {
      await transportAPI.associerRemorque(tracteur.id, null)
      alert("Remorque déliée !")
      fetchCamions()
    } catch (error) {
      console.error(error)
      alert("Erreur lors de la dissociation")
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
            <p className="text-sm text-slate-500 mt-2">Gérez vos tracteurs, remorques, documents et associations matérielles.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Exporter
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all">
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
                  <td className="px-6 py-4 font-bold text-slate-800">{c.immatriculation}</td>
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
                          <span className="text-sm font-bold text-slate-700">ID: {c.remorque_id}</span>
                          <button onClick={() => handleDissociate(c)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded" title="Délier">
                            <Unlink className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleOpenAssociate(c)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                          <Link className="w-3.5 h-3.5" /> Lier
                        </button>
                      )
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
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

      {/* Associate Modal */}
      {showAssociateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Link className="w-6 h-6 text-blue-600" />
              Associer une Remorque
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Choisissez la remorque à atteler au tracteur <strong>{associatingTractor?.immatriculation}</strong>.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Remorque Disponible</label>
              <select 
                value={selectedRemorqueId}
                onChange={(e) => setSelectedRemorqueId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Aucune --</option>
                {camions.filter(c => c.type_materiel === 'SEMI_REMORQUE' || c.type_materiel === 'REMORQUE').map(r => (
                  <option key={r.id} value={r.id}>{r.immatriculation} ({r.marque})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAssociateModal(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100">
                Annuler
              </button>
              <button onClick={handleAssociate} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">
                Confirmer l'attelage
              </button>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  )
}
