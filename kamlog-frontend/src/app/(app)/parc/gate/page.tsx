'use client';

import React, { useEffect, useState } from 'react';
import GenericDataPage from '@/components/ui/GenericDataPage';
import { parcAPI } from '@/lib/api-client';
import { useI18n } from '@/hooks/useI18n';
import { LogIn } from 'lucide-react';

export default function ParcGatePage() {
  const t = useI18n();
  // Instead of a list of gates, maybe we list recent Gate In/Out movements?
  // Backend doesn't have an endpoint for movements list, only gateIn/gateOut POST endpoints.
  // Wait, let's see backend parc.py endpoints for movements or stock.
  // We have getStock. Let's redirect Gate to Stock for now, and implement a Gate-in modal there.
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{t.parc.gateInOut}</h1>
      <p className="mt-4">Interface de saisie pour les entrées et sorties du terminal.</p>
      {/* Saisie form to be implemented */}
    </div>
  );
}
