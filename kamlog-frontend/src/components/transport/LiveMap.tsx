'use client'

import React, { useEffect } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix leaflet missing default icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

interface CamionPosition {
  id: number
  immatriculation: string
  lat: number
  lng: number
  speed: number
  status: string
  last_update: string
}

interface LiveMapProps {
  positions: CamionPosition[]
}

const FitBounds = ({ positions }: { positions: CamionPosition[] }) => {
  const map = useMap()
  
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => [p.lat, p.lng]))
      // Pad bounds a little bit
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [positions, map])

  return null
}

export default function LiveMap({ positions }: LiveMapProps) {
  // Default to Douala if no positions
  const defaultCenter: [number, number] = [4.0511, 9.7679] 

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e7eb', zIndex: 0 }}>
      <MapContainer 
        center={positions.length > 0 ? [positions[0].lat, positions[0].lng] : defaultCenter} 
        zoom={10} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.arcgis.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        <MarkerClusterGroup chunkedLoading>
        {positions.map((pos) => (
          <Marker 
            key={pos.id} 
            position={[pos.lat, pos.lng]}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{pos.immatriculation}</h3>
                <p className="text-sm text-gray-600">Vitesse: <span className="font-semibold">{pos.speed.toFixed(1)} km/h</span></p>
                <p className="text-sm text-gray-600">Statut: <span className="font-semibold text-blue-600">{pos.status}</span></p>
                <p className="text-xs text-gray-400 mt-2">MàJ: {new Date(pos.last_update).toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>

        {positions.length > 0 && <FitBounds positions={positions} />}
      </MapContainer>
    </div>
  )
}
