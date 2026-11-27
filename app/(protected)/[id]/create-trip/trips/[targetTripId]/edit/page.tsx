

// app/(protected)/[id]/create-trip/[targetTripId]/edit/page.tsx
'use client';
import React, { useState, useEffect, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Building2, Utensils, MapPin, ArrowLeft, Compass, AlertCircle, Car } from 'lucide-react';
import OthersItemList from '@/components/creator/OthersItemList';
import OthersFormPanel from '@/components/creator/OthersFormPanel';

export type ActiveTabType = 'leg' | 'accommodation' | 'attraction' | 'dining';

import {
    getTripItineraryDays,
    createItineraryDay,
    updateItineraryDayDetails,
    updateItineraryDayDate,
    reorderItineraryDays,
    deleteItineraryDay,
} from '@/app/actions/itineraryDays';

import DaysTimelinePane, {
    ExtendedItineraryDay,
    DayExtraItem,
    DayFormInput,
} from '@/components/creator/DaysTimelinePane';
import { ActionButton } from '@/components/ui/FormControls';
import TripHeader from '@/app/(protected)/[id]/_components/TripHeader';
export type { DayExtraItem, ExtendedItineraryDay };




// Main Functions
// export default function DesktopCreatorPortal({
//     params,
// }: {
//     params: Promise<{ targetTripId: string; id: string }>;
// }) {
//     const resolvedParams = use(params);
//     const tripId = resolvedParams.targetTripId;
//     const id = resolvedParams.id;
//     const supabase = createClient();

//     const [days, setDays] = useState<ExtendedItineraryDay[]>([]);
//     const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
//     const [legsCountByDayId, setLegsCountByDayId] = useState<Record<string, number>>({});



//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isCreatingDay, setIsCreatingDay] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [mobileView, setMobileView] = useState<'days' | 'list' | 'form'>('days');



//     const [activeTab, setActiveTab] = useState<ActiveTabType>('accommodation');

//     // Data lists for the selected day/trip
//     const [accommodations, setAccommodations] = useState<any[]>([]);
//     const [attractions, setAttractions] = useState<any[]>([]);
//     const [diningSpots, setDiningSpots] = useState<any[]>([]);
//     const [legs, setLegs] = useState<any[]>([]);

//     // Selected item for editing (null means creating new)
//     const [selectedItem, setSelectedItem] = useState<any | null>(null);
//     const [successMessage, setSuccessMessage] = useState<string | null>(null);

//     useEffect(() => {
//         if (!tripId) return;
//         let cancelled = false;

//         async function loadDays() {
//             try {
//                 const daysData = await getTripItineraryDays(tripId);
//                 if (cancelled) return;

//                 const typedDays = (daysData || []) as ExtendedItineraryDay[];
//                 setDays(typedDays);

//                 if (typedDays.length > 0) {
//                     setSelectedDayId((prev) =>
//                         prev && typedDays.some((d) => d.id === prev) ? prev : typedDays[0].id
//                     );
//                 } else {
//                     setSelectedDayId(null);
//                 }
//             } catch (err: any) {
//                 if (cancelled) return;
//                 console.error('Error fetching itinerary days:', err);
//                 setErrorMessage(err.message || 'Failed to load itinerary dates.');
//             }
//         }

//         loadDays();
//         return () => {
//             cancelled = true;
//         };
//     }, [tripId]);


//     useEffect(() => {
//         if (!tripId) return;
//         let cancelled = false;

//         async function loadOthersDetails() {
//             try {
//                 const query = selectedDayId
//                     ? `?dayId=${encodeURIComponent(selectedDayId)}`
//                     : '';
//                 const res = await fetch(`/api/trips/${tripId}/others-details${query}`);
//                 if (!res.ok) throw new Error('Failed to fetch supplementary trip details');
//                 const json = await res.json();

