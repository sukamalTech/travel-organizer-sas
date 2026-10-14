import React from 'react'
import {
    Compass,
    Sparkles,

    Globe,
    Map,

    Check,


    ChevronDown,
    XCircle,
    X,
    CheckCircle2
} from "lucide-react";
export default function ProblemAgitationMatrix() {
    return (
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
    )
}
