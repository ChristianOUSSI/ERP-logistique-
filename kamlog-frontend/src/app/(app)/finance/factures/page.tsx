'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Filter, MoreVertical, 
  Download, Eye, Send, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { financeAPI, tiersAPI } from '@/lib/api-client';

export default function FacturesPage() {
  const [factures, setFactures] = useState<any[]>([]);
  const [tiersMap, setTiersMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real implementation this would fetch from backend /api/finance/factures
    // Currently using the mocked /api/finance/invoices from the template
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const [facturesData, tiersData] = await Promise.all([
        financeAPI.getFactures(),
        tiersAPI.getTiers().catch(() => ({ data: [] }))
      ]);
      setFactures(facturesData.data || []);
      
      const map: Record<number, string> = {};
      (tiersData.data || []).forEach((t: any) => {
        map[t.id] = t.raison_sociale;
      });
      setTiersMap(map);
    } catch (err) {
      console.error(err);
      setFactures([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAYEE':
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'EMISE':
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'BROUILLON':
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'EN_RETARD':
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures Clients</h1>
          <p className="text-gray-500 mt-1">Gérez les factures générées automatiquement ou manuellement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />
            Nouvelle Facture
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une facture (N°, Client)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filtres Avancés
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                <th className="p-4 font-semibold">N° Facture</th>
                <th className="p-4 font-semibold">Date Émission</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold text-right">Montant HT</th>
                <th className="p-4 font-semibold text-right">Montant TTC</th>
                <th className="p-4 font-semibold text-center">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                    Chargement des factures...
                  </td>
                </tr>
              ) : factures.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Aucune facture trouvée.
                  </td>
                </tr>
              ) : (
                factures.map((facture, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{facture.numero_facture || facture.id}</div>
                      {facture.mission_id && (
                        <div className="text-xs text-gray-500 mt-0.5">Mission: #{facture.mission_id}</div>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(facture.date_emission || facture.dueDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{tiersMap[facture.tiers_id] || facture.client || 'Client Inconnu'}</div>
                    </td>
                    <td className="p-4 text-right text-gray-600">
                      {formatCurrency(facture.montant_ht_xaf || (facture.amount ? facture.amount * 0.8 : 0))}
                    </td>
                    <td className="p-4 text-right font-medium text-gray-900">
                      {formatCurrency(facture.montant_ttc_xaf || facture.amount || 0)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(facture.statut || facture.status)}`}>
                        {facture.statut || facture.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Voir">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Envoyer au client">
                          <Send className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
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
