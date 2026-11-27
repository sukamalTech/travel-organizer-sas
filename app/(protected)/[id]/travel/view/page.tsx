// 'use client';

// import React, { useState, useEffect, useMemo, use, useCallback } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { getTripItineraryDays } from '@/app/actions/itineraryDays';
// import { fetchTripOthersDetails } from '@/lib/itinerary/othersDetailsClient';
// import { formatReadableDate, buildGoogleMapsUrl } from '@/lib/travel/viewHelpers';
// import DayLogisticsCards from '@/components/travel/DayLogisticsCards';
// import FullTripRouteMap, { RouteStopPoint } from '@/components/travel/FullTripRouteMap';
// import { ActionButton } from '@/components/ui/FormControls';
// import {
//     Calendar,
//     MapPin,
//     ChevronDown,
//     Compass,
//     Loader2,
//     AlertCircle,
//     Search,
//     Printer,
//     Share2,
//     Check,
//     Map as MapIcon,
//     Navigation,
//     Send,
// } from 'lucide-react';
// import dynamic from 'next/dynamic';

// const DynamicFullTripRouteMap = dynamic(
//     () => import('@/components/travel/FullTripRouteMap'),
//     {
//         ssr: false,
//         loading: () => (
//             <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">
//                 Loading route map...
//             </div>
//         ),
//     }
// );

// export default function UserTravelViewPage({
//     params,
// }: {
//     params: Promise<{ id: string }>;
// }) {
//     const resolvedParams = use(params);
//     const routeUserId = resolvedParams.id;
//     const supabase = createClient();

//     // User's created trips & form selection state
//     const [userTrips, setUserTrips] = useState<any[]>([]);
//     const [selectedTripOption, setSelectedTripOption] = useState<string>('');
//     const [loadedTripId, setLoadedTripId] = useState<string>('');
//     const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(true);

//     // Loaded itinerary & logistics state
//     const [days, setDays] = useState<any[]>([]);
//     const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
//     const [mobileOpenDayId, setMobileOpenDayId] = useState<string | null>(null);

//     const [legs, setLegs] = useState<any[]>([]);
//     const [accommodations, setAccommodations] = useState<any[]>([]);
//     const [attractions, setAttractions] = useState<any[]>([]);
//     const [diningSpots, setDiningSpots] = useState<any[]>([]);

//     // UI helpers
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showFullRouteMap, setShowFullRouteMap] = useState(true);
//     const [copiedShare, setCopiedShare] = useState(false);
//     const [isLoadingDetails, setIsLoadingDetails] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     function getTripDisplayTitle(trip: any): string {
//         return (
//             trip?.title ||
//             trip?.name ||
//             trip?.trip_name ||
//             trip?.destination ||
//             'Untitled Trip'
//         );
//     }

//     function getTripSubtitle(trip: any): string {
//         return (
//             trip?.destination ||
//             trip?.route_summary ||
//             trip?.summary ||
//             (trip?.start_date ? `Starts ${trip.start_date}` : 'Custom Route')
//         );
//     }
//     // Fetch only trips created by the authenticated user
//     useEffect(() => {
//         let cancelled = false;

//         async function fetchUserTrips() {
//             setIsLoadingTrips(true);
//             setErrorMessage(null);

//             try {
//                 const {
//                     data: { user },
//                     error: authError,
//                 } = await supabase.auth.getUser();

//                 if (authError) {
//                     throw new Error(authError.message || 'Authentication check failed.');
//                 }

//                 const ownerId = user?.id || routeUserId;
//                 if (!ownerId) {
//                     throw new Error('Unable to identify user account.');
//                 }

//                 const { data, error } = await supabase
//                     .from('trips')
//                     .select('*')
//                     .eq('user_id', ownerId)
//                     .order('created_at', { ascending: false });

//                 if (error) {
//                     throw new Error(
//                         error.message ||
//                         error.details ||
//                         error.hint ||
//                         `Supabase query failed (code: ${error.code || 'unknown'})`
//                     );
//                 }

//                 if (cancelled) return;

//                 const tripsList = data || [];
//                 setUserTrips(tripsList);

//                 if (tripsList.length > 0) {
//                     setSelectedTripOption(tripsList[0].id);
//                 }
//             } catch (err: any) {
//                 if (cancelled) return;
//                 const message =
//                     err?.message ||
//                     err?.error_description ||
//                     (typeof err === 'string' ? err : 'Failed to load your trips.');
//                 console.error('Error fetching user trips:', message, err);
//                 setErrorMessage(message);
//             } finally {
//                 if (!cancelled) setIsLoadingTrips(false);
//             }
//         }

//         fetchUserTrips();
//         return () => {
//             cancelled = true;
//         };
//     }, [supabase, routeUserId]);

//     // Load days & logistics for a specific tripId
//     const loadTripData = useCallback(async (targetTripId: string) => {
//         if (!targetTripId) return;

//         setIsLoadingDetails(true);
//         setErrorMessage(null);

//         try {
//             const [daysData, details] = await Promise.all([
//                 getTripItineraryDays(targetTripId),
//                 fetchTripOthersDetails(targetTripId),
//             ]);

//             const orderedDays = Array.isArray(daysData) ? daysData : [];
//             setLoadedTripId(targetTripId);
//             setDays(orderedDays);
//             setLegs(details.travelLegs);
//             setAccommodations(details.accommodations);
//             setAttractions(details.attractions);
//             setDiningSpots(details.diningSpots);

