'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

interface Point {
  lat: number;
  lng: number;
  label?: string;
  type?: 'truck' | 'container' | 'location';
  id?: string | number;
}

interface MapViewerProps {
  points?: Point[];
  center?: [number, number];
  zoom?: number;
  mode?: 'truck_tracking' | 'yard_management';
}

export default function MapViewer({ points = [], center = [4.0511, 9.7679], zoom = 12, mode = 'truck_tracking' }: MapViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Chargement de la carte...</div>;
  }

  // Define Custom Icons based on point type
  const truckIcon = L.divIcon({
    html: `<div style="background-color: #2563eb; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-9h-4m-4 9h4v-3h-4z"/><path d="M8.5 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M19.5 17a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></svg></div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const containerIcon = L.divIcon({
    html: `<div style="background-color: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 1px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-slate-200" style={{ zIndex: 0 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        {mode === 'yard_management' ? (
          // Satellite View for Yard Management
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          // Standard Street View for Truck Tracking
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {points.map((pt, idx) => (
          <Marker 
            key={idx} 
            position={[pt.lat, pt.lng]} 
            icon={pt.type === 'truck' ? truckIcon : pt.type === 'container' ? containerIcon : undefined}
          >
            <Popup>
              <div className="font-sans font-bold text-slate-800">{pt.label || 'Point inconnu'}</div>
              {pt.type === 'truck' && <div className="text-xs text-slate-500 mt-1">ID: {pt.id}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
