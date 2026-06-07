'use client';

import { useEffect, useState } from 'react';
import { transportAPI } from '@/lib/api-client';
import { Mission } from '@/types';
import { PortIllustration } from '@/components/illustrations/PortIllustration';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const response = await transportAPI.getMissions();
      setMissions(response.data);
    } catch (error) {
      console.error('Error loading missions:', error);
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Missions de Transport</h2>
        <div className="w-32 h-20">
          <PortIllustration className="w-full h-full" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marchandise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {missions.map((mission) => (
              <tr key={mission.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {mission.reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mission.origine}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {mission.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mission.type_marchandise}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(mission.statut)}`}>
                    {mission.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
