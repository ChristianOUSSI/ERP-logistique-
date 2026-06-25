"use client"

import { useState, useEffect } from 'react'
import { MaterialSymbol } from '@/components/MaterialSymbol'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface Category {
  id: number
  code: string
  description: string
  parent: string | null
  niveau: number
}

const CATEGORY_MAPPINGS: Record<string, { description: string, parent: string | null, niveau: number }> = {
  ALIMENTAIRE: { description: 'Alimentaire', parent: null, niveau: 1 },
  PHARMACEUTIQUE: { description: 'Pharmaceutique', parent: null, niveau: 1 },
  MATIERES_PREMIERES: { description: 'Matières premières', parent: null, niveau: 1 },
  PRODUITS_FINIS: { description: 'Produits finis', parent: null, niveau: 1 },
  EMBALLAGES_PALETES: { description: 'Emballages & Palettes', parent: null, niveau: 1 },
  EQUIPEMENT: { description: 'Équipement', parent: null, niveau: 1 },
  PIECES_DETACHEES: { description: 'Pièces détachées', parent: null, niveau: 1 },
  MOBILIER_BUREAU_INFORMATIQUE: { description: 'Mobilier de bureau & Informatique', parent: null, niveau: 1 },
  PRODUITS_DANGEREUX: { description: 'Produits dangereux', parent: null, niveau: 1 },
  PRODUITS_LUXE_VALEUR: { description: 'Produits de luxe & valeur', parent: null, niveau: 1 },
  VRAC: { description: 'Vrac', parent: null, niveau: 1 },
  HORS_GABARIT: { description: 'Hors gabarit', parent: null, niveau: 1 }
}

export default function ArticleCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get<string[]>('/api/master-data/article-categories')
      
      const mappedCategories: Category[] = data.map((code, index) => {
        const mapping = CATEGORY_MAPPINGS[code] || {
          description: code,
          parent: null,
          niveau: 1
        }
        return {
          id: index + 1,
          code,
          description: mapping.description,
          parent: mapping.parent,
          niveau: mapping.niveau
        }
      })
      
      setCategories(mappedCategories)
    } catch (err) {
      console.error(err)
      toast.error("Impossible de charger les catégories d'articles.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(category =>
    category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getNiveauLabel = (niveau: number) => {
    switch (niveau) {
      case 1: return 'Catégorie principale'
      case 2: return 'Sous-catégorie'
      case 3: return 'Sous-sous-catégorie'
      default: return 'Niveau ' + niveau
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories d'Articles</h1>
          <p className="text-gray-600 mt-1">Consulter la classification des articles</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200">
          <MaterialSymbol icon="info" size={18} />
          <span>Classification Système (Lecture seule)</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <MaterialSymbol icon="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement des données...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Aucune catégorie trouvée.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-blue-600">{category.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.parent ? (
                        <span className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{category.parent}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getNiveauLabel(category.niveau)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
