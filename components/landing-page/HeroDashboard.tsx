"use client";
import { useState } from "react";
import { Calendar, MapPin, Utensils, Home, Plus, ZoomIn, ZoomOut, Compass } from "lucide-react";

export default function HeroDashboard() {
    const [selectedPin, setSelectedPin] = useState(0);

    const itineraryItems = [
        { type: "Attraction", typeColor: "text-indigo-600 dark:text-indigo-400", time: "09:30 AM", title: "Shibuya Crossing & Hachiko", description: "World's busiest scramble intersection.", bgColor: "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60" },
        { type: "Dining", typeColor: "text-emerald-600 dark:text-emerald-400", time: "12:30 PM", title: "Ichiran Ramen Shibuya", description: "Famous solo tonkotsu ramen booths.", bgColor: "bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60" },
        { type: "Stay", typeColor: "text-violet-600 dark:text-violet-400", time: "03:00 PM", title: "Trunk Hotel Cat Street", description: "Boutique design hotel in Harajuku.", bgColor: "bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60" }
    ];

    return (
        <div className="relative max-w-6xl mx-auto backdrop-blur-md bg-white/70 dark:bg-slate-900/75 border border-white/40 dark:border-slate-800 rounded-3xl p-3 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white/60 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <span>Day 01: Tokyo Metro Pulse</span>
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {itineraryItems.map((item, idx) => (
                                <div key={idx} onClick={() => setSelectedPin(idx)} className={`cursor-pointer p-3 rounded-xl border transition-all ${selectedPin === idx ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200' : item.bgColor}`}>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${item.typeColor}`}>[{item.type}]</span>
                                    <h4 className="font-semibold text-sm mt-1">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => alert('Item added!')} className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center space-x-1">
                        <Plus className="w-3.5 h-3.5" /><span>Add Stop</span>
                    </button>
                </div>
                <div className="lg:col-span-7 relative bg-slate-200 dark:bg-slate-900 rounded-2xl h-80 sm:h-96 flex items-center justify-center">
                    <div className="absolute top-[55%] left-[25%] cursor-pointer" onClick={() => setSelectedPin(0)}>
                        <div className={`w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center ${selectedPin === 0 ? 'animate-bounce' : ''}`}><MapPin className="w-4 h-4" /></div>
                    </div>
                    <div className="absolute top-[40%] left-[55%] cursor-pointer" onClick={() => setSelectedPin(1)}>
                        <div className={`w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center ${selectedPin === 1 ? 'animate-bounce' : ''}`}><Utensils className="w-4 h-4" /></div>
                    </div>
                    <div className="absolute top-[30%] left-[80%] cursor-pointer" onClick={() => setSelectedPin(2)}>
                        <div className={`w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center ${selectedPin === 2 ? 'animate-bounce' : ''}`}><Home className="w-4 h-4" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}