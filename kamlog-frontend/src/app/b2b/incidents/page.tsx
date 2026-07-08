'use client';

import React, { useEffect, useState } from 'react';
import { incidentsAPI } from '@/lib/api-client';
import { useAuth } from '@/components/layout/AuthProvider';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { AlertCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function B2BIncidentsPage() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newIncident, setNewIncident] = useState({ description: '', priorite: 'MOYENNE' });
  const [submitting, setSubmitting] = useState(false);

  const tiersId = parseInt(user?.id || '1') || 1;

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, tiersId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await incidentsAPI.getClientIncidents(tiersId);
      setIncidents(res.data);
    } catch (e) {
      toast.error("Erreur de chargement des litiges.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.description) return;
    setSubmitting(true);
    try {
      await incidentsAPI.createIncident({
        ...newIncident,
        source: 'CLIENT',
        statut: 'OUVERT',
        tiers_impliques: [tiersId]
      });
      toast.success("Litige déclaré avec succès.");
      setShowModal(false);
      setNewIncident({ description: '', priorite: 'MOYENNE' });
      loadData();
    } catch (e) {
      toast.error("Erreur lors de la déclaration.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Ticket', render: (val: number) => `TKT-${val}` },
    { key: 'date_declaration', label: 'Date', render: (val: string) => new Date(val).toLocaleDateString('fr-FR') },
    { key: 'description', label: 'Description', render: (val: string) => <span className="max-w-[200px] truncate block" title={val}>{val}</span> },
    { 
      key: 'priorite', 
      label: 'Priorité', 
      render: (val: string) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
          val === 'HAUTE' || val === 'CRITIQUE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {val}
        </span>
      )
    },
    { 
      key: 'statut', 
      label: 'Statut', 
      render: (val: string) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
          val === 'RESOLU' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <GenericDataPage
        title="Mes Litiges & Tickets"
        description="Déclarez un incident ou suivez l'avancement de vos requêtes"
        columns={columns}
        data={incidents}
        isLoading={loading}
        icon={<AlertCircle className="text-amber-500" />}
        primaryActionLabel="Déclarer un litige"
        onAdd={() => setShowModal(true)}
      />

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Déclarer un Litige</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description détaillée</label>
                <textarea 
                  required 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-blue-500 focus:outline-none"
                  rows={4}
                  value={newIncident.description}
                  onChange={e => setNewIncident({...newIncident, description: e.target.value})}
                  placeholder="Veuillez décrire le problème rencontré..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Niveau d'urgence</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:border-blue-500 focus:outline-none"
                  value={newIncident.priorite}
                  onChange={e => setNewIncident({...newIncident, priorite: e.target.value})}
                >
                  <option value="BASSE">Faible (Requête standard)</option>
                  <option value="MOYENNE">Moyenne (Problème modéré)</option>
                  <option value="HAUTE">Haute (Impact significatif)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200">
                  Annuler
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-700 disabled:opacity-50">
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
