'use client';

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { Users, Banknote, Calendar, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { financeAPI } from '@/lib/api-client';

export default function PayrollPage() {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = async () => {
    setLoading(true);
    try {
      const res = await financeAPI.getPayroll();
      setDrivers(res.data || []);
    } catch (error) {
      console.error('Failed to load payroll', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleLayout module="finance">
      <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Banknote className="w-8 h-8 text-emerald-600" />
              Paie & Frais de Route (RH)
            </h1>
            <p className="text-sm text-slate-500 mt-2">Gestion des per diems, péages et rémunération des chauffeurs.</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Générer les Fiches de Paie
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Paie (Mois)</p>
            <h2 className="text-3xl font-black text-slate-800">
              {(drivers.reduce((acc, d) => acc + d.base + d.primes + d.peages, 0)).toLocaleString()} <span className="text-lg font-bold text-slate-500">XAF</span>
            </h2>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Primes Variables</p>
            <h2 className="text-3xl font-black text-emerald-600">
              {(drivers.reduce((acc, d) => acc + d.primes, 0)).toLocaleString()} <span className="text-lg font-bold text-emerald-600/50">XAF</span>
            </h2>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Frais Avancés (Péages)</p>
            <h2 className="text-3xl font-black text-amber-600">
              {(drivers.reduce((acc, d) => acc + d.peages, 0)).toLocaleString()} <span className="text-lg font-bold text-amber-600/50">XAF</span>
            </h2>
          </div>
          <div className="bg-slate-900 p-5 rounded-2xl shadow-sm text-white">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Prochaine Clôture
            </p>
            <h2 className="text-2xl font-black text-white mt-1">31 Juillet 2026</h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              Rémunérations Chauffeurs
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Chauffeur</th>
                <th className="px-6 py-4 text-right">Salaire Base</th>
                <th className="px-6 py-4 text-right">Primes Trajet</th>
                <th className="px-6 py-4 text-right">Remb. Péages</th>
                <th className="px-6 py-4 text-right">Net à Payer</th>
                <th className="px-6 py-4 text-right">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Chargement de la paie...</td></tr>
              ) : drivers.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Aucun chauffeur trouvé.</td></tr>
              ) : drivers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{d.nom} {d.prenoms}</div>
                    <div className="text-xs text-slate-500">ID: DRV-{d.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-600">{d.base.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">+{d.primes.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-medium text-amber-600">+{d.peages.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 text-lg">
                    {(d.base + d.primes + d.peages).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {d.statut === 'PAYE' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> PAYÉ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
                        <AlertCircle className="w-3 h-3" /> EN ATTENTE
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Fiche de Paie">
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </ModuleLayout>
  );
}
