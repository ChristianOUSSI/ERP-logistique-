'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { Users, FileText, CalendarDays, Download, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { rhAPI } from '@/lib/api-client';
import { toast } from 'sonner';

export default function RHDashboardPage() {
  const [employes, setEmployes] = useState<any[]>([]);
  const [conges, setConges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'EMPLOYES' | 'CONGES'>('EMPLOYES');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [empRes, congesRes] = await Promise.all([
        rhAPI.getEmployes(),
        rhAPI.getConges()
      ]);
      const empList = Array.isArray(empRes.data) ? empRes.data : (empRes.data?.items || (Array.isArray(empRes) ? empRes : []));
      const congesList = Array.isArray(congesRes.data) ? congesRes.data : (congesRes.data?.items || (Array.isArray(congesRes) ? congesRes : []));
      setEmployes(empList);
      setConges(congesList);
    } catch (e) {
      toast.error("Erreur de chargement des données RH");
      setEmployes([]);
      setConges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprouverConge = async (id: number, statut: string) => {
    try {
      await rhAPI.updateCongeStatut(id, statut);
      toast.success(`Congé ${statut.toLowerCase()} avec succès`);
      loadData();
    } catch (e) {
      toast.error("Erreur lors de la mise à jour du congé");
    }
  };

  return (
    <ModuleLayout module="rh">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-teal-600" />
              Administration RH
            </h1>
            <p className="text-slate-500 mt-2">Vue globale sur les effectifs, contrats, et demandes de congés.</p>
          </div>
          <div className="flex gap-3 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('EMPLOYES')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${activeTab === 'EMPLOYES' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Annuaire Employés
            </button>
            <button 
              onClick={() => setActiveTab('CONGES')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${activeTab === 'CONGES' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Demandes de Congés
              {conges.filter(c => c.statut === 'EN_ATTENTE').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px]">
                  {conges.filter(c => c.statut === 'EN_ATTENTE').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Chargement de l'administration...</div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {activeTab === 'EMPLOYES' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Matricule</th>
                      <th className="px-6 py-4">Employé</th>
                      <th className="px-6 py-4">Poste & Dpt</th>
                      <th className="px-6 py-4">Date Embauche</th>
                      <th className="px-6 py-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(!Array.isArray(employes) || employes.length === 0) ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Aucun employé enregistré</td></tr>
                    ) : (Array.isArray(employes) ? employes : []).map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-600">{emp.matricule}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{emp.prenom} {emp.nom}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-700">{emp.poste}</p>
                          <p className="text-xs text-slate-500">{emp.departement}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{new Date(emp.date_embauche).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded uppercase">{emp.statut}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Employé ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Période</th>
                      <th className="px-6 py-4">Motif</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(!Array.isArray(conges) || conges.length === 0) ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Aucune demande de congé</td></tr>
                    ) : (Array.isArray(conges) ? conges : []).map(conge => (
                      <tr key={conge.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-600">EMP-{conge.employe_id}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{conge.type_conge}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          Du {new Date(conge.date_debut).toLocaleDateString('fr-FR')}<br/>
                          Au {new Date(conge.date_fin).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">{conge.motif || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 font-bold text-xs rounded uppercase ${
                            conge.statut === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-700' :
                            conge.statut === 'APPROUVE' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {conge.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                          {conge.statut === 'EN_ATTENTE' && (
                            <>
                              <button onClick={() => handleApprouverConge(conge.id, 'APPROUVE')} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors" title="Approuver">
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleApprouverConge(conge.id, 'REFUSE')} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors" title="Refuser">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}
