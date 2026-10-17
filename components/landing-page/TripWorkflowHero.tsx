'use client';

import { useState } from 'react';
import { Compass, MapPin, Map, Navigation, Hotel, Eye, Sparkles, ArrowRight, ShieldCheck, Route, Calendar, CheckCircle2, Camera, Coffee } from 'lucide-react';

const WORKFLOW_STEPS = [
    {
        id: 'step-1',
        number: '01',
        title: 'Create New Trip',
        subtitle: 'Setup & Timeline',
        description: 'Initialize your journey with a title, custom date range (up to 15 days), and your primary travel mode (Car, Train, Bike, etc.).',
        icon: MapPin,
        color: 'from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/40',
        badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        glow: 'group-hover:shadow-indigo-500/20',
    },
    {
        id: 'step-2',
        number: '02',
        title: 'Live Map Itineraries',
        subtitle: 'Interactive Routing',
        description: 'Build day-wise itineraries seamlessly on top of interactive live maps to map out your geographic path.',
        icon: Map,
        color: 'from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40',
        badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        glow: 'group-hover:shadow-blue-500/20',
    },
    {
        id: 'step-3',
        number: '03',
        title: 'Day Legs & Micro-Architecture',
        subtitle: 'Segment Control',
        description: 'Break down daily travel into micro-legs, calculating distances, driving intervals, and scenic stops along the way.',
        icon: Navigation,
        color: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40',
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        glow: 'group-hover:shadow-amber-500/20',
    },
    {
        id: 'step-4',
        number: '04',
        title: 'Stays, Dining & Attractions',
        subtitle: 'Curated Stops',
        description: 'Attach family-friendly hotels, local roadside dhabas/cafes, and must-visit tourist viewpoints for each specific day.',
        icon: Hotel,
        color: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        glow: 'group-hover:shadow-emerald-500/20',
    },
    {
        id: 'step-5',
        number: '05',
        title: 'View Unified Trip',
        subtitle: 'All-in-One Dashboard',
        description: 'Review your complete clubbed itinerary, schedules, and memories cleanly in one unified dashboard view.',
        icon: Eye,
        color: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/40',
        badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        glow: 'group-hover:shadow-purple-500/20',
    },
];

