// components/landing-page/LandingPageWrapper.tsx
"use client";

import { useState, ReactNode } from "react";

export default function LandingPageWrapper({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-indigo-500 selection:text-white font-sans">
                {/* Pass toggleTheme down to Navbar if needed via props or context */}
                {children}
            </div>
        </div>
    );
}