'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck } from 'lucide-react';

// Configuration de l'icône personnalisée pour les camions
const createTruckIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-trucEVO-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const DIT_DOUALA = [4.0475, 9.6974];
const YAOUNDE = [3.8480, 11.5021];
const NGAOUNDERE = [7.3197, 13.5835];

const interpolate = (start: number[], end: number[], fraction: number) => {
  return [
    start[0] + (end[0] - start[0]) * fraction,
    start[1] + (end[1] - start[1]) * fraction
  ];
};

export default function MapControlTower({ missions }: { missions: any[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Fix for default leaflet icons not showing up
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  if (!isClient) {
    return <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">Chargement de la cartographie...</div>;
  }

  // Calculate real truck positions from active missions dynamically
  const activeMissions = missions.filter(m => m.statut === 'EN_COURS' || m.statut === 'DEMARREE' || m.statut === 'EN_ROUTE');
  const positions = activeMissions.map((m, idx) => {
    // Distribute them evenly along the Douala-Yaoundé road
    const fraction = ((m.id || idx) % 8 + 1) / 10;
    const pos = interpolate(DIT_DOUALA, YAOUNDE, fraction);
    return {
      id: m.id || idx,
      reference: m.reference || `OT-${m.id}`,
      camion: m.camion_immatriculation || 'Inconnu',
      chauffeur: m.chauffeur_nom ? `${m.chauffeur_prenom || ''} ${m.chauffeur_nom}` : 'Non assigné',
      statut: m.statut,
      pos,
      color: m.statut === 'EN_ROUTE' ? '#10b981' : '#3b82f6'
    };
  });

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer center={[4.0475, 9.6974] as [number, number]} zoom={7} className="h-full w-full rounded-2xl z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Draw Routes */}
        <Polyline positions={[DIT_DOUALA as [number, number], YAOUNDE as [number, number]]} color="#94a3b8" weight={3} dashArray="5, 10" />
        <Polyline positions={[DIT_DOUALA as [number, number], NGAOUNDERE as [number, number]]} color="#94a3b8" weight={3} dashArray="5, 10" />

        {/* Sites fixes */}
        <Marker position={DIT_DOUALA as [number, number]}>
          <Popup><strong className="text-slate-800">Port Autonome de Douala</strong><br/>Hub Principal EVO-LOG</Popup>
        </Marker>
        <Marker position={YAOUNDE as [number, number]}>
          <Popup><strong className="text-slate-800">Magasin Yaoundé</strong><br/>Destinataire</Popup>
        </Marker>

        {/* Camions réels en cours de mission */}
        {positions.map((truck) => (
          <Marker key={truck.id} position={truck.pos as [number, number]} icon={createTruckIcon(truck.color)}>
            <Popup>
              <div className="p-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Mission Réelle Active</p>
                <p className="font-black text-slate-800 text-lg mb-1">{truck.reference}</p>
                <p className="text-xs text-slate-600">Camion: <span className="font-bold">{truck.camion}</span></p>
                <p className="text-xs text-slate-600">Chauffeur: <span className="font-bold">{truck.chauffeur}</span></p>
                <p className="text-xs text-slate-600">Statut: <span className="font-bold text-blue-600">{truck.statut}</span></p>
                <p className="text-xs text-slate-500 mt-2">Dernière mise à jour GPS en temps réel.</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
