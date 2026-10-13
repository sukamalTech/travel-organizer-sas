'use client';

import { useState } from 'react';
import GlassCard from '../ui/GlassCard';

const AUDIENCES = [
    { id: 'leisure', label: 'Leisure Explorer', desc: 'Visual itinerary planner with smart routing and curated attraction suggestions.' },
    { id: 'blogger', label: 'Travel Creator', desc: 'Shareable branded map widgets, affiliate link integration, and downloadable itineraries.' },
    { id: 'operator', label: 'Tour Operator', desc: 'Multi-user client dashboards, real-time group updates, and automated reservation management.' }
];

export default function AudienceSelector() {
    const [selected, setSelected] = useState('leisure');

    const current = AUDIENCES.find(a => a.id === selected)!;

    return (
        <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Tailored for How You Travel</h2>

                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {AUDIENCES.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelected(item.id)}
                            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${selected === item.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <GlassCard className="text-left border-indigo-500/20">
                    <h3 className="text-xl font-bold text-white mb-2">{current.label} Experience</h3>
                    <p className="text-slate-300 text-base">{current.desc}</p>
                </GlassCard>
            </div>
        </section>
    );
}