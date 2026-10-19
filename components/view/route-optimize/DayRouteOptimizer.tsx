'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Map } from "lucide-react";
import mapboxgl from "mapbox-gl";

import { DestinationSelector } from './DestinationSelector';
import { RouteMapDisplay } from './RouteMapDisplay';
import { ItineraryList } from './ItineraryList';
import { ShareAndDownloadActions } from './ShareAndDownloadActions';
import { solveOpenTSP, addMinutesToTime, formatTime } from './utils';

if (typeof window !== 'undefined') {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

interface DayRouteOptimizerProps {
    dayAttractions: any[];
    defaultVisitDurationMinutes?: number;
}

export function DayRouteOptimizer({
    dayAttractions,
    defaultVisitDurationMinutes = 45
}: DayRouteOptimizerProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [itinerary, setItinerary] = useState<any[]>([]);
    const [routeGeometry, setRouteGeometry] = useState<any>(null);
    const [showMapSection, setShowMapSection] = useState<boolean>(false);
    const [totalTripStats, setTotalTripStats] = useState<{ distanceKm: number; durationHours: string } | null>(null);
    const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Trip routing preferences
    const [tripMode, setTripMode] = useState<'roundtrip' | 'open' | 'custom_end'>('open');

    // Custom End Destination State
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [customEndPoint, setCustomEndPoint] = useState<{ name: string; latitude: number; longitude: number } | null>(null);

    const validAttractions = dayAttractions.filter(item => item.latitude && item.longitude);
    if (validAttractions.length < 2) {
        return null;
    }

    // Geocoding Search Debounce
    useEffect(() => {
        if (!searchQuery || searchQuery.trim().length < 3 || tripMode !== 'custom_end') {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&limit=5`
                );
                const data = await res.json();
                if (data.features) {
                    setSearchResults(data.features.map((f: any) => ({
                        name: f.place_name,
                        longitude: f.center[0],
                        latitude: f.center[1]
                    })));
                }
            } catch (err) {
                console.error("Geocoding error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, tripMode]);

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
                setUserCoords({ lat: userLat, lng: userLng });

                try {
                    let targetEndPoint = null;
                    if (tripMode === 'custom_end' && customEndPoint) {
                        targetEndPoint = customEndPoint;
                    }

                    const spotsToOptimize = validAttractions.slice(0, 10);

                    // 1. Solve TSP locally
                    const sortedSpots = solveOpenTSP(
                        { lat: userLat, lng: userLng },
                        spotsToOptimize,
                        targetEndPoint
                    );

                    // 2. Fetch Directions (1 API call)
                    const coordinatesArray = [
                        `${userLng},${userLat}`,
                        ...sortedSpots.map((item) => `${item.longitude},${item.latitude}`),
                    ];

                    if (tripMode === 'roundtrip') {
                        coordinatesArray.push(`${userLng},${userLat}`);
                    }

                    const coordinates = coordinatesArray.join(";");

                    const response = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`
                    );

                    const data = await response.json();

                    if (data.code !== "Ok") {
                        throw new Error(data.message || `Mapbox error: ${data.code}`);
                    }

                    const route = data.routes[0];
                    const legs = route.legs;

                    setTotalTripStats({
                        distanceKm: Number((route.distance / 1000).toFixed(1)),
                        durationHours: (route.duration / 3600).toFixed(1)
                    });
                    setRouteGeometry(route.geometry);

                    // 3. Build Schedule
                    let currentTime = new Date();
                    currentTime.setHours(9, 0, 0, 0);

                    const orderedList: any[] = [];

                    orderedList.push({
                        type: 'start',
                        order: 0,
                        name: "Starting Point (Hotel / Current Location)",
                        lat: userLat,
                        lng: userLng,
                        departureTime: formatTime(currentTime),
                    });

                    sortedSpots.forEach((spot, index) => {
                        const travelDurationSecs = legs[index]?.duration || 0;
                        const travelMinutes = Math.ceil(travelDurationSecs / 60);

                        currentTime = addMinutesToTime(currentTime, travelMinutes);
                        const arrivalTime = formatTime(currentTime);

                        const isFinalDestination = (
                            (tripMode === 'custom_end' && targetEndPoint && spot.latitude === targetEndPoint.latitude && spot.longitude === targetEndPoint.longitude) ||
                            (tripMode === 'open' && index === sortedSpots.length - 1)
                        );

                        const visitDuration = isFinalDestination ? 0 : (spot.durationMinutes || defaultVisitDurationMinutes);
                        currentTime = addMinutesToTime(currentTime, visitDuration);
                        const departureTime = formatTime(currentTime);

                        orderedList.push({
                            type: isFinalDestination ? 'destination' : 'stop',
                            order: index + 1,
                            name: spot.name || `Stop ${index + 1}`,
                            lat: spot.latitude,
                            lng: spot.longitude,
                            arrivalTime,
                            departureTime,
                            visitDuration,
                            travelFromPrevMins: travelMinutes,
                        });
                    });

                    if (tripMode === 'roundtrip') {
                        const finalLegIndex = legs.length - 1;
                        const returnTravelMins = Math.ceil((legs[finalLegIndex]?.duration || 0) / 60);

                        currentTime = addMinutesToTime(currentTime, returnTravelMins);

                        orderedList.push({
                            type: 'return',
                            order: sortedSpots.length + 1,
                            name: "Return to Starting Point",
                            lat: userLat,
                            lng: userLng,
                            arrivalTime: formatTime(currentTime),
                            travelFromPrevMins: returnTravelMins,
                        });
                    }

                    setItinerary(orderedList);
                    setShowMapSection(true);

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

    return (
        <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
            <DestinationSelector
                tripMode={tripMode}
                setTripMode={setTripMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearching={isSearching}
                searchResults={searchResults}
                customEndPoint={customEndPoint}
                onSelectCustomDestination={(res) => {
                    setCustomEndPoint(res);
                    setSearchQuery(res.name);
                    setSearchResults([]);
                }}
            />

            <button
                onClick={handleOptimizeRoute}
                disabled={loading || (tripMode === 'custom_end' && !customEndPoint)}
                className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        Calculating Route & Schedule...
                    </>
                ) : (
                    <>
                        <Map className="w-4 h-4" />
                        ✨ Optimize Route & Schedule
                    </>
                )}
            </button>

            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

            {showMapSection && userCoords && routeGeometry && (
                <div className="mt-3 p-3 rounded-2xl bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Optimized Route Schedule</h4>
                            {totalTripStats && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                    Total: {totalTripStats.distanceKm} km • ~{totalTripStats.durationHours} hrs driving
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowMapSection(false)}
                            className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                        >
                            Hide Map
                        </button>
                    </div>

                    <RouteMapDisplay
                        userLat={userCoords.lat}
                        userLng={userCoords.lng}
                        geometry={routeGeometry}
                        orderedSpots={itinerary}
                    />

                    <ItineraryList itinerary={itinerary} />

                    <ShareAndDownloadActions
                        itinerary={itinerary}
                        totalTripStats={totalTripStats}
                    />
                </div>
            )}
        </div>
    );
}