'use client'

import React from 'react'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Wrench } from 'lucide-react'

export default function ParcWorkshop() {
  return (
    <GenericDataPage
      title="Atelier (Workshop)"
      description="Gestion des réparations et de la maintenance du matériel roulant."
      icon={<Wrench className="w-6 h-6 text-slate-600" />}
      columns={[]}
      data={[]}
      isLoading={false}
      primaryActionLabel="Nouvelle Réparation"
      onAdd={() => alert('Création en cours d\'intégration avec le Backend...')}
    />
  )
}
