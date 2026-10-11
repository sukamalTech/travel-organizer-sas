// components/MapNavigatorButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface Props {
    lat: number;
    lng: number;
    label: string;
}

export function MapNavigatorButton({ lat, lng, label }: Props) {
    const handleOpenMap = () => {
        // Opens Google Maps directions from current location (destination specified via lat/lng & query)
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(label)}`;
        window.open(url, "_blank");
    };

    return (
        <Button variant="outline" size="sm" onClick={handleOpenMap} className="w-full text-xs h-8 gap-1.5 mt-1">
            <Navigation className="w-3.5 h-3.5 text-primary" /> Show in Google Maps
        </Button>
    );
}