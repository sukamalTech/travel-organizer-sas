// src/components/dashboards/LocalGuideDashboard.tsx
'use client';

import React from 'react';
import { Share2, Copy, BookOpen, Award } from 'lucide-react';

export default function LocalGuideDashboard({ tripData }: { tripData: any }) {
    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            <div className="p-5 bg-emerald-900 text-white rounded-3xl flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-800 px-2.5 py-1 rounded-full text-emerald-200">
                        Published Curator Blueprint
                    </span>
                    <h2 className="text-lg font-black mt-2">{tripData?.title || 'Offbeat Silk Route Trail'}</h2>
                    <p className="text-xs text-emerald-200">Curated by Regional Expert</p>
                </div>
                <Award className="w-8 h-8 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <Copy className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <span className="text-2xl font-black text-slate-900 dark:text-white">482</span>
                    <span className="text-[10px] text-slate-400 block uppercase">Traveler Clones</span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <Share2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <span className="text-2xl font-black text-slate-900 dark:text-white">1,290</span>
                    <span className="text-[10px] text-slate-400 block uppercase">Public Views</span>
                </div>
            </div>
        </div>
    );
}