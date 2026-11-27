// // components/creator/DayLinkedSidebar.tsx
// 'use client';

// import React, { useState } from 'react';
// import {
//     Car,
//     BedDouble,
//     Camera,
//     Utensils,
//     Plus,
//     Trash2,
//     X,
//     PanelLeftClose,
// } from 'lucide-react';
// import { LegItem } from '@/lib/validations/itinerary';
// import LegReorderList from '@/components/creator/LegReorderList';
// import type { DayExtraItem } from './DayActivitiesPanel';

// export type DaySectionType = 'legs' | 'stays' | 'attractions' | 'dining';

// interface DayLinkedSidebarProps {
//     dayNumber: number;
//     date: string;
//     activeSection: DaySectionType;
//     onSelectSection: (section: DaySectionType) => void;
//     legs: LegItem[];
//     selectedLegId?: string;
//     onSelectLeg: (leg: LegItem) => void;
//     onAddLegClick: () => void;
//     onReorderLegs: (reordered: LegItem[]) => void;
//     onDeleteLeg: (legId: string) => Promise<void>;
//     extras: {
//         stays: DayExtraItem[];
//         attractions: DayExtraItem[];
//         dining: DayExtraItem[];
//     };
//     onAddExtraItem: (
//         category: 'stays' | 'attractions' | 'dining',
//         item: DayExtraItem
//     ) => void;
//     onDeleteExtraItem: (
//         category: 'stays' | 'attractions' | 'dining',
//         itemId: string
//     ) => void;
//     onCollapse?: () => void;
// }

// export default function DayLinkedSidebar({
//     dayNumber,
//     date,
//     activeSection,
//     onSelectSection,
//     legs,
//     selectedLegId,
//     onSelectLeg,
//     onAddLegClick,
//     onReorderLegs,
//     onDeleteLeg,
//     extras,
//     onAddExtraItem,
//     onDeleteExtraItem,
//     onCollapse,
// }: DayLinkedSidebarProps) {
//     const [title, setTitle] = useState('');
//     const [subtitle, setSubtitle] = useState('');
//     const [timeOrCost, setTimeOrCost] = useState('');

//     const navItems: {
//         key: DaySectionType;
//         label: string;
//         count: number;
//         icon: React.ReactNode;
//     }[] = [
//             { key: 'legs', label: 'Legs', count: legs.length, icon: <Car className="w-3.5 h-3.5" /> },
//             { key: 'stays', label: 'Stays', count: extras.stays.length, icon: <BedDouble className="w-3.5 h-3.5" /> },
//             { key: 'attractions', label: 'Attractions', count: extras.attractions.length, icon: <Camera className="w-3.5 h-3.5" /> },
//             { key: 'dining', label: 'Dining', count: extras.dining.length, icon: <Utensils className="w-3.5 h-3.5" /> },
//         ];

//     const handleQuickAdd = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!title.trim() || activeSection === 'legs') return;

//         onAddExtraItem(activeSection, {
//             id: globalThis.crypto.randomUUID(),
//             title: title.trim(),
//             subtitle: subtitle.trim(),
//             time_or_cost: timeOrCost.trim(),
//         });

//         setTitle('');
//         setSubtitle('');
//         setTimeOrCost('');
//     };

//     return (
//         <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
//             {/* Header */}
//             <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
//                 <div>
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
//                         Day {dayNumber} • {date}
//                     </span>
//                     <h2 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
//                         Day Linked Items
//                     </h2>
//                 </div>
//                 {onCollapse && (
//                     <button
//                         type="button"
//                         onClick={onCollapse}
//                         className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition"
//                         title="Hide Linked Menu"
//                     >
//                         <PanelLeftClose className="w-4 h-4" />
//                     </button>
//                 )}
//             </div>

