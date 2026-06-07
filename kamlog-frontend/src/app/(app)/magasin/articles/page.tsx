'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Package, Scale, Box } from 'lucide-react'
import { DataTable } from '@/components/shared/DataTable'
import { Article, ArticleCreate, ArticleUpdate, UniteMesure } from '@/types/magasin'
import { PortIllustration } from '@/components/illustrations/PortIllustration'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    {
      key: 'code_article',
      header: 'Code Article',
      cell: (row: Article) => <span className="font-mono font-medium text-blue-600">{row.code_article}</span>
    },
    {
      key: 'nom',
      header: 'Nom du produit',
      cell: (row: Article) => (
        <div>
          <div className="font-medium">{row.nom}</div>
          {row.description && <div className="text-sm text-gray-500">{row.description}</div>}
        </div>
      )
    },
    {
      key: 'unite_mesure',
      header: 'Unité',
      cell: (row: Article) => (
        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
          {row.unite_mesure}
        </span>
      )
    },
    {
      key: 'specs',
      header: 'Spécifications',
      cell: (row: Article) => (
        <div className="space-y-1 text-sm">
          {row.poids_unitaire && (
            <div className="flex items-center gap-2">
              <Scale className="h-3 w-3" />
              <span>{row.poids_unitaire} kg/unité</span>
            </div>
          )}
          {row.volume_unitaire && (
            <div className="flex items-center gap-2">
              <Box className="h-3 w-3" />
              <span>{row.volume_unitaire} m³/unité</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'statut',
      header: 'Statut',
      cell: (row: Article) => (
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
      cell: (row: Article) => (
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

  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
    setShowEditModal(true)
  }

  const handleDelete = async (articleId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setIsLoading(true)
      try {
        // API call to delete article
        // await apiClient.delete(`/api/magasin/articles/${articleId}`)
        setArticles(articles.filter(a => a.id !== articleId))
      } catch (error) {
        console.error('Error deleting article:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const filteredArticles = articles.filter(article =>
    article.code_article.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.nom.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Codes Article</h1>
          <p className="text-gray-600 mt-1">Gestion des codes d'article (génération automatique)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20">
            <PortIllustration className="w-full h-full" />
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Article
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher par code ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredArticles}
        isLoading={isLoading}
      />

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Nouvel Article</h2>
            <ArticleForm
              onSubmit={async (data) => {
                setIsLoading(true)
                try {
                  // API call to create article
                  // const response = await apiClient.post('/api/magasin/articles', data)
                  // setArticles([...articles, response.data])
                  setShowCreateModal(false)
                } catch (error) {
                  console.error('Error creating article:', error)
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
      {showEditModal && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Modifier Article</h2>
            <ArticleForm
              initialData={selectedArticle}
              onSubmit={async (data) => {
                setIsLoading(true)
                try {
                  // API call to update article
                  // const response = await apiClient.put(`/api/magasin/articles/${selectedArticle.id}`, data)
                  // setArticles(articles.map(a => a.id === selectedArticle.id ? response.data : a))
                  setShowEditModal(false)
                  setSelectedArticle(null)
                } catch (error) {
                  console.error('Error updating article:', error)
                } finally {
                  setIsLoading(false)
                }
              }}
              onCancel={() => {
                setShowEditModal(false)
                setSelectedArticle(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ArticleForm({
  initialData,
  onSubmit,
  onCancel
}: {
  initialData?: Article
  onSubmit: (data: ArticleCreate | ArticleUpdate) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(
    initialData || {
      code_article: '',
      nom: '',
      description: '',
      unite_mesure: UniteMesure.UDB,
      poids_unitaire: undefined,
      volume_unitaire: undefined,
      est_actif: true
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Code Article {initialData ? '' : '(généré automatiquement si vide)'}
        </label>
        <Input
          value={formData.code_article}
          onChange={(e) => setFormData({ ...formData, code_article: e.target.value })}
          placeholder="Ex: 1000001"
          disabled={!!initialData}
        />
        {!initialData && (
          <p className="mt-1 text-xs text-gray-500">
            Le code doit commencer par 1 et avoir 7 chiffres minimum
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Nom du produit *</label>
        <Input
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border border-gray-300 p-2"
          rows={3}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Unité de mesure *</label>
        <Select
          value={formData.unite_mesure}
          onValueChange={(value) => setFormData({ ...formData, unite_mesure: value as UniteMesure })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UniteMesure.UDB}>UDB (Unité de base)</SelectItem>
            <SelectItem value={UniteMesure.KG}>Kilogramme (KG)</SelectItem>
            <SelectItem value={UniteMesure.TONNE}>Tonne</SelectItem>
            <SelectItem value={UniteMesure.M3}>Mètre cube (M³)</SelectItem>
            <SelectItem value={UniteMesure.M2}>Mètre carré (M²)</SelectItem>
            <SelectItem value={UniteMesure.UNITE}>Unité</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Poids unitaire (kg)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.poids_unitaire || ''}
            onChange={(e) => setFormData({ ...formData, poids_unitaire: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Volume unitaire (m³)</label>
          <Input
            type="number"
            step="0.01"
            value={formData.volume_unitaire || ''}
            onChange={(e) => setFormData({ ...formData, volume_unitaire: e.target.value ? parseFloat(e.target.value) : undefined })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="est_actif"
          checked={formData.est_actif}
          onChange={(e) => setFormData({ ...formData, est_actif: e.target.checked })}
          className="h-4 w-4"
        />
        <label htmlFor="est_actif" className="text-sm font-medium">Article actif</label>
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
