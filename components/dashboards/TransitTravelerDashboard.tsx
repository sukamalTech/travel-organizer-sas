// src/components/dashboards/TransitTravelerDashboard.tsx
'use client';

import React from 'react';
import { Train, Clock, Ticket, MapPin } from 'lucide-react';

export default function TransitTravelerDashboard({ legData }: { legData: any }) {
    const metadata = legData?.metadata || {};

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-mono uppercase bg-white/20 px-2.5 py-1 rounded-full text-white">
                            {legData?.mode || 'Train'} Service
                        </span>
                        <h2 className="text-xl font-black mt-2">{metadata.train_name || 'Rajdhani Express'}</h2>
                        <p className="text-xs text-blue-100 font-mono">#{metadata.train_number || '12423'}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] uppercase text-blue-200 block">PNR Number</span>
                        <span className="text-sm font-mono font-bold tracking-wider">{metadata.pnr || '8429104821'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
                    <div>
                        <span className="text-[10px] text-blue-200 block">Coach / Berth</span>
                        <span className="text-sm font-bold">{metadata.coach_type || 'B4'} - {metadata.berth_number || '32 Upper'}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-blue-200 block">Departure</span>
                        <span className="text-sm font-bold">{metadata.departure_time || '16:55 PM'}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-blue-200 block">Fare</span>
                        <span className="text-sm font-bold">{metadata.fare || '$45.00'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <div>
                        <p className="text-xs text-slate-500">Live Status</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">On Time • Platform 3</p>
                    </div>
                </div>
                <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 rounded-xl text-xs font-bold">
                    Verify Ticket
                </button>
            </div>
        </div>
    );
}