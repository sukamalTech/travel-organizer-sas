'use client';

import React from 'react';
import { LegItem } from '@/lib/validations/itinerary';
import {
    MapPin,
    Clock,
    Ruler,
    Navigation,
    Tag,
    Calendar,
    X
} from 'lucide-react';

interface LegDetailsViewProps {
    leg: LegItem | null;
    onClose?: () => void;
    onEdit?: (leg: LegItem) => void;
}

export default function LegDetailsView({ leg, onClose, onEdit }: LegDetailsViewProps) {
    if (!leg) return null;

    const formatDateTime = (isoStr?: string | null) => {
        if (!isoStr) return 'Not set';
        return new Date(isoStr).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        {leg.mode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                        Leg #{leg.sequence_order}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(leg)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                        >
                            Edit Leg
                        </button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Origin -> Destination Route */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                <div>
                    <div className="absolute left-1 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {leg.origin_name || 'Origin not specified'}
                    </h4>
                    {leg.origin_coordinates?.lat && leg.origin_coordinates?.lng && (
                        <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {leg.origin_coordinates.lat.toFixed(4)}, {leg.origin_coordinates.lng.toFixed(4)}
                        </p>
                    )}
                </div>

                <div>
                    <div className="absolute left-1 bottom-1.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {leg.destination_name || 'Destination not specified'}
                    </h4>
                    {leg.destination_coordinates?.lat && leg.destination_coordinates?.lng && (
                        <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {leg.destination_coordinates.lat.toFixed(4)}, {leg.destination_coordinates.lng.toFixed(4)}
                        </p>
                    )}
                </div>
            </div>

            {/* Metrics Row: Timings & Distance */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" /> Departure
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 truncate">
                        {formatDateTime(leg.departure_time)}
                    </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-500" /> Arrival
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 truncate">
                        {formatDateTime(leg.arrival_time)}
                    </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Ruler className="w-3 h-3 text-purple-500" /> Distance
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                        {leg.distance_km ? `${leg.distance_km} km` : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Metadata JSON Viewer */}
            {leg.metadata && Object.keys(leg.metadata).length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Additional Metadata
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {Object.entries(leg.metadata).map(([key, val]) => (
                            <div key={key} className="bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 capitalize block">{key.replace('_', ' ')}</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                                    {String(val)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}