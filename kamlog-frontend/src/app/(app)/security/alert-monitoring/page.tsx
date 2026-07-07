'use client';

import React, { useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useComingSoon } from '@/contexts/ComingSoonContext';
import { ShieldAlert } from 'lucide-react';

export default function AlertsPage() {
  const { showComingSoon } = useComingSoon();

  useEffect(() => {
    // Show the coming soon modal immediately on load
    showComingSoon('Alertes de Sécurité (Audit)');
  }, [showComingSoon]);

  return (
    <ModuleLayout module="admin">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Centre d'Alertes</h1>
        <p className="text-slate-500 max-w-md">Ce module surveillera en temps réel toutes les anomalies et alertes de sécurité détectées par le système. Bientôt disponible.</p>
      </div>
    </ModuleLayout>
  );
}
