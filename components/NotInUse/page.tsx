


// 'use client';
// import React, { useState, useEffect, use } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import { Compass, Building2, Utensils, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';
// import OthersSidebarTimeline from '@/components/creator/OthersSidebarTimeline';
// import OthersItemList from '@/components/creator/OthersItemList';
// import OthersFormPanel from '@/components/creator/OthersFormPanel';
// import { ActionButton } from '@/components/ui/FormControls';

// export type ActiveTabType = 'leg' | 'accommodation' | 'attraction' | 'dining';

// export default function OthersDetailsPortal({
//     params,
// }: {
//     params: Promise<{ targetTripId: string; id: string }>;
// }) {
//     const resolvedParams = use(params);
//     const tripId = resolvedParams.targetTripId;
//     const supabase = createClient();
//     const [tripName, setTripName] = useState<string>('');
//     const [days, setDays] = useState<any[]>([]);
//     const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState<ActiveTabType>('accommodation');

//     // Data lists for the selected day/trip
//     const [accommodations, setAccommodations] = useState<any[]>([]);
//     const [attractions, setAttractions] = useState<any[]>([]);
//     const [diningSpots, setDiningSpots] = useState<any[]>([]);

//     // Selected item for editing (null means creating new)
//     const [selectedItem, setSelectedItem] = useState<any | null>(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [successMessage, setSuccessMessage] = useState<string | null>(null);

//     // Mobile view step tracker ('days' | 'list' | 'form') for small screens
//     const [mobileView, setMobileView] = useState<'days' | 'list' | 'form'>('days');

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
//             if (!res.ok) throw new Error('Failed to fetch supplementary trip details');
//             const json = await res.json();

//             setAccommodations(json.accommodations || []);
//             setAttractions(json.attractions || []);
//             setDiningSpots(json.diningSpots || []);
//         } catch (err: any) {
//             console.error('Error fetching TiDB data:', err);
//             setErrorMessage(err.message);
//         }
//     };

//     useEffect(() => {
//         fetchTiDBData();
//     }, [tripId]);

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
//                 type: activeTab, // 'accommodation' | 'attraction' | 'dining'
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

//             setSuccessMessage('Successfully saved record to TiDB!');
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

//     return (
//         <div className="h-screen w-full flex flex-col bg-slate-100 dark:bg-slate-950 font-sans overflow-hidden">
//             {/* Top Navigation Header */}
//             <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0">
//                 <div className="flex items-center gap-2">
//                     <Compass className="w-5 h-5 text-blue-600 shrink-0" />
//                     <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xs md:text-sm truncate">
//                         Trip Logistics Sections
//                     </h1>
//                 </div>

//                 <div className="flex items-center gap-2 md:gap-3">
//                     <span className="hidden sm:inline text-xs text-slate-500 font-mono">
//                         Trip Name: {tripId.slice(0, 8)}...
//                     </span>

//                     {/* Category Tabs */}
//                     <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
//                         <ActionButton
//                             type="button"
//                             variant={activeTab === 'accommodation' ? 'primary' : 'secondary'}
//                             onClick={() => {
//                                 setActiveTab('accommodation');
//                                 setSelectedItem(null);
//                             }}
//                         >
//                             <Building2 className="w-3.5 h-3.5" />
//                             <span className="hidden xs:inline">Stays</span>
//                         </ActionButton>
//                         <ActionButton
//                             type="button"
//                             variant={activeTab === 'attraction' ? 'primary' : 'secondary'}
//                             onClick={() => {
//                                 setActiveTab('attraction');
//                                 setSelectedItem(null);
//                             }}
//                         >
//                             <MapPin className="w-3.5 h-3.5" />
//                             <span className="hidden xs:inline">Attractions</span>
//                         </ActionButton>
//                         <ActionButton
//                             type="button"
//                             variant={activeTab === 'dining' ? 'primary' : 'secondary'}
//                             onClick={() => {
//                                 setActiveTab('dining');
//                                 setSelectedItem(null);
//                             }}
//                         >
//                             <Utensils className="w-3.5 h-3.5" />
//                             <span className="hidden xs:inline">Dining</span>
//                         </ActionButton>
//                     </div>
//                 </div>
//             </header>

