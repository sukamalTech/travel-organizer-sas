'use client';

import { useState } from 'react';
import {
    Compass,
    Calendar,
    MapPin,
    Utensils,
    Home,
    Plus,
    ZoomIn,
    ZoomOut,
    Layers,
    FileText,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    BedDouble
} from 'lucide-react';

export default function TripWorkflowView() {
    // Tracks which step of the data journey the user is viewing/testing
    const [activeStep, setActiveStep] = useState<number>(1);
    const [selectedPin, setSelectedPin] = useState<number>(0);

    // Mock itinerary items for Tokyo Day 1
    const itineraryItems = [
        {
            type: 'Explore',
            typeColor: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800',
            time: '09:00 AM',
            title: 'Shibuya Crossing & Hachiko Statue',
            description: 'Experience the world-famous scramble crossing and morning vibe.'
        },
        {
            type: 'Dining',
            typeColor: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800',
            time: '12:30 PM',
            title: 'Ichiran Ramen Shibuya',
            description: 'Famous tonkotsu ramen with solo dining booths.'
        },
        {
            type: 'Stay',
            typeColor: 'text-violet-600 dark:text-violet-400',
            bgColor: 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800',
            time: '03:00 PM',
            title: 'Trunk Hotel Check-in',
            description: 'Boutique design hotel in Shibuya-Jingumae.'
        }
    ];

    // The 4 Core Data & Workflow Steps
    const workflowSteps = [
        {
            step: 1,
            title: 'Trip Setup',
            subtitle: 'Name, Dates & Mode',
            desc: 'User initializes the trip name, start/end dates, and travel style.',
            icon: Layers,
            badge: 'Database: Trips'
        },
        {
            step: 2,
            title: 'Itinerary & Legs',
            subtitle: 'Day-wise & Route Planning',
            desc: 'Break down the trip into daily legs, custom stops, and map pins.',
            icon: Calendar,
            badge: 'Database: Itineraries'
        },
        {
            step: 3,
            title: 'Spot Details',
            subtitle: 'Stays, Dining & Attractions',
            desc: 'Fill in specific accommodation, restaurants, and activity spots.',
            icon: Utensils,
            badge: 'Database: Places'
        },
        {
            step: 4,
            title: 'Live Visit Mode',
            subtitle: 'Real-time On-the-Go View',
            desc: 'Access day-by-day guides, sync with travel companions, and navigate.',
            icon: Sparkles,
            badge: 'Active Experience'
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

            {/* HEADER SECTION: Introduction & Data Journey Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 text-white shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" /> TravellE Data Architecture
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            From Planning to Live Exploration
                        </h2>
                        <p className="text-sm sm:text-base text-white/90">
                            See how your travel data is stored, structured, and brought to life in real-time as you journey across the globe.
                        </p>
                    </div>

                    {/* Quick Stats / Data Indicators */}
                    <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                        <div className="text-center px-3 border-r border-white/10">
                            <div className="text-xl font-bold">4</div>
                            <div className="text-[10px] text-white/70 uppercase">Stages</div>
                        </div>
                        <div className="text-center px-3 border-r border-white/10">
                            <div className="text-xl font-bold">Day 01</div>
                            <div className="text-[10px] text-white/70 uppercase">Active Leg</div>
                        </div>
                        <div className="text-center px-3">
                            <div className="text-xl font-bold text-emerald-300">Synced</div>
                            <div className="text-[10px] text-white/70 uppercase">Status</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTAINER: Left Workflow Sidebar + Right Dynamic Content/Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT: Workflow Step Selector & Data Guide (Mobile: Full View / Top Stack) */}
                <div className="lg:col-span-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-md space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                            <FileText className="w-4 h-4 text-indigo-500" />
                            <span>Trip Data Pipeline</span>
                        </h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            Interactive Guide
                        </span>
                    </div>

                    {/* Step Buttons / Cards */}
                    <div className="space-y-3">
                        {workflowSteps.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeStep === item.step;
                            return (
                                <div
                                    key={item.step}
                                    onClick={() => setActiveStep(item.step)}
                                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${isActive
                                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 shadow-sm ring-2 ring-indigo-500/20'
                                            : 'bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-xl shrink-0 ${isActive
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                Step 0{item.step}
                                            </span>
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-2">
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                            <span>Active view mode:</span>
                            <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                {workflowSteps[activeStep - 1].title}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Travel Legs, Itinerary & Live Map View (Your Component Enhanced) */}
                <div className="lg:col-span-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-lg">

                    {/* Daywise Itinerary List */}
                    <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between shadow-xs">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-sm">
                                    <Calendar className="w-4 h-4 text-indigo-500" />
                                    <span>Day 01: Tokyo Metro Pulse</span>
                                </h3>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    4 Stops
                                </span>
                            </div>

                            {/* Itinerary Items */}
                            <div className="space-y-3">
                                {itineraryItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedPin(idx)}
                                        className={`cursor-pointer p-3 rounded-xl border transition-all hover:scale-[1.02] ${selectedPin === idx
                                                ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-sm'
                                                : item.bgColor
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${item.typeColor}`}>
                                                [{item.type}]
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono">{item.time}</span>
                                        </div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mt-1">{item.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Add Action */}
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500">Synced across 3 travelers</span>
                            <button
                                onClick={() => alert('New stop added to your itinerary data model!')}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors flex items-center space-x-1 shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Stop</span>
                            </button>
                        </div>
                    </div>

                    {/* Interactive Map Canvas with Pins & Polyline */}
                    <div className="lg:col-span-7 relative bg-slate-200 dark:bg-slate-950 rounded-2xl h-80 sm:h-96 overflow-hidden border border-slate-300 dark:border-slate-800 flex items-center justify-center shadow-inner">
                        {/* Simulated Map Background Pattern */}
                        <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>

                        {/* Simulated Map Graphic Layer */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">

                            {/* SVG Polyline Route Simulation */}
                            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <path d="M 120 220 Q 220 120 340 180 T 520 140" fill="none" stroke="url(#gradient-path)" strokeWidth="4" strokeDasharray="6 6" className="animate-pulse" />
                                <defs>
                                    <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Interactive Map Pins */}
                            <div
                                className="absolute top-[55%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group"
                                onClick={() => setSelectedPin(0)}
                            >
                                <div className={`w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 ring-4 ring-indigo-500/20 ${selectedPin === 0 ? 'animate-bounce' : ''}`}>
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    Shibuya Crossing
                                </div>
                            </div>

                            <div
                                className="absolute top-[40%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group"
                                onClick={() => setSelectedPin(1)}
                            >
                                <div className={`w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/50 ring-4 ring-emerald-500/20 ${selectedPin === 1 ? 'animate-bounce' : ''}`}>
                                    <Utensils className="w-4 h-4" />
                                </div>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ichiran Ramen
                                </div>
                            </div>

                            <div
                                className="absolute top-[30%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group"
                                onClick={() => setSelectedPin(2)}
                            >
                                <div className={`w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/50 ring-4 ring-violet-500/20 ${selectedPin === 2 ? 'animate-bounce' : ''}`}>
                                    <Home className="w-4 h-4" />
                                </div>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    Trunk Hotel
                                </div>
                            </div>

                        </div>

                        {/* Map Overlay Controls */}
                        <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-md">
                            <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors" onClick={() => alert('Zooming in map data...')}>
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors" onClick={() => alert('Zooming out map data...')}>
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors" onClick={() => alert('Compass reset.')}>
                                <Compass className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}