//             if (orderedDays.length > 0) {
//                 setSelectedDayId(orderedDays[0].id);
//             } else {
//                 setSelectedDayId(null);
//             }
//             setMobileOpenDayId(null);
//         } catch (err: any) {
//             console.error('Error loading trip details:', err);
//             setErrorMessage(err.message || 'Failed to load trip details.');
//         } finally {
//             setIsLoadingDetails(false);
//         }
//     }, []);

//     // Submit handler when user selects a trip and clicks Submit
//     const handleTripFormSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedTripOption) {
//             setErrorMessage('Please select a trip first.');
//             return;
//         }
//         await loadTripData(selectedTripOption);
//     };

//     const activeTrip = useMemo(
//         () => userTrips.find((t) => t.id === loadedTripId) || null,
//         [userTrips, loadedTripId]
//     );

//     // Build ordered route points across the entire trip
//     const fullTripRoutePoints = useMemo<RouteStopPoint[]>(() => {
//         const dayOrderMap = new Map<string, number>();
//         days.forEach((d, idx) => {
//             dayOrderMap.set(d.id, Number(d.day_number ?? d.dayNumber ?? idx + 1));
//         });

//         const points: RouteStopPoint[] = [];

//         const sortedLegs = [...legs].sort((a, b) => {
//             const dayA = dayOrderMap.get(a.dayId ?? a.day_id) ?? 999;
//             const dayB = dayOrderMap.get(b.dayId ?? b.day_id) ?? 999;
//             if (dayA !== dayB) return dayA - dayB;
//             return (
//                 Number(a.sequenceOrder ?? a.sequence_order ?? 1) -
//                 Number(b.sequenceOrder ?? b.sequence_order ?? 1)
//             );
//         });

//         sortedLegs.forEach((leg, i) => {
//             const dNum = dayOrderMap.get(leg.dayId ?? leg.day_id);
//             const oLat = leg.originLat ?? leg.origin_lat;
//             const oLng = leg.originLng ?? leg.origin_lng;
//             if (oLat != null && oLng != null) {
//                 points.push({
//                     id: `${leg.id}-origin-${i}`,
//                     label: leg.originName ?? leg.origin_name ?? 'Origin',
//                     sublabel: `${(leg.mode || 'car').toUpperCase()} departure`,
//                     lat: Number(oLat),
//                     lng: Number(oLng),
//                     kind: 'origin',
//                     dayNumber: dNum,
//                 });
//             }

//             const dLat = leg.destinationLat ?? leg.destination_lat;
//             const dLng = leg.destinationLng ?? leg.destination_lng;
//             if (dLat != null && dLng != null) {
//                 points.push({
//                     id: `${leg.id}-dest-${i}`,
//                     label: leg.destinationName ?? leg.destination_name ?? 'Destination',
//                     sublabel: `${(leg.mode || 'car').toUpperCase()} arrival`,
//                     lat: Number(dLat),
//                     lng: Number(dLng),
//                     kind: 'destination',
//                     dayNumber: dNum,
//                 });
//             }
//         });

//         accommodations.forEach((stay) => {
//             if (stay.latitude != null && stay.longitude != null) {
//                 points.push({
//                     id: `stay-${stay.id}`,
//                     label: stay.name,
//                     sublabel: stay.placeName ?? stay.place_name ?? 'Stay',
//                     lat: Number(stay.latitude),
//                     lng: Number(stay.longitude),
//                     kind: 'stay',
//                     dayNumber: dayOrderMap.get(stay.dayId ?? stay.day_id),
//                 });
//             }
//         });

//         attractions.forEach((spot) => {
//             if (spot.latitude != null && spot.longitude != null) {
//                 points.push({
//                     id: `spot-${spot.id}`,
//                     label: spot.name,
//                     sublabel: 'Attraction',
//                     lat: Number(spot.latitude),
//                     lng: Number(spot.longitude),
//                     kind: 'attraction',
//                     dayNumber: dayOrderMap.get(spot.dayId ?? spot.day_id),
//                 });
//             }
//         });

//         diningSpots.forEach((meal) => {
//             if (meal.latitude != null && meal.longitude != null) {
//                 points.push({
//                     id: `meal-${meal.id}`,
//                     label: meal.name,
//                     sublabel: meal.category || 'Dining',
//                     lat: Number(meal.latitude),
//                     lng: Number(meal.longitude),
//                     kind: 'dining',
//                     dayNumber: dayOrderMap.get(meal.dayId ?? meal.day_id),
//                 });
//             }
//         });

//         return points;
//     }, [days, legs, accommodations, attractions, diningSpots]);

//     // Google Maps full route URL (origin -> waypoints -> destination)
//     const fullGoogleMapsRouteUrl = useMemo(() => {
//         if (fullTripRoutePoints.length === 0) {
//             return 'https://www.google.com/maps';
//         }
//         if (fullTripRoutePoints.length === 1) {
//             const only = fullTripRoutePoints[0];
//             return buildGoogleMapsUrl({ lat: only.lat, lng: only.lng, query: only.label });
//         }

//         const first = fullTripRoutePoints[0];
//         const last = fullTripRoutePoints[fullTripRoutePoints.length - 1];
//         const middleWaypoints = fullTripRoutePoints
//             .slice(1, -1)
//             .slice(0, 8) // Keep Google Maps URL waypoints concise
//             .map((p) => `${p.lat},${p.lng}`)
//             .join('|');