//                 if (cancelled) return;
//                 setAccommodations(json.accommodations || []);
//                 setAttractions(json.attractions || []);
//                 setDiningSpots(json.diningSpots || []);
//                 setLegs(json.travelLegs || []);
//             } catch (err: any) {
//                 if (cancelled) return;
//                 console.error('Error fetching TiDB data:', err);
//                 setErrorMessage(err.message);
//             }
//         }

//         loadOthersDetails();
//         return () => {
//             cancelled = true;
//         };
//     }, [tripId, selectedDayId]);

//     // Fetch Trip Days from Supabase
//     useEffect(() => {
//         async function fetchTripDays() {
//             const { data, error } = await supabase
//                 .from('itinerary_days')
//                 .select('*')
//                 .eq('trip_id', tripId)
//                 .order('day_number', { ascending: true });

//             if (error) {
//                 console.error('Error fetching days from Supabase:', error);
//                 setErrorMessage('Failed to load trip days.');
//                 return;
//             }

//             if (data && data.length > 0) {
//                 setDays(data);
//                 setSelectedDayId(data[0].id);
//             }
//         }
//         fetchTripDays();
//     }, [tripId, supabase]);

//     // Fetch TiDB Data (Accommodations, Attractions, Dining Spots)
//     const fetchTiDBData = async () => {
//         if (!tripId) return;
//         try {
//             const res = await fetch(`/api/trips/${tripId}/others-details`);
//             // console.log(res)
//             if (!res.ok) throw new Error('Failed to fetch supplementary trip details');
//             const json = await res.json();

//             setAccommodations(json.accommodations || []);
//             setAttractions(json.attractions || []);
//             setDiningSpots(json.diningSpots || []);
//             setLegs(json.travelLegs || []);
//         } catch (err: any) {
//             console.error('Error fetching TiDB data:', err);
//             setErrorMessage(err.message);
//         }
//     };

//     useEffect(() => {
//         fetchTiDBData();
//     }, [tripId, selectedDayId]);

//     // useEffect(() => {
//     //     if (!tripId) return;
//     //     let cancelled = false;

//     //     async function loadDays() {
//     //         try {
//     //             const daysData = await getTripItineraryDays(tripId);
//     //             if (cancelled) return;

//     //             const typedDays = (daysData || []) as ExtendedItineraryDay[];
//     //             setDays(typedDays);

//     //             if (typedDays.length > 0) {
//     //                 setSelectedDayId((prev) =>
//     //                     prev && typedDays.some((d) => d.id === prev) ? prev : typedDays[0].id
//     //                 );
//     //             } else {
//     //                 setSelectedDayId(null);
//     //             }
//     //         } catch (err: any) {
//     //             if (cancelled) return;
//     //             console.error('Error fetching itinerary days:', err);
//     //             setErrorMessage(err.message || 'Failed to load itinerary dates.');
//     //         }
//     //     }

//     //     loadDays();
//     //     return () => {
//     //         cancelled = true;
//     //     };
//     // }, [tripId]);

//     // Handle form submission to TiDB API endpoint
//     const handleSaveItem = async (formData: any) => {
//         setIsSubmitting(true);
//         setErrorMessage(null);
//         setSuccessMessage(null);

//         try {
//             const endpoint = `/api/trips/${tripId}/others-details`;
//             const method = selectedItem?.id ? 'PUT' : 'POST';

//             const payload = {
//                 ...formData,
//                 tripId: tripId,
//                 dayId: selectedDayId,
//                 type: activeTab, // 'accommodation' | 'attraction' | 'dining'|'leg'
//                 id: selectedItem?.id || undefined,
//             };

//             const res = await fetch(endpoint, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });

//             if (!res.ok) {
//                 const errJson = await res.json();
//                 throw new Error(errJson.error || 'Failed to save record.');
//             }

//             setSuccessMessage('Successfully saved record!');
//             setSelectedItem(null);
//             await fetchTiDBData();
//             setTimeout(() => setSuccessMessage(null), 3000);

