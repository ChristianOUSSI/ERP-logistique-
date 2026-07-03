'use client'

import { useState, useEffect } from 'react'
import { masterDataAPI } from '@/lib/api-client'
import GenericDataPage from '@/components/ui/GenericDataPage'
import { Package } from 'lucide-react'

export default function MasterDataArticles() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await masterDataAPI.getArticles()
        setArticles(res.data || [])
      } catch (err) {
        console.error('Error fetching articles:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const columns = [
    {
      key: 'code_article',
      label: 'Code',
      render: (val: any) => (
        <span className="font-mono text-xs px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium">
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'designation',
      label: 'Désignation',
      render: (val: any, row: any) => (
        <div>
          <div className="font-semibold text-slate-900">{val || 'Sans désignation'}</div>
          <div className="text-xs text-slate-500">Catégorie: {row.categorie?.nom || row.categorie_id || 'Aucune'}</div>
        </div>
      ),
    },
    {
      key: 'type_article',
      label: 'Type',
      render: (val: any) => {
        const typeStr = val || 'STANDARD'
        return (
          <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-600/20">
            {typeStr}
          </span>
        )
      }
    },
    {
      key: 'unite',
      label: 'Unité',
      render: (val: any, row: any) => (
        <div className="text-sm text-slate-600">
          {row.unite?.code || 'UN'}
        </div>
      )
    },
    {
      key: 'prix_unitaire',
      label: 'Prix Unitaire',
      render: (val: any) => (
        <div className="text-sm font-medium text-slate-900">
          {val ? `${val.toLocaleString()} FCFA` : '-'}
        </div>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (val: any) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${val !== 'INACTIF' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val !== 'INACTIF' ? 'bg-emerald-600' : 'bg-red-600'}`}></span> {val !== 'INACTIF' ? 'Actif' : 'Inactif'}
        </span>
      )
    }
  ]

  return (
    <GenericDataPage
      title="Articles (Catalogue)"
      description="Gestion centralisée du catalogue d'articles, produits et pièces de rechange."
      icon={<Package className="w-6 h-6 text-emerald-600" />}
      columns={columns}
      data={articles}
      isLoading={loading}
      onAdd={() => console.log('Add article')}
      primaryActionLabel="Nouvel Article"
    />
  )
}
