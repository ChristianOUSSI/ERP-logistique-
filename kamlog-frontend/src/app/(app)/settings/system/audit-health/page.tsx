'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { Settings } from 'lucide-react';

export default function AuditHealthSettingsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 'SET-001', parameter: 'Data Retention (Days)', value: '90', module: 'Database', status: 'Active' },
        { id: 'SET-002', parameter: 'Log Level', value: 'INFO', module: 'Application', status: 'Active' },
        { id: 'SET-003', parameter: 'Auto-Archiving', value: 'Enabled', module: 'Storage', status: 'Pending' },
      ]);
      setLoading(false);
    }, 600);
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
      onAdd={() => alert('Modification des paramètres...')}
      primaryActionLabel="Ajouter Règle"
    />
  );
}
