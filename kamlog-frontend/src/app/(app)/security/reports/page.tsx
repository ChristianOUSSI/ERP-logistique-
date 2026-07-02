'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SecurityReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un appel API pour les rapports de sécurité
    setTimeout(() => {
      setData([
        { id: 'RPT-SEC-001', type: 'Intrusion Attempt', severity: 'High', date: '2026-07-02 14:30', status: 'Resolved', source: 'IP 192.168.1.45' },
        { id: 'RPT-SEC-002', type: 'Failed Logins', severity: 'Medium', date: '2026-07-02 10:15', status: 'Investigating', source: 'Multiple IPs' },
        { id: 'RPT-SEC-003', type: 'Unauthorized Access', severity: 'Critical', date: '2026-07-01 22:45', status: 'Open', source: 'User: demo_agent' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const columns = [
    { key: 'id', label: 'ID Rapport' },
    { key: 'type', label: 'Type d\'Incident' },
    { key: 'source', label: 'Source' },
    { key: 'date', label: 'Date' },
    { 
      key: 'severity', 
      label: 'Sévérité',
      render: (val: string) => {
        const colors: Record<string, string> = {
          'High': 'bg-orange-100 text-orange-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'Critical': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[val] || 'bg-gray-100'}`}>
            {val}
          </span>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Statut',
      render: (val: string) => {
        const colors: Record<string, string> = {
          'Resolved': 'text-green-600',
          'Investigating': 'text-blue-600',
          'Open': 'text-red-600'
        };
        return <span className={`font-medium ${colors[val]}`}>{val}</span>;
      }
    }
  ];

  return (
    <GenericDataPage
      title="Rapports de Sécurité"
      description="Consultez et analysez les incidents de sécurité détectés par le système."
      icon={<ShieldAlert className="w-6 h-6 text-red-600" />}
      columns={columns}
      data={data}
      isLoading={loading}
      onExport={() => alert('Export en cours...')}
      primaryActionLabel="Créer un Rapport"
    />
  );
}
