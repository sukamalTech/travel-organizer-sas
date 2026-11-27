'use client';

import React, { useState } from 'react';
import {
    Car,
    Bike,
    Train,
    Bus,
    Plane,
    Ship,
    Footprints,
    Building2,
    MapPin,
    Utensils,
    Navigation,
    Clock,
    Phone,
    ExternalLink,
    Copy,
    Check,
    Sparkles,
    Camera,
    Star,
    Ticket,
    Route,
    Wallet,
    CalendarCheck,
} from 'lucide-react';
import {
    buildGoogleMapsUrl,
    formatTime12Hr,
    normalizeStringArray,
} from '@/lib/travel/viewHelpers';

export type FilterCategory = 'all' | 'leg' | 'accommodation' | 'attraction' | 'dining';

interface DayLogisticsCardsProps {
    day: any;
    legs: any[];
    accommodations: any[];
    attractions: any[];
    diningSpots: any[];
}

function getModeIcon(mode?: string) {
    switch ((mode || 'car').toLowerCase()) {
        case 'bike':
            return <Bike className="w-4 h-4" />;
        case 'train':
            return <Train className="w-4 h-4" />;
        case 'bus':
            return <Bus className="w-4 h-4" />;
        case 'flight':
            return <Plane className="w-4 h-4" />;
        case 'ferry':
            return <Ship className="w-4 h-4" />;
        case 'walk':
            return <Footprints className="w-4 h-4" />;
        default:
            return <Car className="w-4 h-4" />;
    }
}

