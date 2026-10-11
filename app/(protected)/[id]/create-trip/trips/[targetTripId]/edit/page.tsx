'use client';

import React, { useState, useEffect, use } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import {
    TravelLegFormSchema,
    TravelLegFormInput,
    LegItem,
    ItineraryDay,
} from '@/lib/validations/itinerary';

import LegReorderList from '@/components/creator/LegReorderList';
import LegDetailsView from '@/components/creator/LegDetailsView';
import LegForm from '@/components/creator/LegForm';
import RichTextEditor from '@/components/creator/RichTextEditor';

import { Calendar, Plus, Save, Compass, AlertCircle, Eye, Sparkles, MapPin } from 'lucide-react';

export default function DesktopCreatorPortal({
    params,
}: {
    params: Promise<{ targetTripId: string }>;
}) {
    const resolvedParams = use(params);
    const tripId = resolvedParams.targetTripId;
    const supabase = createClient();

    const [days, setDays] = useState<ItineraryDay[]>([]);
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
    const [legs, setLegs] = useState<LegItem[]>([]);
    const [selectedLeg, setSelectedLeg] = useState<LegItem | null>(null);
    const [dayNotes, setDayNotes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<TravelLegFormInput>({
        resolver: zodResolver(TravelLegFormSchema),
        defaultValues: {
            trip_id: tripId,
            day_id: "",
            mode: "car",
            origin_name: "",
            origin_coordinates: null,
            destination_name: "",
            destination_coordinates: null,
            departure_time: "",
            arrival_time: "",
            distance_km: 0,
            sequence_order: 1,
            metadata: {},
        },
    });

    // Handle switching selected day/date
    const handleSelectDay = (day: ItineraryDay) => {
        setSelectedDayId(day.id);
        setDayNotes(day.daily_notes || '');
        setSelectedLeg(null);
        form.reset({
            trip_id: tripId,
            day_id: day.id,
            mode: 'car',
            origin_name: '',
            origin_coordinates: null,
            destination_name: '',
            destination_coordinates: null,
            departure_time: '',
            arrival_time: '',
            distance_km: undefined,
            sequence_order: legs.length + 1,
            metadata: {},
        });
    };

    // Populate form with existing leg data for editing or viewing
    // const handleSelectLeg = (leg: LegItem) => {
    //     setSelectedLeg(leg);
    //     form.reset({
    //         id: leg.id,
    //         trip_id: tripId,
    //         day_id: leg.day_id || selectedDayId || '',
    //         mode: leg.mode,
    //         origin_name: leg.origin_name,
    //         origin_coordinates: leg.origin_coordinates || null,
    //         destination_name: leg.destination_name,
    //         destination_coordinates: leg.destination_coordinates || null,
    //         departure_time: leg.departure_time ? new Date(leg.departure_time).toISOString().slice(0, 16) : '',
    //         arrival_time: leg.arrival_time ? new Date(leg.arrival_time).toISOString().slice(0, 16) : '',
    //         distance_km: leg.distance_km ?? undefined,
    //         sequence_order: leg.sequence_order,
    //         metadata: leg.metadata || {},
    //     });
    // };
    const handleSelectLeg = (leg: LegItem) => {
        setSelectedLeg(leg);

        const parseCoordinates = (coord: any) => {
            if (!coord) return { lat: null, lng: null };
            if (typeof coord === 'string') {
                const match = coord.match(/\(([^,]+),([^)]+)\)/);
                if (match) {
                    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
                }
            } else if (typeof coord === 'object' && 'x' in coord && 'y' in coord) {
                return { lng: coord.x, lat: coord.y };
            }
            return { lat: null, lng: null };
        };

        const originCoords = parseCoordinates(leg.origin_coordinates);
        const destCoords = parseCoordinates(leg.destination_coordinates);

        form.reset({
            id: leg.id,
            trip_id: tripId,
            day_id: leg.day_id || selectedDayId || '',
            mode: leg.mode,
            origin_name: leg.origin_name,
            origin_lat: originCoords.lat,
            origin_lng: originCoords.lng,
            destination_name: leg.destination_name,
            destination_lat: destCoords.lat,
            destination_lng: destCoords.lng,
            departure_time: leg.departure_time ? new Date(leg.departure_time).toISOString().slice(0, 16) : '',
            arrival_time: leg.arrival_time ? new Date(leg.arrival_time).toISOString().slice(0, 16) : '',
            distance_km: leg.distance_km ?? undefined,
            sequence_order: leg.sequence_order,
            metadata: leg.metadata || {},
        });

        // Automatically recalculate route metrics & trigger map update if both points exist
        if (originCoords.lat && originCoords.lng && destCoords.lat && destCoords.lng) {
            // This leverages Mapbox directions API if your LegForm exposes or handles it, 
            // or you can ensure LegRouteMap re-renders with the valid coordinates.
        }
    };
    // Fetch Days for current trip
    useEffect(() => {
        async function fetchTripData() {
            const { data: daysData } = await supabase
                .from('itinerary_days')
                .select('*')
                .eq('trip_id', tripId)
                .order('day_number', { ascending: true });

            if (daysData && daysData.length > 0) {
                setDays(daysData as ItineraryDay[]);
                setSelectedDayId(daysData[0].id);
                setDayNotes(daysData[0].daily_notes || '');
            }
        }
        fetchTripData();
    }, [tripId, supabase]);

    // Fetch legs whenever selected day changes
    useEffect(() => {
        if (!selectedDayId) return;

        async function fetchDayLegs() {
            const { data: legsData, error } = await supabase
                .from('travel_legs')
                .select('*')
                .eq('day_id', selectedDayId)
                .order('sequence_order', { ascending: true });

            if (error) {
                console.error('Error fetching legs:', error);
                return;
            }

            setLegs((legsData as LegItem[]) || []);
        }
        fetchDayLegs();
    }, [selectedDayId, supabase]);

    // Save/Update Travel Leg including all schema columns
    const onSubmitLeg: SubmitHandler<TravelLegFormInput> = async (values) => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            if (!selectedDayId) throw new Error('Please select a day first.');

            // const payload = {
            //     trip_id: tripId,
            //     day_id: selectedDayId,
            //     mode: values.mode,
            //     origin_name: values.origin_name,
            //     origin_coordinates: values.origin_coordinates ? `(${values.origin_coordinates.lng},${values.origin_coordinates.lat})` : null,
            //     destination_name: values.destination_name,
            //     destination_coordinates: values.destination_coordinates ? `(${values.destination_coordinates.lng},${values.destination_coordinates.lat})` : null,
            //     departure_time: values.departure_time ? new Date(values.departure_time).toISOString() : null,
            //     arrival_time: values.arrival_time ? new Date(values.arrival_time).toISOString() : null,
            //     distance_km: values.distance_km || null,
            //     sequence_order: values.sequence_order || legs.length + 1,
            //     metadata: values.metadata || {},
            // };

            // CORRECTED CODE IN onSubmitLeg
            const payload = {
                trip_id: tripId,
                day_id: selectedDayId,
                mode: values.mode,
                origin_name: values.origin_name,
                origin_coordinates: values.origin_lng != null && values.origin_lat != null
                    ? `(${values.origin_lng},${values.origin_lat})`
                    : null,
                destination_name: values.destination_name,
                destination_coordinates: values.destination_lng != null && values.destination_lat != null
                    ? `(${values.destination_lng},${values.destination_lat})`
                    : null,
                departure_time: values.departure_time ? new Date(values.departure_time).toISOString() : null,
                arrival_time: values.arrival_time ? new Date(values.arrival_time).toISOString() : null,
                distance_km: values.distance_km || null,
                sequence_order: values.sequence_order || legs.length + 1,
                metadata: values.metadata || {},
            };
            if (selectedLeg?.id) {
                const { error } = await supabase
                    .from('travel_legs')
                    .update(payload)
                    .eq('id', selectedLeg.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('travel_legs')
                    .insert([{ ...payload, sequence_order: legs.length + 1 }]);

                if (error) throw error;
            }

            // Refresh leg list
            const { data: refreshedLegs, error: fetchError } = await supabase
                .from('travel_legs')
                .select('*')
                .eq('day_id', selectedDayId)
                .order('sequence_order', { ascending: true });

            if (fetchError) throw fetchError;

            setLegs((refreshedLegs as LegItem[]) || []);
            setSelectedLeg(null); // Clear selected leg so form goes back to "Create" mode

            // Get the active leg date for resetting default times
            const currentDayDate = days.find((d) => d.id === selectedDayId)?.date || new Date().toISOString().split('T')[0];

            // Freshly reset the form
            form.reset({
                id: undefined,
                trip_id: tripId,
                day_id: selectedDayId,
                mode: 'car',
                origin_name: '',
                origin_lat: null,
                origin_lng: null,
                destination_name: '',
                destination_lat: null,
                destination_lng: null,
                departure_time: `${currentDayDate}T08:00`,
                arrival_time: `${currentDayDate}T12:00`,
                distance_km: undefined,
                sequence_order: (refreshedLegs?.length || 0) + 1,
                metadata: {
                    highway_number: '',
                    road_condition: '',
                    train_name: '',
                    train_number: '',
                    pnr: '',
                    seat_number: '',
                    departure_platform: '',
                    fare: '',
                    airline: '',
                    flight_number: '',
                    terminal: '',
                    seat: '',
                },
            });
        } catch (err: any) {
            console.error('Save leg error:', err);
            setErrorMessage(err.message || 'Failed to save travel leg.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveWorkspace = async () => {
        if (!selectedDayId) return;
        setIsSubmitting(true);

        const { error } = await supabase
            .from('itinerary_days')
            .update({ daily_notes: dayNotes })
            .eq('id', selectedDayId);

        if (error) {
            setErrorMessage(error.message);
        }
        setIsSubmitting(false);
    };

    const handleReorderLegs = async (reordered: LegItem[]) => {
        setLegs(reordered);
        for (const leg of reordered) {
            await supabase
                .from('travel_legs')
                .update({ sequence_order: leg.sequence_order })
                .eq('id', leg.id);
        }
    };

    const handleAddDay = async () => {
        const nextDayNumber = days.length + 1;
        let nextDate = new Date().toISOString().split('T')[0];

        if (days.length > 0) {
            const lastDate = new Date(days[days.length - 1].date);
            lastDate.setDate(lastDate.getDate() + 1);
            nextDate = lastDate.toISOString().split('T')[0];
        }

        const { data: newDay, error } = await supabase
            .from('itinerary_days')
            .insert({
                trip_id: tripId,
                day_number: nextDayNumber,
                date: nextDate,
                summary: `Day ${nextDayNumber}`,
            })
            .select('*')
            .single();

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        if (newDay) {
            setDays((prev) => [...prev, newDay as ItineraryDay]);
            setSelectedDayId(newDay.id);
            setDayNotes(newDay.daily_notes || '');
        }
    };

    const handleDateChange = async (dayId: string, newDate: string) => {
        setDays((prev) =>
            prev.map((d) => (d.id === dayId ? { ...d, date: newDate } : d))
        );

        const { error } = await supabase
            .from('itinerary_days')
            .update({ date: newDate })
            .eq('id', dayId);

        if (error) setErrorMessage(error.message);
    };

    return (
        <div className="h-screen w-full flex flex-col bg-background font-sans overflow-hidden">
            {/* Top Navigation Header with Colorful Gradient Banner Feel */}
            <header className="h-16 bg-card/80 backdrop-blur-md border-b border-primary/20 px-6 flex items-center justify-between shadow-xs relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-80" />
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
                        <Compass className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-foreground text-sm tracking-tight flex items-center gap-2">
                            Itinerary Creator Portal <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        </h1>
                        <p className="text-[11px] text-muted-foreground font-medium">
                            Trip ID: <span className="font-mono text-primary">{tripId.slice(0, 8)}...</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSaveWorkspace}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-4 py-2 rounded-2xl text-xs font-extrabold transition shadow-md hover:shadow-lg active:scale-95"
                    >
                        <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save Workspace'}
                    </button>
                </div>
            </header>

            {/* Main 3-Pane Workspace Grid */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden bg-muted/20">
                {/* Pane 1: Days Timeline */}
                <aside className="col-span-3 bg-card/70 backdrop-blur-md border-r border-border/80 p-5 flex flex-col gap-4 overflow-y-auto">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Days Timeline</h2>
                        </div>
                        <button
                            onClick={handleAddDay}
                            className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition shadow-2xs font-bold"
                            title="Add Day"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {days.map((day) => (
                            <div
                                key={day.id}
                                onClick={() => handleSelectDay(day)}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${selectedDayId === day.id
                                    ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                                    : 'border-border/60 bg-card/50 hover:bg-card hover:border-primary/40 shadow-xs'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-foreground">
                                        Day {day.day_number}
                                    </span>
                                    <div className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-lg border border-border/50">
                                        <Calendar className="w-3 h-3 text-primary" />
                                        <input
                                            type="date"
                                            value={day.date}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleDateChange(day.id, e.target.value)}
                                            className="bg-transparent text-[11px] text-muted-foreground font-mono focus:outline-none focus:text-primary cursor-pointer font-bold"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 truncate font-medium">
                                    {day.summary || 'No summary entered'}
                                </p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Pane 2: Leg List & Day Notes */}
                <section className="col-span-4 border-r border-border/80 p-5 flex flex-col gap-5 overflow-y-auto bg-card/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Daily Schedule</h2>
                            <p className="text-xs font-bold text-foreground">
                                {legs.length} {legs.length === 1 ? 'leg' : 'legs'} scheduled
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedLeg(null);
                                form.reset({
                                    trip_id: tripId,
                                    day_id: selectedDayId || '',
                                    mode: 'car',
                                    origin_name: '',
                                    origin_coordinates: null,
                                    destination_name: '',
                                    destination_coordinates: null,
                                    departure_time: '',
                                    arrival_time: '',
                                    distance_km: undefined,
                                    sequence_order: legs.length + 1,
                                    metadata: {},
                                });
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-2 rounded-2xl transition shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Leg
                        </button>
                    </div>

                    <div className="space-y-2">
                        <LegReorderList
                            legs={legs}
                            onReorder={handleReorderLegs}
                            onSelectLeg={handleSelectLeg}
                            onDeleteLeg={async (id) => {
                                await supabase.from('travel_legs').delete().eq('id', id);
                                setLegs(legs.filter((l) => l.id !== id));
                                if (selectedLeg?.id === id) setSelectedLeg(null);
                            }}
                        />
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/60">
                        <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-2">
                            Day Journal & Advisories
                        </h3>
                        <div className="rounded-2xl border border-border/80 bg-card/80 overflow-hidden shadow-xs">
                            <RichTextEditor content={dayNotes} onChange={setDayNotes} />
                        </div>
                    </div>
                </section>

                {/* Pane 3: Leg Viewer & Editor */}
                <main className="col-span-5 p-6 bg-card/70 backdrop-blur-md overflow-y-auto space-y-6">
                    <div>
                        <h2 className="text-sm font-extrabold text-foreground">
                            {selectedLeg ? 'Leg Details & Editor' : 'Add New Travel Leg'}
                        </h2>
                        <p className="text-xs text-muted-foreground font-medium">
                            Configure coordinates, timing, distance, and transport metadata.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl text-xs flex items-center gap-2 font-bold shadow-xs">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Selected Leg Details Summary Card */}
                    {selectedLeg && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs font-extrabold text-primary uppercase tracking-wider">
                                <Eye className="w-3.5 h-3.5" /> Selected Leg Overview
                            </div>
                            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-xs">
                                <LegDetailsView
                                    leg={selectedLeg}
                                    onClose={() => setSelectedLeg(null)}
                                />
                            </div>
                        </div>
                    )}

                    {/* All-Columns Leg Form */}
                    <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
                        <LegForm
                            form={form}
                            onSubmit={onSubmitLeg}
                            isSubmitting={isSubmitting}
                            selectedLegId={selectedLeg?.id}
                            legDate={days.find((d) => d.id === selectedDayId)?.date || new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}