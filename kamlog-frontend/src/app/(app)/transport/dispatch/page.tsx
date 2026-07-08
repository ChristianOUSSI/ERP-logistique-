'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { transportAPI, tiersAPI } from '@/lib/api-client';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { 
  Building2, Box, Truck, Map, Receipt, CheckCircle2, 
  AlertCircle, ChevronRight, User, Phone, MapPin, Scale, Clock
} from 'lucide-react';
import { CardSkeletonLoader } from '@/components/ui/Loaders';
import { Combobox } from '@/components/ui/combobox';

export default function TransportDispatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // References Data
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [camions, setCamions] = useState<any[]>([]); // Includes Tractors, Remorques, etc.

  const [clients, setClients] = useState<any[]>([]);

  // Form State (5 Blocs)
  const [formData, setFormData] = useState({
    // 1. Entités
    client_id: '',
    expediteur_adresse: '',
    destinataire_adresse: '',
    contact_site: '',
    
    // 2. Fret
    nature_fret: 'CONTENEUR_20',
    poids_kg: '',
    volume_m3: '',
    
    // 3. Ressources
    camion_id: '',
    remorque_id: '',
    chauffeur_id: '',
    
    // 4. Logistique
    origine: '',
    destination: '',
    distance_km: '',
    date_chargement_prevue: '',
    date_livraison_souhaitee: '',
    
    // 5. Finance
    montant_fret: '',
    frais_peage: '0',
    frais_annexes: '0',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chaufRes, camRes, tiersRes] = await Promise.all([
          transportAPI.getChauffeurs(),
          transportAPI.getCamions(),
          tiersAPI.getTiers().catch(() => ({ data: [] }))
        ]);
        setChauffeurs(chaufRes.data || []);
        setCamions(camRes.data || []);
        setClients(tiersRes.data || []);
      } catch (err) {
        console.error("Failed to load references", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {
        reference: `OT-${new Date().getTime().toString().slice(-6)}`,
        tiers_id: parseInt(formData.client_id),
        expediteur_adresse: formData.expediteur_adresse,
        destinataire_adresse: formData.destinataire_adresse,
        contact_site: formData.contact_site,

        camion_id: parseInt(formData.camion_id),
        chauffeur_id: parseInt(formData.chauffeur_id),
        
        origine: formData.origine,
        destination: formData.destination,
        distance_km: parseFloat(formData.distance_km) || 0,
        nature_fret: formData.nature_fret,
      };

      if (formData.remorque_id) payload.remorque_id = parseInt(formData.remorque_id);
      if (formData.poids_kg) payload.poids_kg = parseFloat(formData.poids_kg);
      if (formData.volume_m3) payload.volume_m3 = parseFloat(formData.volume_m3);
      if (formData.date_chargement_prevue) payload.date_chargement_prevue = new Date(formData.date_chargement_prevue).toISOString();
      if (formData.date_livraison_souhaitee) payload.date_livraison_souhaitee = new Date(formData.date_livraison_souhaitee).toISOString();
      if (formData.montant_fret) payload.montant_fret = parseFloat(formData.montant_fret);
      if (formData.frais_peage) payload.frais_peage = parseFloat(formData.frais_peage);
      if (formData.frais_annexes) payload.frais_annexes = parseFloat(formData.frais_annexes);
      if (formData.notes) payload.notes = formData.notes;

      const res = await transportAPI.createMission(payload);
      setSuccess(`L'Ordre de Transport ${res.data?.reference} a été créé avec succès.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur de création. Vérifiez que le véhicule et le chauffeur sont disponibles et conformes (Garde-fou HSE).");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const tracteurs = camions.filter(c => c.type_materiel === 'TRACTEUR');
  const remorques = camions.filter(c => c.type_materiel === 'SEMI_REMORQUE' || c.type_materiel === 'REMORQUE');

  return (
    <ModuleLayout module="transport">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Map className="w-8 h-8 text-blue-600" />
            Création d'Ordre de Transport (OT)
          </h1>
          <p className="text-slate-500 mt-2">
            Générez un nouvel OT en remplissant les 5 blocs requis. Le Garde-fou de conformité HSE s'assurera de la validité du transport.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Blocage de Sécurité (Garde-fou)</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-emerald-800">Succès</h3>
              <p className="text-sm text-emerald-600 mt-1">{success}</p>
              <button 
                onClick={() => router.push('/transport/missions')}
                className="mt-3 text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                Voir les missions
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-6"><CardSkeletonLoader /><CardSkeletonLoader /></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Entités Contractuelles */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Building2 className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800">1. Entités Contractuelles</h2>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Client Facturé *</label>
                  <Combobox
                    options={clients.map(c => ({ value: String(c.id), label: c.raison_sociale }))}
                    value={formData.client_id}
                    onChange={(val) => setFormData(prev => ({ ...prev, client_id: val }))}
                    placeholder="Sélectionner un Client"
                    searchPlaceholder="Rechercher par nom..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adresse Expéditeur</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input type="text" name="expediteur_adresse" value={formData.expediteur_adresse} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Point de départ" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adresse Destinataire</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input type="text" name="destinataire_adresse" value={formData.destinataire_adresse} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Point de livraison" />
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contact sur Site</label>
                  <div className="relative w-full md:w-1/3">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input type="text" name="contact_site" value={formData.contact_site} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Nom & Numéro" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Détails du Fret */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-6 flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Box className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800">2. Détails du Fret</h2>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nature du Fret *</label>
                  <select name="nature_fret" required value={formData.nature_fret} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <option value="CONTENEUR_20">Conteneur 20 pieds</option>
                    <option value="CONTENEUR_40">Conteneur 40 pieds</option>
                    <option value="VRAC_SOLIDE">Vrac Solide</option>
                    <option value="VRAC_LIQUIDE">Vrac Liquide (Citerne)</option>
                    <option value="PALETTES">Palettes / Conventionnel</option>
                    <option value="MATIERES_DANGEREUSES">Matières Dangereuses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Poids (Kg)</label>
                  <div className="relative">
                    <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input type="number" name="poids_kg" value={formData.poids_kg} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: 25000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Volume (m³)</label>
                  <div className="relative">
                    <Box className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input type="number" name="volume_m3" value={formData.volume_m3} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: 33" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Ressources Affectées */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><Truck className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800">3. Ressources Affectées</h2>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tracteur *</label>
                  <Combobox
                    options={tracteurs.map((t: any) => ({
                      value: String(t.id),
                      label: `${t.immatriculation} - ${t.marque} ${t.statut !== 'DISPONIBLE' ? `(${t.statut})` : ''}`
                    }))}
                    value={formData.camion_id}
                    onChange={(val) => setFormData(prev => ({ ...prev, camion_id: val }))}
                    placeholder="Sélectionner un tracteur"
                    searchPlaceholder="Rechercher immatriculation..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Semi-remorque (Optionnel)</label>
                  <Combobox
                    options={remorques.map((r: any) => ({
                      value: String(r.id),
                      label: `${r.immatriculation} - ${r.marque}`
                    }))}
                    value={formData.remorque_id}
                    onChange={(val) => setFormData(prev => ({ ...prev, remorque_id: val }))}
                    placeholder="Aucune remorque"
                    searchPlaceholder="Rechercher immatriculation..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Conducteur *</label>
                  <Combobox
                    options={chauffeurs.map((c: any) => ({
                      value: String(c.id),
                      label: `${c.prenom} ${c.nom} ${c.specialisation ? `[${c.specialisation}]` : ''}`
                    }))}
                    value={formData.chauffeur_id}
                    onChange={(val) => setFormData(prev => ({ ...prev, chauffeur_id: val }))}
                    placeholder="Sélectionner un conducteur"
                    searchPlaceholder="Rechercher par nom..."
                  />
                </div>
              </div>
            </div>

            {/* 4. Logistique Opérationnelle */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><Map className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800">4. Logistique Opérationnelle</h2>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Origine (Ville/Site) *</label>
                  <input type="text" name="origine" required value={formData.origine} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Port Autonome" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Destination (Ville/Site) *</label>
                  <input type="text" name="destination" required value={formData.destination} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: Entrepôt Yassa" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Distance Estimée (Km) *</label>
                  <input type="number" name="distance_km" required value={formData.distance_km} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Ex: 45" />
                </div>
                <div className="hidden lg:block"></div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date Chargement</label>
                  <input type="datetime-local" name="date_chargement_prevue" value={formData.date_chargement_prevue} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date Livraison Souhaitée</label>
                  <input type="datetime-local" name="date_livraison_souhaitee" value={formData.date_livraison_souhaitee} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* 5. Finance */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-4 md:px-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Receipt className="w-5 h-5" /></div>
                <h2 className="text-lg font-bold text-slate-800">5. Volet Financier</h2>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Montant Fret (FCFA) *</label>
                  <input type="number" name="montant_fret" required value={formData.montant_fret} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" placeholder="Ex: 150000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Frais de Péage</label>
                  <input type="number" name="frais_peage" value={formData.frais_peage} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" placeholder="Ex: 5000" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Frais Annexes</label>
                  <input type="number" name="frais_annexes" value={formData.frais_annexes} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" placeholder="Ex: 10000" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Notes & Instructions (Affiché sur le BL)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none h-24" placeholder="Instructions particulières pour le conducteur..."></textarea>
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="flex items-center justify-end gap-4 py-4">
              <button type="button" onClick={() => router.push('/transport/missions')} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200/50 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={submitting} className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all">
                {submitting ? 'Validation Garde-fou...' : 'Confirmer l\'Ordre de Transport'}
              </button>
            </div>

          </form>
        )}
      </div>
    </ModuleLayout>
  );
}
