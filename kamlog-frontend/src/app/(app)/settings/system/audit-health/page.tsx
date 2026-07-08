'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { Settings } from 'lucide-react';
import { useComingSoon } from '@/contexts/ComingSoonContext';

export default function AuditHealthSettingsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { showComingSoon } = useComingSoon();

  useEffect(() => {
    // Supprimé: fausses données. Remplacé par un chargement en attente API.
    setLoading(false);
  }, []);

  const columns = [
    { key: 'parameter', label: 'Paramètre' },
    { key: 'module', label: 'Module Cible' },
    { 
      key: 'value', 
      label: 'Valeur',
      render: (val: string) => <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">{val}</span>
    },
    { 
      key: 'status', 
      label: 'Statut',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <GenericDataPage
      title="Paramètres de Santé du Système"
      description="Configuration de l'audit système, rétention des logs et maintenance de l'infrastructure."
      icon={<Settings className="w-6 h-6 text-slate-600" />}
      columns={columns}
      data={data}
      isLoading={loading}
      onAdd={() => showComingSoon('Configuration des paramètres système')}
      primaryActionLabel="Ajouter Règle"
    />
  );
}
