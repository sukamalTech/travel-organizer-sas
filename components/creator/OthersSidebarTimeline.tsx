'use client';
import React from 'react';
import { Calendar } from 'lucide-react';

interface OthersSidebarTimelineProps {
    days: any[];
    selectedDayId: string | null;
    onSelectDay: (day: any) => void;
}

export default function OthersSidebarTimeline({
    days,
    selectedDayId,
    onSelectDay,
}: OthersSidebarTimelineProps) {
    return (
        <aside className="col-span-3 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days Timeline</h2>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-mono">
                    {days.length} Days Loaded
                </span>
            </div>
            <div className="space-y-2">
                {days.map((day) => (
                    <div
                        key={day.id}
                        onClick={() => onSelectDay(day)}
                        className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${selectedDayId === day.id
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Day {day.day_number}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                                <Calendar className="w-3 h-3" />
                                {day.date}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                            {day.summary || 'No summary entered'}
                        </p>
                    </div>
                ))}
            </div>
        </aside>
    );
}