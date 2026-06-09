'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Truck, CheckCircle, XCircle, Calendar, Warehouse } from 'lucide-react'
import { DataTable } from '@/components/shared/DataTable'
import { Reception, ReceptionCreate, LigneReceptionCreate, StatutReception, UniteMesure } from '@/types/magasin'
import { PortIllustration } from '@/components/illustrations/PortIllustration'
import { ModuleLayout } from '@/components/layout/ModuleLayout'

export default function ReceptionsPage() {
  const [receptions, setReceptions] = useState<Reception[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReception, setSelectedReception] = useState<Reception | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    {
      key: 'numero_reception',
      header: 'N° Réception',
      cell: (row: Reception) => <span className="font-mono font-medium text-blue-600">{row.numero_reception}</span>
    },
    {
      key: 'declaration',
      header: 'Déclaration',
      cell: (row: Reception) => (
        <div>
          <div className="font-medium">{row.declaration?.numero_bl}</div>
          <div className="text-sm text-gray-500">{row.declaration?.client?.nom}</div>
        </div>
      )
    },
    {
      key: 'magasin',
      header: 'Magasin',
      cell: (row: Reception) => (
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-gray-400" />
          <span>{row.magasin?.nom}</span>
        </div>
      )
    },
    {
      key: 'date_reception',
      header: 'Date réception',
      cell: (row: Reception) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{new Date(row.date_reception).toLocaleDateString('fr-FR')}</span>
        </div>
      )
    },
    {
      key: 'statut',
      header: 'Statut',
      cell: (row: Reception) => {
        const statusConfig = {
          [StatutReception.EN_COURS]: { color: 'bg-yellow-100 text-yellow-800', icon: Truck },
          [StatutReception.COMPLETEE]: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
          [StatutReception.ANNULEE]: { color: 'bg-red-100 text-red-800', icon: XCircle }
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
      cell: (row: Reception) => (
        <div className="flex gap-2">
          {row.statut === StatutReception.EN_COURS && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleComplete(row.id)}
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

  const handleEdit = (reception: Reception) => {
    setSelectedReception(reception)
    setShowEditModal(true)
  }

  const handleComplete = async (receptionId: number) => {
    setIsLoading(true)
    try {
      // API call to complete reception
      // await apiClient.post(`/api/magasin/receptions/${receptionId}/completer`)
      setReceptions(receptions.map(r => 
        r.id === receptionId ? { ...r, statut: StatutReception.COMPLETEE } : r
      ))
    } catch (error) {
      console.error('Error completing reception:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (receptionId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réception ? Le stock sera ajusté.')) {
      setIsLoading(true)
      try {
        // API call to delete reception
        // await apiClient.post(`/api/magasin/receptions/${receptionId}/annuler`)
        setReceptions(receptions.filter(r => r.id !== receptionId))
      } catch (error) {
        console.error('Error deleting reception:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const filteredReceptions = receptions.filter(reception =>
    reception.numero_reception.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (reception.declaration?.numero_bl && reception.declaration.numero_bl.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <ModuleLayout moduleName="magasin">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Réceptions</h1>
            <p className="text-gray-600 mt-1">Réception des marchandises dans les magasins</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20">
              <PortIllustration className="w-full h-full" />
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Réception
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher par N° réception ou déclaration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredReceptions}
          isLoading={isLoading}
        />

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-4xl rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">Nouvelle Réception</h2>
              <ReceptionForm
                onSubmit={async (data) => {
                  setIsLoading(true)
                  try {
                    // API call to create reception
                    // const response = await apiClient.post('/api/magasin/receptions', data, { params: { recu_par: 'user' } })
                    // setReceptions([...receptions, response.data])
                    setShowCreateModal(false)
                  } catch (error) {
                    console.error('Error creating reception:', error)
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
        {showEditModal && selectedReception && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-4xl rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">Modifier Réception</h2>
              <ReceptionForm
                initialData={selectedReception}
                onSubmit={async (data) => {
                  setIsLoading(true)
                  try {
                    // API call to update reception
                    // const response = await apiClient.put(`/api/magasin/receptions/${selectedReception.id}`, data)
                    // setReceptions(receptions.map(r => r.id === selectedReception.id ? response.data : r))
                    setShowEditModal(false)
                    setSelectedReception(null)
                  } catch (error) {
                    console.error('Error updating reception:', error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedReception(null)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  )
}

function ReceptionForm({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: Reception
  onSubmit: (data: ReceptionCreate) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<ReceptionCreate>({
    declaration_id: initialData?.declaration_id || 0,
    magasin_id: initialData?.magasin_id || 0,
    statut: initialData?.statut || StatutReception.EN_COURS,
    notes: initialData?.notes || '',
    lignes: initialData?.lignes?.map(l => ({
      article_id: l.article_id,
      quantite_recue: l.quantite_recue,
      unite_mesure: l.unite_mesure,
      quantite_udb: l.quantite_udb
    })) || []
  })

  const [newLigne, setNewLigne] = useState<LigneReceptionCreate>({
    article_id: 0,
    quantite_recue: 0,
    unite_mesure: UniteMesure.UDB,
    quantite_udb: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addLigne = () => {
    if (newLigne.article_id && newLigne.quantite_recue > 0) {
      setFormData({
        ...formData,
        lignes: [...formData.lignes, { ...newLigne }]
      })
      setNewLigne({
        article_id: 0,
        quantite_recue: 0,
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
          <label className="mb-1 block text-sm font-medium">Déclaration *</label>
          <Select
            value={formData.declaration_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, declaration_id: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une déclaration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">BL-2024-0001 - Client 1</SelectItem>
              <SelectItem value="2">BL-2024-0002 - Client 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Magasin *</label>
          <Select
            value={formData.magasin_id.toString()}
            onValueChange={(value) => setFormData({ ...formData, magasin_id: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un magasin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Magasin Principal</SelectItem>
              <SelectItem value="2">Magasin Secondaire</SelectItem>
              <SelectItem value="3">Magasin Tertiaire</SelectItem>
            </SelectContent>
          </Select>
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
        <h3 className="mb-3 font-semibold">Lignes de réception</h3>
        
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
              <label className="mb-1 block text-xs font-medium">Quantité reçue</label>
              <Input
                type="number"
                step="0.001"
                value={newLigne.quantite_recue}
                onChange={(e) => setNewLigne({ ...newLigne, quantite_recue: parseFloat(e.target.value) })}
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
                  <span>{ligne.quantite_recue} {ligne.unite_mesure}</span>
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