//         const base = `https://www.google.com/maps/dir/?api=1&origin=${first.lat},${first.lng}&destination=${last.lat},${last.lng}`;
//         return middleWaypoints
//             ? `${base}&waypoints=${encodeURIComponent(middleWaypoints)}`
//             : base;
//     }, [fullTripRoutePoints]);

//     const handleShareLink = async () => {
//         try {
//             const shareUrl = window.location.href;
//             if (navigator.share) {
//                 await navigator.share({
//                     title: activeTrip?.title || 'My Travel Itinerary',
//                     text: `Check out my trip itinerary: ${activeTrip?.title || ''}`,
//                     url: shareUrl,
//                 });
//             } else {
//                 await navigator.clipboard.writeText(shareUrl);
//                 setCopiedShare(true);
//                 setTimeout(() => setCopiedShare(false), 2500);
//             }
//         } catch {
//             try {
//                 await navigator.clipboard.writeText(window.location.href);
//                 setCopiedShare(true);
//                 setTimeout(() => setCopiedShare(false), 2500);
//             } catch {
//                 // Ignore clipboard errors
//             }
//         }
//     };

//     const handlePrintPage = () => {
//         window.print();
//     };

//     const getItemsForDay = (dayId: string) => {
//         const matchesSearch = (item: any) => {
//             if (!searchTerm.trim()) return true;
//             return JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
//         };

//         const byDay = (item: any) => (item?.dayId ?? item?.day_id) === dayId;

//         return {
//             dayLegs: legs.filter((i) => byDay(i) && matchesSearch(i)),
//             dayStays: accommodations.filter((i) => byDay(i) && matchesSearch(i)),
//             dayAttractions: attractions.filter((i) => byDay(i) && matchesSearch(i)),
//             dayDining: diningSpots.filter((i) => byDay(i) && matchesSearch(i)),
//         };
//     };

//     const selectedDay = useMemo(
//         () => days.find((d) => d.id === selectedDayId) || days[0] || null,
//         [days, selectedDayId]
//     );

//     const handleMobileDayToggle = (dayId: string) => {
//         setMobileOpenDayId((prev) => (prev === dayId ? null : dayId));
//         setSelectedDayId(dayId);
//     };

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 print:bg-white">
//             {/* Top Header */}
//             <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:static">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm">
//                             <Compass className="w-5 h-5" />
//                         </div>
//                         <div>
//                             <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
//                                 {activeTrip ? getTripDisplayTitle(activeTrip) : 'My Travel Itinerary'}
//                             </h1>
//                             <p className="text-xs text-slate-500 dark:text-slate-400">
//                                 {activeTrip
//                                     ? `${getTripSubtitle(activeTrip)} • ${days.length} Days`
//                                     : 'Select one of your created trips to view full details'}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Share & Print buttons stay on the right */}
//                 </div>
//             </header>

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
//                 {/* Trip Selector + Submit Form */}
//                 <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm print:hidden">
//                     {isLoadingTrips ? (
//                         <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
//                             <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
//                             <span>Loading your created trips...</span>
//                         </div>
//                     ) : userTrips.length === 0 ? (
//                         <p className="text-xs text-slate-500">
//                             No trips found under your account yet. Create a trip first to view its itinerary.
//                         </p>
//                     ) : (
//                         <form
//                             onSubmit={handleTripFormSubmit}
//                             className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
//                         >
//                             <div className="flex-1 space-y-1">
//                                 <label
//                                     htmlFor="user-trip-select"
//                                     className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
//                                 >
//                                     Select Your Trip
//                                 </label>
//                                 <select
//                                     id="user-trip-select"
//                                     value={selectedTripOption}
//                                     onChange={(e) => setSelectedTripOption(e.target.value)}
//                                     className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 >
//                                     {userTrips.map((trip) => (
//                                         // <option key={trip.id} value={trip.id}>
//                                         //     {trip.title || trip.destination || 'Untitled Trip'}
//                                         //     {trip.destination && trip.title ? ` — ${trip.destination}` : ''}
//                                         // </option>
//                                         <option key={trip.id} value={trip.id}>
//                                             {getTripDisplayTitle(trip)}
//                                             {trip.start_date ? ` (${trip.start_date})` : ''}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {loadedTripId && (
//                                 <div className="sm:w-56 space-y-1">
//                                     <label
//                                         htmlFor="trip-filter-input"
//                                         className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
//                                     >
//                                         Filter Items
//                                     </label>
//                                     <div className="relative">
//                                         <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                                         <input
//                                             id="trip-filter-input"
//                                             type="text"
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                             placeholder="Hotel, train, place..."
//                                             className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             <ActionButton
//                                 type="submit"
//                                 variant="primary"
//                                 size="md"
//                                 disabled={isLoadingDetails || !selectedTripOption}
//                                 className="sm:px-5 py-2.5 justify-center shrink-0"
//                             >
//                                 {isLoadingDetails ? (
//                                     <>
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                         <span>Loading...</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Send className="w-3.5 h-3.5" />
//                                         <span>Show Trip</span>
//                                     </>
//                                 )}
//                             </ActionButton>
//                         </form>
//                     )}
//                 </section>

//                 {errorMessage && (
//                     <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
//                         <AlertCircle className="w-5 h-5 shrink-0" />
//                         <span>{errorMessage}</span>
//                     </div>
//                 )}

