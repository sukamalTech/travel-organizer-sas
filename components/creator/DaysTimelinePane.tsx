

// // components/creator/DaysTimelinePane.tsx
// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import {
//     Calendar,
//     Plus,
//     MapPin,
//     GripVertical,
//     Moon,
//     Trash2,
//     X,
//     Car,
//     BedDouble,
//     MoreVertical,
//     Pencil,
//     CalendarSync,
//     CheckCircle2,
// } from 'lucide-react';

// export interface DayExtraItem {
//     id: string;
//     title: string;
//     subtitle?: string;
//     time_or_cost?: string;
//     notes?: string;
// }

// export interface ExtendedItineraryDay {
//     id: string;
//     trip_id: string;
//     day_number: number;
//     date: string;
//     summary?: string | null;
//     daily_notes?: string | null;
//     night_stay_location?: string | null;
//     night_stay_notes?: string | null;
//     day_metadata?: {
//         stays?: DayExtraItem[];
//         dining?: DayExtraItem[];
//         attractions?: DayExtraItem[];
//         [key: string]: any;
//     };
// }

// export interface NewDayFormInput {
//     date: string;
//     nightStayLocation: string;
//     nightStayNotes: string;
//     dailyNotes: string;
// }

// interface DaysTimelinePaneProps {
//     days: ExtendedItineraryDay[];
//     selectedDayId: string | null;
//     legsCountByDayId: Record<string, number>;
//     onSelectDay: (day: ExtendedItineraryDay) => void;
//     onEditDayClick?: (day: ExtendedItineraryDay) => void;
//     onCreateDaySubmit: (input: NewDayFormInput) => Promise<void>;
//     onDateChange: (dayId: string, newDate: string) => void;
//     onSyncSubsequentDates: (recalculatedDays: ExtendedItineraryDay[]) => Promise<void>;
//     onReorderDays: (reorderedDays: ExtendedItineraryDay[]) => void;
//     onDeleteDay?: (dayId: string) => void;
//     isCreatingDay?: boolean;
// }

// export default function DaysTimelinePane({
//     days,
//     selectedDayId,
//     legsCountByDayId,
//     onSelectDay,
//     onEditDayClick,
//     onCreateDaySubmit,
//     onDateChange,
//     onSyncSubsequentDates,
//     onReorderDays,
//     onDeleteDay,
//     isCreatingDay = false,
// }: DaysTimelinePaneProps) {
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
//     const [nightStayLocation, setNightStayLocation] = useState('');
//     const [nightStayNotes, setNightStayNotes] = useState('');
//     const [dailyNotes, setDailyNotes] = useState('');

//     const [openMenuDayId, setOpenMenuDayId] = useState<string | null>(null);
//     const [confirmDeleteDayId, setConfirmDeleteDayId] = useState<string | null>(null);
//     const [isSyncingDates, setIsSyncingDates] = useState(false);

//     const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
//     const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
//     const menuRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const handleClickOutside = (e: MouseEvent) => {
//             if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
//                 setOpenMenuDayId(null);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const openAddDayForm = () => {
//         let suggestedDate = new Date().toISOString().split('T')[0];
//         if (days.length > 0) {
//             const lastDate = new Date(days[days.length - 1].date + 'T00:00:00');
//             lastDate.setDate(lastDate.getDate() + 1);
//             suggestedDate = lastDate.toISOString().split('T')[0];
//         }
//         setNewDate(suggestedDate);
//         setNightStayLocation('');
//         setNightStayNotes('');
//         setDailyNotes('');
//         setShowAddForm(true);
//     };

//     const handleFormSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!newDate) return;
//         await onCreateDaySubmit({
//             date: newDate,
//             nightStayLocation: nightStayLocation.trim(),
//             nightStayNotes: nightStayNotes.trim(),
//             dailyNotes: dailyNotes.trim(),
//         });
//         setShowAddForm(false);
//     };

//     const handleSyncFromFirstDate = async () => {
//         if (days.length <= 1) return;
//         setIsSyncingDates(true);
//         try {
//             const anchorDate = new Date(days[0].date + 'T00:00:00');
//             const updated = days.map((day, idx) => {
//                 const nextDate = new Date(anchorDate);
//                 nextDate.setDate(anchorDate.getDate() + idx);
//                 return {
//                     ...day,
//                     day_number: idx + 1,
//                     date: nextDate.toISOString().split('T')[0],
//                 };
//             });
//             await onSyncSubsequentDates(updated);
//         } finally {
//             setIsSyncingDates(false);
//         }
//     };

