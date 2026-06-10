'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface Magasin {
  id: number
  code: string
  nom: string
}

interface CategorieArticle {
  value: string
  label: string
}

interface StatutStock {
  value: string
  label: string
}

const magasins: Magasin[] = [
  { id: 1, code: 'MAG3', nom: 'Magasin 3' },
  { id: 2, code: 'DNW1', nom: 'Depot Nord West 1' },
  { id: 3, code: 'DNW2', nom: 'Depot Nord West 2' },
]

const categoriesArticle: CategorieArticle[] = [
  { value: 'ALIMENTAIRE', label: 'Alimentaire' },
  { value: 'PHARMACEUTIQUE', label: 'Produits Pharmaceutiques' },
  { value: 'MATIERES_PREMIERES', label: 'Matières Premières' },
  { value: 'PRODUITS_FINIS', label: 'Produits Finis' },
  { value: 'EMBALLAGES_PALETES', label: 'Emballages et Palettes' },
  { value: 'EQUIPEMENT', label: 'Équipement' },
  { value: 'PIECES_DETACHEES', label: 'Pièces Détachées' },
  { value: 'MOBILIER_BUREAU_INFORMATIQUE', label: 'Mobilier de Bureau / Informatique' },
  { value: 'PRODUITS_DANGEREUX', label: 'Produits Dangereux (HAZMAT)' },
  { value: 'PRODUITS_LUXE_VALEUR', label: 'Produits de Luxe / Valeur' },
  { value: 'VRAC', label: 'Vrac (Bulk)' },
  { value: 'HORS_GABARIT', label: 'Hors-Gabarit (OOG)' },
]

const statutsStock: StatutStock[] = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'DECHIRE', label: 'Déchiré' },
  { value: 'MOUILLE', label: 'Mouillé' },
  { value: 'ENDOMMAGE', label: 'Endommagé' },
  { value: 'PERIME', label: 'Périmé' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'RESERVE', label: 'Réservé' },
]

interface StockFilterProps {
  onFilter: (filters: any) => void
}

export function StockFilter({ onFilter }: StockFilterProps) {
  const [codeArticle, setCodeArticle] = useState('')
  const [selectedMagasins, setSelectedMagasins] = useState<number[]>([])
  const [clientId, setClientId] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [statut, setStatut] = useState('')
  const [categorie, setCategorie] = useState('')

  const handleMagasinToggle = (magasinId: number) => {
    setSelectedMagasins((prev) =>
      prev.includes(magasinId)
        ? prev.filter((id) => id !== magasinId)
        : [...prev, magasinId]
    )
  }

  const handleSelectAllMagasins = () => {
    if (selectedMagasins.length === magasins.length) {
      setSelectedMagasins([])
    } else {
      setSelectedMagasins(magasins.map((m) => m.id))
    }
  }

  const handleReset = () => {
    setCodeArticle('')
    setSelectedMagasins([])
    setClientId('')
    setDateDebut('')
    setDateFin('')
    setStatut('')
    setCategorie('')
  }

  const handleSearch = () => {
    onFilter({
      code_article: codeArticle || undefined,
      magasin_ids: selectedMagasins.length > 0 ? selectedMagasins : undefined,
      client_id: clientId || undefined,
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
      statut: statut || undefined,
      categorie: categorie || undefined,
    })
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Filtres de Recherche</h2>
          <p className="text-gray-600">Recherche avancée de stock</p>
        </div>
        <Button variant="outline" onClick={handleReset} size="sm">
          <X className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <div className="space-y-6">
        {/* Code Article */}
        <div>
          <Label htmlFor="codeArticle">Code d'Article</Label>
          <Input
            id="codeArticle"
            type="text"
            placeholder="Ex: 1111110"
            value={codeArticle}
            onChange={(e) => setCodeArticle(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Code d'article de 7 chiffres
          </p>
        </div>

        {/* Magasins (Multi-sélection) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Magasins</Label>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={handleSelectAllMagasins}
            >
              {selectedMagasins.length === magasins.length
                ? 'Désélectionner tout'
                : 'Sélectionner tout'}
            </Button>
          </div>
          <div className="space-y-2">
            {magasins.map((magasin) => (
              <div key={magasin.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`magasin-${magasin.id}`}
                  checked={selectedMagasins.includes(magasin.id)}
                  onCheckedChange={() => handleMagasinToggle(magasin.id)}
                />
                <label
                  htmlFor={`magasin-${magasin.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {magasin.code} - {magasin.nom}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choix obligatoire - peut sélectionner plusieurs magasins
          </p>
        </div>

        {/* Client ID */}
        <div>
          <Label htmlFor="clientId">ID Client</Label>
          <Input
            id="clientId"
            type="text"
            placeholder="ID du client"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Période */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateDebut">Date de début</Label>
            <Input
              id="dateDebut"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dateFin">Date de fin</Label>
            <Input
              id="dateFin"
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Statut */}
        <div>
          <Label htmlFor="statut">Statut du Stock</Label>
          <Select value={statut} onValueChange={setStatut}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {statutsStock.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Catégorie */}
        <div>
          <Label htmlFor="categorie">Catégorie d'Article</Label>
          <Select value={categorie} onValueChange={setCategorie}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categoriesArticle.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </Card>
  )
}