//             // Return to list view on mobile after successful save
//             setMobileView('list');
//         } catch (err: any) {
//             setErrorMessage(err.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Handle item deletion
//     const handleDeleteItem = async (id: string, type: ActiveTabType) => {
//         if (!confirm('Are you sure you want to delete this item?')) return;
//         try {
//             const res = await fetch(`/api/trips/${tripId}/others-details?id=${id}&type=${type}`, {
//                 method: 'DELETE',
//             });
//             if (!res.ok) throw new Error('Failed to delete item.');
//             await fetchTiDBData();
//             if (selectedItem?.id === id) setSelectedItem(null);
//         } catch (err: any) {
//             setErrorMessage(err.message);
//         }
//     };

//     const syncDayState = (day: ExtendedItineraryDay) => {
//         setSelectedDayId(day.id);
//         const meta = day.day_metadata || {};
//     };

//     const handleSelectDay = (day: ExtendedItineraryDay) => {
//         syncDayState(day);
//         setMobileView('list');
//     };


//     // This functioned required to tripid wise date fatching
//     useEffect(() => {
//         async function fetchTripData() {
//             try {
//                 const daysData = await getTripItineraryDays(tripId);
//                 if (daysData && daysData.length > 0) {
//                     const typedDays = daysData as ExtendedItineraryDay[];
//                     setDays(typedDays);
//                 }
//             } catch (err: any) {
//                 console.error('Error fetching itinerary days from TiDB:', err);
//                 setErrorMessage(err.message || 'Failed to load itinerary dates.');
//             }
//         }
//         fetchTripData();
//     }, [tripId, supabase]);




//     const handleReorderDays = async (reorderedDays: ExtendedItineraryDay[]) => {
//         setDays(reorderedDays);
//         try {
//             await reorderItineraryDays(
//                 reorderedDays.map((d) => ({
//                     id: d.id,
//                     day_number: d.day_number,
//                     date: d.date,
//                 }))
//             );
//             // showToast('Dates reordered; all linked stays & legs preserved');
//         } catch (err: any) {
//             setErrorMessage(err.message || 'Failed to reorder dates.');
//         }
//     };

//     const handleSyncSubsequentDates = async (recalculatedDays: ExtendedItineraryDay[]) => {
//         setDays(recalculatedDays);
//         try {
//             await reorderItineraryDays(
//                 recalculatedDays.map((d) => ({
//                     id: d.id,
//                     day_number: d.day_number,
//                     date: d.date,
//                 }))
//             );
//             // showToast('All subsequent dates updated from Day 1');
//         } catch (err: any) {
//             setErrorMessage(err.message || 'Failed to sync dates.');
//         }
//     };

//     const handleCreateDaySubmit = async (input: DayFormInput) => {
//         setIsCreatingDay(true);
//         setErrorMessage(null);
//         const nextDayNumber = days.length + 1;

//         try {
//             const newDay = await createItineraryDay({
//                 tripId,
//                 dayNumber: nextDayNumber,
//                 date: input.date,
//                 summary: input.nightStayLocation || `Day ${nextDayNumber}`,
//             });

//             await updateItineraryDayDetails(newDay.id, {
//                 nightStayLocation: input.nightStayLocation || null,
//                 nightStayNotes: input.nightStayNotes || null,
//                 dailyNotes: input.dailyNotes || '',

//             });

//             const createdTyped: ExtendedItineraryDay = {
//                 ...newDay,
//                 night_stay_location: input.nightStayLocation || null,
//                 night_stay_notes: input.nightStayNotes || null,
//                 daily_notes: input.dailyNotes || '',

//             };

//             setDays((prev) => [...prev, createdTyped]);
//             // showToast(`Created Day ${nextDayNumber}`);
//         } catch (err: any) {
//             setErrorMessage(err.message || 'Failed to create date.');
//         } finally {
//             setIsCreatingDay(false);
//         }
//     };

//     const handleUpdateDaySubmit = async (input: DayFormInput) => {
//         if (!input.id) return;
//         setIsSubmitting(true);
//         setErrorMessage(null);

//         const activeDay = days.find((d) => d.id === input.id);

