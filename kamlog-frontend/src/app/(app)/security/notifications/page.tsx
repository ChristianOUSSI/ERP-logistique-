'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { BellRing, ShieldAlert, CheckCircle2, Info, FileText } from 'lucide-react';
import { notificationsAPI } from '@/lib/api-client';

export default function SecurityNotificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const response = await notificationsAPI.getMyNotifications({ limit: 50 });
        setData(response.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [refreshTrigger]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'CRITIQUE': return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'HAUTE': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      case 'NORMALE': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const columns = [
    { 
      key: 'titre', 
      label: 'Titre de la notification',
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          {getPriorityIcon(row.priorite)}
          <div>
            <p className={`text-sm ${row.statut === 'NON_LUE' ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{val}</p>
            <p className="text-xs text-slate-500 truncate max-w-md" title={row.message}>{row.message}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'type_notification', 
      label: 'Catégorie',
      render: (val: string) => <span className="text-xs font-mono px-2 py-1 bg-slate-100 rounded-lg">{val}</span>
    },
    { 
      key: 'date_creation', 
      label: 'Reçue le',
      render: (val: string) => <span className="text-sm text-slate-500">{new Date(val).toLocaleString()}</span>
    },
    { 
      key: 'statut', 
      label: 'Statut',
      render: (val: string) => (
        <span className={`flex items-center gap-1 w-max px-2 py-1 rounded-full text-xs font-bold ${val === 'LUE' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
          {val === 'LUE' && <CheckCircle2 className="w-3 h-3" />}
          {val === 'NON_LUE' ? 'Nouvelle' : 'Lue'}
        </span>
      )
    }
  ];

  return (
    <GenericDataPage
      title="Notifications Système"
      description="Gérez vos alertes et notifications système."
      icon={<BellRing className="w-6 h-6 text-amber-500" />}
      columns={columns}
      data={data}
      isLoading={loading}
      primaryActionLabel="Marquer tout comme lu"
      onPrimaryAction={handleMarkAllAsRead}
    />
  );
}

