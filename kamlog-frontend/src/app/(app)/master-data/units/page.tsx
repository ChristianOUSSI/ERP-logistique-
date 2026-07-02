"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Scale } from 'lucide-react'

interface Unit {
  id: number
  code: string
  description: string
  symbole: string
  categorie: string
}

const UNIT_MAPPINGS: Record<string, { description: string, symbole: string, categorie: string }> = {
  UDB: { description: 'Unité de base (ex: sac)', symbole: 'udb', categorie: 'Quantité' },
  KG: { description: 'Kilogramme', symbole: 'kg', categorie: 'Poids' },
  TONNE: { description: 'Tonne', symbole: 't', categorie: 'Poids' },
  M3: { description: 'Mètre cube', symbole: 'm³', categorie: 'Volume' },
  M2: { description: 'Mètre carré', symbole: 'm²', categorie: 'Surface' },
  UNITE: { description: 'Unité générique', symbole: 'u', categorie: 'Quantité' }
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUnits = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get<string[]>('/api/master-data/units')
      
      const mappedUnits: Unit[] = data.map((code, index) => {
        const mapping = UNIT_MAPPINGS[code] || {
          description: code,
          symbole: code.toLowerCase(),
          categorie: 'Général'
        }
        return {
          id: index + 1,
          code,
          description: mapping.description,
          symbole: mapping.symbole,
          categorie: mapping.categorie
        }
      })
      
      setUnits(mappedUnits)
    } catch (err) {
      console.error(err)
      toast.error("Impossible de charger les unités de mesure.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (val: string) => <span className="font-mono font-bold text-blue-600">{val}</span>
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'symbole',
      label: 'Symbole',
      render: (val: string) => (
        <span className="bg-slate-100 px-2 py-1 rounded font-mono text-xs font-semibold text-slate-700 border border-slate-200">
          {val}
        </span>
      )
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (val: string) => (
        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-indigo-100">
          {val}
        </span>
      )
    }
  ]

  return (
    <GenericDataPage
      title="Unités de Mesure"
      description="Consulter les unités de mesure configurées dans le système (Lecture seule)"
      icon={<Scale className="w-6 h-6 text-blue-600" />}
      columns={columns}
      data={units}
      isLoading={loading}
    />
  )
}
