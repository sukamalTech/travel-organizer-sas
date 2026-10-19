'use client';

import React from 'react';
import { Navigation, Clock } from "lucide-react";

interface ItineraryListProps {
    itinerary: any[];
}

export function ItineraryList({ itinerary }: ItineraryListProps) {
    return (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {itinerary.map((spot, idx) => (
                <div key={idx} className="flex flex-col p-2.5 rounded-lg bg-card border border-border/60 text-xs gap-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white ${spot.type === 'start' ? 'bg-emerald-600' : spot.type === 'return' || spot.type === 'destination' ? 'bg-amber-600' : 'bg-blue-600'
                                }`}>
                                {spot.type === 'start' ? '★' : spot.type === 'return' || spot.type === 'destination' ? '🏁' : spot.order}
                            </span>
                            <span className="font-semibold text-foreground truncate max-w-[180px]">{spot.name}</span>
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground shrink-0">
                            {spot.type === 'start' ? `Depart: ${spot.departureTime}` : spot.type === 'destination' ? `Arrive: ${spot.arrivalTime} (Final Stop)` : `Arrive: ${spot.arrivalTime}`}
                        </span>
                    </div>

                    {spot.type === 'stop' && (
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pl-7 pt-0.5 border-t border-border/30 mt-1">
                            <span className="flex items-center gap-1">
                                <Navigation className="w-3 h-3 text-blue-500" /> {spot.travelFromPrevMins} min drive
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-500" /> {spot.visitDuration} min visit (Depart {spot.departureTime})
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}