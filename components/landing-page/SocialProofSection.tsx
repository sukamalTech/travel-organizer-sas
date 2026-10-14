import React from 'react'
import {
    Compass,

    Globe,
    Map,
    Navigation,

} from "lucide-react";
export default function SocialProofSection() {
    return (
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
    )
}