//     const handleDragStart = (e: React.DragEvent, index: number) => {
//         setDraggedIndex(index);
//         e.dataTransfer.effectAllowed = 'move';
//     };

//     const handleDragOver = (e: React.DragEvent, index: number) => {
//         e.preventDefault();
//         if (draggedIndex === null || draggedIndex === index) return;
//         setDragOverIndex(index);
//     };

//     const handleDrop = (e: React.DragEvent, dropIndex: number) => {
//         e.preventDefault();
//         if (draggedIndex === null || draggedIndex === dropIndex) {
//             setDraggedIndex(null);
//             setDragOverIndex(null);
//             return;
//         }

//         const updated = [...days];
//         const [movedItem] = updated.splice(draggedIndex, 1);
//         updated.splice(dropIndex, 0, movedItem);

//         const anchorDateStr = days[0]?.date || new Date().toISOString().split('T')[0];
//         const anchorDate = new Date(anchorDateStr + 'T00:00:00');

//         const recalculated = updated.map((day, idx) => {
//             const nextDate = new Date(anchorDate);
//             nextDate.setDate(anchorDate.getDate() + idx);
//             return {
//                 ...day,
//                 day_number: idx + 1,
//                 date: nextDate.toISOString().split('T')[0],
//             };
//         });

//         setDraggedIndex(null);
//         setDragOverIndex(null);
//         onReorderDays(recalculated);
//     };

