// components/creator/DayOverviewCard.tsx
'use client';

import React from 'react';
import { Moon, Save, FileText, Sparkles } from 'lucide-react';
import RichTextEditor from '@/components/creator/RichTextEditor';
import { ExtendedItineraryDay } from './DaysTimelinePane';

interface DayOverviewCardProps {
    day: ExtendedItineraryDay;
    nightStayLocation: string;
    setNightStayLocation: (val: string) => void;
    nightStayNotes: string;
    setNightStayNotes: (val: string) => void;
    dayNotes: string;
    setDayNotes: (val: string) => void;
    onSaveDayDetails: () => void;
    isSaving: boolean;
}

export default function DayOverviewCard({
    day,
    nightStayLocation,
    setNightStayLocation,
    nightStayNotes,
    setNightStayNotes,
    dayNotes,
    setDayNotes,
    onSaveDayDetails,
    isSaving,
}: DayOverviewCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Day {day.day_number} • {day.date}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        Night Stay & Daily Notes
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={onSaveDayDetails}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition disabled:opacity-50"
                >
                    <Save className="w-3.5 h-3.5" />
                    {isSaving ? 'Saving...' : 'Save Day Info'}
                </button>
            </div>

            {/* Night Stay Section */}
            <div className="space-y-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Night Stay Destination / Hotel Option
                </label>
                <input
                    type="text"
                    value={nightStayLocation}
                    onChange={(e) => setNightStayLocation(e.target.value)}
                    placeholder="e.g., Munnar - Tea Valley Resort (or Tentative Stay)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    value={nightStayNotes}
                    onChange={(e) => setNightStayNotes(e.target.value)}
                    placeholder="Stay notes (e.g., Check-in 2 PM, Room options, Contact #)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Daily Notes Section */}
            <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Day Notes, Advisories & Future Reminders
                </label>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
                    <RichTextEditor content={dayNotes} onChange={setDayNotes} />
                </div>
            </div>
        </div>
    );
}