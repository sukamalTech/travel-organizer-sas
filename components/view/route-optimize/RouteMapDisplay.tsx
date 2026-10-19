'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface RouteMapDisplayProps {
    userLat: number;
    userLng: number;
    geometry: any;
    orderedSpots: any[];
}

export function RouteMapDisplay({ userLat, userLng, geometry, orderedSpots }: RouteMapDisplayProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (!mapRef.current && mapContainerRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v12",
                center: [userLng, userLat],
                zoom: 12,
            });
        }

        const map = mapRef.current;
        if (map) {
            if (map.isStyleLoaded()) {
                renderRouteAndMarkers(map, geometry, orderedSpots);
            } else {
                map.on("load", () => {
                    renderRouteAndMarkers(map, geometry, orderedSpots);
                });
            }
        }
    }, [geometry, orderedSpots, userLat, userLng]);

    const renderRouteAndMarkers = (
        map: mapboxgl.Map,
        geo: any,
        spots: any[]
    ) => {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        if (map.getSource("route")) {
            (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
                type: "Feature",
                properties: {},
                geometry: geo,
            });
        } else {
            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: geo,
                },
            });

            map.addLayer({
                id: "route-line",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#2563eb",
                    "line-width": 5,
                    "line-opacity": 0.8,
                },
            });
        }

        const bounds = new mapboxgl.LngLatBounds();

        spots.forEach((spot) => {
            const el = document.createElement("div");

            if (spot.type === 'start') {
                el.className = "flex items-center justify-center w-7 h-7 rounded-full text-white font-bold shadow-md border-2 border-white text-xs bg-emerald-600 scale-110";
                el.innerText = "★";
            } else if (spot.type === 'return' || spot.type === 'destination') {
                el.className = "flex items-center justify-center w-7 h-7 rounded-full text-white font-bold shadow-md border-2 border-white text-xs bg-amber-600 scale-110";
                el.innerText = "🏁";
            } else {
                el.className = "flex items-center justify-center w-7 h-7 rounded-full text-white font-bold shadow-md border-2 border-white text-xs bg-blue-600";
                el.innerText = `${spot.order}`;
            }

            const popupContent = spot.type === 'start'
                ? `<div class="p-1 font-sans"><p class="font-semibold text-gray-900">Start Location</p><p class="text-xs text-gray-600">Depart: ${spot.departureTime}</p></div>`
                : spot.type === 'return' || spot.type === 'destination'
                    ? `<div class="p-1 font-sans"><p class="font-semibold text-gray-900">Final Destination: ${spot.name}</p><p class="text-xs text-gray-600">Arrival: ${spot.arrivalTime}</p></div>`
                    : `<div class="p-1 font-sans"><p class="font-semibold text-gray-900">Stop ${spot.order}: ${spot.name}</p><p class="text-xs text-gray-600">Arrival: ${spot.arrivalTime} | Depart: ${spot.departureTime}</p></div>`;

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

            const marker = new mapboxgl.Marker(el)
                .setLngLat([spot.lng, spot.lat])
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);
            bounds.extend([spot.lng, spot.lat]);
        });

        map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    };

    return (
        <div className="w-full h-64 rounded-xl overflow-hidden border border-border/80 relative">
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
}