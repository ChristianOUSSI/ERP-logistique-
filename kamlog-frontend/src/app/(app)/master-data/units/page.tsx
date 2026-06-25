"use client"

import { useState, useEffect } from 'react'
import { MaterialSymbol } from '@/components/MaterialSymbol'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

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
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredUnits = units.filter(unit =>
    unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unités de Mesure</h1>
          <p className="text-gray-600 mt-1">Consulter les unités de mesure configurées dans le système</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200">
          <MaterialSymbol icon="info" size={18} />
          <span>Constantes Système (Lecture seule)</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <MaterialSymbol icon="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une unité de mesure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Units Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement des données...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbole</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Aucune unité de mesure trouvée.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-blue-600">{unit.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{unit.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{unit.symbole}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{unit.categorie}</span>
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
