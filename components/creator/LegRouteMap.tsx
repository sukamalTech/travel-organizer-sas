// src/components/creator/LegRouteMap.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface LegRouteMapProps {
    originLat?: number | null;
    originLng?: number | null;
    destinationLat?: number | null;
    destinationLng?: number | null;
    mode?: string;
    onUpdateOrigin: (coords: { lat: number; lng: number }) => void;
    onUpdateDestination: (coords: { lat: number; lng: number }) => void;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function LegRouteMap({
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    mode = 'car',
    onUpdateOrigin,
    onUpdateDestination,
}: LegRouteMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const destMarkerRef = useRef<mapboxgl.Marker | null>(null);

    const defLat = originLat ?? 22.5726;
    const defLng = originLng ?? 88.3639;

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [defLng, defLat],
            zoom: 6,
        });
        mapRef.current = map;

        // Origin Marker (Blue)
        const originEl = document.createElement('div');
        originEl.className = 'w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold';
        originEl.innerText = 'A';

        const originMarker = new mapboxgl.Marker({ element: originEl, draggable: true })
            .setLngLat([originLng ?? defLng, originLat ?? defLat])
            .addTo(map);
        originMarkerRef.current = originMarker;

        originMarker.on('dragend', () => {
            const lngLat = originMarker.getLngLat();
            onUpdateOrigin({ lat: lngLat.lat, lng: lngLat.lng });
        });

        // Destination Marker (Green)
        const destEl = document.createElement('div');
        destEl.className = 'w-6 h-6 bg-emerald-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold';
        destEl.innerText = 'B';

        const destMarker = new mapboxgl.Marker({ element: destEl, draggable: true })
            .setLngLat([destinationLng ?? defLng + 0.5, destinationLat ?? defLat + 0.5])
            .addTo(map);
        destMarkerRef.current = destMarker;

        destMarker.on('dragend', () => {
            const lngLat = destMarker.getLngLat();
            onUpdateDestination({ lat: lngLat.lat, lng: lngLat.lng });
        });

        return () => {
            map.remove();
        };
    }, []);

    // Fetch route line and update markers/bounds whenever coordinates or mode changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (originMarkerRef.current && originLat && originLng) {
            originMarkerRef.current.setLngLat([originLng, originLat]);
        }
        if (destMarkerRef.current && destinationLat && destinationLng) {
            destMarkerRef.current.setLngLat([destinationLng, destinationLat]);
        }

        if (!originLat || !originLng || !destinationLat || !destinationLng) return;

        // Determine Mapbox routing profile based on transport mode
        let profile = 'mapbox/driving';
        if (mode === 'bike') profile = 'mapbox/cycling';
        if (mode === 'walk') profile = 'mapbox/walking';
        // For train/bus, we fallback to driving path approximation visually
        if (mode === 'train' || mode === 'bus') profile = 'mapbox/driving';

        const fetchRouteGeometry = async () => {
            try {
                const res = await fetch(
                    `https://api.mapbox.com/directions/v5/${profile}/${originLng},${originLat};${destinationLng},${destinationLat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
                );
                const data = await res.json();

                if (data.routes && data.routes.length > 0) {
                    const routeGeoJSON = data.routes[0].geometry;

                    // Add or update route layer on map
                    if (map.getSource('route')) {
                        (map.getSource('route') as mapboxgl.GeoJSONSource).setData({
                            type: 'Feature',
                            properties: {},
                            geometry: routeGeoJSON,
                        });
                    } else {
                        map.addSource('route', {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: routeGeoJSON,
                            },
                        });

                        map.addLayer({
                            id: 'route',
                            type: 'line',
                            source: 'route',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round',
                            },
                            paint: {
                                'line-color': mode === 'train' ? '#f59e0b' : '#2563eb', // Amber for train, Blue for car
                                'line-width': 5,
                                'line-opacity': 0.85,
                            },
                        });
                    }

                    // Fit bounds to show entire route
                    const bounds = new mapboxgl.LngLatBounds();
                    bounds.extend([originLng, originLat]);
                    bounds.extend([destinationLng, destinationLat]);
                    map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 1000 });
                }
            } catch (err) {
                console.error('Error fetching route geometry:', err);
            }
        };

        fetchRouteGeometry();
    }, [originLat, originLng, destinationLat, destinationLng, mode]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> Route Map ({mode.toUpperCase()})
                </span>
                <div className="flex gap-3 font-mono text-[11px] text-slate-500">
                    <span>A: {originLat ? `${originLat.toFixed(2)}, ${originLng?.toFixed(2)}` : 'Pending'}</span>
                    <span>B: {destinationLat ? `${destinationLat.toFixed(2)}, ${destinationLng?.toFixed(2)}` : 'Pending'}</span>
                </div>
            </div>
            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                <div ref={mapContainerRef} className="w-full h-full" />
            </div>
        </div>
    );
}