//                 {/* Prompt before trip is loaded */}
//                 {!loadedTripId && !isLoadingDetails && userTrips.length > 0 && (
//                     <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
//                         <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
//                             Choose a trip from the dropdown above and click <strong>Show Trip</strong> to load your route and daily plan.
//                         </p>
//                     </div>
//                 )}

//                 {/* Loaded Trip Content */}
//                 {loadedTripId && !isLoadingDetails && (
//                     <>
//                         {/* Full-Trip Route Section */}
//                         <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
//                             <div className="flex flex-wrap items-center justify-between gap-2">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
//                                         <MapIcon className="w-4 h-4" />
//                                     </div>
//                                     <div>
//                                         <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
//                                             Full Trip Route Overview
//                                         </h2>
//                                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                                             Combined path across legs, stays, attractions, and dining stops
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-2 print:hidden">
//                                     <a
//                                         href={fullGoogleMapsRouteUrl}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
//                                     >
//                                         <Navigation className="w-3.5 h-3.5" />
//                                         Full Route in Google Maps
//                                     </a>

//                                     <ActionButton
//                                         type="button"
//                                         variant="secondary"
//                                         onClick={() => setShowFullRouteMap((prev) => !prev)}
//                                         className="text-xs"
//                                     >
//                                         {showFullRouteMap ? 'Hide Map' : 'Show Map'}
//                                     </ActionButton>
//                                 </div>
//                             </div>

//                             {showFullRouteMap && (
//                                 <DynamicFullTripRouteMap points={fullTripRoutePoints} />
//                             )}
//                         </section>

//                         {days.length === 0 ? (
//                             <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
//                                 <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
//                                     No itinerary days found for this trip.
//                                 </p>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* MOBILE VIEW (< md): Day + Location Only; Accordion Expand */}
//                                 <div className="md:hidden space-y-3 print:hidden">
//                                     {days.map((day, index) => {
//                                         const isOpen = mobileOpenDayId === day.id;
//                                         const { shortDate, weekday } = formatReadableDate(day.date);
//                                         const locationName =
//                                             day.night_stay_location ||
//                                             day.nightStayLocation ||
//                                             day.summary ||
//                                             `Day ${day.day_number ?? index + 1}`;

//                                         const { dayLegs, dayStays, dayAttractions, dayDining } =
//                                             getItemsForDay(day.id);

//                                         return (
//                                             <div
//                                                 key={day.id}
//                                                 className={`rounded-2xl border transition-all overflow-hidden ${isOpen
//                                                     ? 'border-blue-500 bg-white dark:bg-slate-900 shadow-md'
//                                                     : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
//                                                     }`}
//                                             >
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => handleMobileDayToggle(day.id)}
//                                                     className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
//                                                 >
//                                                     <div className="flex items-center gap-3 min-w-0">
//                                                         <div
//                                                             className={`px-2.5 py-1.5 rounded-xl text-center shrink-0 ${isOpen
//                                                                 ? 'bg-blue-600 text-white'
//                                                                 : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
//                                                                 }`}
//                                                         >
//                                                             <p className="text-[10px] font-extrabold uppercase">
//                                                                 Day {day.day_number ?? index + 1}
//                                                             </p>
//                                                             <p className="text-[11px] font-bold">{shortDate}</p>
//                                                         </div>

//                                                         <div className="min-w-0">
//                                                             <p className="text-xs font-semibold text-slate-400">
//                                                                 {weekday}
//                                                             </p>
//                                                             <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1">
//                                                                 <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
//                                                                 <span>{locationName}</span>
//                                                             </p>
//                                                         </div>
//                                                     </div>

//                                                     <ChevronDown
//                                                         className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''
//                                                             }`}
//                                                     />
//                                                 </button>

//                                                 {isOpen && (
//                                                     <div className="px-3 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
//                                                         <DayLogisticsCards
//                                                             day={day}
//                                                             legs={dayLegs}
//                                                             accommodations={dayStays}
//                                                             attractions={dayAttractions}
//                                                             diningSpots={dayDining}
//                                                         />
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                 </div>

//                                 {/* DESKTOP & TABLET VIEW (md+): Left Days Sidebar + Right Cards */}
//                                 <div className="hidden md:grid md:grid-cols-12 gap-6 items-start print:hidden">
//                                     <aside className="md:col-span-4 sticky top-20 space-y-2 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
//                                         <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1 mb-2">
//                                             Itinerary Days
//                                         </h2>
//                                         {days.map((day, index) => {
//                                             const isSelected = selectedDay?.id === day.id;
//                                             const { shortDate, weekday } = formatReadableDate(day.date);
//                                             const locationName =
//                                                 day.night_stay_location ||
//                                                 day.nightStayLocation ||
//                                                 day.summary ||
//                                                 `Day ${day.day_number ?? index + 1}`;

//                                             return (
//                                                 <button
//                                                     key={day.id}
//                                                     type="button"
//                                                     onClick={() => setSelectedDayId(day.id)}
//                                                     className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${isSelected
//                                                         ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
//                                                         : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-200'
//                                                         }`}
//                                                 >
//                                                     <div
//                                                         className={`px-2.5 py-1.5 rounded-xl text-center shrink-0 ${isSelected
//                                                             ? 'bg-white/20 text-white'
//                                                             : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
//                                                             }`}
//                                                     >
//                                                         <p className="text-[10px] font-extrabold uppercase">
//                                                             Day {day.day_number ?? index + 1}
//                                                         </p>
//                                                         <p className="text-xs font-bold">{shortDate}</p>
//                                                     </div>

