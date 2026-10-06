// src/components/creator/MapboxPinPicker.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapboxPinPickerProps {
    lat?: number | null;
    lng?: number | null;
    onSelectCoordinates: (coords: { lat: number; lng: number; address?: string }) => void;
    label?: string;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function MapboxPinPicker({
    lat = 28.6139,
    lng = 77.2090,
    onSelectCoordinates,
    label = 'Select Location Pin',
}: MapboxPinPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    const currentLat = lat ?? 28.6139;
    const currentLng = lng ?? 77.2090;

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [currentLng, currentLat],
            zoom: 12,
        });
        mapRef.current = map;

        const marker = new mapboxgl.Marker({ draggable: true, color: '#2563eb' })
            .setLngLat([currentLng, currentLat])
            .addTo(map);
        markerRef.current = marker;

        const updatePosition = () => {
            const lngLat = marker.getLngLat();
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

    // Sync map & marker when external props (lat/lng from geocoding) change
    useEffect(() => {
        if (mapRef.current && markerRef.current) {
            markerRef.current.setLngLat([currentLng, currentLat]);
            mapRef.current.flyTo({ center: [currentLng, currentLat], zoom: 12 });
        }
    }, [currentLat, currentLng]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> {label}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                    {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
                </span>
            </div>
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div ref={mapContainerRef} className="w-full h-full" />
            </div>
        </div>
    );
}