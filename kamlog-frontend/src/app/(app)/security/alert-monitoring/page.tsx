'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { Activity } from 'lucide-react';

export default function AlertMonitoringPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 'ALRT-001', metric: 'CPU Usage > 90%', node: 'Worker-Node-3', time: '10:45 AM', active: true },
        { id: 'ALRT-002', metric: 'Database Latency Spike', node: 'DB-Primary', time: '09:12 AM', active: false },
      ]);
      setLoading(false);
    }, 700);
  }, []);

  const columns = [
    { key: 'id', label: 'ID Alerte' },
    { key: 'metric', label: 'Métrique' },
    { key: 'node', label: 'Nœud/Service' },
    { key: 'time', label: 'Heure' },
    { 
      key: 'active', 
      label: 'État',
      render: (val: boolean) => (
        <span className={`flex items-center gap-1.5 ${val ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
          <span className={`w-2 h-2 rounded-full ${val ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`}></span>
          {val ? 'En cours' : 'Résolue'}
        </span>
      )
    }
  ];

  return (
    <GenericDataPage
      title="Monitoring des Alertes"
      description="Surveillance en temps réel de l'infrastructure et des alertes actives."
      icon={<Activity className="w-6 h-6 text-indigo-600" />}
      columns={columns}
      data={data}
      isLoading={loading}
      onExport={() => alert('Exporting alerts...')}
      primaryActionLabel="Configurer les seuils"
    />
  );
}
