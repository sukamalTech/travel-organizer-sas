

'use client';

import React, { useState, useEffect } from 'react';
import { LegItem, ItineraryDay } from '@/lib/validations/itinerary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    MapPin,
    Navigation,
    Hotel,
    Utensils,
    Landmark,
    CalendarDays,
    Clock,
    Gauge,
    Car,
    Plane,
    Train,
    Bus,
    Bike,
    Compass,
    ArrowRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MapNavigatorButton } from "@/components/view/MapNavigatorButton";

// Dynamic Transport Mode Styling & Icons
function getModeStyle(mode: string = '') {
    switch (mode.toLowerCase()) {
        case 'car':
        case 'suv':
            return {
                bg: 'bg-blue-500/10 dark:bg-blue-500/20',
                border: 'border-blue-500/30',
                text: 'text-blue-600 dark:text-blue-400',
                icon: <Car className="w-3.5 h-3.5" />
            };
        case 'flight':
        case 'plane':
            return {
                bg: 'bg-purple-500/10 dark:bg-purple-500/20',
                border: 'border-purple-500/30',
                text: 'text-purple-600 dark:text-purple-400',
                icon: <Plane className="w-3.5 h-3.5" />
            };
        case 'train':
            return {
                bg: 'bg-amber-500/10 dark:bg-amber-500/20',
                border: 'border-amber-500/30',
                text: 'text-amber-600 dark:text-amber-400',
                icon: <Train className="w-3.5 h-3.5" />
            };
        case 'bus':
            return {
                bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
                border: 'border-emerald-500/30',
                text: 'text-emerald-600 dark:text-emerald-400',
                icon: <Bus className="w-3.5 h-3.5" />
            };
        case 'bike':
            return {
                bg: 'bg-rose-500/10 dark:bg-rose-500/20',
                border: 'border-rose-500/30',
                text: 'text-rose-600 dark:text-rose-400',
                icon: <Bike className="w-3.5 h-3.5" />
            };
        default:
            return {
                bg: 'bg-primary/10',
                border: 'border-primary/30',
                text: 'text-primary',
                icon: <Compass className="w-3.5 h-3.5" />
            };
    }
}

