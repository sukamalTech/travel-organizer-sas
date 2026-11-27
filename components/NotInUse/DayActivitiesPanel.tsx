// // components/creator/DayActivitiesPanel.tsx
// 'use client';

// import React, { useState } from 'react';
// import {
//     Car,
//     BedDouble,
//     Utensils,
//     Camera,
//     Plus,
//     Trash2,
// } from 'lucide-react';
// import { LegItem } from '@/lib/validations/itinerary';
// import LegReorderList from '@/components/creator/LegReorderList';

// export type DayActivityCategory = 'legs' | 'stays' | 'dining' | 'attractions';

// export interface DayExtraItem {
//     id: string;
//     title: string;
//     subtitle?: string;
//     time_or_cost?: string;
//     notes?: string;
// }

// interface DayActivitiesPanelProps {
//     legs: LegItem[];
//     selectedLegId?: string;
//     onSelectLeg: (leg: LegItem) => void;
//     onAddNewLegClick: () => void;
//     onReorderLegs: (reordered: LegItem[]) => void;
//     onDeleteLeg: (legId: string) => Promise<void>;
//     extras: {
//         stays: DayExtraItem[];
//         dining: DayExtraItem[];
//         attractions: DayExtraItem[];
//     };
//     onUpdateExtras: (updatedExtras: {
//         stays: DayExtraItem[];
//         dining: DayExtraItem[];
//         attractions: DayExtraItem[];
//     }) => void;
// }

// export default function DayActivitiesPanel({
//     legs,
//     selectedLegId,
//     onSelectLeg,
//     onAddNewLegClick,
//     onReorderLegs,
//     onDeleteLeg,
//     extras,
//     onUpdateExtras,
// }: DayActivitiesPanelProps) {
//     const [activeTab, setActiveTab] = useState<DayActivityCategory>('legs');
//     const [title, setTitle] = useState('');
//     const [subtitle, setSubtitle] = useState('');
//     const [timeOrCost, setTimeOrCost] = useState('');

//     const handleAddExtraItem = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!title.trim() || activeTab === 'legs') return;

//         const newItem: DayExtraItem = {
//             id: globalThis.crypto.randomUUID(),
//             title: title.trim(),
//             subtitle: subtitle.trim(),
//             time_or_cost: timeOrCost.trim(),
//         };

//         onUpdateExtras({
//             ...extras,
//             [activeTab]: [...(extras[activeTab] || []), newItem],
//         });

//         setTitle('');
//         setSubtitle('');
//         setTimeOrCost('');
//     };

//     const handleDeleteExtraItem = (category: 'stays' | 'dining' | 'attractions', itemId: string) => {
//         onUpdateExtras({
//             ...extras,
//             [category]: extras[category].filter((item) => item.id !== itemId),
//         });
//     };

//     const tabs: { key: DayActivityCategory; label: string; icon: React.ReactNode; count: number }[] = [
//         { key: 'legs', label: 'Legs', icon: <Car className="w-3.5 h-3.5" />, count: legs.length },
//         { key: 'stays', label: 'Stays', icon: <BedDouble className="w-3.5 h-3.5" />, count: extras.stays?.length || 0 },
//         { key: 'dining', label: 'Dining', icon: <Utensils className="w-3.5 h-3.5" />, count: extras.dining?.length || 0 },
//         { key: 'attractions', label: 'Spots', icon: <Camera className="w-3.5 h-3.5" />, count: extras.attractions?.length || 0 },
//     ];

//     return (
//         <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs space-y-4">
//             {/* Category Tabs */}
//             <div className="grid grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
//                 {tabs.map((tab) => (
//                     <button
//                         key={tab.key}
//                         type="button"
//                         onClick={() => setActiveTab(tab.key)}
//                         className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-bold transition ${activeTab === tab.key
//                                 ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
//                                 : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
//                             }`}
//                     >
//                         {tab.icon}
//                         <span>{tab.label}</span>
//                         <span className="text-[10px] opacity-75">({tab.count})</span>
//                     </button>
//                 ))}
//             </div>

//             {/* Tab Content: Travel Legs */}
//             {activeTab === 'legs' && (
//                 <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
//                             Route & Transit Legs
//                         </span>
//                         <button
//                             type="button"
//                             onClick={onAddNewLegClick}
//                             className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
//                         >
//                             <Plus className="w-3.5 h-3.5" /> Add Leg
//                         </button>
//                     </div>

//                     <LegReorderList
//                         legs={legs}
//                         onReorder={onReorderLegs}
//                         onSelectLeg={onSelectLeg}
//                         onDeleteLeg={onDeleteLeg}
//                         selectedLegId={selectedLegId}
//                     />
//                 </div>
//             )}

//             {/* Tab Content: Staying Options, Dining, Attractions */}
//             {activeTab !== 'legs' && (
//                 <div className="space-y-3">
//                     <form onSubmit={handleAddExtraItem} className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
//                         <input
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder={
//                                 activeTab === 'stays'
//                                     ? 'Hotel / Homestay Option Name'
//                                     : activeTab === 'dining'
//                                         ? 'Restaurant / Cafe Name'
//                                         : 'Attraction / Sightseeing Spot'
//                             }
//                             className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                             required
//                         />
//                         <div className="grid grid-cols-2 gap-2">
//                             <input
//                                 type="text"
//                                 value={subtitle}
//                                 onChange={(e) => setSubtitle(e.target.value)}
//                                 placeholder={
//                                     activeTab === 'stays'
//                                         ? 'Room type / Address'
//                                         : activeTab === 'dining'
//                                             ? 'Must-try dish / Cuisine'
//                                             : 'Entry fee / Ticket info'
//                                 }
//                                 className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                             />
//                             <input
//                                 type="text"
//                                 value={timeOrCost}
//                                 onChange={(e) => setTimeOrCost(e.target.value)}
//                                 placeholder={
//                                     activeTab === 'stays'
//                                         ? 'Tariff (e.g., ₹3,500)'
//                                         : 'Timing (e.g., 10:00 AM)'
//                                 }
//                                 className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full py-1.5 bg-slate-900 dark:bg-blue-600 hover:opacity-90 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"
//                         >
//                             <Plus className="w-3.5 h-3.5" /> Add to{' '}
//                             {activeTab === 'stays' ? 'Staying Options' : activeTab === 'dining' ? 'Dining' : 'Attractions'}
//                         </button>
//                     </form>

//                     {/* Items List */}
//                     <div className="space-y-2">
//                         {(extras[activeTab] || []).length === 0 ? (
//                             <p className="text-xs text-center text-slate-400 py-4">
//                                 No {activeTab} added for this date yet.
//                             </p>
//                         ) : (
//                             extras[activeTab].map((item) => (
//                                 <div
//                                     key={item.id}
//                                     className="flex items-start justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
//                                 >
//                                     <div className="space-y-0.5">
//                                         <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
//                                             {item.title}
//                                         </div>
//                                         {item.subtitle && (
//                                             <div className="text-[11px] text-slate-500 dark:text-slate-400">
//                                                 {item.subtitle}
//                                             </div>
//                                         )}
//                                         {item.time_or_cost && (
//                                             <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
//                                                 {item.time_or_cost}
//                                             </span>
//                                         )}
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleDeleteExtraItem(activeTab, item.id)}
//                                         className="p-1 text-slate-400 hover:text-rose-500"
//                                         title="Remove item"
//                                     >
//                                         <Trash2 className="w-3.5 h-3.5" />
//                                     </button>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import React from 'react'

export default function DayActivitiesPanel() {
    return (
        <div>
            Not in use
        </div>
    )
}
