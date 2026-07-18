'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { Wrench, Calendar, Clock, CheckCircle, Search, Plus } from 'lucide-react';
import { parcAPI } from '@/lib/api-client';
import { WorkshopRepair } from '@/types/parc';
import { toast } from 'sonner';

export default function WorkshopPage() {
  const [repairs, setRepairs] = useState<WorkshopRepair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    reference: `REP-${Date.now()}`,
    camion_id: 0,
    type_intervention: 'MECANIQUE',
    description: '',
    date_entree: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const data = await parcAPI.getWorkshopRepairs();
      setRepairs(data);
    } catch (err) {
      toast.error('Erreur lors du chargement de l\'atelier');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await parcAPI.createWorkshopRepair({
        ...form,
        statut: 'EN_ATTENTE',
        cout_estime: null,
        date_sortie_prevue: null,
        mecanicien_en_charge: null
      });
      toast.success('Réparation ajoutée !');
      setShowModal(false);
      fetchRepairs();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création');
    }
  };

  return (
    <ModuleLayout module="parc">
      <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Wrench className="w-8 h-8 text-blue-600" />
              Atelier & Reverse Logistics
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gestion des réparations, immobilisations et conteneurs endommagés.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Nouvelle Réparation
          </button>
        </div>

        {/* Dashboard KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase">En Attente</h3>
            <p className="text-4xl font-black text-slate-800 mt-2">{repairs.filter(r => r.statut === 'EN_ATTENTE').length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase">En Cours</h3>
            <p className="text-4xl font-black text-slate-800 mt-2">{repairs.filter(r => r.statut === 'EN_COURS').length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase">Terminées</h3>
            <p className="text-4xl font-black text-slate-800 mt-2">{repairs.filter(r => r.statut === 'TERMINEE').length}</p>
          </div>
        </div>

        {/* Repairs Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Ordres de Réparation (Work Orders)</h2>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Équipement ID</th>
                <th className="px-6 py-4">Intervention</th>
                <th className="px-6 py-4">Date Entrée</th>
                <th className="px-6 py-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Chargement...</td></tr>
              ) : repairs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Aucune réparation trouvée.</td></tr>
              ) : repairs.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-800">{r.reference}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">EQ-{r.camion_id}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700">{r.type_intervention}</span>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{r.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4"/> {new Date(r.date_entree).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.statut === 'EN_ATTENTE' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800"><Clock className="w-3 h-3"/> EN ATTENTE</span>}
                    {r.statut === 'EN_COURS' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800"><Wrench className="w-3 h-3"/> EN COURS</span>}
                    {r.statut === 'TERMINEE' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3"/> TERMINEE</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Création */}
        {showModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Nouvelle Réparation</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">ID Équipement / Camion</label>
                  <input type="number" value={form.camion_id} onChange={e => setForm({...form, camion_id: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Type d'intervention</label>
                  <select value={form.type_intervention} onChange={e => setForm({...form, type_intervention: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none">
                    <option value="MECANIQUE">Mécanique</option>
                    <option value="CARROSSERIE">Carrosserie</option>
                    <option value="PNEUMATIQUE">Pneumatique</option>
                    <option value="MAINTENANCE_PREVENTIVE">Maintenance Préventive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Description / Constat</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none h-24" placeholder="Détails du problème..."></textarea>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Annuler</button>
                <button onClick={handleCreate} className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">Créer l'Ordre</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ModuleLayout>
  );
}
