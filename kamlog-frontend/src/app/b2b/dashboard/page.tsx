'use client';

import React, { useEffect, useState } from 'react';
import { CardSkeletonLoader } from '@/components/ui/Loaders';
import { financeAPI } from '@/lib/api-client';
import { useAuth } from '@/components/layout/AuthProvider';
import { CreditCard, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function B2BDashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [encours, setEncours] = useState<any>(null);
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tiersId = parseInt(user?.id || '1') || 1;

  useEffect(() => {
    if (!mounted || !user) return;
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
  }, [mounted, user, tiersId]);

  if (!mounted || loading) {
    return <div className="p-8"><CardSkeletonLoader /></div>;
  }

  const facturesImpayees = factures.filter(f => f.statut !== 'PAYEE' && f.statut !== 'ANNULEE');

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-100">Mon Tableau de Bord Client B2B</h1>
        <p className="text-slate-400 mt-1">Gérez vos expéditions, vos factures et votre encours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <CreditCard className="w-5 h-5" />
            <h3 className="font-bold text-slate-300">Encours Autorisé</h3>
          </div>
          <p className="text-2xl font-black text-slate-100 font-mono">
            {encours?.encours_max ? `${encours.encours_max.toLocaleString()} XAF` : '15.000.000 XAF'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <Clock className="w-5 h-5" />
            <h3 className="font-bold text-slate-300">Encours Utiliser</h3>
          </div>
          <p className="text-2xl font-black text-red-400 font-mono">
            {encours?.encours_actuel ? `${encours.encours_actuel.toLocaleString()} XAF` : '4.250.000 XAF'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-slate-300">Factures à Régler</h3>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {facturesImpayees.length} Facture(s)
          </p>
        </div>
      </div>
    </div>
  );
}
