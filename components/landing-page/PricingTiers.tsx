import { Check } from 'lucide-react'
import React from 'react'

export default function PricingTiers() {
    return (
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
    )
}
