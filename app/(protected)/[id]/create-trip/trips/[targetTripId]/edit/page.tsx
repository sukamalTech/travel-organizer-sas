// [id]/create-trip/trips/[targetTripId]/edit/page.tsx
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

import { Calendar, Plus, Save, Compass, AlertCircle, Eye } from 'lucide-react';

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
    const handleSelectLeg = (leg: LegItem) => {
        setSelectedLeg(leg);
        form.reset({
            id: leg.id,
            trip_id: tripId,
            day_id: leg.day_id || selectedDayId || '',
            mode: leg.mode,
            origin_name: leg.origin_name,
            origin_coordinates: leg.origin_coordinates || null,
            destination_name: leg.destination_name,
            destination_coordinates: leg.destination_coordinates || null,
            departure_time: leg.departure_time ? new Date(leg.departure_time).toISOString().slice(0, 16) : '',
            arrival_time: leg.arrival_time ? new Date(leg.arrival_time).toISOString().slice(0, 16) : '',
            distance_km: leg.distance_km ?? undefined,
            sequence_order: leg.sequence_order,
            metadata: leg.metadata || {},
        });
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

            const payload = {
                trip_id: tripId,
                day_id: selectedDayId,
                mode: values.mode,
                origin_name: values.origin_name,
                origin_coordinates: values.origin_coordinates ? `(${values.origin_coordinates.lng},${values.origin_coordinates.lat})` : null,
                destination_name: values.destination_name,
                destination_coordinates: values.destination_coordinates ? `(${values.destination_coordinates.lng},${values.destination_coordinates.lat})` : null,
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
            setSelectedLeg(null);

            // Reset form
            form.reset({
                trip_id: tripId,
                day_id: selectedDayId,
                mode: 'car',
                origin_name: '',
                origin_coordinates: null,
                destination_name: '',
                destination_coordinates: null,
                departure_time: '',
                arrival_time: '',
                distance_km: undefined,
                sequence_order: (refreshedLegs?.length || 0) + 1,
                metadata: {},
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
        <div className="h-screen w-full flex flex-col bg-slate-100 dark:bg-slate-950 font-sans overflow-hidden">
            {/* Top Navigation Header */}
            <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        Itinerary Creator Portal
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">Trip ID: {tripId.slice(0, 8)}...</span>
                    <button
                        type="button"
                        onClick={handleSaveWorkspace}
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                    >
                        <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save Workspace'}
                    </button>
                </div>
            </header>

            {/* Main 3-Pane Workspace Grid */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
                {/* Pane 1: Days Timeline */}
                <aside className="col-span-3 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days Timeline</h2>
                        <button
                            onClick={handleAddDay}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {days.map((day) => (
                            <div
                                key={day.id}
                                onClick={() => handleSelectDay(day)}
                                className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${selectedDayId === day.id
                                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Day {day.day_number}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <input
                                            type="date"
                                            value={day.date}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => handleDateChange(day.id, e.target.value)}
                                            className="bg-transparent text-[11px] text-slate-400 font-mono focus:outline-none focus:text-blue-500 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {day.summary || 'No summary entered'}
                                </p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Pane 2: Leg List & Day Notes */}
                <section className="col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Schedule</h2>
                            <p className="text-xs text-slate-500">
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
                            className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Leg
                        </button>
                    </div>

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

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Day Journal & Advisories
                        </h3>
                        <RichTextEditor content={dayNotes} onChange={setDayNotes} />
                    </div>
                </section>

                {/* Pane 3: Leg Viewer & Editor */}
                <main className="col-span-5 p-5 bg-white dark:bg-slate-900 overflow-y-auto space-y-5">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {selectedLeg ? 'Leg Details & Editor' : 'Add New Travel Leg'}
                        </h2>
                        <p className="text-xs text-slate-500">
                            Configure coordinates, timing, distance, and transport metadata.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Selected Leg Details Summary Card */}
                    {selectedLeg && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <Eye className="w-3.5 h-3.5 text-blue-500" /> Selected Leg Overview
                            </div>
                            <LegDetailsView
                                leg={selectedLeg}
                                onClose={() => setSelectedLeg(null)}
                            />
                        </div>
                    )}

                    {/* All-Columns Leg Form */}
                    <LegForm
                        form={form}
                        onSubmit={onSubmitLeg}
                        isSubmitting={isSubmitting}
                        selectedLegId={selectedLeg?.id}
                    />
                </main>
            </div>
        </div>
    );
}