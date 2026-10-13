import { Map, Calendar, Info, WifiOff } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function BentoGrid() {
    return (
        <section id="features" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Master Every Aspect of Your Journey</h2>
                    <p className="text-slate-400">Custom tools built for complete visual trip execution.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="md:col-span-2" glow>
                        <Map className="w-8 h-8 text-indigo-400 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Interactive Custom Map Engine</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            See your trip unfold geographically. Filter route waypoints by day, attraction, or dining preference with color-coded custom map pins.
                        </p>
                    </GlassCard>

                    <GlassCard>
                        <Calendar className="w-8 h-8 text-pink-400 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Daywise Pacing</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Drag and drop daily activities while automated transit time calculations keep your schedule realistic.
                        </p>
                    </GlassCard>

                    <GlassCard>
                        <Info className="w-8 h-8 text-amber-400 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Place Insights</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Integrated place details like opening hours, local links, and reviews embedded into every card.
                        </p>
                    </GlassCard>

                    <GlassCard className="md:col-span-2">
                        <WifiOff className="w-8 h-8 text-emerald-400 mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Offline Route Synchronization</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Access your route details and offline maps anywhere on earth without relying on cellular data connectivity.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </section>
    );
}