//                                                     <div className="min-w-0 flex-1">
//                                                         <p
//                                                             className={`text-[11px] font-medium flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'
//                                                                 }`}
//                                                         >
//                                                             <Calendar className="w-3 h-3" />
//                                                             {weekday}
//                                                         </p>
//                                                         <p className="text-sm font-extrabold truncate mt-0.5 flex items-center gap-1">
//                                                             <MapPin
//                                                                 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-rose-500'
//                                                                     }`}
//                                                             />
//                                                             <span>{locationName}</span>
//                                                         </p>
//                                                     </div>
//                                                 </button>
//                                             );
//                                         })}
//                                     </aside>

//                                     <section className="md:col-span-8">
//                                         {selectedDay && (() => {
//                                             const { dayLegs, dayStays, dayAttractions, dayDining } =
//                                                 getItemsForDay(selectedDay.id);
//                                             return (
//                                                 <DayLogisticsCards
//                                                     day={selectedDay}
//                                                     legs={dayLegs}
//                                                     accommodations={dayStays}
//                                                     attractions={dayAttractions}
//                                                     diningSpots={dayDining}
//                                                 />
//                                             );
//                                         })()}
//                                     </section>
//                                 </div>

//                                 {/* PRINT LAYOUT: Renders all days sequentially when printing */}
//                                 <div className="hidden print:block space-y-6">
//                                     {days.map((day, index) => {
//                                         const { dayLegs, dayStays, dayAttractions, dayDining } =
//                                             getItemsForDay(day.id);
//                                         const { fullDate } = formatReadableDate(day.date);
//                                         return (
//                                             <div key={day.id} className="space-y-2 break-inside-avoid">
//                                                 <h3 className="text-base font-extrabold border-b pb-1">
//                                                     Day {day.day_number ?? index + 1} — {fullDate}
//                                                 </h3>
//                                                 <DayLogisticsCards
//                                                     day={day}
//                                                     legs={dayLegs}
//                                                     accommodations={dayStays}
//                                                     attractions={dayAttractions}
//                                                     diningSpots={dayDining}
//                                                 />
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </>
//                         )}
//                     </>
//                 )}
//             </main>
//         </div>
//     );
// }



'use client';

import React, { useState, useEffect, useMemo, use, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { getTripItineraryDays } from '@/app/actions/itineraryDays';
import { fetchTripOthersDetails } from '@/lib/itinerary/othersDetailsClient';
import { formatReadableDate, buildGoogleMapsUrl } from '@/lib/travel/viewHelpers';
import DayLogisticsCards from '@/components/travel/DayLogisticsCards';
import { RouteStopPoint } from '@/components/travel/FullTripRouteMap';
import { ActionButton } from '@/components/ui/FormControls';
import {
    Calendar,
    MapPin,
    ChevronDown,
    Compass,
    Loader2,
    AlertCircle,
    Search,
    Printer,
    Share2,
    Check,
    Map as MapIcon,
    Navigation,
    Send,
} from 'lucide-react';

const DynamicFullTripRouteMap = dynamic(
    () => import('@/components/travel/FullTripRouteMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-400">
                Loading route map...
            </div>
        ),
    }
);

function getTripDisplayTitle(trip: any): string {
    return (
        trip?.title ||
        trip?.name ||
        trip?.trip_name ||
        trip?.destination ||
        'Untitled Trip'
    );
}

function getTripSubtitle(trip: any): string {
    return (
        trip?.destination ||
        trip?.route_summary ||
        trip?.summary ||
        (trip?.start_date ? `Starts ${trip.start_date}` : 'Custom Route')
    );
}