//         try {
//             await updateItineraryDayDate(input.id, input.date);
//             await updateItineraryDayDetails(input.id, {
//                 nightStayLocation: input.nightStayLocation || null,
//                 nightStayNotes: input.nightStayNotes || null,
//                 dailyNotes: input.dailyNotes || '',
//             });

//             setDays((prev) =>
//                 prev.map((d) =>
//                     d.id === input.id
//                         ? {
//                             ...d,
//                             date: input.date,
//                             night_stay_location: input.nightStayLocation || null,
//                             night_stay_notes: input.nightStayNotes || null,
//                             daily_notes: input.dailyNotes || '',
//                         }
//                         : d
//                 )
//             );

//         } catch (err: any) {
//             setErrorMessage(err.message || 'Failed to update date.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleDeleteDay = async (dayId: string) => {
//         setErrorMessage(null);

//         const remaining = days
//             .filter((d) => d.id !== dayId)
//             .map((d, idx) => ({ ...d, day_number: idx + 1 }));

//         try {
//             await supabase.from('travel_legs').delete().eq('day_id', dayId);
//             await deleteItineraryDay(
//                 dayId,
//                 remaining.map((d) => ({ id: d.id, day_number: d.day_number }))
//             );

//             setDays(remaining);
//             if (selectedDayId === dayId) {
//                 setSelectedDayId(null);
//             }

//         } catch (err: any) {
//             setErrorMessage(err.message || 'Failed to delete date.');
//         }
//     };


//     return (
//         <div className="min-h-screen w-full flex justify-center bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans px-0 sm:px-4">
//             {/* Centered Workspace Container */}
//             <div className="h-screen w-full max-w-7xl mx-auto flex flex-col bg-white dark:bg-slate-950 sm:border-x border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//                 {/* Top Header */}
//                 <TripHeader tripId={tripId} id={id} />

//                 {/* Mobile Step Switcher Bar */}
//                 <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 shrink-0 text-xs">
//                     <div className="flex items-center gap-2">
//                         {mobileView !== 'days' && (
//                             <ActionButton
//                                 type="button"
//                                 variant="secondary"
//                                 onClick={() => setMobileView(mobileView === 'form' ? 'list' : 'days')}
//                             >
//                                 <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                                 <span>Back</span>
//                             </ActionButton>
//                         )}
//                         <span className="font-bold">
//                             {mobileView === 'days' && '1. Dates'}
//                             {mobileView === 'list' && '2. Day Plan'}
//                         </span>

//                     </div>
//                     <div className="flex gap-1">
//                         {(['days', 'list', 'form'] as const).map((step, i) => (
//                             <ActionButton
//                                 key={step}
//                                 type="button"
//                                 variant={mobileView === step ? 'primary' : 'secondary'}
//                                 onClick={() => setMobileView(step)}
//                                 className="capitalize"
//                             >
//                                 {i + 1}. {step === 'days' ? 'Dates' : step === 'list' ? 'Plan' : 'Leg'}
//                             </ActionButton>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Centered 3-Pane Workspace: Wider Day Cards (5 cols) + Compact Forms (4 & 3 cols) */}
//                 <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
//                     {/* Pane 1: Wider Dates Timeline (4 of 12 columns) */}
//                     <div
//                         className={`lg:col-span-4 h-full overflow-hidden ${mobileView === 'days' ? 'block' : 'hidden lg:block'
//                             }`}
//                     >

//                         <DaysTimelinePane
//                             days={days}
//                             selectedDayId={selectedDayId}
//                             legsCountByDayId={legsCountByDayId}// required to delete after checking
//                             onSelectDay={handleSelectDay}
//                             onCreateDaySubmit={handleCreateDaySubmit}
//                             onUpdateDaySubmit={handleUpdateDaySubmit}
//                             onSyncSubsequentDates={handleSyncSubsequentDates}
//                             onReorderDays={handleReorderDays}
//                             onDeleteDay={handleDeleteDay}
//                             isSavingDay={isCreatingDay || isSubmitting}
//                         />
//                     </div>