//     return (
//         <aside className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3.5 flex flex-col gap-3 h-full overflow-y-auto">
//             {/* Top Bar */}
//             <div className="flex flex-wrap items-center justify-between gap-2">
//                 <div className="flex items-center gap-1.5">
//                     <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
//                     <div>
//                         <h2 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
//                             Trip Dates
//                         </h2>
//                         <p className="text-[10px] text-slate-400">Select a date to edit or add leg</p>
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                     {days.length > 1 && (
//                         <button
//                             type="button"
//                             onClick={handleSyncFromFirstDate}
//                             disabled={isSyncingDates}
//                             title="Keep Day 1 date fixed and update all following dates sequentially"
//                             className="flex items-center gap-1 px-2 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] rounded-xl transition font-bold disabled:opacity-50"
//                         >
//                             <CalendarSync className="w-3.5 h-3.5" />
//                             <span>{isSyncingDates ? 'Syncing...' : 'Sync Dates'}</span>
//                         </button>
//                     )}

//                     <button
//                         type="button"
//                         onClick={openAddDayForm}
//                         className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl transition shadow-2xs font-semibold"
//                     >
//                         <Plus className="w-3.5 h-3.5" /> Add Date
//                     </button>
//                 </div>
//             </div>

//             {/* Add Date Form — Only Staying Options & Daily Note */}
//             {showAddForm && (
//                 <form
//                     onSubmit={handleFormSubmit}
//                     className="p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 space-y-2.5"
//                 >
//                     <div className="flex items-center justify-between">
//                         <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">
//                             Add Date & Night Stay
//                         </span>
//                         <button
//                             type="button"
//                             onClick={() => setShowAddForm(false)}
//                             className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
//                             title="Cancel"
//                         >
//                             <X className="w-3.5 h-3.5" />
//                         </button>
//                     </div>

//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
//                             Date
//                         </label>
//                         <input
//                             type="date"
//                             value={newDate}
//                             onChange={(e) => setNewDate(e.target.value)}
//                             required
//                             className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
//                         />
//                     </div>

//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
//                             Night Stay Place
//                         </label>
//                         <input
//                             type="text"
//                             value={nightStayLocation}
//                             onChange={(e) => setNightStayLocation(e.target.value)}
//                             placeholder="e.g., Munnar / Hotel Tea Valley"
//                             className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                         />
//                     </div>

//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
//                             Staying Notes
//                         </label>
//                         <input
//                             type="text"
//                             value={nightStayNotes}
//                             onChange={(e) => setNightStayNotes(e.target.value)}
//                             placeholder="Check-in / parking / room details"
//                             className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                         />
//                     </div>

//                     <div className="space-y-1">
//                         <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
//                             Daily Note
//                         </label>
//                         <textarea
//                             rows={2}
//                             value={dailyNotes}
//                             onChange={(e) => setDailyNotes(e.target.value)}
//                             placeholder="Notes for this day..."
//                             className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isCreatingDay}
//                         className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition disabled:opacity-50"
//                     >
//                         {isCreatingDay ? 'Creating...' : 'Save Date'}
//                     </button>
//                 </form>
//             )}

//             {/* Sequential Date Cards */}
//             <div className="flex flex-col gap-2.5">
//                 {days.map((day, index) => {
//                     const isSelected = selectedDayId === day.id;
//                     const isDragOver = dragOverIndex === index;

//                     const hasStaying = Boolean(day.night_stay_location?.trim());
//                     const hasLeg = (legsCountByDayId[day.id] || 0) > 0;

//                     return (
//                         <div
//                             key={day.id}
//                             draggable
//                             onDragStart={(e) => handleDragStart(e, index)}
//                             onDragOver={(e) => handleDragOver(e, index)}
//                             onDragLeave={() => setDragOverIndex(null)}
//                             onDrop={(e) => handleDrop(e, index)}
//                             onClick={() => onSelectDay(day)}
//                             className={`relative w-full text-left p-3 rounded-xl border transition-all cursor-pointer select-none ${isSelected
//                                 ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
//                                 : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70'
//                                 } ${isDragOver ? 'border-t-2 border-t-indigo-500' : ''}`}
//                         >
//                             {/* Top Row */}
//                             <div className="flex items-center justify-between gap-1.5">
//                                 <div className="flex items-center gap-1 min-w-0">
//                                     <GripVertical className="w-4 h-4 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
//                                     <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 whitespace-nowrap">
//                                         Day {day.day_number}
//                                     </span>
//                                 </div>

//                                 <div className="flex items-center gap-1">
//                                     <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
//                                         <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
//                                         <input
//                                             type="date"
//                                             value={day.date}
//                                             onClick={(e) => e.stopPropagation()}
//                                             onChange={(e) => onDateChange(day.id, e.target.value)}
//                                             className="bg-transparent text-[11px] text-slate-700 dark:text-slate-200 font-mono focus:outline-none cursor-pointer font-bold w-[102px]"
//                                         />
//                                     </div>

//                                     {/* Top-Right Menu Icon */}
//                                     <div
//                                         className="relative"
//                                         ref={openMenuDayId === day.id ? menuRef : null}
//                                         onClick={(e) => e.stopPropagation()}
//                                     >
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 setOpenMenuDayId(openMenuDayId === day.id ? null : day.id)
//                                             }
//                                             className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition"
//                                             title="Date Options"
//                                         >
//                                             <MoreVertical className="w-4 h-4" />
//                                         </button>

//                                         {openMenuDayId === day.id && (
//                                             <div className="absolute right-0 top-7 z-30 w-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 text-xs">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => {
//                                                         setOpenMenuDayId(null);
//                                                         if (onEditDayClick) {
//                                                             onEditDayClick(day);
//                                                         } else {
//                                                             onSelectDay(day);
//                                                         }
//                                                     }}
//                                                     className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold"
//                                                 >
//                                                     <Pencil className="w-3.5 h-3.5 text-blue-500" />
//                                                     <span>Edit</span>
//                                                 </button>

//                                                 {onDeleteDay && (
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => {
//                                                             setOpenMenuDayId(null);
//                                                             setConfirmDeleteDayId(day.id);
//                                                         }}
//                                                         className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 font-semibold"
//                                                     >
//                                                         <Trash2 className="w-3.5 h-3.5" />
//                                                         <span>Delete</span>
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Night Stay Place Name */}
//                             <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
//                                 <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
//                                 <span className="truncate">
//                                     {day.night_stay_location || 'No night stay set'}
//                                 </span>
//                             </div>

//                             {/* 2 Status Indicators: Staying & Leg (Green when filled) */}
//                             <div className="mt-2.5 grid grid-cols-2 gap-1.5">
//                                 <div
//                                     className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] font-bold border transition-colors ${hasStaying
//                                         ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
//                                         : 'bg-transparent text-slate-400 dark:text-slate-500 border-dashed border-slate-300 dark:border-slate-700'
//                                         }`}
//                                 >
//                                     <BedDouble className="w-3.5 h-3.5" />
//                                     <span>Staying</span>
//                                     {hasStaying && <CheckCircle2 className="w-3 h-3 shrink-0" />}
//                                 </div>

//                                 <div
//                                     className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] font-bold border transition-colors ${hasLeg
//                                         ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
//                                         : 'bg-transparent text-slate-400 dark:text-slate-500 border-dashed border-slate-300 dark:border-slate-700'
//                                         }`}
//                                 >
//                                     <Car className="w-3.5 h-3.5" />
//                                     <span>Leg</span>
//                                     {hasLeg && <CheckCircle2 className="w-3 h-3 shrink-0" />}
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Confirmation Modal for Deleting a Date */}
//             {confirmDeleteDayId && onDeleteDay && (
//                 <div
//                     className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
//                     onClick={() => setConfirmDeleteDayId(null)}
//                 >
//                     <div
//                         className="max-w-sm w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl space-y-4"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="space-y-1.5">
//                             <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
//                                 Delete This Date?
//                             </h3>
//                             <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
//                                 Are you sure you want to delete this date along with its linked staying details and travel legs? This action cannot be undone.
//                             </p>
//                         </div>

//                         <div className="flex items-center justify-end gap-2">
//                             <button
//                                 type="button"
//                                 onClick={() => setConfirmDeleteDayId(null)}
//                                 className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     const idToDelete = confirmDeleteDayId;
//                                     setConfirmDeleteDayId(null);
//                                     onDeleteDay(idToDelete);
//                                 }}
//                                 className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition"
//                             >
//                                 Yes, Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </aside>
//     );
// }

// components/creator/DaysTimelinePane.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Calendar,
    Plus,
    MapPin,
    GripVertical,
    Moon,
    Trash2,
    X,
    Car,
    BedDouble,
    Utensils,
    Camera,
    MoreVertical,
    Pencil,
    CalendarSync,
} from 'lucide-react';
import {
    TextInput,
    DateInput,
    TextAreaInput,
    ActionButton,
} from '@/components/ui/FormControls';