export default function UserTravelViewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const routeUserId = resolvedParams.id;
    const supabase = createClient();

    // User's created trips & form selection state
    const [userTrips, setUserTrips] = useState<any[]>([]);
    const [selectedTripOption, setSelectedTripOption] = useState<string>('');
    const [loadedTripId, setLoadedTripId] = useState<string>('');
    const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(true);

    // Loaded itinerary & logistics state
    const [days, setDays] = useState<any[]>([]);
    const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
    const [mobileOpenDayId, setMobileOpenDayId] = useState<string | null>(null);

    const [legs, setLegs] = useState<any[]>([]);
    const [accommodations, setAccommodations] = useState<any[]>([]);
    const [attractions, setAttractions] = useState<any[]>([]);
    const [diningSpots, setDiningSpots] = useState<any[]>([]);

    // UI helpers
    const [searchTerm, setSearchTerm] = useState('');
    const [showFullRouteMap, setShowFullRouteMap] = useState(true);
    const [copiedShare, setCopiedShare] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch trips created by the user
    useEffect(() => {
        let cancelled = false;

        async function fetchUserTrips() {
            setIsLoadingTrips(true);
            setErrorMessage(null);

            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                const ownerId = user?.id || routeUserId;
                if (!ownerId) {
                    throw new Error('Unable to identify user account.');
                }

                const { data, error } = await supabase
                    .from('trips')
                    .select('*')
                    .eq('owner_id', ownerId);

                if (error) {
                    throw new Error(
                        error.message ||
                        error.details ||
                        error.hint ||
                        `Supabase query failed (${error.code || 'unknown'})`
                    );
                }

                if (cancelled) return;

                const tripsList = Array.isArray(data) ? data : [];
                setUserTrips(tripsList);

                if (tripsList.length > 0) {
                    setSelectedTripOption(tripsList[0].id);
                }
            } catch (err: any) {
                if (cancelled) return;
                const msg =
                    err?.message ||
                    err?.error_description ||
                    (typeof err === 'string' ? err : 'Failed to load your trips.');
                console.error('Error fetching user trips:', msg);
                setErrorMessage(msg);
            } finally {
                if (!cancelled) setIsLoadingTrips(false);
            }
        }

        fetchUserTrips();
        return () => {
            cancelled = true;
        };
    }, [supabase, routeUserId]);

    // Load days & TiDB logistics for the chosen trip
    const loadTripData = useCallback(async (targetTripId: string) => {
        if (!targetTripId) return;

        setIsLoadingDetails(true);
        setErrorMessage(null);

        try {
            const [daysData, details] = await Promise.all([
                getTripItineraryDays(targetTripId),
                fetchTripOthersDetails(targetTripId),
            ]);

            const orderedDays = Array.isArray(daysData) ? daysData : [];
            setLoadedTripId(targetTripId);
            setDays(orderedDays);
            setLegs(details.travelLegs);
            setAccommodations(details.accommodations);
            setAttractions(details.attractions);
            setDiningSpots(details.diningSpots);

            if (orderedDays.length > 0) {
                setSelectedDayId(orderedDays[0].id);
            } else {
                setSelectedDayId(null);
            }
            setMobileOpenDayId(null);
        } catch (err: any) {
            const msg = err?.message || 'Failed to load trip details.';
            console.error('Error loading trip details:', msg);
            setErrorMessage(msg);
        } finally {
            setIsLoadingDetails(false);
        }
    }, []);

    const handleTripFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTripOption) {
            setErrorMessage('Please select a trip first.');
            return;
        }
        await loadTripData(selectedTripOption);
    };

    const activeTrip = useMemo(
        () => userTrips.find((t) => t.id === loadedTripId) || null,
        [userTrips, loadedTripId]
    );

    // Build ordered route stops across the trip
    const fullTripRoutePoints = useMemo<RouteStopPoint[]>(() => {
        const dayOrderMap = new Map<string, number>();
        days.forEach((d, idx) => {
            dayOrderMap.set(d.id, Number(d.day_number ?? d.dayNumber ?? idx + 1));
        });

        const points: RouteStopPoint[] = [];

        const sortedLegs = [...legs].sort((a, b) => {
            const dayA = dayOrderMap.get(a.dayId ?? a.day_id) ?? 999;
            const dayB = dayOrderMap.get(b.dayId ?? b.day_id) ?? 999;
            if (dayA !== dayB) return dayA - dayB;
            return (
                Number(a.sequenceOrder ?? a.sequence_order ?? 1) -
                Number(b.sequenceOrder ?? b.sequence_order ?? 1)
            );
        });

        sortedLegs.forEach((leg, i) => {
            const dNum = dayOrderMap.get(leg.dayId ?? leg.day_id);
            const oLat = leg.originLat ?? leg.origin_lat;
            const oLng = leg.originLng ?? leg.origin_lng;
            if (oLat != null && oLng != null) {
                points.push({
                    id: `${leg.id}-origin-${i}`,
                    label: leg.originName ?? leg.origin_name ?? 'Origin',
                    sublabel: `${(leg.mode || 'car').toUpperCase()} departure`,
                    lat: Number(oLat),
                    lng: Number(oLng),
                    kind: 'origin',
                    dayNumber: dNum,
                });
            }

            const dLat = leg.destinationLat ?? leg.destination_lat;
            const dLng = leg.destinationLng ?? leg.destination_lng;
            if (dLat != null && dLng != null) {
                points.push({
                    id: `${leg.id}-dest-${i}`,
                    label: leg.destinationName ?? leg.destination_name ?? 'Destination',
                    sublabel: `${(leg.mode || 'car').toUpperCase()} arrival`,
                    lat: Number(dLat),
                    lng: Number(dLng),
                    kind: 'destination',
                    dayNumber: dNum,
                });
            }
        });

        accommodations.forEach((stay) => {
            if (stay.latitude != null && stay.longitude != null) {
                points.push({
                    id: `stay-${stay.id}`,
                    label: stay.name,
                    sublabel: stay.placeName ?? stay.place_name ?? 'Stay',
                    lat: Number(stay.latitude),
                    lng: Number(stay.longitude),
                    kind: 'stay',
                    dayNumber: dayOrderMap.get(stay.dayId ?? stay.day_id),
                });
            }
        });

        attractions.forEach((spot) => {
            if (spot.latitude != null && spot.longitude != null) {
                points.push({
                    id: `spot-${spot.id}`,
                    label: spot.name,
                    sublabel: 'Attraction',
                    lat: Number(spot.latitude),
                    lng: Number(spot.longitude),
                    kind: 'attraction',
                    dayNumber: dayOrderMap.get(spot.dayId ?? spot.day_id),
                });
            }
        });

        diningSpots.forEach((meal) => {
            if (meal.latitude != null && meal.longitude != null) {
                points.push({
                    id: `meal-${meal.id}`,
                    label: meal.name,
                    sublabel: meal.category || 'Dining',
                    lat: Number(meal.latitude),
                    lng: Number(meal.longitude),
                    kind: 'dining',
                    dayNumber: dayOrderMap.get(meal.dayId ?? meal.day_id),
                });
            }
        });

        return points;
    }, [days, legs, accommodations, attractions, diningSpots]);

    const fullGoogleMapsRouteUrl = useMemo(() => {
        if (fullTripRoutePoints.length === 0) {
            return 'https://www.google.com/maps';
        }
        if (fullTripRoutePoints.length === 1) {
            const only = fullTripRoutePoints[0];
            return buildGoogleMapsUrl({ lat: only.lat, lng: only.lng, query: only.label });
        }

        const first = fullTripRoutePoints[0];
        const last = fullTripRoutePoints[fullTripRoutePoints.length - 1];
        const middleWaypoints = fullTripRoutePoints
            .slice(1, -1)
            .slice(0, 8)
            .map((p) => `${p.lat},${p.lng}`)
            .join('|');

        const base = `https://www.google.com/maps/dir/?api=1&origin=${first.lat},${first.lng}&destination=${last.lat},${last.lng}`;
        return middleWaypoints
            ? `${base}&waypoints=${encodeURIComponent(middleWaypoints)}`
            : base;
    }, [fullTripRoutePoints]);

    const handleShareLink = async () => {
        try {
            const shareUrl = window.location.href;
            if (navigator.share) {
                await navigator.share({
                    title: activeTrip ? getTripDisplayTitle(activeTrip) : 'My Travel Itinerary',
                    text: `Check out my trip itinerary: ${activeTrip ? getTripDisplayTitle(activeTrip) : ''}`,
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                setCopiedShare(true);
                setTimeout(() => setCopiedShare(false), 2500);
            }
        } catch {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopiedShare(true);
                setTimeout(() => setCopiedShare(false), 2500);
            } catch {
                // Ignore clipboard errors
            }
        }
    };

    const handlePrintPage = () => {
        window.print();
    };

    const getItemsForDay = (dayId: string) => {
        const matchesSearch = (item: any) => {
            if (!searchTerm.trim()) return true;
            return JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
        };

        const byDay = (item: any) => (item?.dayId ?? item?.day_id) === dayId;

        return {
            dayLegs: legs.filter((i) => byDay(i) && matchesSearch(i)),
            dayStays: accommodations.filter((i) => byDay(i) && matchesSearch(i)),
            dayAttractions: attractions.filter((i) => byDay(i) && matchesSearch(i)),
            dayDining: diningSpots.filter((i) => byDay(i) && matchesSearch(i)),
        };
    };

    const selectedDay = useMemo(
        () => days.find((d) => d.id === selectedDayId) || days[0] || null,
        [days, selectedDayId]
    );

    const handleMobileDayToggle = (dayId: string) => {
        setMobileOpenDayId((prev) => (prev === dayId ? null : dayId));
        setSelectedDayId(dayId);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 print:bg-white">
            {/* Top Header */}
            <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:static">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                                {activeTrip ? getTripDisplayTitle(activeTrip) : 'My Travel Itinerary'}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {activeTrip
                                    ? `${getTripSubtitle(activeTrip)} • ${days.length} Days`
                                    : 'Select one of your created trips to view full details'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 print:hidden">
                        <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={handleShareLink}
                            className="text-xs"
                        >
                            {copiedShare ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Link Copied</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Share</span>
                                </>
                            )}
                        </ActionButton>

                        <ActionButton
                            type="button"
                            variant="primary"
                            onClick={handlePrintPage}
                            className="text-xs"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                        </ActionButton>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
                {/* Trip Selector + Submit Form */}
                <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm print:hidden">
                    {isLoadingTrips ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span>Loading your created trips...</span>
                        </div>
                    ) : userTrips.length === 0 ? (
                        <p className="text-xs text-slate-500">
                            No trips found under your account yet. Create a trip first to view its itinerary.
                        </p>
                    ) : (
                        <form
                            onSubmit={handleTripFormSubmit}
                            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
                        >
                            <div className="flex-1 space-y-1">
                                <label
                                    htmlFor="user-trip-select"
                                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                >
                                    Select Your Trip
                                </label>
                                <select
                                    id="user-trip-select"
                                    value={selectedTripOption}
                                    onChange={(e) => setSelectedTripOption(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {userTrips.map((trip) => (
                                        <option key={trip.id} value={trip.id}>
                                            {getTripDisplayTitle(trip)}
                                            {trip.start_date ? ` (${trip.start_date})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {loadedTripId && (
                                <div className="sm:w-56 space-y-1">
                                    <label
                                        htmlFor="trip-filter-input"
                                        className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                    >
                                        Filter Items
                                    </label>
                                    <div className="relative">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            id="trip-filter-input"
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Hotel, train, place..."
                                            className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <ActionButton
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={isLoadingDetails || !selectedTripOption}
                                className="sm:px-5 py-2.5 justify-center shrink-0"
                            >
                                {isLoadingDetails ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Show Trip</span>
                                    </>
                                )}
                            </ActionButton>
                        </form>
                    )}
                </section>

                {errorMessage && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {!loadedTripId && !isLoadingDetails && userTrips.length > 0 && (
                    <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                            Choose a trip from the dropdown above and click <strong>Show Trip</strong> to load your route and daily plan.
                        </p>
                    </div>
                )}

                {loadedTripId && !isLoadingDetails && (
                    <>
                        {/* Full-Trip Route Map */}
                        <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                                        <MapIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                                            Full Trip Route Overview
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Combined path across legs, stays, attractions, and dining stops
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 print:hidden">
                                    <a
                                        href={fullGoogleMapsRouteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        Full Route in Google Maps
                                    </a>

                                    <ActionButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setShowFullRouteMap((prev) => !prev)}
                                        className="text-xs"
                                    >
                                        {showFullRouteMap ? 'Hide Map' : 'Show Map'}
                                    </ActionButton>
                                </div>
                            </div>

                            {showFullRouteMap && (
                                <DynamicFullTripRouteMap points={fullTripRoutePoints} />
                            )}
                        </section>

                        {days.length === 0 ? (
                            <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    No itinerary days found for this trip.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* MOBILE VIEW (< md) */}
                                <div className="md:hidden space-y-3 print:hidden">
                                    {days.map((day, index) => {
                                        const isOpen = mobileOpenDayId === day.id;
                                        const { shortDate, weekday } = formatReadableDate(day.date);
                                        const locationName =
                                            day.night_stay_location ||
                                            day.nightStayLocation ||
                                            day.summary ||
                                            `Day ${day.day_number ?? index + 1}`;

                                        const { dayLegs, dayStays, dayAttractions, dayDining } =
                                            getItemsForDay(day.id);

                                        return (
                                            <div
                                                key={day.id}
                                                className={`rounded-2xl border transition-all overflow-hidden ${isOpen
                                                    ? 'border-blue-500 bg-white dark:bg-slate-900 shadow-md'
                                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                                                    }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleMobileDayToggle(day.id)}
                                                    className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div
                                                            className={`px-2.5 py-1.5 rounded-xl text-center shrink-0 ${isOpen
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                                                                }`}
                                                        >
                                                            <p className="text-[10px] font-extrabold uppercase">
                                                                Day {day.day_number ?? index + 1}
                                                            </p>
                                                            <p className="text-[11px] font-bold">{shortDate}</p>
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-xs font-semibold text-slate-400">
                                                                {weekday}
                                                            </p>
                                                            <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1">
                                                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                                <span>{locationName}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <ChevronDown
                                                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''
                                                            }`}
                                                    />
                                                </button>

                                                {isOpen && (
                                                    <div className="px-3 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                                                        <DayLogisticsCards
                                                            day={day}
                                                            legs={dayLegs}
                                                            accommodations={dayStays}
                                                            attractions={dayAttractions}
                                                            diningSpots={dayDining}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* DESKTOP & TABLET VIEW (md+) */}
                                <div className="hidden md:grid md:grid-cols-12 gap-6 items-start print:hidden">
                                    <aside className="md:col-span-4 sticky top-20 space-y-2 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
                                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-1 mb-2">
                                            Itinerary Days
                                        </h2>
                                        {days.map((day, index) => {
                                            const isSelected = selectedDay?.id === day.id;
                                            const { shortDate, weekday } = formatReadableDate(day.date);
                                            const locationName =
                                                day.night_stay_location ||
                                                day.nightStayLocation ||
                                                day.summary ||
                                                `Day ${day.day_number ?? index + 1}`;

                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    onClick={() => setSelectedDayId(day.id)}
                                                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center gap-3 ${isSelected
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-200'
                                                        }`}
                                                >
                                                    <div
                                                        className={`px-2.5 py-1.5 rounded-xl text-center shrink-0 ${isSelected
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                            }`}
                                                    >
                                                        <p className="text-[10px] font-extrabold uppercase">
                                                            Day {day.day_number ?? index + 1}
                                                        </p>
                                                        <p className="text-xs font-bold">{shortDate}</p>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p
                                                            className={`text-[11px] font-medium flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'
                                                                }`}
                                                        >
                                                            <Calendar className="w-3 h-3" />
                                                            {weekday}
                                                        </p>
                                                        <p className="text-sm font-extrabold truncate mt-0.5 flex items-center gap-1">
                                                            <MapPin
                                                                className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-rose-500'
                                                                    }`}
                                                            />
                                                            <span>{locationName}</span>
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </aside>

                                    <section className="md:col-span-8">
                                        {selectedDay && (() => {
                                            const { dayLegs, dayStays, dayAttractions, dayDining } =
                                                getItemsForDay(selectedDay.id);
                                            return (
                                                <DayLogisticsCards
                                                    day={selectedDay}
                                                    legs={dayLegs}
                                                    accommodations={dayStays}
                                                    attractions={dayAttractions}
                                                    diningSpots={dayDining}
                                                />
                                            );
                                        })()}
                                    </section>
                                </div>

                                {/* PRINT VIEW */}
                                <div className="hidden print:block space-y-6">
                                    {days.map((day, index) => {
                                        const { dayLegs, dayStays, dayAttractions, dayDining } =
                                            getItemsForDay(day.id);
                                        const { fullDate } = formatReadableDate(day.date);
                                        return (
                                            <div key={day.id} className="space-y-2 break-inside-avoid">
                                                <h3 className="text-base font-extrabold border-b pb-1">
                                                    Day {day.day_number ?? index + 1} — {fullDate}
                                                </h3>
                                                <DayLogisticsCards
                                                    day={day}
                                                    legs={dayLegs}
                                                    accommodations={dayStays}
                                                    attractions={dayAttractions}
                                                    diningSpots={dayDining}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}