"use client"

import { useState } from 'react'
import { MaterialSymbol } from '@/components/MaterialSymbol'

interface Category {
  id: number
  code: string
  description: string
  parent: string | null
  niveau: number
}

export default function ArticleCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, code: 'ALIM', description: 'Alimentation', parent: null, niveau: 1 },
    { id: 2, code: 'ELEC', description: 'Électronique', parent: null, niveau: 1 },
    { id: 3, code: 'TEXT', description: 'Textile', parent: null, niveau: 1 },
    { id: 4, code: 'ALIM-FRAIS', description: 'Produits frais', parent: 'ALIM', niveau: 2 },
    { id: 5, code: 'ALIM-SEC', description: 'Produits secs', parent: 'ALIM', niveau: 2 },
    { id: 6, code: 'ELEC-INFO', description: 'Informatique', parent: 'ELEC', niveau: 2 },
    { id: 7, code: 'ELEC-TEL', description: 'Téléphonie', parent: 'ELEC', niveau: 2 },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const filteredCategories = categories.filter(category =>
    category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) {
      setCategories(categories.filter(c => c.id !== id))
    }
  }

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
          <p className="text-gray-600 mt-1">Gérer la classification des articles</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MaterialSymbol icon="add" size={20} />
          Nouvelle Catégorie
        </button>
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
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <MaterialSymbol icon="edit" size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <MaterialSymbol icon="delete" size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Modifier Catégorie' : 'Nouvelle Catégorie'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MaterialSymbol icon="close" size={20} />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    defaultValue={editingCategory?.code || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: ALIM, ELEC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    defaultValue={editingCategory?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Alimentation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie parent</label>
                  <select
                    defaultValue={editingCategory?.parent || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Aucune (catégorie principale)</option>
                    {categories.filter(c => c.niveau === 1).map(cat => (
                      <option key={cat.id} value={cat.code}>{cat.code} - {cat.description}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    defaultValue={editingCategory?.niveau || 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>Niveau 1 - Catégorie principale</option>
                    <option value={2}>Niveau 2 - Sous-catégorie</option>
                    <option value={3}>Niveau 3 - Sous-sous-catégorie</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingCategory ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
