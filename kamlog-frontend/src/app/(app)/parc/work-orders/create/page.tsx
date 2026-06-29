// src/app/(app)/parc/work-orders/create/page.tsx - KP05 Création Ordre de Travail K-Parc - Fidèle 100% au HTML original
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WorkOrderCreate() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState('')
  const [interventionType, setInterventionType] = useState('curative')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [mechanic, setMechanic] = useState('MEC-01')
  const [duration, setDuration] = useState('2.5')
  const [spareParts, setSpareParts] = useState([
    { id: 1, checked: true, name: 'Filtre à Huile (Réf: FLT-8839)', qty: 1 },
    { id: 2, checked: false, name: '', qty: 1 }
  ])

  const handleCancel = () => {
    router.push('/parc/work-orders')
  }

  const handleSave = () => {
    // Save work order - will be connected to backend
    router.push('/parc/work-orders')
  }

  const handleAddPart = () => {
    setSpareParts([...spareParts, { id: Date.now(), checked: false, name: '', qty: 1 }])
  }

  const handleRemovePart = (id: number) => {
    setSpareParts(spareParts.filter(part => part.id !== id))
  }

  const handlePartCheck = (id: number, checked: boolean) => {
    setSpareParts(spareParts.map(part => part.id === id ? { ...part, checked } : part))
  }

  const handlePartNameChange = (id: number, name: string) => {
    setSpareParts(spareParts.map(part => part.id === id ? { ...part, name } : part))
  }

  const handlePartQtyChange = (id: number, qty: number) => {
    setSpareParts(spareParts.map(part => part.id === id ? { ...part, qty } : part))
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .k-parc-accent { color: #00714d; }
        .k-parc-bg-accent { background-color: #00714d; }
        .k-parc-border-accent { border-color: #00714d; }
        .k-parc-ring-accent { --tw-ring-color: #00714d; }
      `}</style>
      <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex">
        
        
        {/* Main Content Area */}
        <main className="ml-[240px] flex-1 flex flex-col ">
          
          
          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-[1.5rem]">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Page Header */}
              <div className="flex items-end justify-between border-b border-outline-variant pb-4">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Création Ordre de Travail</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Générez une nouvelle intervention de maintenance pour la flotte de véhicules.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCancel} className="px-4 py-2 border border-outline-variant rounded bg-surface text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleSave} className="px-4 py-2 rounded k-parc-bg-accent text-white font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{fontSize: '18px'}}>save</span>
                    Enregistrer l'OT
                  </button>
                </div>
              </div>
              {/* Form Layout (Bento-style grid) */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column: Primary Details */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* Section: Informations Générales */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-6 shadow-sm">
                    <h3 className="font-title-md text-title-md text-on-surface mb-4 border-b border-outline-variant pb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined k-parc-accent" style={{fontSize: '20px'}}>info</span>
                      Informations Générales
                    </h3>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2 sm:col-span-1 space-y-1">
                        <label className="font-label-sm text-label-sm text-on-surface-variant">Véhicule / Équipement <span className="text-error">*</span></label>
                        <div className="relative">
                          <select 
                            className="w-full pl-3 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:outline-none focus:ring-2 k-parc-ring-accent focus:border-transparent appearance-none"
                            value={vehicle}
                            onChange={(e) => setVehicle(e.target.value)}
                          >
                            <option disabled selected value="">Sélectionner un véhicule...</option>
                            <option value="TRK-001">TRK-001 - Chariot Élévateur (Hyster 3T)</option>
                            <option value="TRK-045">TRK-045 - Tracteur Terminal (Kalmar)</option>
                            <option value="VHL-102">VHL-102 - Camionnette Service (Renault Master)</option>
                            <option value="CRN-005">CRN-005 - Grue Mobile (Liebherr)</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none" style={{fontSize: '18px'}}>arrow_drop_down</span>
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-1 space-y-1">
                        <label className="font-label-sm text-label-sm text-on-surface-variant">Type d'Intervention <span className="text-error">*</span></label>
                        <div className="relative">
                          <select 
                            className="w-full pl-3 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:outline-none focus:ring-2 k-parc-ring-accent focus:border-transparent appearance-none"
                            value={interventionType}
                            onChange={(e) => setInterventionType(e.target.value)}
                          >
                            <option value="curative">Maintenance Curative (Panne)</option>
                            <option value="preventive">Maintenance Préventive</option>
                            <option value="inspection">Inspection Réglementaire</option>
                            <option value="pneumatique">Remplacement Pneumatiques</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none" style={{fontSize: '18px'}}>arrow_drop_down</span>
                        </div>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="font-label-sm text-label-sm text-on-surface-variant">Description du Problème <span className="text-error">*</span></label>
                        <textarea 
                          className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:outline-none focus:ring-2 k-parc-ring-accent focus:border-transparent resize-y" 
                          placeholder="Décrivez en détail le symptôme ou le travail à effectuer..." 
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  {/* Section: Pièces de Rechange (Checklist) */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-2">
                      <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined k-parc-accent" style={{fontSize: '20px'}}>build</span>
                        Pièces de Rechange (Magasin)
                      </h3>
                      <button onClick={handleAddPart} className="text-sm font-medium k-parc-accent hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{fontSize: '16px'}}>add</span>
                        Ajouter Ligne
                      </button>
                    </div>
                    <div className="space-y-3">
                      {spareParts.map((part) => (
                        <div key={part.id} className="flex items-center gap-3 bg-surface-container-low p-2 rounded border border-outline-variant">
                          <input 
                            checked={part.checked} 
                            className="w-4 h-4 rounded border-outline k-parc-accent focus:ring-0 cursor-pointer" 
                            type="checkbox"
                            onChange={(e) => handlePartCheck(part.id, e.target.checked)}
                          />
                          <div className="flex-1">
                            <input 
                              className="w-full bg-transparent border-none text-sm p-1 focus:ring-0 focus:outline-none text-on-surface" 
                              type="text" 
                              value={part.name}
                              onChange={(e) => handlePartNameChange(part.id, e.target.value)}
                              placeholder="Rechercher une pièce par Réf ou Nom..."
                            />
                          </div>
                          <div className="w-24">
                            <input 
                              className="w-full p-1 bg-surface border border-outline-variant rounded text-sm text-center focus:outline-none focus:ring-1 k-parc-ring-accent focus:border-transparent" 
                              min="1" 
                              type="number" 
                              value={part.qty}
                              onChange={(e) => handlePartQtyChange(part.id, parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <button onClick={() => handleRemovePart(part.id)} className="p-1 text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 italic text-xs">Note : Les pièces cochées généreront automatiquement une demande de sortie au module K-Magasin.</p>
                  </div>
                </div>
                {/* Right Column: Planning & Assignment */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {/* Status & Priority Card */}
                  <div className="bg-surface border border-outline-variant rounded-lg p-6 shadow-sm">
                    <h3 className="font-title-md text-title-md text-on-surface mb-4 border-b border-outline-variant pb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined k-parc-accent" style={{fontSize: '20px'}}>flag</span>
                      Planification
                    </h3>
                    <div className="space-y-5">
                      {/* Priority */}
                      <div className="space-y-2">
                        <label className="font-label-sm text-label-sm text-on-surface-variant block">Niveau de Priorité</label>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center p-2 border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors group">
                            <input className="w-4 h-4 k-parc-accent border-outline focus:ring-0" name="priority" type="radio" value="low" checked={priority === 'low'} onChange={() => setPriority('low')}/>
                            <span className="ml-2 text-sm text-on-surface flex-1">Basse</span>
                            <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
                          </label>
                          <label className="flex items-center p-2 border border-outline-variant rounded cursor-pointer bg-surface-container-highest group">
                            <input className="w-4 h-4 k-parc-accent border-outline focus:ring-0" name="priority" type="radio" value="medium" checked={priority === 'medium'} onChange={() => setPriority('medium')}/>
                            <span className="ml-2 text-sm font-medium text-on-surface flex-1">Moyenne</span>
                            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                          </label>
                          <label className="flex items-center p-2 border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors group">
                            <input className="w-4 h-4 k-parc-accent border-outline focus:ring-0" name="priority" type="radio" value="high" checked={priority === 'high'} onChange={() => setPriority('high')}/>
                            <span className="ml-2 text-sm text-on-surface flex-1">Haute</span>
                            <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
                          </label>
                          <label className="flex items-center p-2 border border-error-container rounded cursor-pointer hover:bg-error-container/20 transition-colors group">
                            <input className="w-4 h-4 text-error border-error focus:ring-0" name="priority" type="radio" value="critical" checked={priority === 'critical'} onChange={() => setPriority('critical')}/>
                            <span className="ml-2 text-sm font-medium text-error flex-1">Critique (Immobilisation)</span>
                            <span className="w-2 h-2 rounded-full bg-error"></span>
                          </label>
                        </div>
                      </div>
                      {/* Assignment */}
                      <div className="space-y-1">
                        <label className="font-label-sm text-label-sm text-on-surface-variant block">Mécanicien Assigné</label>
                        <div className="relative">
                          <select 
                            className="w-full pl-3 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm focus:outline-none focus:ring-2 k-parc-ring-accent focus:border-transparent appearance-none"
                            value={mechanic}
                            onChange={(e) => setMechanic(e.target.value)}
                          >
                            <option disabled value="">À assigner plus tard</option>
                            <option value="MEC-01">Marc Dupont (Équipe Matin)</option>
                            <option value="MEC-02">Jean Leblanc (Spécialiste Hydraulique)</option>
                            <option value="MEC-03">Équipe Externe (Sous-traitant)</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none" style={{fontSize: '18px'}}>arrow_drop_down</span>
                        </div>
                      </div>
                      {/* Duration */}
                      <div className="space-y-1">
                        <label className="font-label-sm text-label-sm text-on-surface-variant block">Durée Estimée (Heures)</label>
                        <div className="flex items-center border border-outline-variant rounded bg-surface-container-lowest overflow-hidden focus-within:ring-2 k-parc-ring-accent focus-within:border-transparent">
                          <span className="material-symbols-outlined text-outline pl-3" style={{fontSize: '18px'}}>schedule</span>
                          <input 
                            className="w-full p-2 border-none bg-transparent text-sm focus:ring-0 focus:outline-none" 
                            min="0.5" 
                            step="0.5" 
                            type="number" 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
