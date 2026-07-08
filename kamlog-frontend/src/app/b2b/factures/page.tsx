'use client';

import React, { useEffect, useState } from 'react';
import { financeAPI } from '@/lib/api-client';
import { useAuth } from '@/components/layout/AuthProvider';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function B2BFacturesPage() {
  const { user } = useAuth();
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tiersId = parseInt(user?.id || '1') || 1;

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const res = await financeAPI.getFactures({ tiers_id: tiersId });
        setFactures(res.data);
      } catch (e) {
        toast.error("Erreur de chargement des factures.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, tiersId]);

  const columns = [
    { key: 'numero_facture', label: 'N° Facture' },
    { key: 'date_emission', label: 'Date Émission', render: (val: string) => new Date(val).toLocaleDateString('fr-FR') },
    { key: 'date_echeance', label: 'Échéance', render: (val: string) => val ? new Date(val).toLocaleDateString('fr-FR') : '-' },
    { key: 'montant_ttc_xaf', label: 'Montant TTC', render: (val: number) => `${val?.toLocaleString('fr-FR')} XAF` },
    { 
      key: 'statut', 
      label: 'Statut', 
      render: (val: string) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
          val === 'PAYEE' ? 'bg-emerald-100 text-emerald-700' : 
          val === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <GenericDataPage
        title="Mes Factures"
        description="Historique de vos facturations et relevés"
        columns={columns}
        data={factures}
        isLoading={loading}
        icon={<FileText className="text-blue-600" />}
        onView={(row) => toast('Téléchargement PDF...', { icon: '📄' })}
        onExport={() => toast('Export en cours...', { icon: '📊' })}
      />
    </div>
  );
}
