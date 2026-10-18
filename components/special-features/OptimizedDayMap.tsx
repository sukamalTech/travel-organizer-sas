"use client";

import { useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getAttractionsByDayId, AttractionData } from "@/app/actions/get-day-attractions";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface OptimizedDayMapProps {
    dayId: string;
}

interface WaypointResult {
    waypoint_index: number;
    trips_index: number;
    name: string;
    location: [number, number];
}

export default function OptimizedDayMap({ dayId }: OptimizedDayMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [itinerary, setItinerary] = useState<
        Array<{ order: number; name: string; lat: number; lng: number }>
    >([]);

    const handleOptimizeRoute = async () => {
        setLoading(true);
        setError(null);

        // 1. Get user's current location via Browser Geolocation API
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userLng = position.coords.longitude;
                const userLat = position.coords.latitude;

                try {
                    // 2. Fetch attractions from backend for the given dayId
                    const dayAttractions: AttractionData[] = await getAttractionsByDayId(dayId);

                    if (!dayAttractions || dayAttractions.length === 0) {
                        setError("No attractions found for this day.");
                        setLoading(false);
                        return;
                    }

                    // Limit warning: Mapbox Optimization API accepts up to 12 coordinates per request on standard endpoints
                    const spotsToOptimize = dayAttractions.slice(0, 11);

                    // 3. Build coordinate string starting with user location
                    // Format: {lng},{lat};{lng},{lat};...
                    const coordinates = [
                        `${userLng},${userLat}`,
                        ...spotsToOptimize.map((item) => `${item.longitude},${item.latitude}`),
                    ].join(";");

                    // 4. Call Mapbox Optimization API
                    // source=first forces the route to start at index 0 (user's current location)
                    // roundtrip=false means we finish at the last stop rather than looping back
                    const response = await fetch(
                        `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?source=first&roundtrip=false&steps=true&geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
                    );

                    const data = await response.json();

                    if (data.code !== "Ok") {
                        throw new Error(data.message || "Failed to calculate optimized route.");
                    }

                    const trip = data.trips[0];
                    const waypoints: WaypointResult[] = data.waypoints;

                    // Map optimized waypoints back to place names
                    const orderedList = waypoints
                        .sort((a, b) => a.waypoint_index - b.waypoint_index)
                        .map((wp, index) => {
                            if (index === 0) {
                                return { order: 0, name: "Current Location", lat: userLat, lng: userLng };
                            }
                            const spotIndex = wp.trips_index - 1; // Subtract 1 because index 0 was user location
                            const attraction = spotsToOptimize[spotIndex];
                            return {
                                order: wp.waypoint_index,
                                name: attraction ? attraction.name : `Stop ${wp.waypoint_index}`,
                                lat: wp.location[1],
                                lng: wp.location[0],
                            };
                        });

                    setItinerary(orderedList);

                    // 5. Initialize or re-center Mapbox Map
                    if (!mapRef.current && mapContainerRef.current) {
                        mapRef.current = new mapboxgl.Map({
                            container: mapContainerRef.current,
                            style: "mapbox://styles/mapbox/streets-v12",
                            center: [userLng, userLat],
                            zoom: 12,
                        });
                    }

                    const map = mapRef.current;

                    map?.on("load", () => {
                        renderRouteAndMarkers(map, trip.geometry, orderedList);
                    });

                    if (map?.isStyleLoaded()) {
                        renderRouteAndMarkers(map, trip.geometry, orderedList);
                    }
                } catch (err: any) {
                    setError(err.message || "An unexpected error occurred.");
                } finally {
                    setLoading(false);
                }
            },
            (geoError) => {
                setError(`Unable to retrieve location: ${geoError.message}`);
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const renderRouteAndMarkers = (
        map: mapboxgl.Map,
        geometry: any,
        orderedSpots: Array<{ order: number; name: string; lat: number; lng: number }>
    ) => {
        // Clear existing markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        // Add or Update Polyline Source/Layer for Route
        if (map.getSource("route")) {
            (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
                type: "Feature",
                properties: {},
                geometry: geometry,
            });
        } else {
            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: geometry,
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
                    "line-color": "#2563eb", // Tailwind Blue 600
                    "line-width": 5,
                    "line-opacity": 0.8,
                },
            });
        }

        // Drop Numbered Pins
        const bounds = new mapboxgl.LngLatBounds();

        orderedSpots.forEach((spot) => {
            const el = document.createElement("div");
            el.className =
                "flex items-center justify-center w-8 h-8 rounded-full text-white font-bold shadow-md border-2 border-white text-xs " +
                (spot.order === 0 ? "bg-emerald-600 scale-110" : "bg-blue-600");
            el.innerText = spot.order === 0 ? "Start" : `${spot.order}`;

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div class="p-1 font-sans">
          <p class="font-semibold text-gray-900">${spot.order === 0 ? "Your Location" : `Stop ${spot.order}`}</p>
          <p class="text-xs text-gray-600">${spot.name}</p>
        </div>`
            );

            const marker = new mapboxgl.Marker(el)
                .setLngLat([spot.lng, spot.lat])
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);
            bounds.extend([spot.lng, spot.lat]);
        });

        // Fit map view to encompass all markers
        map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4">
            {/* Control Panel */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Day Route Planner</h2>
                    <p className="text-sm text-gray-500">Generate an optimized trip from your position</p>
                </div>
                <button
                    onClick={handleOptimizeRoute}
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg shadow transition-colors flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Calculating Route...
                        </>
                    ) : (
                        "Calculate Logical Route"
                    )}
                </button>
            </div>

            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Main Content Area: Map + Itinerary List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[550px]">
                {/* Map Container */}
                <div className="md:col-span-2 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                    <div ref={mapContainerRef} className="w-full h-full" />
                </div>

                {/* Itinerary List */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Optimized Sequence</h3>
                    {itinerary.length === 0 ? (
                        <p className="text-sm text-gray-400">Click the button to optimize your day schedule.</p>
                    ) : (
                        <ol className="space-y-3">
                            {itinerary.map((spot) => (
                                <li key={spot.order} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                                    <span
                                        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white mt-0.5 ${spot.order === 0 ? "bg-emerald-600" : "bg-blue-600"
                                            }`}
                                    >
                                        {spot.order === 0 ? "★" : spot.order}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{spot.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
}