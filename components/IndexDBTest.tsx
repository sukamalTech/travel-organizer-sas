"use client";

import { useState, useEffect } from "react";
import { saveOfflineData, getOfflineData } from "@/lib/indexdb/db";

export default function TripDetailView({ tripId }: { tripId: string }) {
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Monitor mobile network status
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        setIsOffline(!navigator.onLine);

        async function fetchTripData() {
            try {
                // 1. Try fetching fresh data from your API (connected to Supabase/TiDB)
                const res = await fetch(`/api/trips/${tripId}`);
                if (!res.ok) throw new Error("Network response failed");

                const data = await res.json();
                setTrip(data);

                // 2. Save a fresh copy to IndexedDB for offline mobile usage
                await saveOfflineData(`trip_${tripId}`, data);
            } catch (error) {
                console.log("Network unavailable. Loading from IndexedDB...");

                // 3. Fallback to IndexedDB cache if offline or fetch failed
                const cachedTrip = await getOfflineData(`trip_${tripId}`);
                if (cachedTrip) {
                    setTrip(cachedTrip);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchTripData();

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [tripId]);

    if (loading) return <div className="p-6 text-center">Loading itinerary...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {isOffline && (
                <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs py-2 px-4 rounded-xl text-center font-medium">
                    📶 You are currently offline. Displaying cached itinerary from your device storage.
                </div>
            )}

            {trip ? (
                <div>
                    <h1 className="text-2xl font-bold">{trip.title}</h1>
                    {/* Render your daywise itinerary stops here */}
                </div>
            ) : (
                <p className="text-center text-slate-500">No trip data found offline.</p>
            )}
        </div>
    );
}