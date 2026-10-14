"use client";
import React, { useState } from 'react'
import {
    Compass,
    Sparkles,
    ArrowRight,
    PlayCircle,
    Calendar,
    MapPin,
    Utensils,
    Home,
    Plus,
    ZoomIn,
    ZoomOut,
    Globe,
    Map,
    Navigation,
    XCircle,
    CheckCircle2,
    X,
    Check,
    Sun,
    Moon,
    Menu,

    ChevronDown
} from "lucide-react";
import { itineraryItems } from "@/lib/constants/landingpageconstant";
export default function HeroSection() {
    const [selectedPin, setSelectedPin] = useState(0);
    return (
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
            {/* Ambient background glow gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Next.js 16 Travel Engine Powered by AI</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                        The Dynamic <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">Explorer</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 font-normal leading-relaxed">
                        Plan smarter, travel deeper. Replace spreadsheet chaos with a unified, real-time interactive canvas synced directly to custom daywise itineraries and dynamic live maps.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3">
                            <span>Launch Workspace Free</span>
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/70 dark:bg-slate-800/70 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center justify-center space-x-2">
                            <PlayCircle className="w-5 h-5 text-indigo-500" />
                            <span>Watch 2-Min Demo</span>
                        </a>
                    </div>
                </div>

                {/* Split Glass Overlay Mockup: Itinerary List & Map Canvas */}
                <div className="relative max-w-6xl mx-auto backdrop-blur-md bg-white/70 dark:bg-slate-900/75 border border-white/40 dark:border-slate-800 rounded-3xl p-3 sm:p-6 shadow-2xl shadow-indigo-500/10 animate-float">
                    {/* Mac-style header bar */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60 dark:border-slate-800/60 px-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="ml-4 text-xs font-mono text-slate-500 dark:text-slate-400">workspace://tokyo-autumn-expedition-2026.app</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                <span>Live Sync Active</span>
                            </span>
                        </div>
                    </div>

                    {/* Grid Split: Left Itinerary | Right Map Canvas */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Daywise Itinerary List */}
                        <div className="lg:col-span-5 bg-white/60 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                        <span>Day 01: Tokyo Metro Pulse</span>
                                    </h3>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">4 Stops</span>
                                </div>

                                {/* Itinerary Items */}
                                <div className="space-y-3">
                                    {itineraryItems.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedPin(idx)}
                                            className={`cursor-pointer p-3 rounded-xl border transition-all hover:scale-[1.02] ${selectedPin === idx
                                                ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60 shadow-sm'
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
                                    onClick={() => alert('Item added to live map successfully!')}
                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors flex items-center space-x-1"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Stop</span>
                                </button>
                            </div>
                        </div>

                        {/* Right: Mock Google Maps Canvas with Animated Pins & Polyline */}
                        <div className="lg:col-span-7 relative bg-slate-200 dark:bg-slate-900 rounded-2xl h-80 sm:h-96 overflow-hidden border border-slate-300 dark:border-slate-800 flex items-center justify-center">
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
                                <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={() => alert('Zooming in...')}>
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={() => alert('Zooming out...')}>
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" onClick={() => alert('Compass North reset.')}>
                                    <Compass className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


