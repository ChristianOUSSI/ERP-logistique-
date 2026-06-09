'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, FileText, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { DataTable } from '@/components/shared/DataTable'
import { Declaration, DeclarationCreate, LigneDeclarationCreate, StatutDeclaration, UniteMesure } from '@/types/magasin'
import { PortIllustration } from '@/components/illustrations/PortIllustration'
import { ModuleLayout } from '@/components/layout/ModuleLayout'

export default function DeclarationsPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDeclaration, setSelectedDeclaration] = useState<Declaration | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    {
      key: 'numero_bl',
      header: 'N° BL',
      cell: (row: Declaration) => <span className="font-mono font-medium text-blue-600">{row.numero_bl}</span>
    },
    {
      key: 'client',
      header: 'Client',
      cell: (row: Declaration) => (
        <div>
          <div className="font-medium">{row.client?.nom} {row.client?.prenom}</div>
          {row.client?.raison_sociale && <div className="text-sm text-gray-500">{row.client.raison_sociale}</div>}
        </div>
      )
    },
    {
      key: 'date_declaration',
      header: 'Date déclaration',
      cell: (row: Declaration) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(row.date_declaration).toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
    {
      key: 'date_arrivee',
      header: 'Arrivée prévue',
      cell: (row: Declaration) => (
        row.date_arrivee_prevue ? new Date(row.date_arrivee_prevue).toLocaleDateString('fr-FR') : '-'
      )
    },
    {
      key: 'statut',
      header: 'Statut',
      cell: (row: Declaration) => {
        const statusConfig = {
          [StatutDeclaration.BROUILLON]: { color: 'bg-yellow-100 text-yellow-800', icon: FileText },
          [StatutDeclaration.VALIDEE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
          [StatutDeclaration.ANNULEE]: { color: 'bg-red-100 text-red-800', icon: XCircle }
        }
        const config = statusConfig[row.statut]
        const Icon = config.icon
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
            <Icon className="h-3 w-3" />
            {row.statut}
          </span>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row: Declaration) => (
        <div className="flex gap-2">
          {row.statut === StatutDeclaration.BROUILLON && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleValidate(row.id)}
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )
    }
  ]

  const handleEdit = (declaration: Declaration) => {
    setSelectedDeclaration(declaration)
    setShowEditModal(true)
  }

  const handleValidate = async (declarationId: number) => {
    setIsLoading(true)
    try {
      // API call to validate declaration
      // await apiClient.post(`/api/magasin/declarations/${declarationId}/valider`)
      setDeclarations(declarations.map(d => 
        d.id === declarationId ? { ...d, statut: StatutDeclaration.VALIDEE } : d
      ))
    } catch (error) {
      console.error('Error validating declaration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (declarationId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette déclaration ?')) {
      setIsLoading(true)
      try {
        // API call to delete declaration
        // await apiClient.delete(`/api/magasin/declarations/${declarationId}`)
        setDeclarations(declarations.filter(d => d.id !== declarationId))
      } catch (error) {
        console.error('Error deleting declaration:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const filteredDeclarations = declarations.filter(declaration =>
    declaration.numero_bl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (declaration.client?.nom && declaration.client.nom.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <ModuleLayout moduleName="magasin">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Déclarations (Bill of Lading)</h1>
            <p className="text-gray-600 mt-1">Gestion des déclarations de marchandises</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20">
              <PortIllustration className="w-full h-full" />
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Déclaration
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher par N° BL ou client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredDeclarations}
          isLoading={isLoading}
        />

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-4xl rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">Nouvelle Déclaration</h2>
              <DeclarationForm
                onSubmit={async (data) => {
                  setIsLoading(true)
                  try {
                    // API call to create declaration
                    // const response = await apiClient.post('/api/magasin/declarations', data, { params: { cree_par: 'user' } })
                    // setDeclarations([...declarations, response.data])
                    setShowCreateModal(false)
                  } catch (error) {
                    console.error('Error creating declaration:', error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedDeclaration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-4xl rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">Modifier Déclaration</h2>
              <DeclarationForm
                initialData={selectedDeclaration}
                onSubmit={async (data) => {
                  setIsLoading(true)
                  try {
                    // API call to update declaration
                    // const response = await apiClient.put(`/api/magasin/declarations/${selectedDeclaration.id}`, data)
                    // setDeclarations(declarations.map(d => d.id === selectedDeclaration.id ? response.data : d))
                    setShowEditModal(false)
                    setSelectedDeclaration(null)
                  } catch (error) {
                    console.error('Error updating declaration:', error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedDeclaration(null)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  )
}

function DeclarationForm({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: Declaration
  onSubmit: (data: DeclarationCreate) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<DeclarationCreate>({
    client_id: initialData?.client_id || 0,
    date_arrivee_prevue: initialData?.date_arrivee_prevue ? new Date(initialData.date_arrivee_prevue).toISOString().split('T')[0] : '',
    statut: initialData?.statut || StatutDeclaration.BROUILLON,
    notes: initialData?.notes || '',
    lignes: initialData?.lignes?.map(l => ({
      article_id: l.article_id,
      quantite_declaree: l.quantite_declaree,
      unite_mesure: l.unite_mesure,
      quantite_udb: l.quantite_udb
    })) || []
  })

  const [newLigne, setNewLigne] = useState<LigneDeclarationCreate>({
    article_id: 0,
    quantite_declaree: 0,
    unite_mesure: UniteMesure.UDB,
    quantite_udb: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addLigne = () => {
    if (newLigne.article_id && newLigne.quantite_declaree > 0) {
      setFormData({
        ...formData,
        lignes: [...formData.lignes, { ...newLigne }]
      })
      setNewLigne({
        article_id: 0,
        quantite_declaree: 0,
        unite_mesure: UniteMesure.UDB,
        quantite_udb: 0
      })
    }
  }

  const removeLigne = (index: number) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.filter((_, i) => i !== index)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Client *</label>
          <Select
            value={formData.client_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, client_id: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Client 1</SelectItem>
              <SelectItem value="2">Client 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Date arrivée prévue</label>
          <Input
            type="date"
            value={formData.date_arrivee_prevue}
            onChange={(e) => setFormData({ ...formData, date_arrivee_prevue: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-md border border-gray-300 p-2"
          rows={2}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-3 font-semibold">Lignes de déclaration</h3>
        
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Article</label>
              <Select
                value={newLigne.article_id.toString()}
                onValueChange={(value) => setNewLigne({ ...newLigne, article_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Article" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Riz Bellaluna 25kg</SelectItem>
                  <SelectItem value="2">Riz Bellaluna 50kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Quantité</label>
              <Input
                type="number"
                step="0.001"
                value={newLigne.quantite_declaree}
                onChange={(e) => setNewLigne({ ...newLigne, quantite_declaree: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Unité</label>
              <Select
                value={newLigne.unite_mesure}
                onValueChange={(value) => setNewLigne({ ...newLigne, unite_mesure: value as UniteMesure })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UniteMesure.UDB}>UDB</SelectItem>
                  <SelectItem value={UniteMesure.KG}>KG</SelectItem>
                  <SelectItem value={UniteMesure.TONNE}>Tonne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addLigne} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        {formData.lignes.length > 0 && (
          <div className="space-y-2">
            {formData.lignes.map((ligne, index) => (
              <div key={index} className="flex items-center justify-between rounded border bg-white p-2">
                <div className="text-sm">
                  <span className="font-medium">Article #{ligne.article_id}</span>
                  <span className="mx-2 text-gray-500">|</span>
                  <span>{ligne.quantite_declaree} {ligne.unite_mesure}</span>
                  {ligne.quantite_udb && (
                    <span className="mx-2 text-gray-500">|</span>
                  )}
                  {ligne.quantite_udb && <span className="text-gray-500">({ligne.quantite_udb} UDB)</span>}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLigne(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={formData.lignes.length === 0}>
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
