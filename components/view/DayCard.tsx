'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
    MapPin,
    Navigation,
    CalendarDays,
    Clock,
    Gauge,
    Car,
    Plane,
    Train,
    Bus,
    Bike,
    Compass,
    ArrowRight,
    ExternalLink,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { DayRouteOptimizer } from "./DayRouteOptimizer";

function getModeStyle(mode: string = '') {
    switch (mode.toLowerCase()) {
        case 'car':
        case 'suv':
            return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600', icon: <Car className="w-3.5 h-3.5" /> };
        case 'flight':
        case 'plane':
            return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-600', icon: <Plane className="w-3.5 h-3.5" /> };
        case 'train':
            return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-600', icon: <Train className="w-3.5 h-3.5" /> };
        case 'bus':
            return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600', icon: <Bus className="w-3.5 h-3.5" /> };
        case 'bike':
            return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-600', icon: <Bike className="w-3.5 h-3.5" /> };
        default:
            return { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: <Compass className="w-3.5 h-3.5" /> };
    }
}

function renderModeMetadata(leg: any) {
    const mode = leg.mode?.toLowerCase() || '';
    const meta = leg.metadata || {};
    if (mode === 'car' || mode === 'suv' || mode === 'bike') {
        return (
            <div className="space-y-1.5 pt-1 text-[11px]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Car / Bike Metadata</p>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20 font-medium flex justify-between">
                        <span>Highway:</span> <span className="font-bold">{meta.highway_number || '—'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-700 border border-indigo-500/20 font-medium flex justify-between">
                        <span>Condition:</span> <span className="font-semibold">{meta.road_condition || 'smooth'}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
}

interface DayCardProps {
    day: any;
    dayLegs: any[];
    dayAttrs: any[];
    isOpen: boolean;
    onToggle: () => void;
    onViewOthers: (dayId: string) => void;
}

export function DayCard({ day, dayLegs, dayAttrs, isOpen, onToggle, onViewOthers }: DayCardProps) {
    return (
        <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md transition-all">
            <div
                onClick={onToggle}
                className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/5 px-4 py-3.5 border-b border-border/70 flex items-center justify-between cursor-pointer select-none"
            >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/15 text-primary">
                        <CalendarDays className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-extrabold text-foreground">
                        Day {day.day_number} <span className="text-muted-foreground font-normal">({day.date})</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground border border-border/60">
                        {dayLegs.length} Legs
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>

            {isOpen && (
                <CardContent className="p-3.5 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => onViewOthers(day.id)}
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-semibold transition-colors bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 cursor-pointer"
                        >
                            <span>View Stays, Dining & Attractions</span>
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>

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
                                    <div key={leg.id} className="p-3.5 rounded-2xl bg-card border border-border/80 text-xs space-y-2.5 shadow-xs">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                                Seq #{leg.sequence_order || 1}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 uppercase text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${modeStyle.bg} ${modeStyle.border} ${modeStyle.text}`}>
                                                {modeStyle.icon} {leg.mode}
                                            </span>
                                        </div>

                                        <div className="space-y-2 p-2.5 rounded-xl bg-muted/30 border border-border/50">
                                            <div className="flex items-start gap-2">
                                                <div className="p-1 rounded-md bg-rose-500/10 text-rose-500 shrink-0 mt-0.5"><MapPin className="w-3.5 h-3.5" /></div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-semibold text-rose-500/80">Origin Point</p>
                                                    <p className="font-bold text-foreground line-clamp-1">{leg.origin_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pl-2 text-muted-foreground">
                                                <ArrowRight className="w-3.5 h-3.5 rotate-90 text-primary/60" />
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5"><Navigation className="w-3.5 h-3.5" /></div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-semibold text-emerald-500/80">Destination Point</p>
                                                    <p className="font-bold text-foreground line-clamp-1">{leg.destination_name}</p>
                                                </div>
                                            </div>
                                        </div>

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
                                        {renderModeMetadata(leg)}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <DayRouteOptimizer dayAttractions={dayAttrs} />
                </CardContent>
            )}
        </Card>
    );
}