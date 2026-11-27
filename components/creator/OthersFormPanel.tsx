

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Search, MapPin, Loader2, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TextInput, ActionButton } from '@/components/ui/FormControls';

export type ActiveTabType = 'accommodation' | 'attraction' | 'dining' | 'leg';

interface OthersFormPanelProps {
    activeTab: ActiveTabType;
    selectedItem: any;
    isSubmitting: boolean;
    onSubmit: (values: any) => void;
    onCancel: () => void;
}

interface PlaceSuggestion {
    id: string;
    name?: string;
    display_name: string;
    lat: string;
    lon: string;
    category?: string;
    extratags?: Record<string, string>;
}

const COMMON_FACILITIES = [
    'Parking',
    'Wi-Fi',
    'Swimming Pool',
    'AC',
    'Restaurant',
    'Room Service',
    'Power Backup',
    'Pet Friendly',
];

const LocationMapPreview = dynamic(() => import('./LocationMapPreview'), { ssr: false });

async function searchNominatimPlaces(query: string): Promise<PlaceSuggestion[]> {
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
    )}&format=jsonv2&extratags=1&addressdetails=1&limit=5`;

    const res = await fetch(endpoint, {
        headers: {
            'User-Agent': 'TravelItineraryApp/1.0 (contact@example.com)',
        },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

export default function OthersFormPanel({
    activeTab,
    selectedItem,
    isSubmitting,
    onSubmit,
    onCancel,
}: OthersFormPanelProps) {
    const [formData, setFormData] = useState<any>({});

    // Single-place search states (Accommodation / Attraction / Dining)
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Leg Origin & Destination search states
    const [originQuery, setOriginQuery] = useState('');
    const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>([]);
    const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
    const [showOriginDropdown, setShowOriginDropdown] = useState(false);

    const [destQuery, setDestQuery] = useState('');
    const [destSuggestions, setDestSuggestions] = useState<PlaceSuggestion[]>([]);
    const [isSearchingDest, setIsSearchingDest] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);

    const originRef = useRef<HTMLDivElement>(null);
    const destRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab === 'leg') {
            const base = selectedItem || {};
            setFormData({
                mode: 'car',
                sequenceOrder: 1,
                metadata: {},
                ...base,
                // metadata: base.metadata || {},
            });
            setOriginQuery(base.originName || base.origin_name || '');
            setDestQuery(base.destinationName || base.destination_name || '');
        } else {
            setFormData(selectedItem || {});
            setSearchQuery(selectedItem?.name || '');
        }
        setSuggestions([]);
        setShowDropdown(false);
        setOriginSuggestions([]);
        setShowOriginDropdown(false);
        setDestSuggestions([]);
        setShowDestDropdown(false);
    }, [selectedItem, activeTab]);

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

    const resetForm = () => {
        setFormData(activeTab === 'leg' ? { mode: 'car', sequenceOrder: 1, metadata: {} } : {});
        setSearchQuery('');
        setOriginQuery('');
        setDestQuery('');
        setSuggestions([]);
        setOriginSuggestions([]);
        setDestSuggestions([]);
        setShowDropdown(false);
        setShowOriginDropdown(false);
        setShowDestDropdown(false);
    };

    const handleChange = (field: string, val: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: val }));
    };

    const handleMetaChange = (metaField: string, val: any) => {
        setFormData((prev: any) => ({
            ...prev,
            metadata: {
                ...(prev.metadata || {}),
                [metaField]: val,
            },
        }));
    };

    const toggleFacility = (facility: string) => {
        const currentFacilities = Array.isArray(formData.facilities) ? formData.facilities : [];
        if (currentFacilities.includes(facility)) {
            handleChange(
                'facilities',
                currentFacilities.filter((f: string) => f !== facility)
            );
        } else {
            handleChange('facilities', [...currentFacilities, facility]);
        }
    };

    // Single place search (Accommodation / Attraction / Dining)
    const handleSearchSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setShowDropdown(false);
        handleChange('name', searchQuery);

        try {
            const data = await searchNominatimPlaces(searchQuery);
            setSuggestions(data);
            if (data.length > 0) setShowDropdown(true);
        } catch (err) {
            console.error('Error fetching Nominatim places:', err);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSuggestion = (item: PlaceSuggestion) => {
        const placeName = item.name || item.display_name.split(',')[0];
        setSearchQuery(placeName);
        setShowDropdown(false);
        setSuggestions([]);

        handleChange('name', placeName);
        if (item.display_name) handleChange('address', item.display_name);
        if (item.lat && item.lon) {
            handleChange('latitude', parseFloat(item.lat));
            handleChange('longitude', parseFloat(item.lon));
        }
        if (item.extratags) {
            const desc = item.extratags.description || item.extratags.wikipedia || item.category;
            if (desc) handleChange('highlights', [desc]);
        }
    };

    // Leg Origin search
    const handleOriginSearch = async () => {
        if (!originQuery.trim()) return;
        setIsSearchingOrigin(true);
        setShowOriginDropdown(false);
        handleChange('originName', originQuery);

        try {
            const data = await searchNominatimPlaces(originQuery);
            setOriginSuggestions(data);
            if (data.length > 0) setShowOriginDropdown(true);
        } catch (err) {
            console.error('Error fetching origin places:', err);
            setOriginSuggestions([]);
        } finally {
            setIsSearchingOrigin(false);
        }
    };

    const handleSelectOriginSuggestion = (item: PlaceSuggestion) => {
        const placeName = item.name || item.display_name.split(',')[0];
        setOriginQuery(placeName);
        setShowOriginDropdown(false);
        setOriginSuggestions([]);

        setFormData((prev: any) => ({
            ...prev,
            originName: placeName,
            originLat: item.lat ? parseFloat(item.lat) : null,
            originLng: item.lon ? parseFloat(item.lon) : null,
        }));
    };

    // Leg Destination search
    const handleDestSearch = async () => {
        if (!destQuery.trim()) return;
        setIsSearchingDest(true);
        setShowDestDropdown(false);
        handleChange('destinationName', destQuery);

        try {
            const data = await searchNominatimPlaces(destQuery);
            setDestSuggestions(data);
            if (data.length > 0) setShowDestDropdown(true);
        } catch (err) {
            console.error('Error fetching destination places:', err);
            setDestSuggestions([]);
        } finally {
            setIsSearchingDest(false);
        }
    };

    const handleSelectDestSuggestion = (item: PlaceSuggestion) => {
        const placeName = item.name || item.display_name.split(',')[0];
        setDestQuery(placeName);
        setShowDestDropdown(false);
        setDestSuggestions([]);

        setFormData((prev: any) => ({
            ...prev,
            destinationName: placeName,
            destinationLat: item.lat ? parseFloat(item.lat) : null,
            destinationLng: item.lon ? parseFloat(item.lon) : null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === 'leg') {
            const payload = {
                ...formData,
                originName: (formData.originName || originQuery || '').trim(),
                originLat:
                    formData.originLat !== '' && formData.originLat != null
                        ? Number(formData.originLat)
                        : null,
                originLng:
                    formData.originLng !== '' && formData.originLng != null
                        ? Number(formData.originLng)
                        : null,
                destinationName: (formData.destinationName || destQuery || '').trim(),
                destinationLat:
                    formData.destinationLat !== '' && formData.destinationLat != null
                        ? Number(formData.destinationLat)
                        : null,
                destinationLng:
                    formData.destinationLng !== '' && formData.destinationLng != null
                        ? Number(formData.destinationLng)
                        : null,
                distanceKm:
                    formData.distanceKm !== '' && formData.distanceKm != null
                        ? Number(formData.distanceKm)
                        : null,
                sequenceOrder: Number(formData.sequenceOrder) || 1,
                metadata: formData.metadata || {},
            };
            await onSubmit(payload);
        } else {
            await onSubmit(formData);
        }
        resetForm();
    };

    const currentMode = formData.mode || 'car';
    const meta = formData.metadata || {};

    const previewLat =
        activeTab === 'leg'
            ? formData.destinationLat || formData.originLat
            : formData.latitude;
    const previewLng =
        activeTab === 'leg'
            ? formData.destinationLng || formData.originLng
            : formData.longitude;

    const lat = previewLat != null && previewLat !== '' ? parseFloat(previewLat) : null;
    const lng = previewLng != null && previewLng !== '' ? parseFloat(previewLng) : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 relative">
            {/* TRAVEL LEG FORM */}
            {activeTab === 'leg' && (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Transport Mode
                            </label>
                            <select
                                value={currentMode}
                                onChange={(e) => handleChange('mode', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                            >
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="train">Train</option>
                                <option value="bus">Bus</option>
                                <option value="flight">Flight</option>
                                <option value="ferry">Ferry</option>
                                <option value="walk">Walk</option>
                            </select>
                        </div>

                        <TextInput
                            label="Sequence Order"
                            type="number"
                            min="1"
                            value={formData.sequenceOrder ?? 1}
                            onChange={(e) => handleChange('sequenceOrder', e.target.value)}
                        />
                    </div>

                    {/* Origin Search + Lat/Lng */}
                    <div className="space-y-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50">
                        <div className="relative space-y-1" ref={originRef}>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Origin Name
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    required
                                    value={originQuery}
                                    onChange={(e) => {
                                        setOriginQuery(e.target.value);
                                        handleChange('originName', e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleOriginSearch();
                                        }
                                    }}
                                    placeholder="Search origin (Press Enter)"
                                    className="w-full pl-8 pr-20 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                                />
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                <ActionButton
                                    type="button"
                                    variant="primary"
                                    onClick={handleOriginSearch}
                                    className="absolute right-1 px-2.5 py-1 text-[10px] rounded-lg"
                                >
                                    {isSearchingOrigin ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        'Search'
                                    )}
                                </ActionButton>
                            </div>

                            {showOriginDropdown && originSuggestions.length > 0 && (
                                <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-44 overflow-y-auto text-xs">
                                    {originSuggestions.map((item, idx) => (
                                        <li
                                            key={item.id || idx}
                                            onClick={() => handleSelectOriginSuggestion(item)}
                                            className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-start gap-2 border-b border-slate-100 dark:border-slate-800 last:border-none"
                                        >
                                            <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                    {item.name || item.display_name.split(',')[0]}
                                                </p>
                                                <p className="text-[10px] text-slate-500 truncate">
                                                    {item.display_name}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                label="Origin Latitude"
                                type="number"
                                step="any"
                                value={formData.originLat ?? ''}
                                onChange={(e) => handleChange('originLat', e.target.value)}
                            />
                            <TextInput
                                label="Origin Longitude"
                                type="number"
                                step="any"
                                value={formData.originLng ?? ''}
                                onChange={(e) => handleChange('originLng', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Destination Search + Lat/Lng */}
                    <div className="space-y-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50">
                        <div className="relative space-y-1" ref={destRef}>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Destination Name
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    required
                                    value={destQuery}
                                    onChange={(e) => {
                                        setDestQuery(e.target.value);
                                        handleChange('destinationName', e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleDestSearch();
                                        }
                                    }}
                                    placeholder="Search destination (Press Enter)"
                                    className="w-full pl-8 pr-20 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                                />
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                                <ActionButton
                                    type="button"
                                    variant="primary"
                                    onClick={handleDestSearch}
                                    className="absolute right-1 px-2.5 py-1 text-[10px] rounded-lg"
                                >
                                    {isSearchingDest ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        'Search'
                                    )}
                                </ActionButton>
                            </div>

                            {showDestDropdown && destSuggestions.length > 0 && (
                                <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-44 overflow-y-auto text-xs">
                                    {destSuggestions.map((item, idx) => (
                                        <li
                                            key={item.id || idx}
                                            onClick={() => handleSelectDestSuggestion(item)}
                                            className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-start gap-2 border-b border-slate-100 dark:border-slate-800 last:border-none"
                                        >
                                            <MapPin className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                    {item.name || item.display_name.split(',')[0]}
                                                </p>
                                                <p className="text-[10px] text-slate-500 truncate">
                                                    {item.display_name}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                label="Destination Latitude"
                                type="number"
                                step="any"
                                value={formData.destinationLat ?? ''}
                                onChange={(e) => handleChange('destinationLat', e.target.value)}
                            />
                            <TextInput
                                label="Destination Longitude"
                                type="number"
                                step="any"
                                value={formData.destinationLng ?? ''}
                                onChange={(e) => handleChange('destinationLng', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Departure Time, Arrival Time & Distance */}
                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Departure Time"
                            type="time"
                            step="1"
                            value={formData.departureTime || ''}
                            onChange={(e) => handleChange('departureTime', e.target.value)}
                        />
                        <TextInput
                            label="Arrival Time"
                            type="time"
                            step="1"
                            value={formData.arrivalTime || ''}
                            onChange={(e) => handleChange('arrivalTime', e.target.value)}
                        />
                    </div>

                    <TextInput
                        label="Distance (km)"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 185.5"
                        value={formData.distanceKm ?? ''}
                        onChange={(e) => handleChange('distanceKm', e.target.value)}
                    />

                    {/* Mode-Specific Metadata */}
                    {(currentMode === 'car' || currentMode === 'bike') && (
                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                label="Highway / Route Number"
                                placeholder="e.g. NH-16"
                                value={meta.highway_number || ''}
                                onChange={(e) => handleMetaChange('highway_number', e.target.value)}
                            />
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Road Condition
                                </label>
                                <select
                                    value={meta.road_condition || 'smooth'}
                                    onChange={(e) => handleMetaChange('road_condition', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                                >
                                    <option value="smooth">Smooth</option>
                                    <option value="patchy">Patchy</option>
                                    <option value="gravel">Gravel</option>
                                    <option value="severe">Severe</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {(currentMode === 'train' || currentMode === 'bus' || currentMode === 'ferry') && (
                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                label="Transit / Operator Name"
                                placeholder="e.g. Vande Bharat"
                                value={meta.train_name || ''}
                                onChange={(e) => handleMetaChange('train_name', e.target.value)}
                            />
                            <TextInput
                                label="Train / Service Number"
                                placeholder="e.g. 22301"
                                value={meta.train_number || ''}
                                onChange={(e) => handleMetaChange('train_number', e.target.value)}
                            />
                            <TextInput
                                label="PNR / Booking Ref"
                                value={meta.pnr || ''}
                                onChange={(e) => handleMetaChange('pnr', e.target.value)}
                            />
                            <TextInput
                                label="Coach / Seat Number"
                                value={meta.seat_number || ''}
                                onChange={(e) => handleMetaChange('seat_number', e.target.value)}
                            />
                            <TextInput
                                label="Platform / Terminal"
                                value={meta.departure_platform || ''}
                                onChange={(e) =>
                                    handleMetaChange('departure_platform', e.target.value)
                                }
                            />
                            <TextInput
                                label="Fare"
                                type="number"
                                step="any"
                                value={meta.fare ?? ''}
                                onChange={(e) => handleMetaChange('fare', e.target.value)}
                            />
                        </div>
                    )}

                    {currentMode === 'flight' && (
                        <div className="grid grid-cols-2 gap-3">
                            <TextInput
                                label="Airline"
                                value={meta.airline || ''}
                                onChange={(e) => handleMetaChange('airline', e.target.value)}
                            />
                            <TextInput
                                label="Flight Number"
                                value={meta.flight_number || ''}
                                onChange={(e) => handleMetaChange('flight_number', e.target.value)}
                            />
                            <TextInput
                                label="Terminal"
                                value={meta.terminal || ''}
                                onChange={(e) => handleMetaChange('terminal', e.target.value)}
                            />
                            <TextInput
                                label="Gate & Seat"
                                value={meta.seat || ''}
                                onChange={(e) => handleMetaChange('seat', e.target.value)}
                            />
                        </div>
                    )}
                </>
            )}

            {/* NON-LEG TABS (Accommodation / Attraction / Dining) */}
            {activeTab !== 'leg' && (
                <>
                    <div className="relative space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Name
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                required
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    handleChange('name', e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearchSubmit();
                                    }
                                }}
                                placeholder={
                                    activeTab === 'accommodation'
                                        ? 'Search Hotel Name (Press Enter)'
                                        : activeTab === 'attraction'
                                            ? 'Search Monument Name (Press Enter)'
                                            : 'Search Restaurant Name (Press Enter)'
                                }
                                className="w-full pl-8 pr-20 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />

                            <ActionButton
                                type="button"
                                variant="primary"
                                onClick={() => handleSearchSubmit()}
                                className="absolute right-1 px-2.5 py-1 text-[10px] rounded-lg"
                            >
                                {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
                            </ActionButton>
                        </div>

                        {showDropdown && suggestions.length > 0 && (
                            <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto text-xs">
                                {suggestions.map((item, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelectSuggestion(item)}
                                        className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-start gap-2 border-b border-slate-100 dark:border-slate-800 last:border-none"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                                                {item.name || item.display_name.split(',')[0]}
                                            </p>
                                            <p className="text-[10px] text-slate-500 truncate">
                                                {item.display_name}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {activeTab === 'accommodation' && (
                        <>
                            <TextInput
                                label="Place Name"
                                placeholder="e.g. Downtown District, Mall Road"
                                value={formData.placeName || ''}
                                onChange={(e) => handleChange('placeName', e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Status / Type
                                    </label>
                                    <select
                                        value={formData.status || 'Confirmed'}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                                    >
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Budget">Budget</option>
                                        <option value="Homestay">Homestay</option>
                                        <option value="2 Star">2 Star</option>
                                        <option value="3 Star">3 Star</option>
                                        <option value="4 Star">4 Star</option>
                                        <option value="5 Star">5 Star</option>
                                        <option value="Tent">Tent</option>
                                    </select>
                                </div>

                                <TextInput
                                    label="Currency"
                                    placeholder="e.g. INR, USD"
                                    value={formData.currency || ''}
                                    onChange={(e) => handleChange('currency', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Facilities
                                </label>
                                <div className="flex flex-wrap gap-1.5 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    {COMMON_FACILITIES.map((facility) => {
                                        const isSelected =
                                            Array.isArray(formData.facilities) &&
                                            formData.facilities.includes(facility);
                                        return (
                                            <ActionButton
                                                key={facility}
                                                type="button"
                                                variant={isSelected ? 'primary' : 'secondary'}
                                                onClick={() => toggleFacility(facility)}
                                                className="px-2.5 py-1 text-[10px] rounded-lg"
                                            >
                                                {isSelected && <Check className="w-3 h-3" />}
                                                {facility}
                                            </ActionButton>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Estimated Cost"
                                    type="number"
                                    step="0.01"
                                    value={formData.estimatedCost || ''}
                                    onChange={(e) => handleChange('estimatedCost', e.target.value)}
                                />
                                <TextInput
                                    label="Actual Cost"
                                    type="number"
                                    step="0.01"
                                    value={formData.actualCost || ''}
                                    onChange={(e) => handleChange('actualCost', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Phone Number"
                                    value={formData.phoneNumber || ''}
                                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                />
                                <TextInput
                                    label="Booking Reference"
                                    value={formData.bookingReference || ''}
                                    onChange={(e) => handleChange('bookingReference', e.target.value)}
                                />
                            </div>

                            <TextInput
                                label="External Booking URL"
                                type="url"
                                placeholder="https://..."
                                value={formData.externalBookingUrl || ''}
                                onChange={(e) =>
                                    handleChange('externalBookingUrl', e.target.value)
                                }
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Latitude"
                                    type="number"
                                    step="any"
                                    value={formData.latitude || ''}
                                    onChange={(e) => handleChange('latitude', e.target.value)}
                                />
                                <TextInput
                                    label="Longitude"
                                    type="number"
                                    step="any"
                                    value={formData.longitude || ''}
                                    onChange={(e) => handleChange('longitude', e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'attraction' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Currency"
                                    placeholder="e.g. INR, USD"
                                    value={formData.currency || ''}
                                    onChange={(e) => handleChange('currency', e.target.value)}
                                />
                                <TextInput
                                    label="Entry Fee"
                                    type="number"
                                    step="0.01"
                                    value={formData.entryFee || ''}
                                    onChange={(e) => handleChange('entryFee', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Opening Time"
                                    type="time"
                                    step="900"
                                    value={formData.openingTime || ''}
                                    onChange={(e) => handleChange('openingTime', e.target.value)}
                                />
                                <TextInput
                                    label="Closing Time"
                                    type="time"
                                    step="900"
                                    value={formData.closingTime || ''}
                                    onChange={(e) => handleChange('closingTime', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Latitude"
                                    type="number"
                                    step="any"
                                    value={formData.latitude || ''}
                                    onChange={(e) => handleChange('latitude', e.target.value)}
                                />
                                <TextInput
                                    label="Longitude"
                                    type="number"
                                    step="any"
                                    value={formData.longitude || ''}
                                    onChange={(e) => handleChange('longitude', e.target.value)}
                                />
                            </div>

                            <TextInput
                                label="Highlights (comma separated)"
                                value={formData.highlights || ''}
                                onChange={(e) => handleChange('highlights', e.target.value)}
                                placeholder="e.g. Sunset view, Architecture, Museum"
                            />
                            <TextInput
                                label="Photography Notes (comma separated)"
                                value={formData.photographyNotes || ''}
                                onChange={(e) => handleChange('photographyNotes', e.target.value)}
                                placeholder="e.g. Drone allowed, Tripod restricted, Golden hour best"
                            />
                        </>
                    )}

                    {activeTab === 'dining' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Category"
                                    value={formData.category || ''}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                />
                                <TextInput
                                    label="Cuisine Type"
                                    value={formData.cuisineType || ''}
                                    onChange={(e) => handleChange('cuisineType', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Estimated Cost"
                                    type="number"
                                    step="0.01"
                                    value={formData.estimatedCost || ''}
                                    onChange={(e) => handleChange('estimatedCost', e.target.value)}
                                />
                                <TextInput
                                    label="Rating"
                                    type="number"
                                    step="0.1"
                                    max="5"
                                    value={formData.rating || ''}
                                    onChange={(e) => handleChange('rating', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <TextInput
                                    label="Latitude"
                                    type="number"
                                    step="any"
                                    value={formData.latitude || ''}
                                    onChange={(e) => handleChange('latitude', e.target.value)}
                                />
                                <TextInput
                                    label="Longitude"
                                    type="number"
                                    step="any"
                                    value={formData.longitude || ''}
                                    onChange={(e) => handleChange('longitude', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <TextInput
                        label="Address / Location"
                        value={formData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Full street address"
                    />
                </>
            )}

            {lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng) && (
                <LocationMapPreview
                    lat={lat}
                    lng={lng}
                    placeName={
                        activeTab === 'leg'
                            ? `${formData.originName || ''} → ${formData.destinationName || ''}`
                            : formData.name
                    }
                />
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                {selectedItem?.id && (
                    <ActionButton type="button" variant="secondary" onClick={onCancel}>
                        <X className="w-3.5 h-3.5" /> Cancel
                    </ActionButton>
                )}
                <ActionButton type="submit" variant="primary" size="md" disabled={isSubmitting}>
                    <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save to TiDB'}
                </ActionButton>
            </div>
        </form>
    );
}