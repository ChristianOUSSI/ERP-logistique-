'use client';

import React, { useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useComingSoon } from '@/contexts/ComingSoonContext';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { showComingSoon } = useComingSoon();

  useEffect(() => {
    showComingSoon('Notifications Système');
  }, [showComingSoon]);

  return (
    <ModuleLayout module="admin">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Bell className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Centre de Notifications</h1>
        <p className="text-slate-500 max-w-md">Tableau de bord de toutes les notifications. Bientôt disponible.</p>
      </div>
    </ModuleLayout>
  );
}