//                     {/* Pane 2: Compact Add Leg Section (4 of 12 columns) */}
//                     <main className={`lg:col-span-5 h-full p-4 md:p-5 bg-white dark:bg-slate-900 overflow-y-auto space-y-4 ${mobileView === 'form' ? 'block' : 'hidden lg:block'}`}>
//                         {/* Top Navigation Header */}
//                         <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0">
//                             <div className="flex items-center gap-2">
//                                 <Compass className="w-5 h-5 text-blue-600 shrink-0" />
//                                 <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm truncate">
//                                     Trip Logistics Sections
//                                 </h1>
//                             </div>

//                             <div className="flex items-center gap-2 md:gap-3">
//                                 {/* Category Tabs */}
//                                 <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
//                                     <ActionButton
//                                         type="button"
//                                         variant={activeTab === 'accommodation' ? 'primary' : 'secondary'}
//                                         onClick={() => {
//                                             setActiveTab('accommodation');
//                                             setSelectedItem(null);
//                                         }}
//                                     >
//                                         <Building2 className="w-3.5 h-3.5" />
//                                         <span className="hidden xs:inline">Stays</span>
//                                     </ActionButton>
//                                     <ActionButton
//                                         type="button"
//                                         variant={activeTab === 'leg' ? 'primary' : 'secondary'}
//                                         onClick={() => {
//                                             setActiveTab('leg');
//                                             setSelectedItem(null);
//                                         }}
//                                     >
//                                         <Car className="w-3.5 h-3.5" />
//                                         <span className="hidden xs:inline">Legs</span>
//                                     </ActionButton>
//                                     <ActionButton
//                                         type="button"
//                                         variant={activeTab === 'attraction' ? 'primary' : 'secondary'}
//                                         onClick={() => {
//                                             setActiveTab('attraction');
//                                             setSelectedItem(null);
//                                         }}
//                                     >
//                                         <MapPin className="w-3.5 h-3.5" />
//                                         <span className="hidden xs:inline">Attractions</span>
//                                     </ActionButton>
//                                     <ActionButton
//                                         type="button"
//                                         variant={activeTab === 'dining' ? 'primary' : 'secondary'}
//                                         onClick={() => {
//                                             setActiveTab('dining');
//                                             setSelectedItem(null);
//                                         }}
//                                     >
//                                         <Utensils className="w-3.5 h-3.5" />
//                                         <span className="hidden xs:inline">Dining</span>
//                                     </ActionButton>
//                                 </div>
//                             </div>
//                         </header>

//                         {/* Mobile Navigation Breadcrumb / View Switcher Bar */}
//                         <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 shrink-0 text-xs">
//                             <div className="flex items-center gap-2">
//                                 {mobileView !== 'days' && (
//                                     <ActionButton
//                                         type="button"
//                                         variant="secondary"
//                                         onClick={() => setMobileView(mobileView === 'form' ? 'list' : 'days')}
//                                     >
//                                         <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                                         <span>Back</span>
//                                     </ActionButton>
//                                 )}
//                                 <span className="font-semibold text-slate-700 dark:text-slate-300">
//                                     {mobileView === 'days' && 'Step 1: Select Day'}
//                                     {mobileView === 'list' && `Step 2: ${activeTab.toUpperCase()} List`}
//                                     {mobileView === 'form' && `Step 3: ${selectedItem?.id ? 'Edit' : 'Add'} ${activeTab}`}
//                                 </span>
//                             </div>
//                             <div className="flex gap-1">
//                                 <ActionButton
//                                     type="button"
//                                     variant={mobileView === 'days' ? 'primary' : 'secondary'}
//                                     onClick={() => setMobileView('days')}
//                                 >
//                                     Days
//                                 </ActionButton>
//                                 <ActionButton
//                                     type="button"
//                                     variant={mobileView === 'list' ? 'primary' : 'secondary'}
//                                     onClick={() => setMobileView('list')}
//                                 >
//                                     Items
//                                 </ActionButton>
//                                 <ActionButton
//                                     type="button"
//                                     variant={mobileView === 'form' ? 'primary' : 'secondary'}
//                                     onClick={() => setMobileView('form')}
//                                 >
//                                     Form
//                                 </ActionButton>
//                             </div>
//                         </div>
//                         <div>
//                             <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
//                                 {selectedItem?.id ? `Edit ${activeTab}` : `Add New ${activeTab}`}
//                             </h2>
//                             <p className="text-xs text-slate-500">
//                                 Manage records stored directly in your  database backend.
//                             </p>
//                         </div>

