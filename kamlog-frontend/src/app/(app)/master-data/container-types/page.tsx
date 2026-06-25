"use client"

import { useState, useEffect } from 'react'
import { MaterialSymbol } from '@/components/MaterialSymbol'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface ContainerType {
  id: number
  code: string
  nom: string
  description: string | null
  longueur: string | null
  type_conteneur: string | null
  est_actif: boolean
}

interface UIContainerType {
  id: number
  code: string
  description: string // Maps to DB nom
  longueur: number
  largeur: number
  hauteur: number
  capacite: number
  text_desc: string
}

export default function ContainerTypesPage() {
  const [containerTypes, setContainerTypes] = useState<UIContainerType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingType, setEditingType] = useState<UIContainerType | null>(null)

  // Form fields
  const [code, setCode] = useState('')
  const [nom, setNom] = useState('') // UI description
  const [longueurStr, setLongueurStr] = useState('')
  const [largeurStr, setLargeurStr] = useState('')
  const [hauteurStr, setHauteurStr] = useState('')
  const [capaciteStr, setCapaciteStr] = useState('')
  const [textDesc, setTextDesc] = useState('')

  const parseDBType = (item: ContainerType): UIContainerType => {
    let parsedDesc = { longueur: 0, largeur: 0, hauteur: 0, capacite: 0, text_desc: item.description || '' }
    try {
      if (item.description && item.description.startsWith('{')) {
        parsedDesc = JSON.parse(item.description)
      } else {
        parsedDesc.text_desc = item.description || ''
        // Deduce fallback dimensions if standard codes
        if (item.code.startsWith('20')) {
          parsedDesc.longueur = 6.06
          parsedDesc.largeur = 2.44
          parsedDesc.hauteur = 2.59
          parsedDesc.capacite = 33.1
        } else if (item.code.startsWith('40')) {
          parsedDesc.longueur = 12.19
          parsedDesc.largeur = 2.44
          parsedDesc.hauteur = item.code.includes('HC') ? 2.90 : 2.59
          parsedDesc.capacite = item.code.includes('HC') ? 76.3 : 67.7
        } else if (item.code.startsWith('45')) {
          parsedDesc.longueur = 13.72
          parsedDesc.largeur = 2.44
          parsedDesc.hauteur = 2.90
          parsedDesc.capacite = 86.0
        }
      }
    } catch (e) {
      console.error(e)
    }

    return {
      id: item.id,
      code: item.code,
      description: item.nom, // DB nom -> UI description
      longueur: parsedDesc.longueur,
      largeur: parsedDesc.largeur,
      hauteur: parsedDesc.hauteur,
      capacite: parsedDesc.capacite,
      text_desc: parsedDesc.text_desc
    }
  }

  const fetchContainerTypes = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/api/master-data/container-types')
      setContainerTypes(data.map(parseDBType))
    } catch (err) {
      console.error(err)
      toast.error("Impossible de charger les types de conteneurs depuis le serveur.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContainerTypes()
  }, [])

  const filteredTypes = containerTypes.filter(type =>
    type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    setEditingType(null)
    setCode('')
    setNom('')
    setLongueurStr('')
    setLargeurStr('')
    setHauteurStr('')
    setCapaciteStr('')
    setTextDesc('')
    setShowModal(true)
  }

  const handleEdit = (type: UIContainerType) => {
    setEditingType(type)
    setCode(type.code)
    setNom(type.description)
    setLongueurStr(type.longueur.toString())
    setLargeurStr(type.largeur.toString())
    setHauteurStr(type.hauteur.toString())
    setCapaciteStr(type.capacite.toString())
    setTextDesc(type.text_desc)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type de conteneur ?')) {
      try {
        await apiClient.delete(`/api/master-data/container-types/${id}`)
        toast.success("Type de conteneur supprimé avec succès.")
        fetchContainerTypes()
      } catch (err) {
        console.error(err)
        toast.error("Erreur lors de la suppression.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !nom) {
      toast.error("Veuillez remplir les champs obligatoires.")
      return
    }

    const dbDescriptionObj = {
      longueur: parseFloat(longueurStr) || 0,
      largeur: parseFloat(largeurStr) || 0,
      hauteur: parseFloat(hauteurStr) || 0,
      capacite: parseFloat(capaciteStr) || 0,
      text_desc: textDesc
    }

    const payload = {
      code: code.toUpperCase(),
      nom: nom,
      description: JSON.stringify(dbDescriptionObj),
      longueur: `${longueurStr || '0'}'`,
      type_conteneur: code.toUpperCase().endsWith('RF') ? 'Reefer' : 
                      code.toUpperCase().endsWith('HC') ? 'High Cube' : 'Dry'
    }

    try {
      if (editingType) {
        await apiClient.put(`/api/master-data/container-types/${editingType.id}`, {
          nom: payload.nom,
          description: payload.description,
          longueur: payload.longueur,
          type_conteneur: payload.type_conteneur
        })
        toast.success("Type de conteneur mis à jour avec succès.")
      } else {
        await apiClient.post('/api/master-data/container-types', payload)
        toast.success("Type de conteneur créé avec succès.")
      }
      setShowModal(false)
      fetchContainerTypes()
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'enregistrement.")
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Types de Conteneurs</h1>
          <p className="text-gray-600 mt-1">Gérer les types de conteneurs maritimes</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MaterialSymbol icon="add" size={20} />
          Nouveau Type
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <MaterialSymbol icon="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un type de conteneur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Container Types Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement des données...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions (L×l×h)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité (m³)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucun type de conteneur trouvé.
                  </td>
                </tr>
              ) : (
                filteredTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-blue-600">{type.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{type.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {type.longueur}m × {type.largeur}m × {type.hauteur}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{type.capacite} m³</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(type)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <MaterialSymbol icon="edit" size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(type.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <MaterialSymbol icon="delete" size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingType ? 'Modifier Type de Conteneur' : 'Nouveau Type de Conteneur'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MaterialSymbol icon="close" size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={!!editingType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Ex: 20GP, 40HC"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 20' Standard"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longueur (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={longueurStr}
                      onChange={(e) => setLongueurStr(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6.06"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Largeur (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={largeurStr}
                      onChange={(e) => setLargeurStr(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2.44"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hauteur (m)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={hauteurStr}
                      onChange={(e) => setHauteurStr(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2.59"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={capaciteStr}
                    onChange={(e) => setCapaciteStr(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="33.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Description détaillée</label>
                  <input
                    type="text"
                    value={textDesc}
                    onChange={(e) => setTextDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Conteneur sec pour marchandises générales"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingType ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
