"use client";
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react'

export default function FAQSection() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
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
    )
}