export default function TripWorkflowHero() {
    const [activeCard, setActiveCard] = useState<string>('step-1');
    // Interactive preview tab state for the left side
    const [activeTab, setActiveTab] = useState<'route' | 'stays' | 'dining' | 'attractions'>('route');

    //
    return (
        <section className="relative w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors flex flex-col justify-center">

            {/* Background Floating Glow Shades */}
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full relative z-10 space-y-16">

                {/* Header Section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wider uppercase border border-indigo-500/20 shadow-inner">
                        <Compass className="h-4 w-4 animate-spin-slow" /> Hassle-Free Road Trip Workflow
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        How You Plan & Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Your Journey</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Follow our streamlined 5-step interactive workflow designed to take you from a blank calendar to a fully coordinated family expedition effortlessly.
                    </p>
                </div>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Side: Application Workflow Guide */}
                    <div className="lg:col-span-6 space-y-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-indigo-50/20 to-slate-50/90 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-indigo-950/30 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">

                        {/* Decorative background glow accents */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800 relative z-10">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-inner">
                                    <Compass className="h-5 w-5 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Journey Blueprint</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Your step-by-step roadmap</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono shadow-sm">
                                5-Step Flow
                            </span>
                        </div>

                        {/* Steps List */}
                        <div className="space-y-3 relative z-10">

                            {/* Step 1: Create New Trip (Active/Current Step) */}
                            <div className="p-4 rounded-2xl border bg-gradient-to-r from-indigo-50/80 to-white dark:from-indigo-950/40 dark:to-slate-900/90 border-indigo-500/60 shadow-md shadow-indigo-500/10 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-600 text-white shadow-sm">
                                        Step 1 • Current
                                    </span>
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">Setup</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Create New Trip</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Enter your journey title, start & end dates, and primary travel mode.
                                </p>
                            </div>

                            {/* Step 2: Live Map Itinerary */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                        Step 2
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Mapping</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                        <Map className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Live Map Itineraries</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Build day-wise itineraries seamlessly using interactive live maps.
                                </p>
                            </div>

                            {/* Step 3: Day Legs */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                        Step 3
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Routing</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                                        <Navigation className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Day Legs & Micro-Architecture</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Define route segments and legs for detailed micro-architecture.
                                </p>
                            </div>

                            {/* Step 4: Stays & Dining */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        Step 4
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Details</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Hotel className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Stays, Dining & Attractions</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    Add hotels, restaurants, and tourist attractions for each specific day.
                                </p>
                            </div>

                            {/* Step 5: View Unified Trip */}
                            <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                        Step 5
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Overview</span>
                                </div>
                                <div className="flex items-center gap-2.5 mt-1">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">View Unified Trip</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-7">
                                    All clubbed information and memories display cleanly in one place.
                                </p>
                            </div>
                        </div>

                        {/* Footer Tagline */}
                        <div className="pt-3 text-center relative z-10 border-t border-slate-200/60 dark:border-slate-800">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                ✨ Plan your family road trips effortlessly & hassle-free.
                            </p>
                        </div>
                    </div>

                    {/* Left Side: Interactive Live Route & Workflow Preview */}
                    <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden space-y-5">

                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 relative z-10">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                    <Map className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Live Route Preview</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Sample Day 1 Architecture</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Flow
                            </span>
                        </div>

                        {/* Interactive Sub-Tabs for Preview */}
                        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 relative z-10 text-xs font-medium">
                            <button
                                type="button"
                                onClick={() => setActiveTab('route')}
                                className={`py-2 rounded-xl transition-all ${activeTab === 'route' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Route
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('stays')}
                                className={`py-2 rounded-xl transition-all ${activeTab === 'stays' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Stays
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('dining')}
                                className={`py-2 rounded-xl transition-all ${activeTab === 'dining' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Dining
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('attractions')}
                                className={`py-2 rounded-xl transition-all ${activeTab === 'attractions' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Places
                            </button>
                        </div>

                        {/* Dynamic Preview Content based on Selected Tab */}
                        <div className="space-y-3 relative z-10 min-h-[220px]">
                            {activeTab === 'route' && (
                                <div className="space-y-3 animate-fadeIn">
                                    <div className="p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Navigation className="w-4 h-4" /></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-slate-900 dark:text-white">Leg 1: Siliguri to Sevoke</span>
                                                <span className="text-blue-500 font-mono">22.4 km</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Highway Route • Morning Drive</p>
                                        </div>
                                    </div>
                                    <div className="p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><Navigation className="w-4 h-4" /></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-slate-900 dark:text-white">Leg 2: Sevoke to Coronation Bridge</span>
                                                <span className="text-amber-500 font-mono">5.1 km</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Scenic Mountain Climb</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'stays' && (
                                <div className="space-y-3 animate-fadeIn">
                                    <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900/60 border-emerald-500/30 flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 mt-0.5"><Hotel className="w-4 h-4" /></div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Summit View Resort & Spa</h4>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">Booked</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Check-in: 04:00 PM • Valley view family cottage with parking.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'dining' && (
                                <div className="space-y-3 animate-fadeIn">
                                    <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900/60 border-orange-500/30 flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 mt-0.5"><Coffee className="w-4 h-4" /></div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tista Riverside Dhaba</h4>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-mono">Lunch Stop</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Famous for local hill tea, fresh snacks, and safe family parking.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'attractions' && (
                                <div className="space-y-3 animate-fadeIn">
                                    <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900/60 border-purple-500/30 flex items-start gap-3">
                                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 mt-0.5"><Camera className="w-4 h-4" /></div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Coronation Bridge Viewpoint</h4>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono">Must Visit</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Spectacular arch bridge over the Teesta River. Great family photos.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Workflow Steps Progress indicator */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10">
                            <span className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                                <CheckCircle2 className="w-4 h-4" /> Step 1 of 5: Trip Setup
                            </span>
                            <span className="font-mono text-[11px]">Hassle-Free Flow</span>
                        </div>
                    </div>

                </section>

                {/* Bottom Callout Banner */}
                <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                            <Sparkles className="h-4 w-4" /> Ready to Hit the Road?
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                            Start planning your family road trip with ultimate precision.
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            Create your custom itinerary, map out daily legs, and keep all your hotel bookings and dining spots organized in one place.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <a
                            href="/create-trip"
                            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all text-sm gap-2"
                        >
                            <Route className="w-4 h-4" /> Create New Trip Now <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}