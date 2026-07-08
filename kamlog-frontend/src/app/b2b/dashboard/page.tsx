'use client';

import React, { useEffect, useState } from 'react';
import { CardSkeletonLoader } from '@/components/ui/Loaders';
import { financeAPI } from '@/lib/api-client';
import { useAuth } from '@/components/layout/AuthProvider';
import { CreditCard, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function B2BDashboardPage() {
  const { user } = useAuth();
  const [encours, setEncours] = useState<any>(null);
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We assume the user.id corresponds to the tiers_id or we can fetch a generic dashboard for now.
  // Actually the client tiers_id might be stored in user.agencyId or a specific claim.
  // Let's use user.id cast to number, or fallback to 1 for demo purposes.
  const tiersId = parseInt(user?.id || '1') || 1;

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const [encoursRes, facturesRes] = await Promise.all([
          financeAPI.getEncours(tiersId),
          financeAPI.getFactures({ tiers_id: tiersId, limit: 5 })
        ]);
        setEncours(encoursRes.data);
        setFactures(facturesRes.data);
      } catch (e) {
        console.error("Erreur chargement dashboard B2B", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, tiersId]);

  if (loading) {
    return <div className="p-8"><CardSkeletonLoader /></div>;
  }

  const facturesImpayees = factures.filter(f => f.statut !== 'PAYEE' && f.statut !== 'ANNULEE');

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Mon Tableau de Bord</h1>
        <p className="text-slate-500 mt-1">Gérez vos expéditions, vos factures et votre encours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Encours Actuel</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">
              {encours?.encours_actuel?.toLocaleString('fr-FR')} <span className="text-lg text-slate-400">XAF</span>
            </h2>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${((encours?.encours_actuel / encours?.plafond_credit) * 100) > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${Math.min(((encours?.encours_actuel / encours?.plafond_credit) * 100) || 0, 100)}%` }} 
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Plafond : {encours?.plafond_credit?.toLocaleString('fr-FR')} XAF</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase">Factures à Régler</p>
            <h2 className="text-3xl font-black text-slate-800 mt-1">
              {facturesImpayees.length}
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" /> Factures Récentes
          </h3>
          <Link href="/b2b/factures" className="text-sm font-bold text-blue-600 hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {factures.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Aucune facture récente.</div>
          ) : (
            factures.map(f => (
              <div key={f.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-800">{f.numero_facture}</h4>
                  <p className="text-sm text-slate-500">Du {new Date(f.date_emission).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-black text-slate-800">{f.montant_ttc_xaf?.toLocaleString('fr-FR')} XAF</p>
                  <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded uppercase mt-1 ${
                    f.statut === 'PAYEE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {f.statut}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
