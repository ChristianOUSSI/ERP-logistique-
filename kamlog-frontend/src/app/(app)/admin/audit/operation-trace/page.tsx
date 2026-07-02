'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { History } from 'lucide-react';

export default function OperationTracePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 'TRC-9901', user: 'admin@kamlog.com', action: 'CREATE_USER', resource: 'User(ID:45)', timestamp: '2026-07-02 10:00:01', ip: '192.168.1.10' },
        { id: 'TRC-9902', user: 'finance@kamlog.com', action: 'APPROVE_INVOICE', resource: 'Facture(ID:1020)', timestamp: '2026-07-02 11:20:45', ip: '192.168.1.15' },
        { id: 'TRC-9903', user: 'transport@kamlog.com', action: 'UPDATE_MISSION', resource: 'Mission(ID:500)', timestamp: '2026-07-02 14:15:22', ip: '10.0.0.5' },
      ]);
      setLoading(false);
    }, 900);
  }, []);

  const columns = [
    { key: 'timestamp', label: 'Horodatage' },
    { key: 'user', label: 'Utilisateur' },
    { 
      key: 'action', 
      label: 'Action',
      render: (val: string) => <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{val}</span>
    },
    { key: 'resource', label: 'Ressource Impactée' },
    { key: 'ip', label: 'Adresse IP' }
  ];

  return (
    <GenericDataPage
      title="Traçabilité des Opérations"
      description="Journal complet d'audit système (Audit Trail) de toutes les actions effectuées."
      icon={<History className="w-6 h-6 text-slate-700" />}
      columns={columns}
      data={data}
      isLoading={loading}
      onExport={() => alert('Exporting audit logs...')}
    />
  );
}
