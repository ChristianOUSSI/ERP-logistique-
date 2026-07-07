import React, { useState } from 'react';
import { Truck, X, Save, AlertCircle } from 'lucide-react';
import { transportAPI } from '@/lib/api-client';

interface CreateCamionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCamionModal({ onClose, onSuccess }: CreateCamionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    immatriculation: '',
    type_materiel: 'TRACTEUR',
    type_vehicule: 'PLATEAU',
    marque: '',
    modele: '',
    charge_utile_kg: 0,
    volume_reservoir_litres: 0,
    conso_theorique_l_100: 0,
    gps_tracker_id: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Formatage basique de l'immatriculation pour faciliter la vie de l'utilisateur
    const payload = {
      ...formData,
      charge_utile_kg: Number(formData.charge_utile_kg),
      volume_reservoir_litres: Number(formData.volume_reservoir_litres) || null,
      conso_theorique_l_100: Number(formData.conso_theorique_l_100) || null,
      gps_tracker_id: formData.gps_tracker_id || null,
    };

    try {
      await transportAPI.createCamion(payload);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erreur lors de la création du véhicule. Vérifiez le format de l\'immatriculation (ex: LT TR 123 AB).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Nouveau Véhicule</h2>
              <p className="text-sm text-slate-500">Enregistrer un tracteur ou une remorque</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form id="create-camion-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Immatriculation *</label>
                <input 
                  type="text" 
                  name="immatriculation" 
                  required
                  placeholder="Ex: LT TR 123 AB"
                  value={formData.immatriculation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Format: [Région] [Genre] [3 Chiffres] [Série]</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Type de Matériel *</label>
                <select 
                  name="type_materiel"
                  value={formData.type_materiel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="TRACTEUR">Tracteur</option>
                  <option value="SEMI_REMORQUE">Semi-Remorque</option>
                  <option value="REMORQUE">Remorque</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Type de Véhicule *</label>
                <select 
                  name="type_vehicule"
                  value={formData.type_vehicule}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="PLATEAU">Plateau (Ouvert)</option>
                  <option value="PORTE_CONTENEUR">Porte-Conteneur</option>
                  <option value="BENNE_VRAC">Benne Vrac</option>
                  <option value="CITERNE">Citerne</option>
                  <option value="FRIGORIFIQUE">Frigorifique</option>
                  <option value="TAUTLINER">Tautliner (Bâche)</option>
                  <option value="FOURGON">Fourgon (Fermé)</option>
                  <option value="PORTE_ENGIN">Porte-Engin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tracker GPS (Optionnel)</label>
                <input 
                  type="text" 
                  name="gps_tracker_id" 
                  placeholder="ID du boîtier GPS"
                  value={formData.gps_tracker_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Marque *</label>
                <input 
                  type="text" 
                  name="marque" 
                  required
                  placeholder="Ex: Mercedes, MAN, Renault..."
                  value={formData.marque}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Modèle *</label>
                <input 
                  type="text" 
                  name="modele" 
                  required
                  placeholder="Ex: Actros 1845"
                  value={formData.modele}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Charge utile (Kg) *</label>
                <input 
                  type="number" 
                  name="charge_utile_kg" 
                  required
                  min="0"
                  value={formData.charge_utile_kg}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Réservoir (L)</label>
                <input 
                  type="number" 
                  name="volume_reservoir_litres"
                  min="0"
                  value={formData.volume_reservoir_litres}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Conso. (L/100km)</label>
                <input 
                  type="number" 
                  name="conso_theorique_l_100" 
                  min="0"
                  step="0.1"
                  value={formData.conso_theorique_l_100}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit"
            form="create-camion-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Créer le véhicule
          </button>
        </div>

      </div>
    </div>
  );
}
