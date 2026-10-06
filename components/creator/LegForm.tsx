'use client';
// https://gemini.google.com/app/6309f53f2edfa531?hl=en-IN
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TravelLegFormInput } from '@/lib/validations/itinerary';
import MapboxPinPicker from '@/components/creator/MapboxPinPicker';
import { Navigation, Clock, MapPin, Ruler } from 'lucide-react';

interface LegFormProps {
    form: UseFormReturn<TravelLegFormInput>;
    onSubmit: (values: TravelLegFormInput) => void;
    isSubmitting: boolean;
    selectedLegId?: string | null;
}

export default function LegForm({
    form,
    onSubmit,
    isSubmitting,
    selectedLegId
}: LegFormProps) {
    const currentMode = form.watch('mode');

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-xs">
            {/* Transport Mode */}
            <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Transport Mode
                </label>
                <select
                    {...form.register('mode')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="car">Car / Personal Vehicle</option>
                    <option value="bike">Motorcycle / Bike</option>
                    <option value="train">Train Transit</option>
                    <option value="bus">Intercity Bus</option>
                    <option value="flight">Flight</option>
                    <option value="ferry">Ferry / Boat</option>
                    <option value="walk">Walking / Trek</option>
                </select>
            </div>

            {/* Origin Name & Destination Name */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Origin Name
                    </label>
                    <input
                        {...form.register('origin_name')}
                        placeholder="e.g. New Delhi Station"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                    {form.formState.errors.origin_name && (
                        <p className="text-rose-500 text-[10px] mt-1">
                            {form.formState.errors.origin_name.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Destination Name
                    </label>
                    <input
                        {...form.register('destination_name')}
                        placeholder="e.g. Manali Bus Stand"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                    {form.formState.errors.destination_name && (
                        <p className="text-rose-500 text-[10px] mt-1">
                            {form.formState.errors.destination_name.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Coordinates Pickers: Origin & Destination */}
            <div className="grid grid-cols-2 gap-3">
                <MapboxPinPicker
                    label="Origin Pin (GPS)"
                    onSelectCoordinates={({ lat, lng }) => {
                        form.setValue('origin_lat', lat, { shouldValidate: true, shouldDirty: true });
                        form.setValue('origin_lng', lng, { shouldValidate: true, shouldDirty: true });
                    }}
                />
                <MapboxPinPicker
                    label="Destination Pin (GPS)"
                    onSelectCoordinates={({ lat, lng }) => {
                        form.setValue('destination_lat', lat, { shouldValidate: true, shouldDirty: true });
                        form.setValue('destination_lng', lng, { shouldValidate: true, shouldDirty: true });
                    }}
                />
            </div>

            {/* Departure Time & Arrival Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> Departure Time
                    </label>
                    <input
                        type="datetime-local"
                        {...form.register('departure_time')}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                </div>

                <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" /> Arrival Time
                    </label>
                    <input
                        type="datetime-local"
                        {...form.register('arrival_time')}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    />
                </div>
            </div>

            {/* Distance in KM */}
            {/* Distance */}
            <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-purple-500" /> Distance (Kilometers)
                </label>
                <input
                    type="number"
                    // step="0.1"
                    placeholder="e.g. 540"

                    {...form.register('metadata.distance_km')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
            </div>
            {/* JSONB Metadata Fields based on Mode */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                    <Navigation className="w-3.5 h-3.5 text-blue-500" /> Mode Metadata Settings (JSONB)
                </h3>

                {currentMode === 'train' || currentMode === 'bus' ? (
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            placeholder="Operator / Train Name"
                            {...form.register('metadata.operator_name')}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        />
                        <input
                            placeholder="PNR / Booking Ref"
                            {...form.register('metadata.pnr')}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        />
                    </div>
                ) : currentMode === 'flight' ? (
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            placeholder="Airline & Flight No."
                            {...form.register('metadata.flight_number')}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        />
                        <input
                            placeholder="Terminal / Gate"
                            {...form.register('metadata.terminal')}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            placeholder="Highway / Route No."
                            {...form.register('metadata.highway_number')}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        />
                        <input
                            placeholder="Vehicle Info / Notes"
                            {...form.register('metadata.notes')}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
                {isSubmitting
                    ? 'Saving...'
                    : selectedLegId
                        ? 'Update Travel Leg'
                        : 'Create Travel Leg'}
            </button>
        </form>
    );
}