export interface DayExtraItem {
    id: string;
    title: string;
    subtitle?: string;
    time_or_cost?: string;
    notes?: string;
}

export interface ExtendedItineraryDay {
    id: string;
    trip_id: string;
    day_number: number;
    date: string;
    summary?: string | null;
    daily_notes?: string | null;
    night_stay_location?: string | null;
    night_stay_notes?: string | null;
    day_metadata?: {
        stays?: DayExtraItem[];
        dining?: DayExtraItem[];
        attractions?: DayExtraItem[];
        [key: string]: any;
    };
}

export interface DayFormInput {
    id?: string;
    date: string;
    nightStayLocation: string;
    nightStayNotes: string;
    dailyNotes: string;
}

interface DaysTimelinePaneProps {
    days: ExtendedItineraryDay[];
    selectedDayId: string | null;
    legsCountByDayId: Record<string, number>;
    onSelectDay: (day: ExtendedItineraryDay) => void;
    onCreateDaySubmit: (input: DayFormInput) => Promise<void>;
    onUpdateDaySubmit: (input: DayFormInput) => Promise<void>;
    onSyncSubsequentDates: (recalculatedDays: ExtendedItineraryDay[]) => Promise<void>;
    onReorderDays: (reorderedDays: ExtendedItineraryDay[]) => void;
    onDeleteDay?: (dayId: string) => void;
    isSavingDay?: boolean;
}

