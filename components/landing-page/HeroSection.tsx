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
import Link from 'next/link';
import HeroExplorer from '../hero/HeroExplorer';
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
                        <Link href="/auth/sign-up" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3">
                            <span>Launch Workspace Free</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
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


                    <HeroExplorer />
                </div>
            </div>
        </section>
    )
}


