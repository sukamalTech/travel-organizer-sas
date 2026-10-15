"use client";
import { useState } from "react";
import { Compass, Sun, Moon, Menu } from "lucide-react";
import Link from "next/link";
import StartFree from "./StartFree";

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };


    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <Compass className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div>
                        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-violet-400 dark:to-pink-400 bg-clip-text text-transparent">
                            Explorer
                        </span>
                        <span className="block text-[10px] uppercase tracking-widest font-semibold text-slate-400">Dynamic Workspace</span>
                    </div>
                </div>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
                    <Link href="#comparison" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Comparison</Link>
                    <Link href="#audience" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workflows</Link>
                    <Link href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
                    <Link href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</Link>
                    <Link href="/auth/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link>
                    <Link href="/auth/sign-up" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign Up</Link>
                </nav>

                {/* Actions: Theme Toggle & CTA */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                        className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <StartFree />
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden backdrop-blur-md bg-white/90 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4">
                    <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Features</Link>
                    <Link href="#comparison" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Comparison</Link>
                    <Link href="#audience" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Workflows</Link>
                    <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium text-slate-700 dark:text-slate-200">Pricing</Link>
                    <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-white bg-indigo-600 shadow-md">
                        Start Free Trial
                    </Link>
                </div>
            )}
        </header>
    );
}