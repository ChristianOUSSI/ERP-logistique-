'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

export default function ClientPortalHome() {
  const [loading, setLoading] = useState(true);

  // Mock data for the portal since we need a backend auth token linked to a Tiers to filter properly
  const mockMissions = [
    { id: 1, ref: 'OT-202607-001', orig: 'Port Autonome (DIT)', dest: 'Yaoundé, Magasin Central', status: 'EN_ROUTE', date: '07/07/2026', type: 'Conteneur 40HC' },
    { id: 2, ref: 'OT-202607-005', orig: 'Kribi Deep Sea Port', dest: 'Douala, ZI Bassa', status: 'LIVRE', date: '06/07/2026', type: 'Vrac (15T)' },
    { id: 3, ref: 'OT-202607-012', orig: 'Port Autonome', dest: 'Ngaoundéré', status: 'EN_ATTENTE_AFFECTATION', date: '08/07/2026', type: 'Conteneur 20FT' },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Bienvenue, CFAO Logistics</h1>
        <p className="text-slate-500 font-medium">Tableau de bord de suivi de vos expéditions en temps réel.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Missions Actives</p>
          <h2 className="text-4xl font-black text-slate-800">12</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Livraisons (Mois)</p>
          <h2 className="text-4xl font-black text-slate-800">45</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Package className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Nouvelle Cotation</h3>
            <p className="text-slate-300 text-sm mb-6">Demandez un transport en quelques clics.</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm w-full transition-colors">
              Faire une demande
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Vos Expéditions Récentes</h3>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher BL, OT..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">Référence OT</th>
              <th className="px-6 py-4">Détails Trajet</th>
              <th className="px-6 py-4">Marchandise</th>
              <th className="px-6 py-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Chargement de vos données...</td></tr>
            ) : mockMissions.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-black text-slate-800">{m.ref}</div>
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" /> {m.date}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-700">{m.orig}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> {m.dest}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{m.type}</td>
                <td className="px-6 py-4 text-right">
                  {m.status === 'EN_ROUTE' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">EN ROUTE</span>}
                  {m.status === 'LIVRE' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">LIVRÉ</span>}
                  {m.status === 'EN_ATTENTE_AFFECTATION' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800">PROGRAMMÉ</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
