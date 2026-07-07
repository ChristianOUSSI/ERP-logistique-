'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { transportAPI } from '@/lib/api-client';
import { 
  TrendingUp, Activity, Truck, Calendar, DollarSign, Filter 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsVehicleHistory() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date_debut: '',
    date_fin: '',
    client_id: '',
    chauffeur_id: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const activeFilters: any = {};
      if (filters.date_debut) activeFilters.date_debut = new Date(filters.date_debut).toISOString();
      if (filters.date_fin) activeFilters.date_fin = new Date(filters.date_fin).toISOString();
      if (filters.client_id) activeFilters.client_id = parseInt(filters.client_id);
      if (filters.chauffeur_id) activeFilters.chauffeur_id = parseInt(filters.chauffeur_id);

      const response = await transportAPI.getVehiclesHistory(activeFilters);
      setData(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchData();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytique & Historique Flotte</h1>
          <p className="text-muted-foreground mt-1">
            Visualisez la rentabilité et l'historique complet de vos véhicules (Revenus, Dépenses, Chauffeurs).
          </p>
        </div>
      </div>

      {/* Barre de filtres */}
      <Card className="border-t-4 border-t-primary shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Date Début</label>
              <Input type="date" name="date_debut" value={filters.date_debut} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Date Fin</label>
              <Input type="date" name="date_fin" value={filters.date_fin} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">ID Client</label>
              <Input type="number" name="client_id" placeholder="Ex: 1" value={filters.client_id} onChange={handleFilterChange} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">ID Chauffeur</label>
              <Input type="number" name="chauffeur_id" placeholder="Ex: 2" value={filters.chauffeur_id} onChange={handleFilterChange} />
            </div>
            <Button onClick={applyFilters} className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Appliquer Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Activity className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg">Aucun historique trouvé pour ces critères.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data.map((item) => (
            <Card key={item.camion.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-slate-50 border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.camion.immatriculation}</h3>
                    <p className="text-sm text-gray-500">{item.camion.marque} {item.camion.modele}</p>
                  </div>
                </div>
                <Badge variant={item.camion.statut === 'DISPONIBLE' ? 'default' : 'secondary'}>
                  {item.camion.statut}
                </Badge>
              </div>

              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-b">
                  <div className="p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-gray-500 mb-1">Missions</p>
                    <p className="text-2xl font-bold">{item.kpis.total_missions}</p>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-gray-500 mb-1">Revenus</p>
                    <p className="text-xl font-bold text-green-600">
                      {item.kpis.revenus_xaf.toLocaleString()} XAF
                    </p>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-gray-500 mb-1">Dépenses (Péage/Annexe)</p>
                    <p className="text-xl font-bold text-red-500">
                      {item.kpis.depenses_xaf.toLocaleString()} XAF
                    </p>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Marge Brute</p>
                    <p className={`text-2xl font-black ${item.kpis.marge_xaf >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {item.kpis.marge_xaf.toLocaleString()} XAF
                    </p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-gray-700">
                      <TrendingUp className="w-4 h-4 mr-2" /> Parcours Fréquents
                    </h4>
                    {item.details.parcours.length > 0 ? (
                      <ul className="space-y-2">
                        {item.details.parcours.map((p: string, i: number) => (
                          <li key={i} className="text-gray-600 flex items-center before:content-['•'] before:mr-2 before:text-primary">
                            {p}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">Aucun parcours</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-gray-700">
                      <DollarSign className="w-4 h-4 mr-2" /> Clients Servis
                    </h4>
                    {item.details.clients.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.details.clients.map((c: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-slate-50 text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">Aucun client</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2" /> Chauffeurs Assignés
                    </h4>
                    {item.details.chauffeurs.length > 0 ? (
                      <ul className="space-y-2">
                        {item.details.chauffeurs.map((c: string, i: number) => (
                          <li key={i} className="text-gray-600 flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-xs font-bold">
                              {c.charAt(0)}
                            </div>
                            {c}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">Aucun chauffeur</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
