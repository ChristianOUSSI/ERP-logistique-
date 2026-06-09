'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react'
import { DataTable } from '@/components/shared/DataTable'
import { ClientMagasin, ClientMagasinCreate, ClientMagasinUpdate } from '@/types/magasin'
import { PortIllustration } from '@/components/illustrations/PortIllustration'
import { ModuleLayout } from '@/components/layout/ModuleLayout'

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientMagasin[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<ClientMagasin | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    {
      key: 'code',
      header: 'Code',
      cell: (row: ClientMagasin) => <span className="font-mono font-medium">{row.code}</span>
    },
    {
      key: 'nom',
      header: 'Nom',
      cell: (row: ClientMagasin) => (
        <div>
          <div className="font-medium">{row.nom} {row.prenom}</div>
          {row.raison_sociale && <div className="text-sm text-gray-500">{row.raison_sociale}</div>}
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      cell: (row: ClientMagasin) => (
        <div className="space-y-1">
          {row.telephone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3 w-3" />
              {row.telephone}
            </div>
          )}
          {row.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3" />
              {row.email}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'adresse',
      header: 'Adresse',
      cell: (row: ClientMagasin) => (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-3 w-3" />
          <span>{row.ville}, {row.pays}</span>
        </div>
      )
    },
    {
      key: 'statut',
      header: 'Statut',
      cell: (row: ClientMagasin) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          row.est_actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.est_actif ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row: ClientMagasin) => (
        <div className="flex gap-2">
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

  const handleEdit = (client: ClientMagasin) => {
    setSelectedClient(client)
    setShowEditModal(true)
  }

  const handleDelete = async (clientId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setIsLoading(true)
      try {
        // API call to delete client
        // await apiClient.delete(`/api/magasin/clients/${clientId}`)
        setClients(clients.filter(c => c.id !== clientId))
      } catch (error) {
        console.error('Error deleting client:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const filteredClients = clients.filter(client =>
    client.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.raison_sociale && client.raison_sociale.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <ModuleLayout moduleName="magasin">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Gestion des profils clients</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20">
              <PortIllustration className="w-full h-full" />
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Client
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher par code, nom ou raison sociale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredClients}
          isLoading={isLoading}
        />

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">Nouveau Client</h2>
              <ClientForm
                onSubmit={async (data) => {
                  setIsLoading(true)
                  try {
                    // API call to create client
                    // const response = await apiClient.post('/api/magasin/clients', data)
                    // setClients([...clients, response.data])
                    setShowCreateModal(false)
                  } catch (error) {
                    console.error('Error creating client:', error)
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
        {showEditModal && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6">
              <h2 className="mb-4 text-xl font-bold">Modifier Client</h2>
              <ClientForm
                initialData={selectedClient}
                onSubmit={async (data) => {
                  setIsLoading(true)
                  try {
                    // API call to update client
                    // const response = await apiClient.put(`/api/magasin/clients/${selectedClient.id}`, data)
                    // setClients(clients.map(c => c.id === selectedClient.id ? response.data : c))
                    setShowEditModal(false)
                    setSelectedClient(null)
                  } catch (error) {
                    console.error('Error updating client:', error)
                  } finally {
                    setIsLoading(false)
                  }
                }}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedClient(null)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </ModuleLayout>
  )
}

function ClientForm({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: ClientMagasin
  onSubmit: (data: ClientMagasinCreate | ClientMagasinUpdate) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(
    initialData || {
      code: '',
      nom: '',
      prenom: '',
      raison_sociale: '',
      telephone: '',
      email: '',
      adresse: '',
      ville: '',
      pays: 'Cameroun',
      numero_contribuable: '',
      est_actif: true
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Code *</label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Raison sociale</label>
          <Input
            value={formData.raison_sociale || ''}
            onChange={(e) => setFormData({ ...formData, raison_sociale: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom *</label>
          <Input
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Prénom</label>
          <Input
            value={formData.prenom || ''}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone</label>
          <Input
            value={formData.telephone || ''}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Adresse</label>
        <Input
          value={formData.adresse || ''}
          onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Ville</label>
          <Input
            value={formData.ville || ''}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Pays</label>
          <Input
            value={formData.pays || ''}
            onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Numéro contribuable</label>
        <Input
          value={formData.numero_contribuable || ''}
          onChange={(e) => setFormData({ ...formData, numero_contribuable: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="est_actif"
          checked={formData.est_actif}
          onChange={(e) => setFormData({ ...formData, est_actif: e.target.checked })}
          className="h-4 w-4"
        />
        <label htmlFor="est_actif" className="text-sm font-medium">Client actif</label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={false}>
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
