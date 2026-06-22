"use client"

import { useState } from 'react'
import { MaterialSymbol } from '@/components/MaterialSymbol'
import Link from 'next/link'

export default function IncotermsPage() {
  const [incoterms, setIncoterms] = useState([
    { id: 1, code: 'EXW', description: 'Ex Works', lieu: 'Usine' },
    { id: 2, code: 'FOB', description: 'Free On Board', lieu: 'Port de départ' },
    { id: 3, code: 'CIF', description: 'Cost, Insurance and Freight', lieu: 'Port de destination' },
    { id: 4, code: 'DAP', description: 'Delivered at Place', lieu: 'Lieu de destination' },
    { id: 5, code: 'DDP', description: 'Delivered Duty Paid', lieu: 'Lieu de destination' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingIncoterm, setEditingIncoterm] = useState(null)

  const filteredIncoterms = incoterms.filter(incoterm =>
    incoterm.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incoterm.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = () => {
    setEditingIncoterm(null)
    setShowModal(true)
  }

  const handleEdit = (incoterm) => {
    setEditingIncoterm(incoterm)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet incoterm?')) {
      setIncoterms(incoterms.filter(i => i.id !== id))
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Incoterms</h1>
          <p className="text-gray-600 mt-1">Gérer les conditions de livraison internationales</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MaterialSymbol icon="add" size={20} />
          Nouvel Incoterm
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <MaterialSymbol icon="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un incoterm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Incoterms Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredIncoterms.map((incoterm) => (
              <tr key={incoterm.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono font-semibold text-blue-600">{incoterm.code}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{incoterm.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{incoterm.lieu}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(incoterm)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <MaterialSymbol icon="edit" size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(incoterm.id)}
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
                {editingIncoterm ? 'Modifier Incoterm' : 'Nouvel Incoterm'}
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
                    defaultValue={editingIncoterm?.code || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: EXW, FOB, CIF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    defaultValue={editingIncoterm?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Ex Works"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                  <input
                    type="text"
                    defaultValue={editingIncoterm?.lieu || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Usine, Port de départ"
                  />
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
                {editingIncoterm ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
