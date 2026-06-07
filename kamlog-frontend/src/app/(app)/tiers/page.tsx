'use client';

import { useEffect, useState } from 'react';
import { tiersAPI } from '@/lib/api-client';
import { Tiers } from '@/types';
import { PortIllustration } from '@/components/illustrations/PortIllustration';

export default function TiersPage() {
  const [tiers, setTiers] = useState<Tiers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      const response = await tiersAPI.getTiers();
      setTiers(response.data);
    } catch (error) {
      console.error('Error loading tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tiers (Clients/Fournisseurs)</h2>
        <div className="flex items-center gap-4">
          <div className="w-32 h-20">
            <PortIllustration className="w-full h-full" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Nouveau Tiers
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Raison Sociale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tiers.map((tier) => (
              <tr key={tier.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tier.code_tiers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tier.raison_sociale}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tier.niu}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tier.statut === 'ACTIF' ? 'bg-green-100 text-green-800' :
                    tier.statut === 'BLOQUE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tier.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tier.autorise_transport && <span className="mr-2">Transport</span>}
                  {tier.autorise_transit && <span className="mr-2">Transit</span>}
                  {tier.autorise_acconage && <span className="mr-2">Acconage</span>}
                  {tier.autorise_magasinage && <span>Magasinage</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
