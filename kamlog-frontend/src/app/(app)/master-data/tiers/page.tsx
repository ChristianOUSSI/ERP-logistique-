'use client'

import { useState, useEffect } from 'react'
import { tiersAPI } from '@/lib/api-client'
import type { Tier } from '@/lib/api/master-data'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Building2 } from 'lucide-react'

export default function MasterDataTiers() {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTiers() {
      try {
        const res = await tiersAPI.getTiers()
        setTiers(res.data || [])
      } catch (err) {
        console.error('Error fetching tiers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTiers()
  }, [])

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (val: any) => (
        <span className="font-mono text-xs px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">
          C-{String(val).padStart(4, '0')}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Tier',
      render: (val: any, row: Tier) => (
        <div>
          <div className="font-semibold text-slate-900">{val || 'Sans nom'}</div>
          <div className="text-xs text-slate-500">{row.email || 'Aucun email'}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Catégorie',
      render: (val: any) => {
        const colors: Record<string, string> = {
          Client: 'bg-blue-50 text-blue-700 ring-blue-600/20',
          Fournisseur: 'bg-amber-50 text-amber-700 ring-amber-600/20',
          Partenaire: 'bg-purple-50 text-purple-700 ring-purple-600/20',
        }
        const style = colors[val as string] || 'bg-slate-50 text-slate-700 ring-slate-600/20'
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style}`}>
            {val || 'N/A'}
          </span>
        )
      }
    },
    {
      key: 'city',
      label: 'Localisation',
      render: (val: any, row: Tier) => (
        <div className="text-sm text-slate-600">
          {val ? `${val}, ${row.region || ''}` : 'Non renseigné'}
        </div>
      )
    },
    {
      key: 'creditLimit',
      label: 'Crédit Max',
      render: (val: any) => (
        <div className="text-sm font-medium text-slate-900">
          {val ? `${val.toLocaleString()} FCFA` : '-'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: () => (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Actif
        </span>
      )
    }
  ]

  return (
    <GenericDataPage
      title="Tiers (Partenaires)"
      description="Gestion centralisée des clients, fournisseurs et partenaires d'affaires."
      icon={<Building2 className="w-6 h-6 text-emerald-600" />}
      columns={columns}
      data={tiers}
      isLoading={loading}
      onAdd={() => console.log('Add tier')}
      primaryActionLabel="Nouveau Tier"
    />
  )
}
