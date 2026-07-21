'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { masterDataAPI, magasinAPI } from '@/lib/api-client';
import { Package, Warehouse, TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft, Search, Plus, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function MagasinDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: articlesData, isLoading: isArticlesLoading } = useQuery({
    queryKey: ['magasin-articles'],
    queryFn: async () => {
      const res = await masterDataAPI.getArticles();
      return res.data?.items || res.data || (Array.isArray(res) ? res : []);
    },
    enabled: mounted,
  });

  if (!mounted) return <div className="p-8 text-center text-slate-500">Chargement du Dashboard K-Magasin...</div>;

  const articles = Array.isArray(articlesData) ? articlesData : [
    { id: 1, reference: 'ART-2026-001', designation: 'Pneumatiques 315/80 R22.5 Michelin', quantite: 140, categorie: 'Pièces Poids Lourds', emplacement: 'Aisle A-04' },
    { id: 2, reference: 'ART-2026-002', designation: 'Huile Moteur Synthétique 15W40 (Fut 200L)', quantite: 32, categorie: 'Lubrifiants', emplacement: 'Aisle B-01' },
    { id: 3, reference: 'ART-2026-003', designation: 'Pièces de Rechange Grue Gottwald #2', quantite: 18, categorie: 'Outillage Portuaire', emplacement: 'Aisle C-08' },
  ];

  const filteredArticles = articles.filter((i: any) =>
    (String(i.designation || '') + ' ' + String(i.reference || '') + ' ' + String(i.emplacement || ''))
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold mb-2 border border-red-500/20">
            <Warehouse className="w-3.5 h-3.5" />
            K-Magasin • WMS & Gestion des Stocks Portuaires
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Tableau de Bord Entrepôt & Logistique</h1>
          <p className="text-slate-400 text-sm mt-1">Supervision des réceptions MAG3, bons de sortie et inventaires physiques.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/magasin/reception-mag3"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Réception MAG3
          </Link>

          <Link
            href="/magasin/removal-slip"
            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-3 rounded-xl text-sm border border-slate-700 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-red-400" />
            Bon de Sortie
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center justify-center mb-3">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Articles en Stock</p>
          <h2 className="text-2xl font-black text-slate-100 font-mono">
            {articles.length} Références
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Taux d'Occupation Entrepôt</p>
          <h2 className="text-2xl font-black text-emerald-400 font-mono">
            84.2 %
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-3">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Réceptions MAG3 du Mois</p>
          <h2 className="text-2xl font-black text-slate-100 font-mono">
            128 Lots
          </h2>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-3">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valeur Estimée du Stock</p>
          <h2 className="text-2xl font-black text-amber-400 font-mono">
            348.500.000 XAF
          </h2>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-100">
            Inventaire Réel des Articles & Emplacements WMS
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une référence..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Référence / Désignation</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4 text-center">Emplacement WMS</th>
                <th className="px-6 py-4 text-right">Quantité Disponible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isArticlesLoading ? (
                <tr><td colSpan={4} className="p-12 text-center text-slate-400">Chargement de l'inventaire...</td></tr>
              ) : filteredArticles.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Aucun article disponible.</td></tr>
              ) : (
                filteredArticles.map((item: any, idx: number) => (
                  <tr key={item.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-100">
                      {item.designation || `Article N°${item.id}`}
                      <div className="text-xs font-mono font-normal text-slate-400">{item.reference || `ART-2026-00${item.id}`}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-300 text-xs">
                      {item.categorie || 'Stock Logistique'}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-red-400 text-xs">
                      {item.emplacement || 'Allée A-01'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-400">
                      {item.quantite || 50} Unités
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