// Mode-Specific Metadata Renderer
function renderModeMetadata(leg: any) {
    const mode = leg.mode?.toLowerCase() || '';
    const meta = leg.metadata || {};

    if (mode === 'car' || mode === 'suv' || mode === 'bike') {
        return (
            <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Car / Bike Metadata</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        <span>Highway:</span>
                        <span className="uppercase font-bold">{meta.highway_number || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-medium">
                        <span>Condition:</span>
                        <span className="capitalize font-semibold">{meta.road_condition || 'smooth'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/20 font-medium">
                        <span>Fuel Stops:</span>
                        <span className="font-bold truncate max-w-[100px]">{meta.fuel_stops?.length ? meta.fuel_stops.join(', ') : 'None'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium">
                        <span>Vehicle Checks:</span>
                        <span className="font-bold truncate max-w-[90px]">{meta.vehicle_check_reminders?.length ? meta.vehicle_check_reminders.join(', ') : 'None'}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'train' || mode === 'bus') {
        return (
            <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Transit Metadata</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        <span>Name:</span>
                        <span className="font-bold truncate max-w-[100px]">{meta.train_name || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        <span>Number:</span>
                        <span className="font-bold">{meta.train_number || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        <span>PNR:</span>
                        <span className="font-bold">{meta.pnr || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        <span>Coach/Seat:</span>
                        <span className="font-bold">{meta.coach_type || '—'} / {meta.seat_number || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        <span>Platform:</span>
                        <span className="font-bold">{meta.departure_platform || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                        <span>Fare:</span>
                        <span className="font-bold">{meta.fare != null ? `₹${meta.fare}` : '—'}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'flight' || mode === 'plane') {
        return (
            <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Flight Metadata</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium">
                        <span>Airline:</span>
                        <span className="font-bold truncate max-w-[100px]">{meta.airline || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium">
                        <span>Flight No:</span>
                        <span className="font-bold">{meta.flight_number || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium">
                        <span>Terminal/Gate:</span>
                        <span className="font-bold">{meta.terminal || '—'} / {meta.gate || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium">
                        <span>Seat:</span>
                        <span className="font-bold">{meta.seat || '—'}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between p-2 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-medium">
                        <span>Booking Ref:</span>
                        <span className="font-bold">{meta.booking_reference || '—'}</span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default function TripDetailsPage({
    params,
}: {
    params: Promise<{ tripId: string }>;
}) {
    const resolvedParams = React.use(params);
    const tripId = resolvedParams.tripId;

    const [days, setDays] = useState<ItineraryDay[]>([]);
    const [legs, setLegs] = useState<LegItem[]>([]);
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

    const [tripAccommodations, setTripAccommodations] = useState<any[]>([]);
    const [tripDining, setTripDining] = useState<any[]>([]);
    const [tripAttractions, setTripAttractions] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTripData() {
            const supabase = createClient();

            // 1. Fetch Itinerary Days and deduplicate by day_number
            const { data: daysData } = await supabase
                .from('itinerary_days')
                .select('*')
                .eq('trip_id', tripId)
                .order('day_number', { ascending: true });

            if (daysData && daysData.length > 0) {
                const uniqueDaysMap = new Map();
                daysData.forEach((day: any) => {
                    if (!uniqueDaysMap.has(day.day_number)) {
                        uniqueDaysMap.set(day.day_number, day);
                    }
                });
                const uniqueDays = Array.from(uniqueDaysMap.values());

                setDays(uniqueDays as ItineraryDay[]);
                setSelectedDayId(uniqueDays[0].id);
            }

            // 2. Fetch All Travel Legs
            const { data: legsData } = await supabase
                .from('travel_legs')
                .select('*')
                .eq('trip_id', tripId)
                .order('sequence_order', { ascending: true });

            if (legsData) {
                setLegs(legsData as LegItem[]);
            }

            // 3. Fetch Accommodations, Dining, and Attractions
            const { data: accData } = await supabase.from('accommodations').select('*').eq('trip_id', tripId);
            const { data: diningData } = await supabase.from('dining_spots').select('*').eq('trip_id', tripId);
            const { data: attrData } = await supabase.from('attractions').select('*').eq('trip_id', tripId);

            if (accData) setTripAccommodations(accData);
            if (diningData) setTripDining(diningData);
            if (attrData) setTripAttractions(attrData);
        }

        fetchTripData();
    }, [tripId]);

    return (
        <main className="min-h-screen bg-background/95 text-foreground pb-24 px-4 pt-4 max-w-md mx-auto">
            <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 h-10 p-1 bg-muted/60 rounded-2xl">
                    <TabsTrigger value="itinerary" className="text-xs font-bold rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-xs">
                        Itinerary & Legs
                    </TabsTrigger>
                    <TabsTrigger value="others" className="text-xs font-bold rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-xs">
                        Other Details
                    </TabsTrigger>
                </TabsList>

                {/* --- TAB 1: ITINERARY & LEGS --- */}
                <TabsContent value="itinerary" className="space-y-4">
                    {days?.map((day, index) => {
                        const dayLegs = legs?.filter((l) => l.day_id === day.id) || [];
                        return (
                            <Card key={day.id} className="border border-border/80 shadow-md rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md">
                                <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/5 px-3.5 py-2.5 border-b border-border/70 flex justify-between items-center text-xs font-bold">
                                    <span className="flex items-center gap-1.5 text-foreground">
                                        <div className="p-1 rounded-lg bg-primary/15 text-primary">
                                            <CalendarDays className="w-3.5 h-3.5" />
                                        </div>
                                        Day {day.day_number} <span className="text-muted-foreground font-normal">({day.date})</span>
                                    </span>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground border border-border/60">
                                        Legs: {dayLegs.length}
                                    </span>
                                </div>

                                <CardContent className="p-3.5 space-y-3">
                                    {day.summary && (
                                        <p className="text-xs italic text-muted-foreground bg-muted/30 p-2 rounded-xl border border-border/40">
                                            "{day.summary}"
                                        </p>
                                    )}

                                    <div className="space-y-3">
                                        {dayLegs.length === 0 ? (
                                            <div className="p-4 rounded-xl border border-dashed border-border/60 text-center bg-muted/20">
                                                <p className="text-[11px] text-muted-foreground">No travel legs logged for this day.</p>
                                            </div>
                                        ) : (
                                            dayLegs.map((leg: any) => {
                                                const modeStyle = getModeStyle(leg.mode);

                                                return (
                                                    <div
                                                        key={leg.id}
                                                        className="p-3.5 rounded-2xl bg-card border border-border/80 text-xs space-y-2.5 shadow-xs hover:border-primary/40 transition-colors"
                                                    >
                                                        {/* Transport Mode Badge & Sequence Header */}
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                                <span>Seq #{leg.sequence_order || 1}</span>
                                                            </div>
                                                            <span className={`inline-flex items-center gap-1.5 uppercase text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${modeStyle.bg} ${modeStyle.border} ${modeStyle.text}`}>
                                                                {modeStyle.icon}
                                                                {leg.mode}
                                                            </span>
                                                        </div>

                                                        {/* Route Block */}
                                                        <div className="space-y-2 p-2.5 rounded-xl bg-muted/30 border border-border/50">
                                                            {/* Origin */}
                                                            <div className="flex items-start gap-2">
                                                                <div className="p-1 rounded-md bg-rose-500/10 text-rose-500 shrink-0 mt-0.5">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-semibold text-rose-500/80">Origin Point</p>
                                                                    <p className="font-bold text-foreground line-clamp-1">{leg.origin_name}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 pl-2 text-muted-foreground">
                                                                <ArrowRight className="w-3.5 h-3.5 rotate-90 text-primary/60" />
                                                            </div>

                                                            {/* Destination */}
                                                            <div className="flex items-start gap-2">
                                                                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                                                                    <Navigation className="w-3.5 h-3.5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-semibold text-emerald-500/80">Destination Point</p>
                                                                    <p className="font-bold text-foreground line-clamp-1">{leg.destination_name}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Timings & Distance Bar */}
                                                        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-primary/5 border border-primary/15 text-[11px]">
                                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                                <Gauge className="w-3.5 h-3.5 text-primary shrink-0" />
                                                                <span>Distance: <strong className="text-foreground">{leg.distance_km ?? "—"} km</strong></span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 justify-end text-muted-foreground">
                                                                <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                                                <span className="font-semibold text-foreground truncate">
                                                                    {leg.departure_time ? new Date(leg.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"} ➔ {leg.arrival_time ? new Date(leg.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Conditional Schema-Specific Metadata */}
                                                        {renderModeMetadata(leg)}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                {/* --- TAB 2: OTHER DETAILS --- */}
                <TabsContent value="others">
                    <Tabs defaultValue="stays" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-3 h-9 p-1 bg-muted/60 rounded-xl text-[11px]">
                            <TabsTrigger value="stays" className="font-bold rounded-lg">Stays</TabsTrigger>
                            <TabsTrigger value="dining" className="font-bold rounded-lg">Dining</TabsTrigger>
                            <TabsTrigger value="attractions" className="font-bold rounded-lg">Attractions</TabsTrigger>
                        </TabsList>

                        {/* Stays Tab */}
                        <TabsContent value="stays" className="space-y-3">
                            {tripAccommodations.length === 0 ? (
                                <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50">
                                    <p className="text-xs text-muted-foreground">No accommodations saved.</p>
                                </div>
                            ) : (
                                tripAccommodations.map((acc) => (
                                    <Card key={acc.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-0.5">
                                                <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                                                    <Hotel className="w-4 h-4 text-blue-500 shrink-0" />
                                                    {acc.name}
                                                </p>
                                                <p className="text-muted-foreground">{acc.address || "No address provided"}</p>
                                            </div>
                                            <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-extrabold px-2 py-0.5 rounded-full capitalize shrink-0">
                                                {acc.status || 'Booked'}
                                            </span>
                                        </div>
                                        {acc.latitude && acc.longitude && (
                                            <MapNavigatorButton lat={Number(acc.latitude)} lng={Number(acc.longitude)} label={acc.name} />
                                        )}
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        {/* Dining Tab */}
                        <TabsContent value="dining" className="space-y-3">
                            {tripDining.length === 0 ? (
                                <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50">
                                    <p className="text-xs text-muted-foreground">No dining spots saved.</p>
                                </div>
                            ) : (
                                tripDining.map((spot: any) => (
                                    <Card key={spot.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
                                        <div className="space-y-0.5">
                                            <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                                                <Utensils className="w-4 h-4 text-amber-500 shrink-0" />
                                                {spot.name}
                                            </p>
                                            <p className="text-muted-foreground">{spot.cuisineType || spot.category || "Restaurant / Cafe"}</p>
                                        </div>
                                        {spot.latitude && spot.longitude && (
                                            <MapNavigatorButton lat={Number(spot.latitude)} lng={Number(spot.longitude)} label={spot.name} />
                                        )}
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        {/* Attractions Tab */}
                        <TabsContent value="attractions" className="space-y-3">
                            {tripAttractions.length === 0 ? (
                                <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50">
                                    <p className="text-xs text-muted-foreground">No attractions saved.</p>
                                </div>
                            ) : (
                                tripAttractions.map((attr) => (
                                    <Card key={attr.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
                                        <div className="space-y-0.5">
                                            <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                                                <Landmark className="w-4 h-4 text-purple-500 shrink-0" />
                                                {attr.name}
                                            </p>
                                            <p className="text-muted-foreground">
                                                Entry Fee: <strong className="text-foreground">{attr.currency || "₹"} {attr.entryFee ?? "Free"}</strong>
                                            </p>
                                        </div>
                                        {attr.latitude && attr.longitude && (
                                            <MapNavigatorButton lat={Number(attr.latitude)} lng={Number(attr.longitude)} label={attr.name} />
                                        )}
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </main>
    );
}