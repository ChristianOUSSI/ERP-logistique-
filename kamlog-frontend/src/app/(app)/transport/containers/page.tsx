'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Map, ArchiveRestore, Ship, AlertCircle, RefreshCw, Layers, MapPin, Anchor, CheckCircle, Clock, Trash2, Edit, X } from 'lucide-react'
import { ModuleLayout } from '@/components/layout/ModuleLayout'
import { parcAPI } from '@/lib/api-client'
import { toast } from 'sonner'

interface Zone {
  id: number
  code_zone: string
  nom_zone: string
  type_zone: string
  capacite_evp: number
  description?: string
  created_at: string
  emplacements: Emplacement[]
}

interface Emplacement {
  id: number
  code_emplacement: string
  zone_id: number
  rangee: string
  bay: number
  tier: number
  statut: string
  created_at: string
}

/* ====================== COMPONENTS ====================== */
const ZoneSelect = ({
  value,
  onChange,
  placeholder = 'Sélectionner une zone',
  disabled = false
}: {
  value?: string | number
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) => {
  const [zones, setZones] = useState<Array<{value: string; label: string}>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadZones = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await parcAPI.getZones()
        const data = res.data || []
        setZones(
          data.map((z: any) => ({
            value: z.id.toString(),
            label: `${z.code_zone} - ${z.nom_zone}`
          }))
        )
      } catch (err) {
        console.error('Failed to load zones', err)
        setError('Failed to load zones')
        setZones([])
      } finally {
        setLoading(false)
      }
    }

    loadZones()
  }, [])

  if (loading) {
    return null;
  }
  return <div><h1>Containers</h1></div>;
}
