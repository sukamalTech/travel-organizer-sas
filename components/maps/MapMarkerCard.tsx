import { Compass } from 'lucide-react';

interface MapMarkerCardProps {
    title: string;
    category: string;
    time: string;
    active: boolean;
}

export default function MapMarkerCard({ title, category, time, active }: MapMarkerCardProps) {
    return (
        <div className={`p-3 rounded-xl transition-all duration-300 ${active
                ? 'bg-slate-900/90 border border-indigo-500/80 shadow-lg shadow-indigo-500/20 text-white scale-105'
                : 'bg-slate-900/60 border border-slate-800 text-slate-300'
            }`}>
            <div className="flex items-center gap-2">
                <Compass className={`w-4 h-4 ${active ? 'text-indigo-400 animate-spin-slow' : 'text-slate-500'}`} />
                <span className="text-xs font-semibold">{title}</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span>{category}</span>
                <span>{time}</span>
            </div>
        </div>
    );
}