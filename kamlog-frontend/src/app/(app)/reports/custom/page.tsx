'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { ClipboardList, PieChart } from 'lucide-react';
import { useComingSoon } from '@/contexts/ComingSoonContext';

export default function CustomReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { showComingSoon } = useComingSoon();

  useEffect(() => {
    // Supprimé: fausses données. Remplacé par un chargement en attente API.
    setLoading(false);
  }, []);

  const columns = [
    { key: 'name', label: 'Nom du Rapport' },
    { key: 'author', label: 'Créé par' },
    { key: 'lastRun', label: 'Dernière Exécution' },
    { 
      key: 'format', 
      label: 'Format(s) d\'Export',
      render: (val: string) => <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-800 rounded-lg">{val}</span>
    }
  ];

  return (
    <GenericDataPage
      title="Générateur de Rapports"
      description="Créez, planifiez et exportez des rapports personnalisés."
      icon={<PieChart className="w-6 h-6 text-purple-600" />}
      columns={columns}
      data={data}
      isLoading={loading}
      onAdd={() => showComingSoon('Générateur de Rapports Personnalisés')}
      primaryActionLabel="Créer un Rapport"
    />
  );
}
