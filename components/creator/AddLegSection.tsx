// components/creator/AddLegSection.tsx
'use client';

import React from 'react';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { Eye } from 'lucide-react';
import { TravelLegFormInput, LegItem } from '@/lib/validations/itinerary';
import LegDetailsView from '@/components/creator/LegDetailsView';
import LegForm from '@/components/creator/LegForm';

interface AddLegSectionProps {
    form: UseFormReturn<TravelLegFormInput>;
    onSubmit: SubmitHandler<TravelLegFormInput>;
    isSubmitting: boolean;
    selectedLeg: LegItem | null;
    onCloseSelectedLeg: () => void;
    dayNumber?: number;
    legDate: string;
}

export default function AddLegSection({
    form,
    onSubmit,
    isSubmitting,
    selectedLeg,
    onCloseSelectedLeg,
    dayNumber,
    legDate,
}: AddLegSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-sm font-extrabold">
                    {selectedLeg ? 'Leg Details & Editor' : 'Add Travel Leg'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Configure route coordinates, timings, distance, and transport details for{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {dayNumber ? `Day ${dayNumber} (${legDate})` : legDate}
                    </span>
                    .
                </p>
            </div>

            {selectedLeg && (
                <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        <Eye className="w-3.5 h-3.5" /> Selected Leg Overview
                    </div>
                    <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/30 p-4">
                        <LegDetailsView leg={selectedLeg} onClose={onCloseSelectedLeg} />
                    </div>
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs">
                <LegForm
                    form={form}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    selectedLegId={selectedLeg?.id}
                    legDate={legDate}
                />
            </div>
        </div>
    );
}