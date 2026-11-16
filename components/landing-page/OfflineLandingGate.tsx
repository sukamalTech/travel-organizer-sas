// components/landing-page/OfflineLandingGate.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, Contact, ArrowRight } from "lucide-react";

export default function OfflineLandingGate({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOffline, setIsOffline] = useState(false);
    const [savedUserId, setSavedUserId] = useState<string | null>(null);

    useEffect(() => {
        setIsOffline(!navigator.onLine);
        setSavedUserId(localStorage.getItem("offline_active_user_id"));

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => {
            setIsOffline(true);
            setSavedUserId(localStorage.getItem("offline_active_user_id"));
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Online: render full landing page sections
    if (!isOffline) {
        return <>{children}</>;
    }

    // Offline: render only the offline quick-access card below Navbar
    const contactsHref = savedUserId ? `/${savedUserId}/contacts` : "/dashboard";

    return (
        <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-5">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <WifiOff className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        You&apos;re Currently Offline
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        During offline mode, you can only access essential cached tools like your{" "}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Contacts Directory
                        </span>{" "}
                        for direct Voice and WhatsApp calls.
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        href={contactsHref}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition"
                    >
                        <Contact className="w-4 h-4" />
                        <span>Open Contacts Page</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}