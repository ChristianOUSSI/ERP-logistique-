'use client';

import { PortIllustration } from '@/components/illustrations/PortIllustration';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="w-48 h-24">
          <PortIllustration className="w-full h-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Missions en cours</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">CA Semaine</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">2.5M XAF</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Alertes Carburant</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">3</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Encours Clients</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">8.7M XAF</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/transport/missions"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <h4 className="font-medium text-gray-900">Nouvelle Mission</h4>
            <p className="text-sm text-gray-500">Créer une mission de transport</p>
          </a>
          <a
            href="/tiers"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <h4 className="font-medium text-gray-900">Nouveau Client</h4>
            <p className="text-sm text-gray-500">Ajouter un client ou fournisseur</p>
          </a>
          <a
            href="/parc"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <h4 className="font-medium text-gray-900">Gate In/Out</h4>
            <p className="text-sm text-gray-500">Gérer les entrées/sorties conteneurs</p>
          </a>
        </div>
      </div>
    </div>
  );
}
