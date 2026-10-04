// src/components/dashboards/RoadTravelerDashboard.tsx
'use client';

import React, { useState } from 'react';
import { Fuel, Navigation, AlertTriangle, Shield, Gauge } from 'lucide-react';

export default function RoadTravelerDashboard({ legData }: { legData: any }) {
    const [roadCondition, setRoadCondition] = useState('good');

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                        <Gauge className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Active Highway Log</h3>
                        <p className="text-xs text-slate-500">{legData?.origin_name} to {legData?.destination_name}</p>
                    </div>
                </div>
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
                    NH-44 Highway
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                        <Fuel className="w-4 h-4 text-emerald-500" />
                        <span>Fuel Gap Warning</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">85 km</p>
                    <p className="text-[10px] text-slate-400 mt-1">Next verified pump: IOCL Station</p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                        <Navigation className="w-4 h-4 text-blue-500" />
                        <span>Total Segment</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{legData?.distance_km || '240'} km</p>
                    <p className="text-[10px] text-slate-400 mt-1">Est. Drive Time: 4h 30m</p>
                </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" /> Surface Report
                    </span>
                    <select
                        value={roadCondition}
                        onChange={(e) => setRoadCondition(e.target.value)}
                        className="text-xs bg-white dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200"
                    >
                        <option value="good">Smooth Asphalt</option>
                        <option value="moderate">Patchy / Potholes</option>
                        <option value="severe">Gravel / Off-road</option>
                    </select>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                    {roadCondition === 'severe' ? 'Warning: High ground clearance required for next 15km.' : 'Standard driving conditions reported.'}
                </p>
            </div>
        </div>
    );
}