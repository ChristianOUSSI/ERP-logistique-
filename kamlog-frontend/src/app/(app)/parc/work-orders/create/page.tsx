'use client'

import React from 'react'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Hammer } from 'lucide-react'
import { useComingSoon } from '@/contexts/ComingSoonContext'

export default function WorkOrdersCreate() {
  const { showComingSoon } = useComingSoon()
  return (
    <GenericDataPage
      title="Création d'Ordre de Travail"
      description="Interface de création des Work Orders pour la maintenance."
      icon={<Hammer className="w-6 h-6 text-slate-600" />}
      columns={[]}
      data={[]}
      isLoading={false}
      primaryActionLabel="Générer Ordre"
      onAdd={() => showComingSoon('Générer Ordre de Travail')}
    />
  )
}
