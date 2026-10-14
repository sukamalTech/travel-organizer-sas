import { Check } from 'lucide-react'
import React from 'react'

export default function InteractiveWorkflowTabs() {
    return (
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
    )
}
