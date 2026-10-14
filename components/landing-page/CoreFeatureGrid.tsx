import { Globe, Map, Sparkles } from 'lucide-react'
import React from 'react'

export default function CoreFeatureGrid() {
    return (
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
    )
}
