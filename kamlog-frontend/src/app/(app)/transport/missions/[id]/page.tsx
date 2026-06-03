'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { transportAPI } from '@/lib/api-client';
import { Mission } from '@/types';

export default function MissionDetailPage() {
  const params = useParams();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadMission(parseInt(params.id as string));
    }
  }, [params.id]);

  const loadMission = async (id: number) => {
    try {
      const response = await transportAPI.getMission(id);
      setMission(response.data);
    } catch (error) {
      console.error('Error loading mission:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'PLANIFIE': return 'bg-gray-100 text-gray-800';
      case 'EN_CHARGEMENT': return 'bg-blue-100 text-blue-800';
      case 'EN_ROUTE': return 'bg-yellow-100 text-yellow-800';
      case 'EN_LIVRAISON': return 'bg-orange-100 text-orange-800';
      case 'LIVRE': return 'bg-green-100 text-green-800';
      case 'CLOTURE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statutTimeline = [
    { statut: 'PLANIFIE', label: 'Planifié' },
    { statut: 'EN_CHARGEMENT', label: 'En Chargement' },
    { statut: 'EN_ROUTE', label: 'En Route' },
    { statut: 'EN_LIVRAISON', label: 'En Livraison' },
    { statut: 'LIVRE', label: 'Livré' },
    { statut: 'CLOTURE', label: 'Clôturé' },
  ];

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!mission) {
    return <div>Mission non trouvée</div>;
  }

  const currentStatutIndex = statutTimeline.findIndex(s => s.statut === mission.statut);

  return (
    <div>
      <div className="mb-6">
        <a href="/transport/missions" className="text-blue-600 hover:text-blue-800">
          ← Retour aux missions
        </a>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{mission.reference}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Créée le {new Date(mission.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(mission.statut)}`}>
            {mission.statut}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Origine</h3>
            <p className="text-lg font-semibold text-gray-900">{mission.origine}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Destination</h3>
            <p className="text-lg font-semibold text-gray-900">{mission.destination}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Distance</h3>
            <p className="text-lg font-semibold text-gray-900">{mission.distance_km} km</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Type Marchandise</h3>
            <p className="text-lg font-semibold text-gray-900">{mission.type_marchandise}</p>
          </div>
          {mission.poids_kg && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Poids</h3>
              <p className="text-lg font-semibold text-gray-900">{mission.poids_kg} kg</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-500">ID Client</h3>
            <p className="text-lg font-semibold text-gray-900">{mission.tiers_id}</p>
          </div>
        </div>

        {mission.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
            <p className="text-gray-900 mt-1">{mission.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle de la Mission</h3>
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${(currentStatutIndex / (statutTimeline.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {statutTimeline.map((step, index) => (
              <div key={step.statut} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStatutIndex 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-gray-900">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          {mission.statut === 'PLANIFIE' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Démarrer Chargement
            </button>
          )}
          {mission.statut === 'EN_CHARGEMENT' && (
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
              Démarrer Route
            </button>
          )}
          {mission.statut === 'EN_ROUTE' && (
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
              Démarrer Livraison
            </button>
          )}
          {mission.statut === 'EN_LIVRAISON' && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Marquer Livré
            </button>
          )}
          {mission.statut === 'LIVRE' && (
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Clôturer Mission
            </button>
          )}
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Générer BL
          </button>
        </div>
      </div>
    </div>
  );
}
