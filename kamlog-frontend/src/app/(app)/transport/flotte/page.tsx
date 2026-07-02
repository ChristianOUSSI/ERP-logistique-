'use client'

import { useEffect, useState } from 'react'
import { transportAPI } from '@/lib/api-client'
import VehiculeDocuments from '@/components/transport/VehiculeDocuments'
import HseBlockModal from '@/components/transport/HseBlockModal'

export default function FlottePage() {
  const [camions, setCamions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicule, setSelectedVehicule] = useState<any>(null)
  const [showDocsModal, setShowDocsModal] = useState(false)
  const [showHseModal, setShowHseModal] = useState(false)

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

  return (
    <div className="flex-1 overflow-y-auto p-container-margin bg-background flex flex-col">
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-1">Gestion de la Flotte</h2>
          <p className="text-secondary font-body-base">Tracteurs, Remorques et Conformité</p>
        </div>
        <button className="module-bg px-4 py-2 rounded-DEFAULT font-title-sm text-title-sm text-white hover:opacity-90 flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Nouveau Véhicule
        </button>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden shadow-sm border border-outline-variant rounded-DEFAULT bg-surface">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant z-10">
              <tr>
                <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Immatriculation</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Type</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Modèle / Marque</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-secondary">Statut</th>
                <th className="py-3 px-4 font-label-caps text-label-caps text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {loading ? (
                <tr><td colSpan={5} className="py-4 text-center text-secondary">Chargement...</td></tr>
              ) : camions.length === 0 ? (
                <tr><td colSpan={5} className="py-4 text-center text-secondary">Aucun véhicule trouvé.</td></tr>
              ) : camions.map((c, idx) => (
                <tr key={c.id} className="border-b border-outline-variant hover:bg-surface-container-lowest h-[grid-row-height]">
                  <td className="py-2 px-4 font-medium">{c.immatriculation}</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 bg-surface-container-high rounded text-xs">
                      {c.type_materiel || c.type_vehicule}
                    </span>
                  </td>
                  <td className="py-2 px-4">{c.marque} {c.modele}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded font-label-caps text-label-caps text-white ${
                      c.statut === 'DISPONIBLE' ? 'bg-green-600' : 
                      c.statut === 'BLOQUE_HSE' ? 'bg-red-600' :
                      c.statut === 'EN_MAINTENANCE' ? 'bg-orange-600' : 'bg-blue-600'
                    }`}>
                      {c.statut}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenDocs(c)} title="Documents de conformité" className="p-1 hover:bg-surface-container-high rounded text-blue-600">
                        <span className="material-symbols-outlined text-sm">description</span>
                      </button>
                      <button onClick={() => handleOpenHse(c)} title="Bloquer HSE / Maintenance" className="p-1 hover:bg-surface-container-high rounded text-red-600">
                        <span className="material-symbols-outlined text-sm">gpp_bad</span>
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
        <HseBlockModal vehicule={selectedVehicule} onClose={() => setShowHseModal(false)} onRefresh={fetchCamions} />
      )}
    </div>
  )
}
