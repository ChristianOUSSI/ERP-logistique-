'use client';

import React, { useState, useEffect } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { BellRing } from 'lucide-react';

export default function SecurityNotificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 1, title: 'Mise à jour système', category: 'Système', date: 'Il y a 2h', isRead: false },
        { id: 2, title: 'Connexion depuis un nouvel appareil', category: 'Sécurité', date: 'Hier', isRead: true },
        { id: 3, title: 'Rapport d\'audit disponible', category: 'Audit', date: 'Hier', isRead: true },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const columns = [
    { key: 'title', label: 'Titre de la notification' },
    { key: 'category', label: 'Catégorie' },
    { key: 'date', label: 'Reçue le' },
    { 
      key: 'isRead', 
      label: 'Statut',
      render: (val: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-800'}`}>
          {val ? 'Lue' : 'Non lue'}
        </span>
      )
    }
  ];

  return (
    <GenericDataPage
      title="Notifications Système"
      description="Gérez vos alertes et notifications de sécurité."
      icon={<BellRing className="w-6 h-6 text-amber-500" />}
      columns={columns}
      data={data}
      isLoading={loading}
      primaryActionLabel="Marquer tout comme lu"
    />
  );
}
