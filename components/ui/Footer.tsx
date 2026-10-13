"use client";
import Link from 'next/link';
import { Map, ArrowRight } from 'lucide-react';
import CTAButton from '../ui/CTAButton';

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950/80 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Contextual CTA Box */}
                <div className="glass-card rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden border border-indigo-500/20 text-center">
                    <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Map Your Next Adventure?
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
                        Join 250,000+ creators and nomads planning stress-free routes worldwide.
                    </p>
                    <CTAButton href="/signup" variant="primary" className="text-base px-8 py-4">
                        Build Your Itinerary — Free Forever <ArrowRight className="w-5 h-5 ml-2" />
                    </CTAButton>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-sm text-slate-400">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-white font-semibold">

                            <Map className="w-5 h-5 text-indigo-400" />
                            GeoSphere
                        </div>
                        <p className="text-xs text-slate-500">
                            The intelligent workspace for modern explorers and travel creators.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Product</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Map Engine</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Daywise Scheduler</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Expense Splitter</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Community Routes</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">API Access</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-3">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 text-center text-xs text-slate-600">
                    <div className="pt-8 text-center text-xs text-slate-600">
                        &copy; 2026 GeoSphere Inc. All rights reserved. Built with Next.js 16 & Tailwind CSS v4.
                    </div>
                </div>
            </div>
        </footer>
    );
}