'use client';
import React from 'react';
import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/others-details/page';
import { Plus, Building2, MapPin, Utensils, Edit3, Trash2 } from 'lucide-react';

interface OthersItemListProps {
    activeTab: ActiveTabType;
    selectedDayId: string | null;
    accommodations: any[];
    attractions: any[];
    diningSpots: any[];
    onSelectItem: (item: any) => void;
    onDeleteItem: (id: string, type: ActiveTabType) => void;
    onAddNew: () => void;
}

export default function OthersItemList({
    activeTab,
    selectedDayId,
    accommodations,
    attractions,
    diningSpots,
    onSelectItem,
    onDeleteItem,
    onAddNew,
}: OthersItemListProps) {
    // Filter items matching the current selected day
    const currentItems =
        activeTab === 'accommodation'
            ? accommodations.filter(i => !selectedDayId || i.dayId === selectedDayId)
            : activeTab === 'attraction'
                ? attractions.filter(i => !selectedDayId || i.dayId === selectedDayId)
                : diningSpots.filter(i => !selectedDayId || i.dayId === selectedDayId);

    return (
        <section className="col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {activeTab} Entries
                    </h2>
                    <p className="text-xs text-slate-500">
                        {currentItems.length} record{currentItems.length === 1 ? '' : 's'} found for day
                    </p>
                </div>
                <button
                    onClick={onAddNew}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition"
                >
                    <Plus className="w-3.5 h-3.5" /> Add New
                </button>
            </div>

            <div className="space-y-2">
                {currentItems.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                        <p className="text-xs text-slate-400">No {activeTab}s recorded for this day.</p>
                    </div>
                ) : (
                    currentItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-400 transition"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0 text-blue-500">
                                    {activeTab === 'accommodation' && <Building2 className="w-4 h-4" />}
                                    {activeTab === 'attraction' && <MapPin className="w-4 h-4" />}
                                    {activeTab === 'dining' && <Utensils className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                        {item.name}
                                    </p>
                                    <span className="text-[10px] text-slate-400 uppercase font-mono truncate block">
                                        {item.address || item.category || item.status || 'TiDB Record'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                    onClick={() => onSelectItem(item)}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => onDeleteItem(item.id, activeTab)}
                                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}