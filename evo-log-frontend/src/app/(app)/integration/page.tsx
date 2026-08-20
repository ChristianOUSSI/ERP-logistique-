'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Link, 
  Globe, 
  ShieldCheck, 
  Building2, 
  Truck, 
  FileText, 
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search
} from 'lucide-react'
import { toast } from 'sonner'

// Mock API integration (à remplacer par api-client.ts)
const integrationAPI = {
  getIntegrations: async () => {
    // Simuler appel API
    return { data: [] }
  },
  createIntegration: async (data: any) => {
    return { data: { ...data, id: 1 } }
  },
  testConnection: async (id: number) => {
    return { data: { success: true, message: 'Connexion réussie' } }
  }
}

export default function IntegrationPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const res = await integrationAPI.getIntegrations()
      return res.data || []
    },
    enabled: mounted,
  })

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'sydonia', label: 'SYDONIA+', icon: ShieldCheck },
    { id: 'guichet', label: 'Guichet Unique', icon: Globe },
    { id: 'pcs', label: 'PCS', icon: FileText },
    { id: 'banque', label: 'Banque', icon: Building2 },
    { id: 'assureur', label: 'Assureur', icon: ShieldCheck },
    { id: 'transitaire', label: 'Transitaire', icon: Truck },
  ]

  const mockIntegrations = [
    {
      id: 1,
      code: 'SYDONIA',
      nom: 'SYDONIA+ Customs',
      type: 'SYDONIA_PLUS',
      statut: 'actif',
      derniere_synchro: '2026-01-18 14:30',
      url_api: 'https://sydonia.douane.cm/api'
    },
    {
      id: 2,
      code: 'GUICHET',
      nom: 'Guichet Unique Port',
      type: 'GUICHET_UNIQUE',
      statut: 'actif',
      derniere_synchro: '2026-01-18 15:00',
      url_api: 'https://guichet-unique.cm/api'
    },
    {
      id: 3,
      code: 'PCS',
      nom: 'Port Community System',
      type: 'PCS',
      statut: 'actif',
      derniere_synchro: '2026-01-18 15:15',
      url_api: 'https://pcs.kribi.cm/api'
    },
    {
      id: 4,
      code: 'BGFI',
      nom: 'BGFI Bank',
      type: 'BANQUE',
      statut: 'actif',
      derniere_synchro: '2026-01-18 14:45',
      url_api: 'https://api.bgfi.cm'
    },
    {
      id: 5,
      code: 'SAHAM',
      nom: 'SAHAM Assurance',
      type: 'ASSUREUR',
      statut: 'inactif',
      derniere_synchro: '2026-01-17 09:00',
      url_api: 'https://api.saham.cm'
    },
  ]

  const testMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await integrationAPI.testConnection(id)
      return res.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Connexion testée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors du test de connexion')
    },
  })

  const handleTestConnection = (id: number) => {
    testMutation.mutate(id)
  }

  if (!mounted) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Intégrations Externes</h1>
          <p className="text-gray-600 mt-1">
            Gestion des connexions avec SYDONIA+, Guichet Unique, PCS, Banques, Assureurs
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Nouvelle Intégration
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Intégrations</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Actives</p>
                  <p className="text-2xl font-bold text-green-600">4</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactives</p>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Requêtes/Jour</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Integrations List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Intégrations Configurées</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <RefreshCw className="w-4 h-4" />
                    Actualiser
                  </button>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {mockIntegrations.map((integration) => (
                <div key={integration.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        integration.statut === 'actif' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {integration.type === 'SYDONIA_PLUS' && <ShieldCheck className="w-6 h-6 text-green-600" />}
                        {integration.type === 'GUICHET_UNIQUE' && <Globe className="w-6 h-6 text-blue-600" />}
                        {integration.type === 'PCS' && <FileText className="w-6 h-6 text-purple-600" />}
                        {integration.type === 'BANQUE' && <Building2 className="w-6 h-6 text-orange-600" />}
                        {integration.type === 'ASSUREUR' && <ShieldCheck className="w-6 h-6 text-red-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.nom}</h3>
                        <p className="text-sm text-gray-600">{integration.code} • {integration.type}</p>
                        <p className="text-xs text-gray-500 mt-1">{integration.url_api}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          integration.statut === 'actif' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {integration.statut === 'actif' ? 'Actif' : 'Inactif'}
                        </p>
                        <p className="text-xs text-gray-500">Sync: {integration.derniere_synchro}</p>
                      </div>
                      <button
                        onClick={() => handleTestConnection(integration.id)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Tester
                      </button>
                      <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        Configurer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'dashboard' && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Configuration {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <p className="text-gray-600 mb-6">
            Module en cours de développement
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retour au Dashboard
          </button>
        </div>
      )}
    </div>
  )
}