//             {/* Mobile Navigation Breadcrumb / View Switcher Bar */}
//             <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 shrink-0 text-xs">
//                 <div className="flex items-center gap-2">
//                     {mobileView !== 'days' && (
//                         <ActionButton
//                             type="button"
//                             variant="secondary"
//                             onClick={() => setMobileView(mobileView === 'form' ? 'list' : 'days')}
//                         >
//                             <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
//                             <span>Back</span>
//                         </ActionButton>
//                     )}
//                     <span className="font-semibold text-slate-700 dark:text-slate-300">
//                         {mobileView === 'days' && 'Step 1: Select Day'}
//                         {mobileView === 'list' && `Step 2: ${activeTab.toUpperCase()} List`}
//                         {mobileView === 'form' && `Step 3: ${selectedItem?.id ? 'Edit' : 'Add'} ${activeTab}`}
//                     </span>
//                 </div>
//                 <div className="flex gap-1">
//                     <ActionButton
//                         type="button"
//                         variant={mobileView === 'days' ? 'primary' : 'secondary'}
//                         onClick={() => setMobileView('days')}
//                     >
//                         Days
//                     </ActionButton>
//                     <ActionButton
//                         type="button"
//                         variant={mobileView === 'list' ? 'primary' : 'secondary'}
//                         onClick={() => setMobileView('list')}
//                     >
//                         Items
//                     </ActionButton>
//                     <ActionButton
//                         type="button"
//                         variant={mobileView === 'form' ? 'primary' : 'secondary'}
//                         onClick={() => setMobileView('form')}
//                     >
//                         Form
//                     </ActionButton>
//                 </div>
//             </div>

//             {/* Workspace Grid: Responsive for mobile (stacked via mobileView state) & Desktop (3-column grid) */}
//             <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
//                 {/* Pane 1: Days Timeline */}
//                 <div className={`lg:col-span-3 h-full overflow-hidden ${mobileView === 'days' ? 'block' : 'hidden lg:block'}`}>
//                     <OthersSidebarTimeline
//                         days={days}
//                         selectedDayId={selectedDayId}
//                         onSelectDay={(day) => {
//                             setSelectedDayId(day.id);
//                             setSelectedItem(null);
//                             setMobileView('list');
//                         }}
//                     />
//                 </div>

//                 {/* Pane 2: Categorized Item List */}
//                 <div className={`lg:col-span-4 h-full overflow-hidden border-x border-slate-200 dark:border-slate-800 ${mobileView === 'list' ? 'block' : 'hidden lg:block'}`}>
//                     <OthersItemList
//                         activeTab={activeTab}
//                         selectedDayId={selectedDayId}
//                         accommodations={accommodations}
//                         attractions={attractions}
//                         diningSpots={diningSpots}
//                         onSelectItem={(item) => {
//                             setSelectedItem(item);
//                             setMobileView('form');
//                         }}
//                         onDeleteItem={handleDeleteItem}
//                         onAddNew={() => {
//                             setSelectedItem({});
//                             setMobileView('form');
//                         }}
//                     />
//                 </div>

//                 {/* Pane 3: Dynamic Editor/Creation Form */}
//                 <main className={`lg:col-span-5 h-full p-4 md:p-5 bg-white dark:bg-slate-900 overflow-y-auto space-y-4 ${mobileView === 'form' ? 'block' : 'hidden lg:block'}`}>
//                     <div>
//                         <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
//                             {selectedItem?.id ? `Edit ${activeTab}` : `Add New ${activeTab}`}
//                         </h2>
//                         <p className="text-xs text-slate-500">
//                             Manage records stored directly in your TiDB database backend.
//                         </p>
//                     </div>

//                     {errorMessage && (
//                         <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
//                             <AlertCircle className="w-4 h-4 shrink-0" />
//                             <span>{errorMessage}</span>
//                         </div>
//                     )}

//                     {successMessage && (
//                         <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs">
//                             {successMessage}
//                         </div>
//                     )}

//                     <OthersFormPanel
//                         activeTab={activeTab}
//                         selectedItem={selectedItem}
//                         isSubmitting={isSubmitting}
//                         onSubmit={handleSaveItem}
//                         onCancel={() => {
//                             setSelectedItem(null);
//                             setMobileView('list');
//                         }}
//                     />
//                 </main>
//             </div>
//         </div>
//     );
// }

import React from 'react'

export default function page() {
    return (
        <div>
            <h1>This page is depricated</h1>
        </div>
    )
}