export default function DayLogisticsCards({
    day,
    legs,
    accommodations,
    attractions,
    diningSpots,
}: DayLogisticsCardsProps) {
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // Fallback ignored
        }
    };

    // Daily Totals Summary
    const totalDistanceKm = legs.reduce((sum, l) => {
        const d = Number(l.distanceKm ?? l.distance_km ?? 0);
        return sum + (Number.isFinite(d) ? d : 0);
    }, 0);

    const totalEstimatedCost = [
        ...accommodations.map((a) => Number(a.actualCost ?? a.actual_cost ?? a.estimatedCost ?? a.estimated_cost ?? 0)),
        ...attractions.map((a) => Number(a.entryFee ?? a.entry_fee ?? 0)),
        ...diningSpots.map((d) => Number(d.estimatedCost ?? d.estimated_cost ?? 0)),
    ].reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0);

    const totalItems =
        legs.length + accommodations.length + attractions.length + diningSpots.length;

    const filterChips: { key: FilterCategory; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: totalItems },
        { key: 'leg', label: 'Travel', count: legs.length },
        { key: 'accommodation', label: 'Stays', count: accommodations.length },
        { key: 'attraction', label: 'Sightseeing', count: attractions.length },
        { key: 'dining', label: 'Dining', count: diningSpots.length },
    ];

    const sortedLegs = [...legs].sort(
        (a, b) =>
            Number(a.sequenceOrder ?? a.sequence_order ?? 1) -
            Number(b.sequenceOrder ?? b.sequence_order ?? 1)
    );

    return (
        <div className="space-y-4">
            {/* Day Overview Banner & Quick Metrics */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-4 sm:p-5 text-white shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm">
                            Day {day.day_number ?? day.dayNumber}
                        </span>
                        <h2 className="text-lg sm:text-xl font-extrabold mt-1">
                            {day.night_stay_location || day.nightStayLocation || day.summary || 'Day Itinerary'}
                        </h2>
                        {(day.daily_notes || day.dailyNotes || day.night_stay_notes || day.nightStayNotes) && (
                            <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
                                {day.daily_notes || day.dailyNotes || day.night_stay_notes || day.nightStayNotes}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {totalDistanceKm > 0 && (
                            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm text-right">
                                <p className="text-[10px] uppercase tracking-wider text-blue-100 font-semibold">
                                    Distance
                                </p>
                                <p className="text-sm font-extrabold">{totalDistanceKm.toFixed(1)} km</p>
                            </div>
                        )}
                        {totalEstimatedCost > 0 && (
                            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm text-right">
                                <p className="text-[10px] uppercase tracking-wider text-blue-100 font-semibold">
                                    Est. Spend
                                </p>
                                <p className="text-sm font-extrabold">₹{totalEstimatedCost.toLocaleString('en-IN')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {filterChips.map((chip) => {
                    const active = activeFilter === chip.key;
                    return (
                        <button
                            key={chip.key}
                            type="button"
                            onClick={() => setActiveFilter(chip.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${active
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            <span>{chip.label}</span>
                            <span
                                className={`px-1.5 py-0.2 rounded-full text-[10px] ${active
                                    ? 'bg-white/20 text-white dark:bg-slate-900/15 dark:text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                                    }`}
                            >
                                {chip.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {totalItems === 0 && (
                <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        No travel legs, stays, sightseeing, or dining added for this day yet.
                    </p>
                </div>
            )}

            {/* 1. TRAVEL LEGS CARDS */}
            {(activeFilter === 'all' || activeFilter === 'leg') &&
                sortedLegs.map((leg, idx) => {
                    const seq = leg.sequenceOrder ?? leg.sequence_order ?? idx + 1;
                    const originName = leg.originName ?? leg.origin_name ?? 'Origin';
                    const destinationName = leg.destinationName ?? leg.destination_name ?? 'Destination';
                    const depTime = formatTime12Hr(leg.departureTime ?? leg.departure_time);
                    const arrTime = formatTime12Hr(leg.arrivalTime ?? leg.arrival_time);
                    const distanceKm = leg.distanceKm ?? leg.distance_km;
                    const meta = leg.metadata || {};

                    const mapsUrl = buildGoogleMapsUrl({
                        isRoute: true,
                        originLat: leg.originLat ?? leg.origin_lat,
                        originLng: leg.originLng ?? leg.origin_lng,
                        originQuery: originName,
                        lat: leg.destinationLat ?? leg.destination_lat,
                        lng: leg.destinationLng ?? leg.destination_lng,
                        query: destinationName,
                    });

                    return (
                        <article
                            key={leg.id}
                            className="rounded-2xl bg-white dark:bg-slate-900 border border-sky-200/80 dark:border-sky-900/60 shadow-sm overflow-hidden"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-sky-500 to-blue-600" />
                            <div className="p-4 sm:p-5 space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 shrink-0">
                                            {getModeIcon(leg.mode)}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                                                    Leg #{seq} • {(leg.mode || 'car').toUpperCase()}
                                                </span>
                                                {distanceKm != null && distanceKm !== '' && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        <Route className="w-3.5 h-3.5 text-sky-500" />
                                                        {distanceKm} km
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                                                {originName} <span className="text-sky-500 mx-1">→</span> {destinationName}
                                            </h3>
                                        </div>
                                    </div>

                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition shrink-0"
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        Navigate Route
                                    </a>
                                </div>

                                {/* Timings */}
                                {(depTime || arrTime) && (
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 px-3 py-2 rounded-xl">
                                        {depTime && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-sky-500" />
                                                <strong>Departure:</strong> {depTime}
                                            </span>
                                        )}
                                        {arrTime && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                                <strong>Arrival:</strong> {arrTime}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Mode-Specific Details */}
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {meta.highway_number && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                            Highway: <strong>{meta.highway_number}</strong>
                                        </span>
                                    )}
                                    {meta.road_condition && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium capitalize">
                                            Road: <strong>{meta.road_condition}</strong>
                                        </span>
                                    )}
                                    {meta.train_name && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                            Service: <strong>{meta.train_name}</strong>
                                            {meta.train_number ? ` (${meta.train_number})` : ''}
                                        </span>
                                    )}
                                    {meta.airline && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                            Airline: <strong>{meta.airline}</strong>
                                            {meta.flight_number ? ` • ${meta.flight_number}` : ''}
                                        </span>
                                    )}
                                    {meta.departure_platform && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                            Platform/Terminal: <strong>{meta.departure_platform}</strong>
                                        </span>
                                    )}
                                    {meta.terminal && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                            Terminal: <strong>{meta.terminal}</strong>
                                        </span>
                                    )}
                                    {(meta.seat_number || meta.seat) && (
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                                            Seat: <strong>{meta.seat_number || meta.seat}</strong>
                                        </span>
                                    )}
                                    {meta.fare && (
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                                            Fare: ₹{meta.fare}
                                        </span>
                                    )}
                                    {meta.pnr && (
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(leg.id, String(meta.pnr))}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200/70 dark:border-amber-800/60"
                                        >
                                            <Ticket className="w-3.5 h-3.5" />
                                            PNR: {meta.pnr}
                                            {copiedId === leg.id ? (
                                                <Check className="w-3 h-3 text-emerald-600" />
                                            ) : (
                                                <Copy className="w-3 h-3 opacity-70" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}

            {/* 2. ACCOMMODATION CARDS */}
            {(activeFilter === 'all' || activeFilter === 'accommodation') &&
                accommodations.map((stay) => {
                    const facilities = normalizeStringArray(stay.facilities);
                    const placeName = stay.placeName ?? stay.place_name;
                    const phoneNumber = stay.phoneNumber ?? stay.phone_number;
                    const bookingRef = stay.bookingReference ?? stay.booking_reference;
                    const bookingUrl = stay.externalBookingUrl ?? stay.external_booking_url;
                    const estCost = stay.estimatedCost ?? stay.estimated_cost;
                    const actCost = stay.actualCost ?? stay.actual_cost;
                    const currency = stay.currency || 'INR';

                    const mapsUrl = buildGoogleMapsUrl({
                        lat: stay.latitude,
                        lng: stay.longitude,
                        query: `${stay.name} ${stay.address || placeName || ''}`,
                    });

                    return (
                        <article
                            key={stay.id}
                            className="rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/60 shadow-sm overflow-hidden"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />
                            <div className="p-4 sm:p-5 space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shrink-0">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                    Stay • {stay.status || 'Confirmed'}
                                                </span>
                                                {placeName && (
                                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        {placeName}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                                                {stay.name}
                                            </h3>
                                            {stay.address && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {stay.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition shrink-0"
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        Open in Maps
                                    </a>
                                </div>

                                {/* Check-in / Check-out & Costs */}
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {(stay.checkIn || stay.check_in) && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                            <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
                                            Check-in: <strong>{stay.checkIn || stay.check_in}</strong>
                                        </span>
                                    )}
                                    {(stay.checkOut || stay.check_out) && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                            <CalendarCheck className="w-3.5 h-3.5 text-rose-500" />
                                            Check-out: <strong>{stay.checkOut || stay.check_out}</strong>
                                        </span>
                                    )}
                                    {estCost && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                                            Est: <strong>{currency} {estCost}</strong>
                                        </span>
                                    )}
                                    {actCost && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                                            Paid: {currency} {actCost}
                                        </span>
                                    )}
                                </div>

                                {/* Facilities */}
                                {facilities.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {facilities.map((fac: any) => (
                                            <span
                                                key={fac}
                                                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50"
                                            >
                                                {fac}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Contact, Booking Ref & External Link */}
                                {(phoneNumber || bookingRef || bookingUrl) && (
                                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                        {phoneNumber && (
                                            <a
                                                href={`tel:${phoneNumber}`}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                                            >
                                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                                {phoneNumber}
                                            </a>
                                        )}
                                        {bookingRef && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(stay.id, String(bookingRef))}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200/70 dark:border-amber-800/60"
                                            >
                                                Ref: {bookingRef}
                                                {copiedId === stay.id ? (
                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-3 h-3 opacity-70" />
                                                )}
                                            </button>
                                        )}
                                        {bookingUrl && (
                                            <a
                                                href={bookingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                Booking Link
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}

            {/* 3. ATTRACTION CARDS */}
            {(activeFilter === 'all' || activeFilter === 'attraction') &&
                attractions.map((spot) => {
                    const highlights = normalizeStringArray(spot.highlights);
                    const photoNotes = normalizeStringArray(
                        spot.photographyNotes ?? spot.photography_notes
                    );
                    const entryFee = spot.entryFee ?? spot.entry_fee;
                    const currency = spot.currency || 'INR';
                    const openTime = formatTime12Hr(spot.openingTime ?? spot.opening_time);
                    const closeTime = formatTime12Hr(spot.closingTime ?? spot.closing_time);

                    const mapsUrl = buildGoogleMapsUrl({
                        lat: spot.latitude,
                        lng: spot.longitude,
                        query: `${spot.name} ${spot.address || ''}`,
                    });

                    return (
                        <article
                            key={spot.id}
                            className="rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 shadow-sm overflow-hidden"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-600" />
                            <div className="p-4 sm:p-5 space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                                Sightseeing / Attraction
                                            </span>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                                                {spot.name}
                                            </h3>
                                            {spot.address && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {spot.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition shrink-0"
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        Open in Maps
                                    </a>
                                </div>

                                {/* Timings & Entry Fee */}
                                {(openTime || closeTime || entryFee) && (
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {(openTime || closeTime) && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                                <Clock className="w-3.5 h-3.5 text-purple-500" />
                                                Hours:{' '}
                                                <strong>
                                                    {openTime || 'Open'} – {closeTime || 'Close'}
                                                </strong>
                                            </span>
                                        )}
                                        {entryFee && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">
                                                <Ticket className="w-3.5 h-3.5" />
                                                Entry: {currency} {entryFee}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Highlights */}
                                {highlights.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-purple-500" /> Highlights
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {highlights.map((h: any, i: any) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50"
                                                >
                                                    {h}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Photography Notes */}
                                {photoNotes.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                            <Camera className="w-3 h-3 text-pink-500" /> Photography Tips
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {photoNotes.map((note: any, i: any) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/50"
                                                >
                                                    {note}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}

            {/* 4. DINING CARDS */}
            {(activeFilter === 'all' || activeFilter === 'dining') &&
                diningSpots.map((meal) => {
                    const cuisine = meal.cuisineType ?? meal.cuisine_type;
                    const estCost = meal.estimatedCost ?? meal.estimated_cost;

                    const mapsUrl = buildGoogleMapsUrl({
                        lat: meal.latitude,
                        lng: meal.longitude,
                        query: `${meal.name} ${meal.address || ''}`,
                    });

                    return (
                        <article
                            key={meal.id}
                            className="rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/60 shadow-sm overflow-hidden"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-600" />
                            <div className="p-4 sm:p-5 space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 shrink-0">
                                            <Utensils className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                    {meal.category || 'Dining'}
                                                </span>
                                                {cuisine && (
                                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        {cuisine}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                                                {meal.name}
                                            </h3>
                                            {meal.address && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {meal.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition shrink-0"
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        Open in Maps
                                    </a>
                                </div>

                                {(estCost || meal.rating) && (
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {estCost && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                                                <Wallet className="w-3.5 h-3.5 text-amber-600" />
                                                Est. Meal Cost: <strong>₹{estCost}</strong>
                                            </span>
                                        )}
                                        {meal.rating && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                {meal.rating} / 5
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}
        </div>
    );
}