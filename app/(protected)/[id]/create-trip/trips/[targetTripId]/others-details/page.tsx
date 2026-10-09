'use client';
import React, { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Compass, Save, Building2, Utensils, MapPin, Plus, AlertCircle } from 'lucide-react';
import OthersSidebarTimeline from '@/components/creator/OthersSidebarTimeline';
import OthersItemList from '@/components/creator/OthersItemList';
import OthersFormPanel from '@/components/creator/OthersFormPanel';

export type ActiveTabType = 'accommodation' | 'attraction' | 'dining';

export default function OthersDetailsPortal({
    params,
}: {
    params: Promise<{ targetTripId: string; id: string }>;
}) {
    const resolvedParams = use(params);
    const tripId = resolvedParams.targetTripId;
    const supabase = createClient();

    const [days, setDays] = useState<any[]>([]);
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTabType>('accommodation');

    // Data lists for the selected day/trip
    const [accommodations, setAccommodations] = useState<any[]>([]);
    const [attractions, setAttractions] = useState<any[]>([]);
    const [diningSpots, setDiningSpots] = useState<any[]>([]);

    // Selected item for editing (null means creating new)
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch Trip Days from Supabase
    useEffect(() => {
        async function fetchTripDays() {
            const { data, error } = await supabase
                .from('itinerary_days')
                .select('*')
                .eq('trip_id', tripId)
                .order('day_number', { ascending: true });

            if (error) {
                console.error('Error fetching days from Supabase:', error);
                setErrorMessage('Failed to load trip days.');
                return;
            }

            if (data && data.length > 0) {
                setDays(data);
                setSelectedDayId(data[0].id);
            }
        }
        fetchTripDays();
    }, [tripId, supabase]);

    // Fetch TiDB Data (Accommodations, Attractions, Dining Spots)
    const fetchTiDBData = async () => {
        if (!tripId) return;
        try {
            const res = await fetch(`/api/trips/${tripId}/others-details`);
            if (!res.ok) throw new Error('Failed to fetch supplementary trip details');
            const json = await res.json();

            setAccommodations(json.accommodations || []);
            setAttractions(json.attractions || []);
            setDiningSpots(json.diningSpots || []);
        } catch (err: any) {
            console.error('Error fetching TiDB data:', err);
            setErrorMessage(err.message);
        }
    };

    useEffect(() => {
        fetchTiDBData();
    }, [tripId]);

    // Handle form submission to TiDB API endpoint
    const handleSaveItem = async (formData: any) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const endpoint = `/api/trips/${tripId}/others-details`;
            const method = selectedItem?.id ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                tripId: tripId,
                dayId: selectedDayId,
                type: activeTab, // 'accommodation' | 'attraction' | 'dining'
                id: selectedItem?.id || undefined,
            };

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errJson = await res.json();
                throw new Error(errJson.error || 'Failed to save record.');
            }

            setSuccessMessage('Successfully saved record to TiDB!');
            setSelectedItem(null);
            await fetchTiDBData();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setErrorMessage(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle item deletion
    const handleDeleteItem = async (id: string, type: ActiveTabType) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            const res = await fetch(`/api/trips/${tripId}/others-details?id=${id}&type=${type}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete item.');
            await fetchTiDBData();
            if (selectedItem?.id === id) setSelectedItem(null);
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-100 dark:bg-slate-950 font-sans overflow-hidden">
            {/* Top Navigation Header */}
            <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        Trip Logistics & Experiences Portal
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">Trip ID: {tripId.slice(0, 8)}...</span>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                        <button
                            onClick={() => { setActiveTab('accommodation'); setSelectedItem(null); }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'accommodation' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <Building2 className="w-3.5 h-3.5" /> Stays
                        </button>
                        <button
                            onClick={() => { setActiveTab('attraction'); setSelectedItem(null); }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'attraction' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <MapPin className="w-3.5 h-3.5" /> Attractions
                        </button>
                        <button
                            onClick={() => { setActiveTab('dining'); setSelectedItem(null); }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${activeTab === 'dining' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <Utensils className="w-3.5 h-3.5" /> Dining
                        </button>
                    </div>
                </div>
            </header>

            {/* Main 3-Pane Workspace Grid */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
                {/* Pane 1: Days Timeline (Fetched from Supabase) */}
                <OthersSidebarTimeline
                    days={days}
                    selectedDayId={selectedDayId}
                    onSelectDay={(day) => {
                        setSelectedDayId(day.id);
                        setSelectedItem(null);
                    }}
                />

                {/* Pane 2: Categorized Item List filtered by Selected Day */}
                <OthersItemList
                    activeTab={activeTab}
                    selectedDayId={selectedDayId}
                    accommodations={accommodations}
                    attractions={attractions}
                    diningSpots={diningSpots}
                    onSelectItem={(item) => setSelectedItem(item)}
                    onDeleteItem={handleDeleteItem}
                    onAddNew={() => setSelectedItem({})}
                />

                {/* Pane 3: Dynamic Editor/Creation Form */}
                <main className="col-span-5 p-5 bg-white dark:bg-slate-900 overflow-y-auto space-y-4">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {selectedItem?.id ? `Edit ${activeTab}` : `Add New ${activeTab}`}
                        </h2>
                        <p className="text-xs text-slate-500">
                            Manage records stored directly in your TiDB database backend.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs">
                            {successMessage}
                        </div>
                    )}

                    <OthersFormPanel
                        activeTab={activeTab}
                        selectedItem={selectedItem}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSaveItem}
                        onCancel={() => setSelectedItem(null)}
                    />
                </main>
            </div>
        </div>
    );
}