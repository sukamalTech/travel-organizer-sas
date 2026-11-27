'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface RouteStopPoint {
    id: string;
    label: string;
    sublabel?: string;
    lat: number;
    lng: number;
    kind: 'origin' | 'destination' | 'stay' | 'attraction' | 'dining';
    dayNumber?: number;
}

interface FullTripRouteMapProps {
    points: RouteStopPoint[];
}

function isValidCoord(lat: unknown, lng: unknown): boolean {
    const nLat = Number(lat);
    const nLng = Number(lng);
    return (
        lat !== null &&
        lat !== undefined &&
        lat !== '' &&
        lng !== null &&
        lng !== undefined &&
        lng !== '' &&
        Number.isFinite(nLat) &&
        Number.isFinite(nLng) &&
        Math.abs(nLat) <= 90 &&
        Math.abs(nLng) <= 180
    );
}

export default function FullTripRouteMap({ points }: FullTripRouteMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    const validPoints = points.filter((p) => isValidCoord(p.lat, p.lng));

    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current, {
                scrollWheelZoom: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 18,
            }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        // Clear previous layers except base tile layer
        map.eachLayer((layer) => {
            if (!(layer instanceof L.TileLayer)) {
                map.removeLayer(layer);
            }
        });

        if (validPoints.length === 0) {
            map.setView([22.5726, 88.3639], 6);
            return;
        }

        const latLngs: L.LatLngExpression[] = validPoints.map((pt) => [
            Number(pt.lat),
            Number(pt.lng),
        ]);

        // Draw connecting trip path
        if (latLngs.length > 1) {
            L.polyline(latLngs, {
                color: '#2563eb',
                weight: 4,
                opacity: 0.85,
                dashArray: '8, 6',
            }).addTo(map);
        }

        // Add numbered circle markers
        validPoints.forEach((pt, idx) => {
            const colorMap: Record<RouteStopPoint['kind'], string> = {
                origin: '#0284c7',
                destination: '#2563eb',
                stay: '#059669',
                attraction: '#9333ea',
                dining: '#d97706',
            };

            const marker = L.circleMarker([Number(pt.lat), Number(pt.lng)], {
                radius: 8,
                fillColor: colorMap[pt.kind] || '#2563eb',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.95,
            }).addTo(map);

            marker.bindPopup(
                `<div style="font-size:12px;line-height:1.4">
          <strong>${idx + 1}. ${pt.label}</strong>${pt.dayNumber ? `<br/><span>Day ${pt.dayNumber}</span>` : ''}
          ${pt.sublabel ? `<br/><span style="color:#64748b">${pt.sublabel}</span>` : ''}
        </div>`
            );
        });

        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });

        return () => {
            // Keep map instance alive during updates; destroy on unmount
        };
    }, [validPoints]);

    useEffect(() => {
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    if (validPoints.length === 0) {
        return (
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-center text-xs text-slate-500">
                No saved map locations available yet for this trip route.
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            <div
                ref={mapContainerRef}
                className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm z-0"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" /> Origin
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Destination
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Stay
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Sightseeing
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Dining
                    </span>
                </div>
                <span>{validPoints.length} mapped stops</span>
            </div>
        </div>
    );
}