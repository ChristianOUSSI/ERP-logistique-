'use client';

import React, { useEffect } from 'react';
import { ModuleLayout } from '@/components/layout/ModuleLayout';
import { useComingSoon } from '@/contexts/ComingSoonContext';
import { ShoppingBag } from 'lucide-react';

export default function PurchasesPage() {
  const { showComingSoon } = useComingSoon();

  useEffect(() => {
    showComingSoon('Demandes d\'Achats (Purchases)');
  }, [showComingSoon]);

  return (
    <ModuleLayout module="finance">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Demandes d'Achat</h1>
        <p className="text-slate-500 max-w-md">Gestion des réquisitions et commandes fournisseurs. Bientôt disponible.</p>
      </div>
    </ModuleLayout>
  );
}