//                         {errorMessage && (
//                             <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
//                                 <AlertCircle className="w-4 h-4 shrink-0" />
//                                 <span>{errorMessage}</span>
//                             </div>
//                         )}

//                         {successMessage && (
//                             <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs">
//                                 {successMessage}
//                             </div>
//                         )}

//                         <OthersFormPanel
//                             activeTab={activeTab}
//                             selectedItem={selectedItem}
//                             isSubmitting={isSubmitting}
//                             onSubmit={handleSaveItem}
//                             onCancel={() => {
//                                 setSelectedItem(null);
//                                 setMobileView('list');
//                             }}
//                         />
//                     </main>
//                     {/* Pane 3: Compact Add Leg Section (4 of 12 columns) */}
//                     <div className={`lg:col-span-3 h-full overflow-hidden border-x border-slate-200 dark:border-slate-800 ${mobileView === 'list' ? 'block' : 'hidden lg:block'}`}>
//                         <OthersItemList
//                             activeTab={activeTab}
//                             selectedDayId={selectedDayId}
//                             accommodations={accommodations}
//                             attractions={attractions}
//                             diningSpots={diningSpots}
//                             legs={legs}
//                             onSelectItem={(item) => {
//                                 setSelectedItem(item);
//                                 setMobileView('form');
//                             }}
//                             onDeleteItem={handleDeleteItem}
//                             onAddNew={() => {
//                                 setSelectedItem({});
//                                 setMobileView('form');
//                             }}
//                         />
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }





import { useTripCreatorWorkspace } from '@/hooks/useTripCreatorWorkspace';


const LOGISTICS_TABS: { key: ActiveTabType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'accommodation', label: 'Stays', Icon: Building2 },
    { key: 'leg', label: 'Legs', Icon: Car },
    { key: 'attraction', label: 'Attractions', Icon: MapPin },
    { key: 'dining', label: 'Dining', Icon: Utensils },
];

