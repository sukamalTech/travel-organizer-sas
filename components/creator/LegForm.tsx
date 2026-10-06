// src/components/creator/LegForm.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TravelLegFormInput } from '@/lib/validations/itinerary';
import LegRouteMap from '@/components/creator/LegRouteMap';
import { Clock, Ruler, MapPin, Loader2 } from 'lucide-react';

interface LegFormProps {
    form: UseFormReturn<TravelLegFormInput>;
    onSubmit: (values: TravelLegFormInput) => void;
    isSubmitting: boolean;
    selectedLegId?: string | null;
    defaultValues?: TravelLegFormInput;
}

interface PlaceSuggestion {
    id: string;
    place_name: string;
    center: [number, number]; // [lng, lat]
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function LegForm({
    form,
    onSubmit,
    isSubmitting,
    selectedLegId,
    defaultValues
}: LegFormProps) {
    const currentMode = form.watch('mode');
    const originLat = form.watch('origin_lat');
    const originLng = form.watch('origin_lng');
    const destinationLat = form.watch('destination_lat');
    const destinationLng = form.watch('destination_lng');

    const originName = form.watch('origin_name');
    const destinationName = form.watch('destination_name');

    // Autocomplete suggestion states
    const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>([]);
    const [destSuggestions, setDestSuggestions] = useState<PlaceSuggestion[]>([]);
    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
    const [isLoadingDest, setIsLoadingDest] = useState(false);

    const originRef = useRef<HTMLDivElement>(null);
    const destRef = useRef<HTMLDivElement>(null);

    // Sync form values when editing a leg
    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [selectedLegId, defaultValues, form]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (originRef.current && !originRef.current.contains(event.target as Node)) {
                setShowOriginDropdown(false);
            }
            if (destRef.current && !destRef.current.contains(event.target as Node)) {
                setShowDestDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Mapbox autocomplete suggestions
    const fetchSuggestions = async (query: string, type: 'origin' | 'dest') => {
        if (!query || query.length < 2 || !MAPBOX_TOKEN) {
            if (type === 'origin') setOriginSuggestions([]);
            else setDestSuggestions([]);
            return;
        }

        if (type === 'origin') setIsLoadingOrigin(true);
        else setIsLoadingDest(true);

        try {
            const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
            );
            const data = await res.json();
            if (data.features) {
                const results = data.features.map((f: any) => ({
                    id: f.id,
                    place_name: f.place_name,
                    center: f.center,
                }));
                if (type === 'origin') setOriginSuggestions(results);
                else setDestSuggestions(results);
            }
        } catch (err) {
            console.error('Autocomplete error:', err);
        } finally {
            if (type === 'origin') setIsLoadingOrigin(false);
            else setIsLoadingDest(false);
        }
    };

    // Calculate Route Metrics (Distance & Duration)
    const calculateRouteMetrics = async (orig: { lat: number; lng: number }, dest: { lat: number; lng: number }, mode: string) => {
        if (!MAPBOX_TOKEN) return;
        let profile = 'mapbox/driving';
        if (mode === 'bike') profile = 'mapbox/cycling';
        if (mode === 'walk') profile = 'mapbox/walking';

        try {
            const res = await fetch(
                `https://api.mapbox.com/directions/v5/${profile}/${orig.lng},${orig.lat};${dest.lng},${dest.lat}?access_token=${MAPBOX_TOKEN}&overview=false`
            );
            const data = await res.json();
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const distanceKm = (route.distance / 1000).toFixed(1);
                form.setValue('metadata.distance_km', Number(distanceKm), { shouldDirty: true });

                const durationSeconds = route.duration;
                const depTimeStr = form.getValues('departure_time');
                if (depTimeStr) {
                    const depDate = new Date(depTimeStr);
                    const arrDate = new Date(depDate.getTime() + durationSeconds * 1000);
                    form.setValue('arrival_time', arrDate.toISOString().slice(0, 16), { shouldDirty: true });
                }
            }
        } catch (err) {
            console.error('Routing error:', err);
        }
    };

    // Handle selecting an origin suggestion
    const handleSelectOrigin = async (place: PlaceSuggestion) => {
        const [lng, lat] = place.center;
        form.setValue('origin_name', place.place_name, { shouldValidate: true, shouldDirty: true });
        form.setValue('origin_lat', lat, { shouldValidate: true, shouldDirty: true });
        form.setValue('origin_lng', lng, { shouldValidate: true, shouldDirty: true });
        setShowOriginDropdown(false);

        // If destination already exists, compute route metrics
        const destLat = form.getValues('destination_lat');
        const destLng = form.getValues('destination_lng');
        if (destLat && destLng) {
            await calculateRouteMetrics({ lat, lng }, { lat: destLat, lng: destLng }, currentMode);
        }
    };

