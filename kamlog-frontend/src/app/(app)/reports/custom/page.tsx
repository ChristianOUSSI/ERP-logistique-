'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { ClipboardList, PieChart } from 'lucide-react';

export default function CustomReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 1, name: 'Bilan Transport Mensuel', author: 'finance_admin', lastRun: 'Il y a 2h', format: 'PDF, Excel' },
        { id: 2, name: 'Audit des Accès', author: 'security_admin', lastRun: 'Hier', format: 'CSV' },
        { id: 3, name: 'Mouvements de Stocks (Mag3)', author: 'magasin_manager', lastRun: 'Il y a 3 jours', format: 'Excel' },
      ]);
      setLoading(false);
    }, 500);
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
      onAdd={() => alert('Ouverture du concepteur de rapport...')}
      primaryActionLabel="Créer un Rapport"
    />
  );
}
