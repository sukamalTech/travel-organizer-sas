// src/components/ThemeToggle.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check initial theme from localStorage or document class
        const isDark = document.documentElement.classList.contains('dark') ||
            localStorage.getItem('theme') === 'dark';
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center space-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
        >
            {isDarkMode ? (
                <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="h-4 w-4 text-slate-600" />
                    <span>Dark Mode</span>
                </>
            )}
        </button>
    );
}