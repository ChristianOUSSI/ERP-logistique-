// src/app/(app)/parc/vehicles/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { transportAPI } from '@/lib/api-client'

export default function NewVehicle() {
  const router = useRouter()
  
  // Real database CamionCreate fields
  const [immatriculation, setImmatriculation] = useState('')
  const [typeVehicule, setTypeVehicule] = useState('PORTE_CONTENEUR')
  const [marque, setMarque] = useState('')
  const [modele, setModele] = useState('')
  const [chargeUtile, setChargeUtile] = useState('')
  const [volumeReservoir, setVolumeReservoir] = useState('')
  const [consoTheorique, setConsoTheorique] = useState('')
  
  // Chauffeurs list for assignment
  const [chauffeurs, setChauffeurs] = useState<any[]>([])
  const [selectedChauffeurId, setSelectedChauffeurId] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadChauffeurs() {
      try {
        const response = await transportAPI.getChauffeurs();
        setChauffeurs(response.data || []);
      } catch (err) {
        console.error("Failed to load chauffeurs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadChauffeurs();
  }, []);

  const handleCancel = () => {
    router.push('/parc/overview')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!immatriculation.trim() || !typeVehicule || !marque.trim() || !modele.trim()) {
      alert('Veuillez remplir les champs obligatoires (Plaque, Type, Marque, Modèle).');
      return;
    }

    try {
      setIsSubmitting(true);
      await transportAPI.createCamion({
        immatriculation: immatriculation.trim().toUpperCase(),
        type_vehicule: typeVehicule,
        marque: marque.trim(),
        modele: modele.trim(),
        charge_utile_kg: parseFloat(chargeUtile) || 0,
        volume_reservoir_litres: parseFloat(volumeReservoir) || 0,
        conso_theorique_l_100: parseFloat(consoTheorique) || 0
      });
      alert('Véhicule créé avec succès !');
      router.push('/parc/overview');
    } catch (error) {
      console.error("Failed to create vehicle", error);
      alert('Erreur lors de la création du véhicule.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL 0, wght 400, GRAD 0, opsz 24';
        }
        .material-symbols-outlined.fill {
          font-variation-settings: 'FILL 1';
        }
        .k-parc { color: #06b6d4; }
      `}</style>
      <div className="bg-[#F8FAFC] text-on-surface font-body-md antialiased min-h-screen">
        <main className="p-[2rem] max-w-[1600px] mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-[1rem] font-body-sm text-body-sm text-outline">
            <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => router.push('/dashboard')}>KAMLOG ERP</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="cursor-pointer hover:text-k-parc transition-colors" onClick={() => router.push('/parc/overview')}>K-Parc</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface font-medium">Nouveau Véhicule</span>
          </div>

          {/* Page Header */}
          <div className="flex justify-between items-end mb-[1.5rem]">
            <div>
              <div className="flex items-center gap-[0.5rem] mb-1">
                <span className="material-symbols-outlined k-parc fill text-[28px]">directions_car</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Enregistrement Véhicule</h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Création d'une nouvelle fiche pour l'intégration d'une unité au parc automobile opérationnel.</p>
            </div>
            <div className="flex gap-[0.5rem]">
              <button type="button" onClick={handleCancel} className="px-[1rem] py-2 border border-outline-variant bg-white text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">
                Annuler
              </button>
              <button type="button" onClick={handleSave} disabled={isSubmitting} className="px-[1rem] py-2 bg-[#06b6d4] text-white rounded-lg font-label-md text-label-md hover:bg-[#0891b2] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]">save</span>
                {isSubmitting ? "Sauvegarde..." : "Sauvegarder l'unité"}
              </button>
            </div>
          </div>

          {/* Form Layout */}
          <form onSubmit={handleSave} className="grid grid-cols-12 gap-[1.5rem]">
            {/* Core Details */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-[1.5rem]">
              <div className="bg-white border border-outline-variant rounded-xl p-[1.5rem] shadow-sm space-y-4">
                <h3 className="font-title-lg text-title-lg text-on-surface pb-[0.5rem] border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">badge</span>
                  Identification de l'Unité
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
                  {/* Immatriculation */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="plaque">Plaque d'Immatriculation *</label>
                    <input 
                      className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-data-tabular text-data-tabular text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc uppercase transition-all outline-none" 
                      id="plaque" 
                      placeholder="Ex: AB-123-CD" 
                      required 
                      type="text"
                      value={immatriculation}
                      onChange={(e) => setImmatriculation(e.target.value.toUpperCase())}
                    />
                  </div>

                  {/* Type de Véhicule */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="type_vehicule">Type d'Unité *</label>
                    <select 
                      className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-body-md text-body-md text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc transition-all outline-none" 
                      id="type_vehicule" 
                      required
                      value={typeVehicule}
                      onChange={(e) => setTypeVehicule(e.target.value)}
                    >
                      <option value="PORTE_CONTENEUR">Porte Conteneur</option>
                      <option value="BENNE_VRAC">Benne Vrac</option>
                      <option value="CITERNE">Citerne</option>
                      <option value="FRIGORIFIQUE">Frigorifique</option>
                      <option value="PLATEAU">Plateau</option>
                    </select>
                  </div>

                  {/* Marque */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="marque">Marque *</label>
                    <input 
                      className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-body-md text-body-md text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc transition-all outline-none" 
                      id="marque" 
                      placeholder="Ex: Volvo, Mercedes" 
                      required 
                      type="text"
                      value={marque}
                      onChange={(e) => setMarque(e.target.value)}
                    />
                  </div>

                  {/* Modèle */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="modele">Modèle *</label>
                    <input 
                      className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-body-md text-body-md text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc transition-all outline-none" 
                      id="modele" 
                      placeholder="Ex: FH16, Actros" 
                      required 
                      type="text"
                      value={modele}
                      onChange={(e) => setModele(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Technical Capacities */}
              <div className="bg-white border border-outline-variant rounded-xl p-[1.5rem] shadow-sm space-y-4">
                <h3 className="font-title-lg text-title-lg text-on-surface pb-[0.5rem] border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">settings_suggest</span>
                  Spécifications Techniques
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1rem]">
                  {/* Charge Utile */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="charge">Charge Utile (kg)</label>
                    <input 
                      className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-data-tabular text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc transition-all outline-none" 
                      id="charge" 
                      placeholder="Ex: 25000" 
                      type="number"
                      value={chargeUtile}
                      onChange={(e) => setChargeUtile(e.target.value)}
                    />
                  </div>

                  {/* Volume Réservoir */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="reservoir">Volume Réservoir (L)</label>
                    <input 
                      className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-data-tabular text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc transition-all outline-none" 
                      id="reservoir" 
                      placeholder="Ex: 400" 
                      type="number"
                      value={volumeReservoir}
                      onChange={(e) => setVolumeReservoir(e.target.value)}
                    />
                  </div>

                  {/* Consommation Théorique */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="conso">Conso. Théorique (L/100)</label>
                    <input 
                      className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-data-tabular text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc transition-all outline-none" 
                      id="conso" 
                      placeholder="Ex: 32.5" 
                      type="number"
                      step="0.1"
                      value={consoTheorique}
                      onChange={(e) => setConsoTheorique(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Assignment (Optional Link UI) */}
              <div className="bg-white border border-outline-variant rounded-xl p-[1.5rem] shadow-sm">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-[1rem] pb-[0.5rem] border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">assignment_ind</span>
                  Affectation Opérationnelle (Chauffeur)
                </h3>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-[0.5rem]" htmlFor="chauffeur-select">Chauffeur Principal / Opérateur</label>
                  <select 
                    id="chauffeur-select"
                    className="w-full bg-[#F8FAFC] border border-outline-variant rounded-lg px-[1rem] py-2.5 font-body-md text-body-md text-on-surface focus:border-k-parc focus:ring-1 focus:ring-k-parc outline-none"
                    value={selectedChauffeurId}
                    onChange={(e) => setSelectedChauffeurId(e.target.value)}
                  >
                    <option value="">-- Mettre en Pool (Non Assigné) --</option>
                    {chauffeurs.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.nom} {ch.prenom}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sidebar Column: Info & Status */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-[1.5rem]">
              <div className="bg-white border border-outline-variant rounded-xl p-[1.5rem] shadow-sm">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-[1rem] pb-[0.5rem] border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-[20px]">info</span>
                  Statut d'Enregistrement
                </h3>
                <div className="bg-[#F8FAFC] rounded-lg p-[1rem] flex items-center gap-[1rem] border border-outline-variant">
                  <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center shrink-0 border border-secondary/20">
                    <span className="material-symbols-outlined text-secondary text-[24px]">check_circle</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface mb-0.5">Prêt à l'enregistrement</div>
                    <div className="font-body-sm text-body-sm text-outline">Champs obligatoires validés</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}
