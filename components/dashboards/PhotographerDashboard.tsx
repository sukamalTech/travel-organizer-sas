// src/components/dashboards/PhotographerDashboard.tsx
'use client';

import React from 'react';
import { Camera, Sun, MapPin, CheckSquare } from 'lucide-react';

export default function PhotographerDashboard({ attractionData }: { attractionData: any }) {
    const photoNotes = attractionData?.photography_notes || {};

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                        <Sun className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Golden Hour Countdown</h3>
                        <p className="text-xs text-slate-400">Location: {attractionData?.name || 'Spiti River Ridge'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-lg font-mono font-black text-amber-400">17:42 PM</span>
                    <span className="text-[10px] text-slate-400 block">Azimuth 240°</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spot Technical Specs</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                        <span className="text-slate-400 block">Ideal Lens</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{photoNotes.focal_length || '70-200mm f/2.8'}</span>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                        <span className="text-slate-400 block">Drone Regulation</span>
                        <span className="font-bold text-emerald-500">{photoNotes.drone_status || 'Permitted (Class G)'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}