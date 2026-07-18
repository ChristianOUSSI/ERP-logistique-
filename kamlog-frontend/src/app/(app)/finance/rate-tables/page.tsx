'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings2, FileText, TrendingUp } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function RateTablesPage() {
  // Static data for presentation (connected to React Query in production)
  const rateTables = [
    { id: 1, name: 'Standard General Cargo 2026', client: 'Tous', currency: 'XAF', rules_count: 45, is_active: true },
    { id: 2, name: 'Contrat Premium - SABC', client: 'SABC SA', currency: 'XAF', rules_count: 12, is_active: true },
    { id: 3, name: 'Import Asie FCL (Douala)', client: 'Tous', currency: 'USD', rules_count: 8, is_active: false },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Grilles Tarifaires (TPO)</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les tarifs de transport, les règles de calcul et l'optimisation des prix.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings2 className="w-4 h-4 mr-2" />
            Règles Globales
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Grille
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Grilles Actives</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">En cours d'application</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Règles de Calcul</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-muted-foreground mt-1">Combinaisons tarifaires</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Grilles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la grille</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Devise</TableHead>
                  <TableHead>Nb. Règles</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rateTables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>{table.client}</TableCell>
                    <TableCell>{table.currency}</TableCell>
                    <TableCell>{table.rules_count}</TableCell>
                    <TableCell>
                      <Badge variant={table.is_active ? "default" : "secondary"}>
                        {table.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Éditer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
