'use client';

import React, { useEffect, useState } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { financeAPI } from '@/lib/api-client';
import { useI18n } from '@/hooks/useI18n';
import { FileText } from 'lucide-react';

export default function TarifsPage() {
  const t = useI18n();
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTarifs() {
      try {
        const res = await financeAPI.getTarifs();
        setTarifs(res.data || []);
      } catch (error) {
        console.error("Failed to fetch tarifs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTarifs();
  }, []);

  const columns = [
    { key: 'code_tarif', label: 'Code' },
    { key: 'description', label: 'Description' },
    { key: 'service_concerne', label: 'Service' },
    { 
      key: 'montant_base', 
      label: 'Montant de base',
      render: (val: number) => val ? `${val.toLocaleString()} FCFA` : '-'
    },
    { key: 'devise', label: 'Devise' },
    { 
      key: 'est_actif', 
      label: 'Statut',
      render: (val: boolean) => (
        <span className={`status-badge ${val ? 'status-delivered' : 'status-maintenance'}`}>
          {val ? 'Actif' : 'Inactif'}
        </span>
      )
    }
  ];

  return (
    <GenericDataPage
      title="Grille Tarifaire"
      description="Gestion des tarifs applicables par service (K-Finance)."
      icon={<FileText className="w-5 h-5 text-primary" />}
      columns={columns}
      data={tarifs}
      isLoading={loading}
      primaryActionLabel="Nouveau Tarif"
      onAdd={() => console.log('Add Tarif')}
      onEdit={(row) => console.log('Edit Tarif', row)}
      onDelete={(row) => console.log('Delete Tarif', row)}
    />
  );
}
