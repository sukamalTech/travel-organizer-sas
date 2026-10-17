'use client';

import { useState } from 'react';
import { MapPin, Utensils, Hotel } from 'lucide-react';
import DynamicMapPreview from '../maps/DynamicMapPreview';

const SCHEDULE_ITEMS = [
    { id: '1', name: 'Shibuya Crossing', type: 'Attraction', time: '09:00 AM', tagColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30', icon: MapPin },
    { id: '2', name: 'Ichiran Ramen', type: 'Dining', time: '01:30 PM', tagColor: 'text-amber-400 bg-amber-400/10 border-amber-500/30', icon: Utensils },
    { id: '3', name: 'Trunk Hotel', type: 'Stay', time: '06:00 PM', tagColor: 'text-pink-400 bg-pink-400/10 border-pink-500/30', icon: Hotel },
];

export default function HeroExplorer() {
    const [activeItem, setActiveItem] = useState<string | null>('1');

    return (
        <section className="relative  overflow-hidden">
            {/* Dynamic Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Split Glass Overlay Hero Workspace */}
            <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 backdrop-blur-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                    {/* Left Panel: Daywise Schedule */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <span className="text-sm font-semibold text-slate-200">Day 1: Tokyo Core Route</span>
                            <span className="text-xs text-indigo-400 font-mono">3 Stops • 14.2 km</span>
                        </div>

                        <div className="space-y-3">
                            {SCHEDULE_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeItem === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        onMouseEnter={() => setActiveItem(item.id)}
                                        onMouseLeave={() => setActiveItem(null)}
                                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${isActive
                                            ? 'bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                                            : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                            <h4 className="text-sm font-medium text-white">{item.name}</h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel: Interactive Google Map Simulation */}
                    <div className="lg:col-span-7">
                        <DynamicMapPreview activeId={activeItem} onHoverPin={(id) => setActiveItem(id)} />
                    </div>

                </div>
            </div>

        </section >
    );
}