    // Handle selecting a destination suggestion
    const handleSelectDestination = async (place: PlaceSuggestion) => {
        const [lng, lat] = place.center;
        form.setValue('destination_name', place.place_name, { shouldValidate: true, shouldDirty: true });
        form.setValue('destination_lat', lat, { shouldValidate: true, shouldDirty: true });
        form.setValue('destination_lng', lng, { shouldValidate: true, shouldDirty: true });
        setShowDestDropdown(false);

        // If origin already exists, compute route metrics
        const origLat = form.getValues('origin_lat');
        const origLng = form.getValues('origin_lng');
        if (origLat && origLng) {
            await calculateRouteMetrics({ lat: origLat, lng: origLng }, { lat, lng }, currentMode);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-xs">
            {/* Transport Mode */}
            <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Transport Mode
                </label>
                <select
                    {...form.register('mode')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="car">Car / Personal Vehicle</option>
                    <option value="bike">Motorcycle / Bike</option>
                    <option value="train">Train Transit</option>
                    <option value="bus">Intercity Bus</option>
                    <option value="flight">Flight</option>
                    <option value="ferry">Ferry / Boat</option>
                    <option value="walk">Walking / Trek</option>
                </select>
            </div>

            {/* Origin & Destination Inputs with Auto-Suggest */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Origin Input */}
                <div className="relative" ref={originRef}>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" /> Origin Name
                    </label>
                    <div className="relative">
                        <input
                            {...form.register('origin_name')}
                            onChange={(e) => {
                                form.setValue('origin_name', e.target.value);
                                fetchSuggestions(e.target.value, 'origin');
                                setShowOriginDropdown(true);
                            }}
                            onFocus={() => {
                                if (originSuggestions.length > 0) setShowOriginDropdown(true);
                            }}
                            placeholder="Type origin (e.g. Kolkata)..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        />
                        {isLoadingOrigin && (
                            <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-slate-400" />
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showOriginDropdown && originSuggestions.length > 0 && (
                        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                            {originSuggestions.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectOrigin(item)}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 last:border-none truncate"
                                >
                                    {item.place_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Destination Input */}
                <div className="relative" ref={destRef}>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Destination Name
                    </label>
                    <div className="relative">
                        <input
                            {...form.register('destination_name')}
                            onChange={(e) => {
                                form.setValue('destination_name', e.target.value);
                                fetchSuggestions(e.target.value, 'dest');
                                setShowDestDropdown(true);
                            }}
                            onFocus={() => {
                                if (destSuggestions.length > 0) setShowDestDropdown(true);
                            }}
                            placeholder="Type destination (e.g. Digha)..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                        />
                        {isLoadingDest && (
                            <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-slate-400" />
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showDestDropdown && destSuggestions.length > 0 && (
                        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                            {destSuggestions.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelectDestination(item)}
                                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 last:border-none truncate"
                                >
                                    {item.place_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* ROUTE MAP */}
            <LegRouteMap
                originLat={originLat}
                originLng={originLng}
                destinationLat={destinationLat}
                destinationLng={destinationLng}
                mode={currentMode}
                onUpdateOrigin={({ lat, lng }) => {
                    form.setValue('origin_lat', lat, { shouldValidate: true, shouldDirty: true });
                    form.setValue('origin_lng', lng, { shouldValidate: true, shouldDirty: true });
                }}
                onUpdateDestination={({ lat, lng }) => {
                    form.setValue('destination_lat', lat, { shouldValidate: true, shouldDirty: true });
                    form.setValue('destination_lng', lng, { shouldValidate: true, shouldDirty: true });
                }}
            />

            {/* Times */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> Departure Time
                    </label>
                    <input
                        type="datetime-local"
                        {...form.register('departure_time')}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                </div>
                <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" /> Arrival Time
                    </label>
                    <input
                        type="datetime-local"
                        {...form.register('arrival_time')}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                </div>
            </div>

            {/* Distance */}
            <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-purple-500" /> Distance (Kilometers)
                </label>
                <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 185.5"
                    {...form.register('metadata.distance_km')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
                {isSubmitting ? 'Saving...' : selectedLegId ? 'Update Travel Leg' : 'Create Travel Leg'}
            </button>
        </form>
    );
}