export default function DesktopCreatorPortal({
    params,
}: {
    params: Promise<{ targetTripId: string; id: string }>;
}) {
    const resolvedParams = use(params);
    const tripId = resolvedParams.targetTripId;
    const id = resolvedParams.id;

    const {
        days,
        selectedDayId,
        legsCountByDayId,
        activeTab,
        setActiveTab,
        accommodations,
        attractions,
        diningSpots,
        legs,
        selectedItem,
        setSelectedItem,
        mobileView,
        setMobileView,
        isSubmitting,
        isCreatingDay,
        errorMessage,
        successMessage,
        handleSelectDay,
        handleReorderDays,
        handleSyncSubsequentDates,
        handleCreateDaySubmit,
        handleUpdateDaySubmit,
        handleDeleteDay,
        handleSaveItem,
        handleDeleteItem,
    } = useTripCreatorWorkspace(tripId);

    return (
        <div className="min-h-screen w-full flex justify-center bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans px-0 sm:px-4">
            <div className="h-screen w-full max-w-7xl mx-auto flex flex-col bg-white dark:bg-slate-950 sm:border-x border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Top Trip Header */}
                <TripHeader tripId={tripId} id={id} />

                {/* Mobile Step Switcher */}
                <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 shrink-0 text-xs">
                    <div className="flex items-center gap-2">
                        {mobileView !== 'days' && (
                            <ActionButton
                                type="button"
                                variant="secondary"
                                onClick={() => setMobileView(mobileView === 'form' ? 'list' : 'days')}
                            >
                                <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Back</span>
                            </ActionButton>
                        )}
                        <span className="font-bold">
                            {mobileView === 'days' && '1. Dates'}
                            {mobileView === 'list' && '2. Day Plan'}
                            {mobileView === 'form' && '3. Logistics Form'}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        {(['days', 'list', 'form'] as const).map((step, i) => (
                            <ActionButton
                                key={step}
                                type="button"
                                variant={mobileView === step ? 'primary' : 'secondary'}
                                onClick={() => setMobileView(step)}
                                className="capitalize"
                            >
                                {i + 1}. {step === 'days' ? 'Dates' : step === 'list' ? 'Plan' : 'Form'}
                            </ActionButton>
                        ))}
                    </div>
                </div>

                {/* 3-Column Command Center Workspace */}
                <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                    {/* Left Column (4 cols): Dates Timeline & Day Creation */}
                    <div
                        className={`lg:col-span-4 h-full overflow-hidden ${mobileView === 'days' ? 'block' : 'hidden lg:block'
                            }`}
                    >
                        <DaysTimelinePane
                            days={days}
                            selectedDayId={selectedDayId}
                            legsCountByDayId={legsCountByDayId}
                            onSelectDay={handleSelectDay}
                            onCreateDaySubmit={handleCreateDaySubmit}
                            onUpdateDaySubmit={handleUpdateDaySubmit}
                            onSyncSubsequentDates={handleSyncSubsequentDates}
                            onReorderDays={handleReorderDays}
                            onDeleteDay={handleDeleteDay}
                            isSavingDay={isCreatingDay || isSubmitting}
                        />
                    </div>

                    {/* Middle Column (5 cols): Category Tabs + Form Panel */}
                    <main
                        className={`lg:col-span-5 h-full p-4 md:p-5 bg-white dark:bg-slate-900 overflow-y-auto space-y-4 ${mobileView === 'form' ? 'block' : 'hidden lg:block'
                            }`}
                    >
                        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <Compass className="w-5 h-5 text-blue-600 shrink-0" />
                                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm truncate">
                                    Trip Logistics Sections
                                </h1>
                            </div>

                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                                {LOGISTICS_TABS.map(({ key, label, Icon }) => (
                                    <ActionButton
                                        key={key}
                                        type="button"
                                        variant={activeTab === key ? 'primary' : 'secondary'}
                                        onClick={() => {
                                            setActiveTab(key);
                                            setSelectedItem(null);
                                        }}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        <span className="hidden xs:inline">{label}</span>
                                    </ActionButton>
                                ))}
                            </div>
                        </header>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {selectedItem?.id ? `Edit ${activeTab}` : `Add New ${activeTab}`}
                            </h2>
                            <p className="text-xs text-slate-500">
                                Manage records stored directly in your TiDB database backend.
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs">
                                {successMessage}
                            </div>
                        )}

                        <OthersFormPanel
                            activeTab={activeTab}
                            selectedItem={selectedItem}
                            isSubmitting={isSubmitting}
                            onSubmit={handleSaveItem}
                            onCancel={() => {
                                setSelectedItem(null);
                                setMobileView('list');
                            }}
                        />
                    </main>

                    {/* Right Column (3 cols): Filtered List for Selected Day & Active Tab */}
                    <div
                        className={`lg:col-span-3 h-full overflow-hidden border-x border-slate-200 dark:border-slate-800 ${mobileView === 'list' ? 'block' : 'hidden lg:block'
                            }`}
                    >
                        <OthersItemList
                            activeTab={activeTab}
                            selectedDayId={selectedDayId}
                            accommodations={accommodations}
                            attractions={attractions}
                            diningSpots={diningSpots}
                            legs={legs}
                            onSelectItem={(item) => {
                                setSelectedItem(item);
                                setMobileView('form');
                            }}
                            onDeleteItem={handleDeleteItem}
                            onAddNew={() => {
                                setSelectedItem({});
                                setMobileView('form');
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}