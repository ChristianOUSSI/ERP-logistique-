'use client'

import React from 'react'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Hammer } from 'lucide-react'

export default function WorkOrdersCreate() {
  return (
    <GenericDataPage
      title="Création d'Ordre de Travail"
      description="Interface de création des Work Orders pour la maintenance."
      icon={<Hammer className="w-6 h-6 text-slate-600" />}
      columns={[]}
      data={[]}
      isLoading={false}
      primaryActionLabel="Générer Ordre"
      onAdd={() => alert('Création en cours d\'intégration avec le Backend...')}
    />
  )
}
