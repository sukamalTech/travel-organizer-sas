"use client";

import React, { useState } from "react";
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
    CheckCircle,
    Clock,
    Layers,
    Smartphone,
    ShieldCheck,
    Zap,
    HelpCircle,
    ChevronDown
} from "lucide-react";

export default function DynamicExplorerLanding() {
    const [darkMode, setDarkMode] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedPin, setSelectedPin] = useState(0);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const itineraryItems = [
        {
            type: "Attraction",
            typeColor: "text-indigo-600 dark:text-indigo-400",
            time: "09:30 AM",
            title: "Shibuya Crossing & Hachiko",
            description: "World's busiest scramble intersection.",
            bgColor: "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60"
        },
        {
            type: "Dining",
            typeColor: "text-emerald-600 dark:text-emerald-400",
            time: "12:30 PM",
            title: "Ichiran Ramen Shibuya",
            description: "Famous solo tonkotsu ramen booths.",
            bgColor: "bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60"
        },
        {
            type: "Stay",
            typeColor: "text-violet-600 dark:text-violet-400",
            time: "03:00 PM",
            title: "Trunk Hotel Cat Street",
            description: "Boutique design hotel in Harajuku.",
            bgColor: "bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60"
        }
    ];

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-indigo-500 selection:text-white font-sans">

                {/* 1. Sticky Navigation Header */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Logo */}
                        <div
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                <Compass className="w-6 h-6 animate-spin-slow" />
                            </div>
                            <div>
                                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    Explorer
                                </span>
                                <span className="block text-[10px] uppercase tracking-widest font-semibold text-slate-400">Dynamic Workspace</span>
                            </div>
                        </div>

                        {/* Desktop Nav Links */}
                        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                            <a href="#comparison" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Comparison</a>
                            <a href="#audience" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workflows</a>
                            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
                            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
                        </nav>

                        {/* Actions: Theme Toggle & CTA */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle Theme"
                                className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <a
                                href="#pricing"
                                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
                            >
                                Start Free Trial
                            </a>
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {mobileMenuOpen && (
                        <div className="md:hidden backdrop-blur-md bg-white/90 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4">
                            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Features</a>
                            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Comparison</a>
                            <a href="#audience" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Workflows</a>
                            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Pricing</a>
                            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-white bg-indigo-600 shadow-md">
                                Start Free Trial
                            </a>
                        </div>
                    )}
                </header>

                {/* 2. Hero Section */}
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

                {/* 3. Social Proof Ticker */}
                <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-8">
                            250,000+ Trips Mapped across 140 Countries Worldwide
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-75 grayscale hover:grayscale-0 transition-all">
                            <div className="flex items-center justify-center space-x-2 font-bold text-lg text-slate-800 dark:text-slate-200">
                                <Globe className="w-6 h-6 text-indigo-500" />
                                <span>GlobeTrekker Mag</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 font-bold text-lg text-slate-800 dark:text-slate-200">
                                <Compass className="w-6 h-6 text-violet-500" />
                                <span>Nomad Weekly</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 font-bold text-lg text-slate-800 dark:text-slate-200">
                                <Map className="w-6 h-6 text-pink-500" />
                                <span>Wanderlust AI</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 font-bold text-lg text-slate-800 dark:text-slate-200">
                                <Navigation className="w-6 h-6 text-emerald-500" />
                                <span>Voyager Elite</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Problem Agitation Matrix */}
                <section id="comparison" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                            Why Travel Planners Are Abandoning Spreadsheets
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                            Stop juggling messy tabs, conflicting PDFs, and disconnected maps. Experience seamless unified exploration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Old Way (Red Tint) */}
                        <div className="rounded-3xl p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                                The Old Way
                            </div>
                            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300 mb-6 flex items-center space-x-2">
                                <XCircle className="w-6 h-6 text-rose-500" />
                                <span>Spreadsheet & PDF Chaos</span>
                            </h3>
                            <ul className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
                                <li className="flex items-start space-x-3">
                                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <span>Endless scrolling across 15 different browser tabs and cluttered Google Docs.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <span>Zero route optimization—ending up backtracking across cities during peak hours.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <span>Manual currency calculations and confusing split-cost group spreadsheets.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <span>Zero offline access when roaming abroad without cellular connectivity.</span>
                                </li>
                            </ul>
                        </div>

                        {/* New Way (Green Tint) */}
                        <div className="rounded-3xl p-8 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 relative overflow-hidden shadow-xl">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                The Dynamic Explorer Way
                            </div>
                            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300 mb-6 flex items-center space-x-2">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                <span>Unified Map Workspace</span>
                            </h3>
                            <ul className="space-y-4 text-slate-700 dark:text-slate-300 text-sm">
                                <li className="flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>All daywise itineraries, bookings, and activities synced instantly on an interactive map canvas.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Smart AI routing engine organizes sequential travel points automatically for minimal transit time.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Built-in live currency conversion and automatic group expense splitting per person.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Full offline progressive web app mode with cached offline maps and tickets.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 5. Core Feature Grid */}
                <section id="features" className="py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-4">
                                <span>Powerful Capabilities</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                                Everything You Need for Effortless Journeys
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 text-lg">
                                Engineered with cutting-edge tech stacks to guarantee smooth collaboration and high performance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">AI Itinerary Generation</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                    Input your destination, dates, and budget. Our advanced AI engine crafts custom daywise schedules tailored to your personal travel style.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 transition-all shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6">
                                    <Map className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-Time Map Canvas</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                    Every card in your itinerary syncs dynamically with custom map coordinates, auto-drawing polylines and routes between stops.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 transition-all shadow-lg hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Multi-User Collaboration</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                    Invite your family, friends, or tour groups to co-edit itineraries simultaneously with live cursor tracking and instant updates.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Interactive Workflow Tabs */}
                <section id="audience" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                            Designed For Every Kind of Explorer
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                            Whether you're planning a family road trip, solo backpacking expedition, or corporate retreat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">Family Road Trips</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Keep children entertained with optimized rest stops, family-friendly dining, and shared itineraries.</p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-500" /><span>Route hotel & lodge bookings</span></li>
                                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-500" /><span>Offline offline GPS navigation maps</span></li>
                            </ul>
                        </div>

                        <div className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-bold mb-2 text-violet-600 dark:text-violet-400">Solo Nomads</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Fast lightweight planning for spontaneous adventurers exploring hidden gems off the beaten path.</p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-500" /><span>Instant AI spot recommendations</span></li>
                                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-500" /><span>One-click export to mobile wallet</span></li>
                            </ul>
                        </div>

                        <div className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-bold mb-2 text-pink-600 dark:text-pink-400">Group Expeditions</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Coordinate large teams or tour groups with centralized scheduling and expense tracking.</p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-500" /><span>Split-cost expense calculator</span></li>
                                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-emerald-500" /><span>Live participant presence indicators</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 7. Pricing Tiers */}
                <section id="pricing" className="py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 text-lg">
                                Start planning for free, upgrade when you need advanced AI and offline map capabilities.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Plan */}
                            <div className="backdrop-blur-md bg-white/70 dark:bg-slate-900/75 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Explorer Free</h3>
                                    <p className="text-slate-500 text-sm mb-6">Perfect for casual weekend getaways.</p>
                                    <div className="text-4xl font-extrabold mb-6">$0 <span className="text-sm font-normal text-slate-500">/ forever</span></div>
                                    <ul className="space-y-4 text-sm mb-8">
                                        <li className="flex items-center space-x-3"><Check className="w-4 h-4 text-indigo-500" /><span>Up to 2 active trip workspaces</span></li>
                                        <li className="flex items-center space-x-3"><Check className="w-4 h-4 text-indigo-500" /><span>Basic map canvas & markers</span></li>
                                        <li className="flex items-center space-x-3"><Check className="w-4 h-4 text-indigo-500" /><span>Standard AI trip suggestions</span></li>
                                    </ul>
                                </div>
                                <a href="#pricing" className="w-full py-3 rounded-xl font-semibold text-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                    Get Started Free
                                </a>
                            </div>

                            {/* Pro Plan */}
                            <div className="backdrop-blur-md bg-gradient-to-b from-indigo-950/20 to-violet-950/20 rounded-3xl p-8 border-2 border-indigo-500 relative flex flex-col justify-between shadow-2xl">
                                <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Explorer Pro</h3>
                                    <p className="text-slate-500 text-sm mb-6">For avid travelers and road trip planners.</p>
                                    <div className="text-4xl font-extrabold mb-6">$12 <span className="text-sm font-normal text-slate-500">/ month</span></div>
                                    <ul className="space-y-4 text-sm mb-8">
                                        <li className="flex items-center space-x-3"><Check className="w-4 h-4 text-indigo-500" /><span>Unlimited trips & collaborative workspaces</span></li>
                                        <li className="flex items-center space-x-3"><Check className="w-4 h-4 text-indigo-500" /><span>Advanced AI auto-routing & polylines</span></li>
                                        <li className="flex items-center space-x-3"><Check className="w-4 h-4 text-indigo-500" /><span>Offline PWA map caching</span></li>
                                        <li className="flex items-center space-x-3"><Check className="w-4 h-4 text-indigo-500" /><span>Multi-currency expense splitting</span></li>
                                    </ul>
                                </div>
                                <a href="#pricing" className="w-full py-3 rounded-xl font-semibold text-center text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 shadow-lg shadow-indigo-600/30 transition-all">
                                    Start 14-Day Free Trial
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. FAQ Section */}
                <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                            Got questions about workspaces, maps, or offline syncing? We've got answers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How does the real-time map canvas work?",
                                a: "Every item you add to your daywise itinerary automatically plots geographic coordinates onto our interactive map engine, connecting stops with optimized route polylines."
                            },
                            {
                                q: "Can I collaborate with friends and family on a trip?",
                                a: "Yes! Simply share your workspace link with collaborators. They can view updates, add new stops, and chat in real-time."
                            },
                            {
                                q: "Does the app work offline when traveling abroad?",
                                a: "Our Pro tier includes Progressive Web App (PWA) offline caching so you can access your itineraries, maps, and tickets without cellular data."
                            },
                            {
                                q: "Can I export my itineraries to other formats?",
                                a: "You can export itineraries as PDF booklets, CSV spreadsheets, or sync directly to calendar apps."
                            }
                        ].map((faq, idx) => (
                            <div
                                key={idx}
                                className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                            >
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full p-6 text-left font-bold flex items-center justify-between"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {activeFaq === idx && (
                                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 9. Footer */}
                <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white">
                                <Compass className="w-4 h-4" />
                            </div>
                            <span className="font-extrabold tracking-tight">The Dynamic Explorer</span>
                        </div>
                        <div className="text-xs text-slate-500">
                            © 2026 Dynamic Explorer Workspace Inc. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm text-slate-500">
                            <a href="#features" className="hover:text-indigo-500">Privacy</a>
                            <a href="#features" className="hover:text-indigo-500">Terms</a>
                            <a href="#features" className="hover:text-indigo-500">Security</a>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}