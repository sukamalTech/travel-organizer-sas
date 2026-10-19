'use client';

import React from 'react';
import { Flag, Search, Loader2, CheckCircle2 } from "lucide-react";

interface DestinationSelectorProps {
    tripMode: 'roundtrip' | 'open' | 'custom_end';
    setTripMode: (mode: 'roundtrip' | 'open' | 'custom_end') => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    isSearching: boolean;
    searchResults: any[];
    customEndPoint: { name: string; latitude: number; longitude: number } | null;
    onSelectCustomDestination: (result: any) => void;
}

export function DestinationSelector({
    tripMode,
    setTripMode,
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    customEndPoint,
    onSelectCustomDestination,
}: DestinationSelectorProps) {
    return (
        <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-primary" /> Day End Destination Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                    type="button"
                    onClick={() => setTripMode('open')}
                    className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all cursor-pointer ${tripMode === 'open'
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-card text-muted-foreground border-border/80 hover:bg-muted/60'
                        }`}
                >
                    End at Last Stop
                </button>
                <button
                    type="button"
                    onClick={() => setTripMode('roundtrip')}
                    className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all cursor-pointer ${tripMode === 'roundtrip'
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-card text-muted-foreground border-border/80 hover:bg-muted/60'
                        }`}
                >
                    Loop to Start
                </button>
                <button
                    type="button"
                    onClick={() => setTripMode('custom_end')}
                    className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-all cursor-pointer ${tripMode === 'custom_end'
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-card text-muted-foreground border-border/80 hover:bg-muted/60'
                        }`}
                >
                    Pick Final Place
                </button>
            </div>

            {tripMode === 'custom_end' && (
                <div className="space-y-2 pt-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-foreground">
                            <Search className="w-3.5 h-3.5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search hotel, city, or landmark to end at..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {searchResults.length > 0 && (
                        <div className="bg-card border border-border rounded-lg shadow-lg max-h-36 overflow-y-auto divide-y divide-border/50 text-xs">
                            {searchResults.map((result, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => onSelectCustomDestination(result)}
                                    className="w-full text-left p-2 hover:bg-muted/50 transition-colors flex items-center justify-between cursor-pointer"
                                >
                                    <span className="truncate pr-2 text-foreground">{result.name}</span>
                                    <span className="text-[10px] text-primary shrink-0 font-medium">Select</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {customEndPoint && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Destination set: {customEndPoint.name}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}