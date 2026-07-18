'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, TrendingUp, Calendar, ArrowRight, FileText, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { transportAPI } from '@/lib/api-client';
import { financeAPI } from '@/lib/api-client';
import { magasinAPI } from '@/lib/api-client';

export default function ClientPortalHome() {
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [declarations, setDeclarations] = useState<any[]>([]);
  type TabType = 'transport'|'finance'|'douane';
  const [activeTab, setActiveTab] = useState<TabType>('transport');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // In a real scenario, this would only return the client's data based on their token.
      const res = await transportAPI.getMissions({ limit: 10 });
      setMissions(res.data?.items || res.data || []);

      const invRes = await financeAPI.getFactures();
      setInvoices(invRes || []);

      const decRes = await magasinAPI.getDeclarations();
      setDeclarations(decRes.data || decRes || []);
    } catch (error) {
      console.error('Failed to load portal data', error);
    } finally {
      setLoading(false);
    }
  };

  
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
          <h2 className="text-4xl font-black text-slate-800">{missions.filter(m => m.statut === 'EN_ROUTE').length}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Livraisons (Mois)</p>
          <h2 className="text-4xl font-black text-slate-800">{missions.filter(m => m.statut === 'LIVREE').length}</h2>
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl max-w-fit mb-6">
        <button 
          onClick={() => setActiveTab('transport')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'transport' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
        >
          <Package className="w-4 h-4" /> Expéditions (Transport)
        </button>
        <button 
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'finance' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
        >
          <FileText className="w-4 h-4" /> Factures (Finance)
        </button>
        <button 
          onClick={() => setActiveTab('douane')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'douane' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
        >
          <ShieldCheck className="w-4 h-4" /> Déclarations (Douane)
        </button>
      </div>

      {/* Tracking Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">
            {activeTab === 'transport' ? 'Vos Expéditions Récentes' : activeTab === 'finance' ? 'Vos Factures' : 'Vos Déclarations en Douane'}
          </h3>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
            {activeTab === 'transport' && (
              <tr>
                <th className="px-6 py-4">Référence OT</th>
                <th className="px-6 py-4">Détails Trajet</th>
                <th className="px-6 py-4">Marchandise</th>
                <th className="px-6 py-4 text-right">Statut</th>
              </tr>
            )}
            {activeTab === 'finance' && (
              <tr>
                <th className="px-6 py-4">N° Facture</th>
                <th className="px-6 py-4">Date d'échéance</th>
                <th className="px-6 py-4 text-right">Montant</th>
                <th className="px-6 py-4 text-right">Statut</th>
              </tr>
            )}
            {activeTab === 'douane' && (
              <tr>
                <th className="px-6 py-4">N° Déclaration</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Marchandise</th>
                <th className="px-6 py-4 text-right">Statut</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Chargement de vos données...</td></tr>
            ) : activeTab === 'transport' ? (
              missions.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Aucune expédition trouvée.</td></tr>
              ) : missions.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-800">{m.reference}</div>
                    <div className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" /> {m.date_depart_prevue ? new Date(m.date_depart_prevue).toLocaleDateString() : '--'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{m.lieu_depart || 'N/A'}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> {m.lieu_arrivee || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{m.nature_fret || '--'}</td>
                  <td className="px-6 py-4 text-right">
                    {m.statut === 'EN_ROUTE' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">EN ROUTE</span>}
                    {m.statut === 'LIVREE' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">LIVRÉ</span>}
                    {m.statut === 'EN_ATTENTE_AFFECTATION' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800">PROGRAMMÉ</span>}
                    {m.statut === 'BROUILLON' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800">BROUILLON</span>}
                    {m.statut === 'EN_CHARGEMENT' && <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">EN CHARGEMENT</span>}
                  </td>
                </tr>
              ))
            ) : activeTab === 'finance' ? (
              invoices.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Aucune facture trouvée.</td></tr>
              ) : invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-800">{inv.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400"/> {new Date(inv.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800 font-mono">
                    FCFA {inv.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.status === 'paid' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3"/> PAYÉE</span>}
                    {inv.status === 'draft' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800"><FileText className="w-3 h-3"/> BROUILLON</span>}
                    {inv.status === 'sent' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800"><Clock className="w-3 h-3"/> EN ATTENTE</span>}
                    {inv.status === 'overdue' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800"><Clock className="w-3 h-3"/> EN RETARD</span>}
                  </td>
                </tr>
              ))
            ) : (
              declarations.map((dec: any) => (
                <tr key={dec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-800">{dec.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400"/> {new Date(dec.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{dec.marchandise}</td>
                  <td className="px-6 py-4 text-right">
                    {dec.statut === 'LIQUIDEE' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800"><ShieldCheck className="w-3 h-3"/> LIQUIDÉE</span>}
                    {dec.statut === 'EN_ATTENTE' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800"><Clock className="w-3 h-3"/> EN ATTENTE</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