//             {/* Toggle Menu for Legs, Stays, Attractions, Dining */}
//             <div className="grid grid-cols-2 gap-1.5 p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30">
//                 {navItems.map((item) => {
//                     const active = activeSection === item.key;
//                     return (
//                         <button
//                             key={item.key}
//                             type="button"
//                             onClick={() => onSelectSection(item.key)}
//                             className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold border transition ${active
//                                     ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
//                                     : 'bg-white dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
//                                 }`}
//                         >
//                             <span className="flex items-center gap-1.5 truncate">
//                                 {item.icon}
//                                 <span className="truncate">{item.label}</span>
//                             </span>
//                             <span
//                                 className={`text-[10px] px-1.5 py-0.5 rounded-full ${active
//                                         ? 'bg-white/20 text-white'
//                                         : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
//                                     }`}
//                             >
//                                 {item.count}
//                             </span>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* Section Body */}
//             <div className="flex-1 overflow-y-auto p-3 space-y-3">
//                 {activeSection === 'legs' ? (
//                     <>
//                         <div className="flex items-center justify-between">
//                             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                                 Travel Legs
//                             </span>
//                             <button
//                                 type="button"
//                                 onClick={onAddLegClick}
//                                 className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition"
//                             >
//                                 <Plus className="w-3.5 h-3.5" /> New Leg
//                             </button>
//                         </div>
//                         <LegReorderList
//                             legs={legs}
//                             onReorder={onReorderLegs}
//                             onSelectLeg={onSelectLeg}
//                             onDeleteLeg={onDeleteLeg}
//                             selectedLegId={selectedLegId}
//                         />
//                     </>
//                 ) : (
//                     <>
//                         <form
//                             onSubmit={handleQuickAdd}
//                             className="space-y-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40"
//                         >
//                             <input
//                                 type="text"
//                                 value={title}
//                                 onChange={(e) => setTitle(e.target.value)}
//                                 placeholder={
//                                     activeSection === 'stays'
//                                         ? 'Stay / Hotel name'
//                                         : activeSection === 'attractions'
//                                             ? 'Attraction / Spot name'
//                                             : 'Dining / Restaurant name'
//                                 }
//                                 className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                                 required
//                             />
//                             <div className="grid grid-cols-2 gap-1.5">
//                                 <input
//                                     type="text"
//                                     value={subtitle}
//                                     onChange={(e) => setSubtitle(e.target.value)}
//                                     placeholder="Details / Note"
//                                     className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                                 />
//                                 <input
//                                     type="text"
//                                     value={timeOrCost}
//                                     onChange={(e) => setTimeOrCost(e.target.value)}
//                                     placeholder={activeSection === 'stays' ? '₹ Tariff' : 'Time / Info'}
//                                     className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition"
//                             >
//                                 <Plus className="w-3.5 h-3.5" /> Add {activeSection.slice(0, -1)}
//                             </button>
//                         </form>

//                         <div className="space-y-2">
//                             {extras[activeSection].length === 0 ? (
//                                 <p className="text-xs text-center text-slate-400 py-4">
//                                     No {activeSection} added for this day yet.
//                                 </p>
//                             ) : (
//                                 extras[activeSection].map((item) => (
//                                     <div
//                                         key={item.id}
//                                         className="flex items-start justify-between gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
//                                     >
//                                         <div className="min-w-0 space-y-0.5">
//                                             <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
//                                                 {item.title}
//                                             </div>
//                                             {item.subtitle && (
//                                                 <div className="text-[11px] text-slate-500 dark:text-slate-400 break-words">
//                                                     {item.subtitle}
//                                                 </div>
//                                             )}
//                                             {item.time_or_cost && (
//                                                 <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
//                                                     {item.time_or_cost}
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() => onDeleteExtraItem(activeSection, item.id)}
//                                             className="p-1 text-slate-400 hover:text-rose-500 shrink-0"
//                                             title="Delete"
//                                         >
//                                             <Trash2 className="w-3.5 h-3.5" />
//                                         </button>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

import React from 'react'

export default function DayLinkedSidebar() {
    return (
        <div>
            Not in use
        </div>
    )
}
