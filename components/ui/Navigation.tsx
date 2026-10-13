'use client';

import Link from 'next/link';
import { Map, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CTAButton from '../ui/CTAButton';

export default function Navigation() {
    return (
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <Map className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">
                        Geo<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Sphere</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#map-demo" className="hover:text-white transition-colors">Interactive Maps</Link>
                    <Link href="#matrix" className="hover:text-white transition-colors">Why Us</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <CTAButton href="/signup" variant="primary" className="hidden sm:inline-flex text-sm py-2.5 px-5">
                        <Sparkles className="w-4 h-4 mr-2" /> Start Free
                    </CTAButton>
                </div>
            </div>
        </header>
    );
}