export default function DaysTimelinePane({
    days,
    selectedDayId,
    legsCountByDayId,
    onSelectDay,
    onCreateDaySubmit,
    onUpdateDaySubmit,
    onSyncSubsequentDates,
    onReorderDays,
    onDeleteDay,
    isSavingDay = false,
}: DaysTimelinePaneProps) {
    const [editingDayId, setEditingDayId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [dateVal, setDateVal] = useState(() => new Date().toISOString().split('T')[0]);
    const [nightStayLocation, setNightStayLocation] = useState('');
    const [nightStayNotes, setNightStayNotes] = useState('');
    const [dailyNotes, setDailyNotes] = useState('');

    const [openMenuDayId, setOpenMenuDayId] = useState<string | null>(null);
    const [confirmDeleteDayId, setConfirmDeleteDayId] = useState<string | null>(null);
    const [isSyncingDates, setIsSyncingDates] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuDayId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openAddForm = () => {
        let nextDate = new Date().toISOString().split('T')[0];
        if (days.length > 0) {
            const last = new Date(days[days.length - 1].date + 'T00:00:00');
            last.setDate(last.getDate() + 1);
            nextDate = last.toISOString().split('T')[0];
        }
        setEditingDayId(null);
        setDateVal(nextDate);
        setNightStayLocation('');
        setNightStayNotes('');
        setDailyNotes('');
        setShowForm(true);
    };

    const openEditForm = (day: ExtendedItineraryDay) => {
        setEditingDayId(day.id);
        setDateVal(day.date);
        setNightStayLocation(day.night_stay_location || '');
        setNightStayNotes(day.night_stay_notes || '');
        setDailyNotes(day.daily_notes || '');
        setShowForm(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dateVal) return;

        const payload: DayFormInput = {
            id: editingDayId || undefined,
            date: dateVal,
            nightStayLocation: nightStayLocation.trim(),
            nightStayNotes: nightStayNotes.trim(),
            dailyNotes: dailyNotes.trim(),
        };

        if (editingDayId) {
            await onUpdateDaySubmit(payload);
        } else {
            await onCreateDaySubmit(payload);
        }

        setShowForm(false);
        setEditingDayId(null);
    };

    const recalculateDatesFromAnchor = (list: ExtendedItineraryDay[]) => {
        const anchorStr = list[0]?.date || new Date().toISOString().split('T')[0];
        const anchor = new Date(anchorStr + 'T00:00:00');
        return list.map((day, idx) => {
            const next = new Date(anchor);
            next.setDate(anchor.getDate() + idx);
            return {
                ...day,
                day_number: idx + 1,
                date: next.toISOString().split('T')[0],
            };
        });
    };

    const handleSyncFromFirstDate = async () => {
        if (days.length <= 1) return;
        setIsSyncingDates(true);
        try {
            await onSyncSubsequentDates(recalculateDatesFromAnchor(days));
        } finally {
            setIsSyncingDates(false);
        }
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }
        const updated = [...days];
        const [moved] = updated.splice(draggedIndex, 1);
        updated.splice(dropIndex, 0, moved);
        setDraggedIndex(null);
        setDragOverIndex(null);
        onReorderDays(recalculateDatesFromAnchor(updated));
    };

    return (
        <aside className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3.5 flex flex-col gap-3 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                            Trip Dates
                        </h2>
                        <p className="text-[10px] text-slate-400">Select a date to add leg</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {days.length > 1 && (
                        <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={handleSyncFromFirstDate}
                            disabled={isSyncingDates}
                            title="Keep Day 1 date fixed and update following dates sequentially"
                        >
                            <CalendarSync className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>{isSyncingDates ? 'Syncing...' : 'Sync Dates'}</span>
                        </ActionButton>
                    )}

                    <ActionButton type="button" variant="primary" onClick={openAddForm}>
                        <Plus className="w-3.5 h-3.5" /> Add Date
                    </ActionButton>
                </div>
            </div>

            {/* Inline Add / Edit Form in Same Column */}
            {showForm && (
                <form
                    onSubmit={handleFormSubmit}
                    className="p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 space-y-2.5"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">
                            {editingDayId ? 'Edit Date Details' : 'Add New Date'}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingDayId(null);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Close"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <DateInput
                        label="Date"
                        value={dateVal}
                        onChange={(e) => setDateVal(e.target.value)}
                        required
                    />

                    <TextInput
                        label="Night Stay Place"
                        value={nightStayLocation}
                        onChange={(e) => setNightStayLocation(e.target.value)}
                        placeholder="e.g., Munnar / Hotel Tea Valley"
                    />

                    <TextInput
                        label="Staying Notes"
                        value={nightStayNotes}
                        onChange={(e) => setNightStayNotes(e.target.value)}
                        placeholder="Check-in / parking / room details"
                    />

                    <TextAreaInput
                        label="Daily Note"
                        rows={2}
                        value={dailyNotes}
                        onChange={(e) => setDailyNotes(e.target.value)}
                        placeholder="Notes for this day..."
                    />

                    <div className="flex items-center gap-2 pt-0.5">
                        <ActionButton
                            type="submit"
                            variant="primary"
                            disabled={isSavingDay}
                            className="flex-1"
                        >
                            {isSavingDay
                                ? 'Saving...'
                                : editingDayId
                                    ? 'Update Date'
                                    : 'Save Date'}
                        </ActionButton>
                        <ActionButton
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowForm(false);
                                setEditingDayId(null);
                            }}
                        >
                            Cancel
                        </ActionButton>
                    </div>
                </form>
            )}

            {/* Sequential Date Cards */}
            <div className="flex flex-col gap-2.5">
                {days.map((day, index) => {
                    const isSelected = selectedDayId === day.id;
                    const isDragOver = dragOverIndex === index;
                    const meta = day.day_metadata || {};

                    const indicators = [
                        {
                            key: 'leg',
                            label: 'Leg',
                            filled: (legsCountByDayId[day.id] || 0) > 0,
                            icon: <Car className="w-3 h-3" />,
                        },
                        {
                            key: 'stay',
                            label: 'Stay',
                            filled:
                                Boolean(day.night_stay_location?.trim()) ||
                                (Array.isArray(meta.stays) && meta.stays.length > 0),
                            icon: <BedDouble className="w-3 h-3" />,
                        },
                        {
                            key: 'dining',
                            label: 'Dining',
                            filled: Array.isArray(meta.dining) && meta.dining.length > 0,
                            icon: <Utensils className="w-3 h-3" />,
                        },
                        {
                            key: 'attraction',
                            label: 'Spot',
                            filled: Array.isArray(meta.attractions) && meta.attractions.length > 0,
                            icon: <Camera className="w-3 h-3" />,
                        },
                    ];

                    return (
                        <div
                            key={day.id}
                            draggable
                            onDragStart={(e) => {
                                setDraggedIndex(index);
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                if (draggedIndex !== null && draggedIndex !== index) {
                                    setDragOverIndex(index);
                                }
                            }}
                            onDragLeave={() => setDragOverIndex(null)}
                            onDrop={(e) => handleDrop(e, index)}
                            onClick={() => onSelectDay(day)}
                            className={`relative w-full text-left p-3 rounded-xl border transition-all cursor-pointer select-none ${isSelected
                                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                                } ${isDragOver ? 'border-t-2 border-t-indigo-500' : ''}`}
                        >
                            <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1 min-w-0">
                                    <GripVertical className="w-4 h-4 text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                                        Day {day.day_number}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200">
                                        <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                                        {day.date}
                                    </span>

                                    {/* Top-Right Menu Icon */}
                                    <div
                                        className="relative"
                                        ref={openMenuDayId === day.id ? menuRef : null}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMenuDayId(openMenuDayId === day.id ? null : day.id)
                                            }
                                            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition"
                                            title="Date Options"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        {openMenuDayId === day.id && (
                                            <div className="absolute right-0 top-7 z-30 w-28 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenMenuDayId(null);
                                                        openEditForm(day);
                                                    }}
                                                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold"
                                                >
                                                    <Pencil className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Edit</span>
                                                </button>

                                                {onDeleteDay && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenMenuDayId(null);
                                                            setConfirmDeleteDayId(day.id);
                                                        }}
                                                        className="w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 font-semibold"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>Delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Night Stay Place Name */}
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                                <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                <span className="truncate">
                                    {day.night_stay_location || 'No night stay set'}
                                </span>
                            </div>

                            {/* 4 Indicators: Leg, Stay, Dining, Attraction */}
                            <div className="mt-2.5 grid grid-cols-4 gap-1">
                                {indicators.map((ind) => (
                                    <div
                                        key={ind.key}
                                        title={`${ind.label}: ${ind.filled ? 'Filled' : 'Empty'}`}
                                        className={`flex items-center justify-center gap-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-colors ${ind.filled
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                                : 'bg-transparent text-slate-400 dark:text-slate-500 border-dashed border-slate-300 dark:border-slate-700'
                                            }`}
                                    >
                                        {ind.icon}
                                        <span className="truncate">{ind.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDeleteDayId && onDeleteDay && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
                    onClick={() => setConfirmDeleteDayId(null)}
                >
                    <div
                        className="max-w-sm w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-1.5">
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                                Delete This Date?
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                This will remove the date and its linked travel legs and notes.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <ActionButton
                                type="button"
                                variant="secondary"
                                onClick={() => setConfirmDeleteDayId(null)}
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton
                                type="button"
                                variant="danger"
                                onClick={() => {
                                    const idToDelete = confirmDeleteDayId;
                                    setConfirmDeleteDayId(null);
                                    onDeleteDay(idToDelete);
                                }}
                            >
                                Delete
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}