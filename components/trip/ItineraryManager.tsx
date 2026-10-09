// components/trip/ItineraryManager.tsx
'use client';

import React from 'react';
import { Trip, ItineraryDay, Accommodation, DiningSpot, Attraction } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, MapPin, DollarSign, Clock, Calendar } from 'lucide-react';

interface ItineraryManagerProps {
    trip: Trip;
    days: ItineraryDay[];
    accommodations: Accommodation[];
    diningSpots: DiningSpot[];
    attractions: Attraction[];
}

export default function ItineraryManager({
    trip,
    days,
    accommodations,
    diningSpots,
    attractions,
}: ItineraryManagerProps) {
    return (
        <div className="space-y-6">
            {/* Trip Overview Banner mapping the exact columns */}
            <div className="bg-card p-5 rounded-xl border shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">{trip.title}</h2>
                        {trip.description && <p className="text-sm text-muted-foreground mt-1">{trip.description}</p>}
                    </div>
                    <span className="text-xs uppercase bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                        {trip.visibility}
                    </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {trip.start_date} to {trip.end_date}
                    </span>
                    <span>Primary Mode: <strong className="text-foreground">{trip.primary_mode}</strong></span>
                    <span>Template: <strong className="text-foreground">{trip.is_template ? 'Yes' : 'No'}</strong></span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Itinerary & Linked Activities</h3>
                <Button size="sm">+ Add Itinerary Day</Button>
            </div>

            {/* Render each itinerary day card */}
            {days.map((day) => {
                // Sub-items must match day_id to render under this specific day block
                const dayAccommodations = accommodations.filter((a) => a.day_id === day.id);
                const dayDining = diningSpots.filter((d) => d.day_id === day.id);
                const dayAttractions = attractions.filter((att) => att.day_id === day.id);

                return (
                    <Card key={day.id} className="border-l-4 border-l-primary shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <span className="bg-muted text-foreground text-xs px-2.5 py-1 rounded-md font-bold">
                                    Day {day.day_number}
                                </span>
                                {day.date}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">Edit Day</Button>
                                <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Accommodations */}
                            <div className="bg-muted/30 p-3 rounded-lg border">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Accommodations</h4>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs">+ Add Stay</Button>
                                </div>
                                {dayAccommodations.map((acc) => (
                                    <div key={acc.id} className="flex justify-between items-center bg-background p-2.5 rounded border text-sm my-1">
                                        <div>
                                            <span className="font-medium">{acc.name}</span>
                                            <span className="text-xs text-muted-foreground ml-2">({acc.status})</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {acc.estimated_cost && <span className="text-xs text-muted-foreground">{acc.estimated_cost} {acc.currency}</span>}
                                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Attractions */}
                            <div className="bg-muted/30 p-3 rounded-lg border">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Attractions</h4>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs">+ Add Attraction</Button>
                                </div>
                                {dayAttractions.map((att) => (
                                    <div key={att.id} className="flex justify-between items-center bg-background p-2.5 rounded border text-sm my-1">
                                        <span className="font-medium">{att.name}</span>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                                    </div>
                                ))}
                            </div>

                            {/* Dining Spots */}
                            <div className="bg-muted/30 p-3 rounded-lg border">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Dining Spots</h4>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs">+ Add Dining</Button>
                                </div>
                                {dayDining.map((dining) => (
                                    <div key={dining.id} className="flex justify-between items-center bg-background p-2.5 rounded border text-sm my-1">
                                        <div>
                                            <span className="font-medium">{dining.name}</span>
                                            {dining.cuisine_type && <span className="text-xs text-muted-foreground ml-2">({dining.cuisine_type})</span>}
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}