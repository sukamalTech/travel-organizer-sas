'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapboxPinPickerProps {
    initialLat?: number | null;
    initialLng?: number | null;
    onSelectCoordinates: (coords: { lat: number; lng: number; address?: string }) => void;
    label?: string;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function MapboxPinPicker({
    initialLat = 28.6139,
    initialLng = 77.2090,
    onSelectCoordinates,
    label = 'Select Location Pin',
}: MapboxPinPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    const [coords, setCoords] = useState({
        lat: initialLat || 28.6139,
        lng: initialLng || 77.2090,
    });

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [coords.lng, coords.lat],
            zoom: 12,
        });

        mapRef.current = map;

        // Add draggable marker
        const marker = new mapboxgl.Marker({ draggable: true, color: '#2563eb' })
            .setLngLat([coords.lng, coords.lat])
            .addTo(map);

        markerRef.current = marker;

        const updatePosition = () => {
            const lngLat = marker.getLngLat();
            setCoords({ lat: lngLat.lat, lng: lngLat.lng });
            onSelectCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
        };

        marker.on('dragend', updatePosition);

        map.on('click', (e) => {
            marker.setLngLat(e.lngLat);
            updatePosition();
        });

        return () => {
            map.remove();
        };
    }, []);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> {label}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
            </div>
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div ref={mapContainerRef} className="w-full h-full" />
            </div>
        </div>
    );
}