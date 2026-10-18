// 'use client';

// import React, { useState, useRef } from 'react';
// import { Loader2, Map } from "lucide-react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// if (typeof window !== 'undefined') {
//     mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
// }

// interface DayRouteOptimizerProps {
//     dayAttractions: any[];
// }

// export function DayRouteOptimizer({ dayAttractions }: DayRouteOptimizerProps) {
//     const mapContainerRef = useRef<HTMLDivElement | null>(null);
//     const mapRef = useRef<mapboxgl.Map | null>(null);
//     const markersRef = useRef<mapboxgl.Marker[]>([]);

//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [itinerary, setItinerary] = useState<Array<{ order: number; name: string; lat: number; lng: number }>>([]);
//     const [showMapSection, setShowMapSection] = useState<boolean>(false);

//     const handleOptimizeRoute = async () => {
//         setLoading(true);
//         setError(null);

//         if (!navigator.geolocation) {
//             setError("Geolocation is not supported by your browser.");
//             setLoading(false);
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             async (position) => {
//                 const userLng = position.coords.longitude;
//                 const userLat = position.coords.latitude;

//                 try {
//                     const validAttractions = dayAttractions.filter(item => item.latitude && item.longitude);
//                     if (validAttractions.length === 0) {
//                         setError("No geolocated attractions found for this day.");
//                         setLoading(false);
//                         return;
//                     }

//                     const spotsToOptimize = validAttractions.slice(0, 11);
//                     const coordinates = [
//                         `${userLng},${userLat}`,
//                         ...spotsToOptimize.map((item) => `${item.longitude},${item.latitude}`),
//                     ].join(";");

//                     const response = await fetch(
//                         `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?source=first&roundtrip=false&steps=true&geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
//                     );

//                     const data = await response.json();

//                     if (data.code !== "Ok") {
//                         throw new Error(data.message || "Failed to calculate optimized route.");
//                     }

//                     const trip = data.trips[0];
//                     const waypoints = data.waypoints;

//                     const orderedList = waypoints
//                         .sort((a: any, b: any) => a.waypoint_index - b.waypoint_index)
//                         .map((wp: any, index: number) => {
//                             if (index === 0) {
//                                 return { order: 0, name: "Current Location", lat: userLat, lng: userLng };
//                             }
//                             const spotIndex = wp.trips_index - 1;
//                             const attraction = spotsToOptimize[spotIndex];
//                             return {
//                                 order: wp.waypoint_index,
//                                 name: attraction ? attraction.name : `Stop ${wp.waypoint_index}`,
//                                 lat: wp.location[1],
//                                 lng: wp.location[0],
//                             };
//                         });

//                     setItinerary(orderedList);
//                     setShowMapSection(true);

//                     setTimeout(() => {
//                         if (!mapRef.current && mapContainerRef.current) {
//                             mapRef.current = new mapboxgl.Map({
//                                 container: mapContainerRef.current,
//                                 style: "mapbox://styles/mapbox/streets-v12",
//                                 center: [userLng, userLat],
//                                 zoom: 12,
//                             });
//                         }

//                         const map = mapRef.current;
//                         if (map) {
//                             if (map.isStyleLoaded()) {
//                                 renderRouteAndMarkers(map, trip.geometry, orderedList);
//                             } else {
//                                 map.on("load", () => {
//                                     renderRouteAndMarkers(map, trip.geometry, orderedList);
//                                 });
//                             }
//                         }
//                     }, 100);

//                 } catch (err: any) {
//                     setError(err.message || "An unexpected error occurred.");
//                 } finally {
//                     setLoading(false);
//                 }
//             },
//             (geoError) => {
//                 setError(`Unable to retrieve location: ${geoError.message}`);
//                 setLoading(false);
//             },
//             { enableHighAccuracy: true }
//         );
//     };

//     const renderRouteAndMarkers = (
//         map: mapboxgl.Map,
//         geometry: any,
//         orderedSpots: Array<{ order: number; name: string; lat: number; lng: number }>
//     ) => {
//         markersRef.current.forEach((m) => m.remove());
//         markersRef.current = [];

//         if (map.getSource("route")) {
//             (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
//                 type: "Feature",
//                 properties: {},
//                 geometry: geometry,
//             });
//         } else {
//             map.addSource("route", {
//                 type: "geojson",
//                 data: {
//                     type: "Feature",
//                     properties: {},
//                     geometry: geometry,
//                 },
//             });

//             map.addLayer({
//                 id: "route-line",
//                 type: "line",
//                 source: "route",
//                 layout: {
//                     "line-join": "round",
//                     "line-cap": "round",
//                 },
//                 paint: {
//                     "line-color": "#2563eb",
//                     "line-width": 5,
//                     "line-opacity": 0.8,
//                 },
//             });
//         }

//         const bounds = new mapboxgl.LngLatBounds();

//         orderedSpots.forEach((spot) => {
//             const el = document.createElement("div");
//             el.className =
//                 "flex items-center justify-center w-7 h-7 rounded-full text-white font-bold shadow-md border-2 border-white text-xs " +
//                 (spot.order === 0 ? "bg-emerald-600 scale-110" : "bg-blue-600");
//             el.innerText = spot.order === 0 ? "★" : `${spot.order}`;

//             const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
//                 `<div class="p-1 font-sans">
//                   <p class="font-semibold text-gray-900">${spot.order === 0 ? "Your Location" : `Stop ${spot.order}`}</p>
//                   <p class="text-xs text-gray-600">${spot.name}</p>
//                 </div>`
//             );

//             const marker = new mapboxgl.Marker(el)
//                 .setLngLat([spot.lng, spot.lat])
//                 .setPopup(popup)
//                 .addTo(map);

//             markersRef.current.push(marker);
//             bounds.extend([spot.lng, spot.lat]);
//         });

//         map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
//     };

//     return (
//         <div className="mt-3 pt-3 border-t border-border/60">
//             <button
//                 onClick={handleOptimizeRoute}
//                 disabled={loading}
//                 className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
//             >
//                 {loading ? (
//                     <>
//                         <Loader2 className="w-4 h-4 animate-spin text-primary" />
//                         Calculating Route...
//                     </>
//                 ) : (
//                     <>
//                         <Map className="w-4 h-4" />
//                         ✨ Optimize Day Route & Map
//                     </>
//                 )}
//             </button>

//             {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

//             {showMapSection && (
//                 <div className="mt-3 p-3 rounded-2xl bg-muted/40 border border-border space-y-3">
//                     <div className="flex items-center justify-between">
//                         <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Optimized Route Sequence</h4>
//                         <button
//                             onClick={() => setShowMapSection(false)}
//                             className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
//                         >
//                             Hide Map
//                         </button>
//                     </div>

//                     <div className="w-full h-64 rounded-xl overflow-hidden border border-border/80 relative">
//                         <div ref={mapContainerRef} className="w-full h-full" />
//                     </div>

//                     <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
//                         {itinerary.map((spot) => (
//                             <div key={spot.order} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border/60 text-xs">
//                                 <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white ${spot.order === 0 ? 'bg-emerald-600' : 'bg-blue-600'}`}>
//                                     {spot.order === 0 ? '★' : spot.order}
//                                 </span>
//                                 <span className="font-semibold text-foreground truncate">{spot.name}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

'use client';

import React, { useState, useRef } from 'react';
import { Loader2, Map } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

if (typeof window !== 'undefined') {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

interface DayRouteOptimizerProps {
    dayAttractions: any[];
}

export function DayRouteOptimizer({ dayAttractions }: DayRouteOptimizerProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [itinerary, setItinerary] = useState<Array<{ order: number; name: string; lat: number; lng: number }>>([]);
    const [showMapSection, setShowMapSection] = useState<boolean>(false);

    // Rule: Hide button if fewer than 2 attractions are available
    const validAttractions = dayAttractions.filter(item => item.latitude && item.longitude);
    if (validAttractions.length < 2) {
        return null;
    }

    const handleOptimizeRoute = async () => {
        setLoading(true);
        setError(null);

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
                    const spotsToOptimize = validAttractions.slice(0, 11);
                    const coordinates = [
                        `${userLng},${userLat}`,
                        ...spotsToOptimize.map((item) => `${item.longitude},${item.latitude}`),
                    ].join(";");

                    const response = await fetch(
                        `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?source=first&roundtrip=false&steps=true&geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
                    );

                    const data = await response.json();

                    if (data.code !== "Ok") {
                        if (data.code === "NotImplemented") {
                            throw new Error("The route combination is not supported. Ensure coordinates are near valid roadways.");
                        }
                        throw new Error(data.message || `Mapbox error: ${data.code}`);
                    }

                    const trip = data.trips[0];
                    const waypoints = data.waypoints;

                    const orderedList = waypoints
                        .sort((a: any, b: any) => a.waypoint_index - b.waypoint_index)
                        .map((wp: any, index: number) => {
                            if (index === 0) {
                                return { order: 0, name: "Current Location", lat: userLat, lng: userLng };
                            }
                            const spotIndex = wp.trips_index - 1;
                            const attraction = spotsToOptimize[spotIndex];
                            return {
                                order: wp.waypoint_index,
                                name: attraction ? attraction.name : `Stop ${wp.waypoint_index}`,
                                lat: wp.location[1],
                                lng: wp.location[0],
                            };
                        });

                    setItinerary(orderedList);
                    setShowMapSection(true);

                    setTimeout(() => {
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
                                renderRouteAndMarkers(map, trip.geometry, orderedList);
                            } else {
                                map.on("load", () => {
                                    renderRouteAndMarkers(map, trip.geometry, orderedList);
                                });
                            }
                        }
                    }, 100);

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
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

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
                    "line-color": "#2563eb",
                    "line-width": 5,
                    "line-opacity": 0.8,
                },
            });
        }

        const bounds = new mapboxgl.LngLatBounds();

        orderedSpots.forEach((spot) => {
            const el = document.createElement("div");
            el.className =
                "flex items-center justify-center w-7 h-7 rounded-full text-white font-bold shadow-md border-2 border-white text-xs " +
                (spot.order === 0 ? "bg-emerald-600 scale-110" : "bg-blue-600");
            el.innerText = spot.order === 0 ? "★" : `${spot.order}`;

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

        map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    };

    return (
        <div className="mt-3 pt-3 border-t border-border/60">
            <button
                onClick={handleOptimizeRoute}
                disabled={loading}
                className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        Calculating Route...
                    </>
                ) : (
                    <>
                        <Map className="w-4 h-4" />
                        ✨ Optimize Day Route & Map
                    </>
                )}
            </button>

            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

            {showMapSection && (
                <div className="mt-3 p-3 rounded-2xl bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Optimized Route Sequence</h4>
                        <button
                            onClick={() => setShowMapSection(false)}
                            className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                        >
                            Hide Map
                        </button>
                    </div>

                    <div className="w-full h-64 rounded-xl overflow-hidden border border-border/80 relative">
                        <div ref={mapContainerRef} className="w-full h-full" />
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {itinerary.map((spot) => (
                            <div key={spot.order} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border/60 text-xs">
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white ${spot.order === 0 ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                                    {spot.order === 0 ? '★' : spot.order}
                                </span>
                                <span className="font-semibold text-foreground truncate">{spot.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}