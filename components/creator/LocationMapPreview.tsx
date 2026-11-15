import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

// Helper to recenter map when lat/lng updates
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
}

export default function LocationMapPreview({ lat, lng, placeName }: { lat: number; lng: number; placeName: string }) {
    // Fix default marker icon path issue in React-Leaflet
    const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    if (!lat || !lng) return null;

    return (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-md transition-all group">
            {/* Embedded Interactive Map */}
            <div className="w-full h-36 z-0">
                <MapContainer
                    center={[lat, lng]}
                    zoom={15}
                    zoomControl={false}
                    attributionControl={false}
                    className="w-full h-full"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat, lng]} icon={defaultIcon} />
                    <MapRecenter lat={lat} lng={lng} />
                </MapContainer>
            </div>

            {/* Gradient overlay for styling */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none z-10" />

            {/* Bottom bar with name and external map link */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow z-20">
                <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-medium border border-white/10">
                    <Navigation className="w-3 h-3 text-blue-400 animate-pulse" />
                    <span className="truncate max-w-[180px]">{placeName || 'Selected Location'}</span>
                </div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600/90 hover:bg-blue-600 text-[10px] px-2 py-1 rounded-lg font-bold backdrop-blur-md transition shadow-sm"
                >
                    Open in Maps
                </a>
            </div>
        </div>
    );
}