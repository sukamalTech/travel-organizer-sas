'use client';

import MapMarkerCard from './MapMarkerCard';

interface Pin {
    id: string;
    name: string;
    category: string;
    time: string;
    top: string;
    left: string;
    color: string;
}

const PINS: Pin[] = [
    { id: '1', name: 'Shibuya Crossing', category: 'Attraction', time: '09:00 AM', top: '28%', left: '32%', color: 'bg-emerald-400' },
    { id: '2', name: 'Ichiran Ramen', category: 'Dining', time: '01:30 PM', top: '48%', left: '55%', color: 'bg-amber-400' },
    { id: '3', name: 'Trunk Hotel', category: 'Stay', time: '06:00 PM', top: '70%', left: '72%', color: 'bg-pink-400' },
];

interface DynamicMapPreviewProps {
    activeId: string | null;
    onHoverPin: (id: string | null) => void;
}

export default function DynamicMapPreview({ activeId, onHoverPin }: DynamicMapPreviewProps) {
    return (
        <div className="relative w-full h-[460px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid Pattern Backdrop simulating Map SDK Canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Polyline Route SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-indigo-500/60 stroke-[3] stroke-dasharray-[6]" style={{ strokeDasharray: '6 6' }}>
                <path d="M 160 130 Q 250 180, 270 220 T 360 320" fill="none" />
            </svg>

            {/* Render Pins */}
            {PINS.map((pin) => {
                const isActive = activeId === pin.id;
                return (
                    <div
                        key={pin.id}
                        style={{ top: pin.top, left: pin.left }}
                        onMouseEnter={() => onHoverPin(pin.id)}
                        onMouseLeave={() => onHoverPin(null)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    >
                        {/* Animated Pin Marker */}
                        <div className="relative flex items-center justify-center">
                            <span className={`absolute w-8 h-8 rounded-full ${pin.color} opacity-30 animate-ping`} />
                            <div className={`w-5 h-5 rounded-full ${pin.color} border-2 border-slate-900 shadow-lg shadow-black/80 flex items-center justify-center`}>
                                <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                            </div>
                        </div>

                        {/* Floating Glass Marker Overlay Card */}
                        <div className="mt-2 w-48 transition-all duration-300">
                            <MapMarkerCard title={pin.name} category={pin.category} time={pin.time} active={isActive} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}