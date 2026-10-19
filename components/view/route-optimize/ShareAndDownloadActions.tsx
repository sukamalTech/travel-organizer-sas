'use client';

import React from 'react';
import { Download, Share2 } from "lucide-react";

interface ShareAndDownloadActionsProps {
    itinerary: any[];
    totalTripStats: { distanceKm: number; durationHours: string } | null;
}

export function ShareAndDownloadActions({ itinerary, totalTripStats }: ShareAndDownloadActionsProps) {
    if (!itinerary || itinerary.length === 0) return null;

    // Handles downloading text file without triggering any API call
    const handleDownloadItinerary = () => {
        let textContent = `🚗 OPTIMIZED DAY ROUTE ITINERARY\n`;
        if (totalTripStats) {
            textContent += `Total Distance: ${totalTripStats.distanceKm} km | Total Driving: ~${totalTripStats.durationHours} hrs\n`;
        }
        textContent += `=========================================\n\n`;

        itinerary.forEach((spot) => {
            if (spot.type === 'start') {
                textContent += `[★ START] ${spot.name}\n  Departure Time: ${spot.departureTime}\n\n`;
            } else if (spot.type === 'destination' || spot.type === 'return') {
                textContent += `[🏁 FINAL DESTINATION] ${spot.name}\n  Arrival Time: ${spot.arrivalTime}\n\n`;
            } else {
                textContent += `[STOP ${spot.order}] ${spot.name}\n`;
                textContent += `  • Arrival: ${spot.arrivalTime} | Departure: ${spot.departureTime}\n`;
                textContent += `  • Driving Duration from Previous: ${spot.travelFromPrevMins} mins\n`;
                textContent += `  • Visit Duration: ${spot.visitDuration} mins\n\n`;
            }
        });

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Optimized_Day_Route.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handles direct WhatsApp share without triggering any API call
    const handleWhatsAppShare = () => {
        let message = `🗺️ *Optimized Day Route Itinerary*\n`;
        if (totalTripStats) {
            message += `📍 Total: ${totalTripStats.distanceKm} km (~${totalTripStats.durationHours} hrs)\n\n`;
        }

        itinerary.forEach((spot) => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`;
            if (spot.type === 'start') {
                message += `★ *Start*: ${spot.name} (Depart: ${spot.departureTime})\n`;
            } else if (spot.type === 'destination' || spot.type === 'return') {
                message += `🏁 *Final Stop*: ${spot.name} (Arrive: ${spot.arrivalTime})\n🔗 Location: ${googleMapsUrl}\n`;
            } else {
                message += `${spot.order}️⃣ *Stop ${spot.order}*: ${spot.name}\n   ⏰ Arrive: ${spot.arrivalTime} | Depart: ${spot.departureTime}\n   🚗 ${spot.travelFromPrevMins} min drive\n   🔗 ${googleMapsUrl}\n\n`;
            }
        });

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
            <button
                type="button"
                onClick={handleDownloadItinerary}
                className="flex-1 py-1.5 px-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-border"
            >
                <Download className="w-3.5 h-3.5" />
                Download Route
            </button>
            <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
                <Share2 className="w-3.5 h-3.5" />
                Share on WhatsApp
            </button>
        </div>
    );
}