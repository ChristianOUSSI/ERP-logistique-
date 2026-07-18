'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, AlertCircle } from 'lucide-react';

// Configuration de l'icône Leaflet personnalisée
const createCustomIcon = (status: string) => {
  let color = '#3b82f6'; // Blue for EN_TRANSIT
  if (status === 'A_L_ARRET') color = '#94a3b8'; // Slate
  if (status === 'EN_MAINTENANCE' || status === 'BLOQUE_HSE') color = '#ef4444'; // Red

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 17h4V5H2v12h3"></path>
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"></path>
      <circle cx="7" cy="17" r="2"></circle>
      <circle cx="17" cy="17" r="2"></circle>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: svgIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component to auto-center if needed
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    // map.setView(center, zoom); // Désactivé pour laisser l'utilisateur naviguer librement
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ trucks }: { trucks: any[] }) {
  // Coordonnées de base pour Douala
  const defaultCenter: [number, number] = [4.0511, 9.7679];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={defaultCenter} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {trucks.map(truck => (
          <Marker 
            key={truck.id} 
            position={[truck.lat, truck.lng]} 
            icon={createCustomIcon(truck.status)}
          >
            <Popup className="rounded-xl">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  <Truck className="w-4 h-4 text-slate-500" />
                  <strong className="text-slate-900">{truck.immatriculation}</strong>
                </div>
                <div className="text-sm space-y-1 text-slate-600">
                  <p>Chauffeur : <strong>{truck.driver}</strong></p>
                  <p>Vitesse : <strong>{truck.speed} km/h</strong></p>
                  <p>Statut : 
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                      truck.status === 'EN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                      truck.status === 'A_L_ARRET' ? 'bg-slate-100 text-slate-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {truck.status.replace('_', ' ')}
                    </span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
