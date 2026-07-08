'use client'

import React from 'react'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Truck } from 'lucide-react'
import { useComingSoon } from '@/contexts/ComingSoonContext'

export default function GestionFlottePage() {
  const { showComingSoon } = useComingSoon()
  return (
    <GenericDataPage
      title="Gestion de la Flotte Interne"
      description="Supervision des engins de manutention (Reach Stackers, Élévateurs) et de la flotte interne du parc."
      icon={<Truck className="w-6 h-6 text-slate-600" />}
      columns={[]}
      data={[]}
      isLoading={false}
      primaryActionLabel="Ajouter Véhicule"
      onAdd={() => showComingSoon('Ajouter Véhicule')}
    />
  )
}
