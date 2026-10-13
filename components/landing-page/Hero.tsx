import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-slate-950 text-white py-24 lg:py-32">
            {/* Background Glow Effect */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Column: Text and CTAs */}
                    <div className="lg:col-span-7 text-center lg:text-left">

                        {/* Top Pill / Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Powered by Next.js 16 & Tailwind CSS</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
                            Build lightning-fast apps with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">Modern Architecture</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                            Scale effortlessly with zero configuration build tools, instant routing, and component-level caching. Deliver unmatched user experiences instantly.
                        </p>

                        {/* CTA Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            <Link
                                href="/get-started"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-600/25"
                            >
                                Start Building Free
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/docs"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium border border-slate-800 transition-all"
                            >
                                Read Documentation
                            </Link>
                        </div>

                        {/* Feature Checkmarks */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-900 text-sm text-slate-400">
                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Zero Config Setup</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Turbopack Native</span>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Server Components</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Visual Graphic / Canvas / Dashboard Mock */}
                    <div className="lg:col-span-5">
                        <div className="relative mx-auto max-w-md lg:max-w-none">

                            {/* Decorative Border Frame */}
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-30 blur-sm" />

                            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">app/dashboard/page.tsx</span>
                                </div>

                                {/* Code / Visual Mock content */}
                                <div className="space-y-3 font-mono text-xs text-slate-300">
                                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-indigo-300">
                                        <span className="text-purple-400">async function</span> <span className="text-cyan-300">Dashboard</span>() &#123;
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 pl-6 text-slate-400">
                                        <span className="text-purple-400">const</span> data = <span className="text-cyan-400">await</span> fetchMetrics();
                                    </div>
                                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 pl-6 text-indigo-200">
                                        &lt;<span className="text-indigo-400">MapCanvasWrapper</span> data=&#123;data&#125; /&gt;
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                                        &#125;
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                                    <span>Compilation status:</span>
                                    <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Turbopack Ready (615ms)
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}