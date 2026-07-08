'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { ShieldAlert, Plus, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { incidentsAPI } from '@/lib/api-client';
import { toast } from 'sonner';

export default function LitigesPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ titre: '', description: '', priorite: 'MOYENNE' });

  // For the MVP we assume client ID 1
  const CLIENT_ID = 1;

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const res = await incidentsAPI.getClientIncidents(CLIENT_ID);
      setIncidents(res.data);
    } catch (e) {
      toast.error("Erreur de chargement des litiges");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await incidentsAPI.createIncident({ ...formData, tiers_id: CLIENT_ID });
      toast.success("Ticket de litige créé avec succès");
      setShowModal(false);
      setFormData({ titre: '', description: '', priorite: 'MOYENNE' });
      loadIncidents();
    } catch (e) {
      toast.error("Erreur lors de la création");
    }
  };

  return (
    <ModuleLayout module="transport">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-rose-600" />
              Ticketing & Litiges
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gérez vos réclamations et suivez leur résolution en temps réel.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
          >
            <Plus className="w-5 h-5" />
            Nouveau Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-slate-500">Chargement...</div>
          ) : incidents.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-600">Aucun litige en cours</p>
            </div>
          ) : (
            incidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {incident.reference}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    incident.statut === 'OUVERT' ? 'bg-amber-100 text-amber-700' :
                    incident.statut === 'RESOLU' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {incident.statut}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{incident.titre}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">{incident.description}</p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mt-auto pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(incident.date_creation).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-0.5 rounded">{incident.priorite}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Création */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-black mb-6">Nouveau Ticket de Litige</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Titre du problème</label>
                  <input required value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 transition-colors" placeholder="Ex: Marchandise endommagée"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description détaillée</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 transition-colors h-32" placeholder="Décrivez le problème rencontré..."/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Priorité</label>
                  <select value={formData.priorite} onChange={e => setFormData({...formData, priorite: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 transition-colors">
                    <option value="BASSE">Basse</option>
                    <option value="MOYENNE">Moyenne</option>
                    <option value="HAUTE">Haute</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Annuler</button>
                  <button type="submit" className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors">Soumettre</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </ModuleLayout>
  );
}
