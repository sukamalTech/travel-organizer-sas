"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqs = [
        { q: "How does the real-time map canvas work?", a: "Every item you add automatically plots geographic coordinates." },
        { q: "Can I collaborate with friends and family on a trip?", a: "Yes! Simply share your workspace link." },
        { q: "Does the app work offline when traveling abroad?", a: "Our Pro tier includes PWA offline caching." },
        { q: "Can I export my itineraries to other formats?", a: "You can export as PDF, CSV, or calendar sync." }
    ];

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
                <div key={idx} className="backdrop-blur-md bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-6 text-left font-bold flex items-center justify-between">
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === idx && <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 text-sm">{faq.a}</div>}
                </div>
            ))}
        </div>
    );
}