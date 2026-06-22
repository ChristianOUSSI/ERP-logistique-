'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface DropdownOption {
  value: string | number
  label: string
}

interface DropdownSelectProps {
  label: string
  options: DropdownOption[]
  value?: string | number
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export function DropdownSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  required = false,
  disabled = false,
}: DropdownSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`select-${label}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value?.toString()} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={`select-${label}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value.toString()} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Composants spécialisés pour chaque type de dropdown

export function MagasinDropdown({ value, onChange, required = false }: { value?: string; onChange: (value: string) => void; required?: boolean }) {
  const magasins = [
    { value: '1', label: 'MAG3 - Magasin 3' },
    { value: '2', label: 'DNW1 - Depot Nord West 1' },
    { value: '3', label: 'DNW2 - Depot Nord West 2' },
  ]

  return (
    <DropdownSelect
      label="Magasin"
      options={magasins}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner un magasin"
      required={required}
    />
  )
}

export function CategorieArticleDropdown({ value, onChange, required = false }: { value?: string; onChange: (value: string) => void; required?: boolean }) {
  const categories = [
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

  return (
    <DropdownSelect
      label="Catégorie d'Article"
      options={categories}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner une catégorie"
      required={required}
    />
  )
}

export function IncotermDropdown({ value, onChange, required = false }: { value?: string; onChange: (value: string) => void; required?: boolean }) {
  const incoterms = [
    { value: '1', label: 'EXW - Ex Works' },
    { value: '2', label: 'FCA - Free Carrier' },
    { value: '3', label: 'FAS - Free Alongside Ship' },
    { value: '4', label: 'FOB - Free On Board' },
    { value: '5', label: 'CPT - Carriage Paid To' },
    { value: '6', label: 'CIP - Carriage and Insurance Paid To' },
    { value: '7', label: 'CFR - Cost and Freight' },
    { value: '8', label: 'CIF - Cost, Insurance and Freight' },
    { value: '9', label: 'DAP - Delivered At Place' },
    { value: '10', label: 'DPU - Delivered at Place Unloaded' },
    { value: '11', label: 'DDP - Delivered Duty Paid' },
  ]

  return (
    <DropdownSelect
      label="Incoterm"
      options={incoterms}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner un incoterm"
      required={required}
    />
  )
}

export function TypeConteneurDropdown({ value, onChange, required = false }: { value?: string; onChange: (value: string) => void; required?: boolean }) {
  const typesConteneur = [
    { value: '1', label: '20\' Dry' },
    { value: '2', label: '40\' Dry' },
    { value: '3', label: '40\' High Cube' },
    { value: '4', label: '40\' Reefer' },
    { value: '5', label: 'Open Top' },
    { value: '6', label: 'Flat Rack' },
    { value: '7', label: 'Tank' },
    { value: '8', label: 'Ventilated' },
    { value: '9', label: 'Insulated' },
  ]

  return (
    <DropdownSelect
      label="Type de Conteneur"
      options={typesConteneur}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner un type de conteneur"
      required={required}
    />
  )
}

export function StatutStockDropdown({ value, onChange, required = false }: { value?: string; onChange: (value: string) => void; required?: boolean }) {
  const statuts = [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'DECHIRE', label: 'Déchiré' },
    { value: 'MOUILLE', label: 'Mouillé' },
    { value: 'ENDOMMAGE', label: 'Endommagé' },
    { value: 'PERIME', label: 'Périmé' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'RESERVE', label: 'Réservé' },
  ]

  return (
    <DropdownSelect
      label="Statut du Stock"
      options={statuts}
      value={value}
      onChange={onChange}
      placeholder="Sélectionner un statut"
      required={required}
    />
  )
}
