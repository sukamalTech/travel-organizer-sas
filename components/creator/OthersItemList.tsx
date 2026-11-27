


// 'use client';

// import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/edit/page';
// import {
//     Plus,
//     Building2,
//     MapPin,
//     Utensils,
//     Car,
//     Edit3,
//     Trash2,
// } from 'lucide-react';
// import { ActionButton } from '@/components/ui/FormControls';

// interface OthersItemListProps {
//     activeTab: ActiveTabType;
//     selectedDayId: string | null;
//     legs: any[];
//     accommodations: any[];
//     attractions: any[];
//     diningSpots: any[];
//     onSelectItem: (item: any) => void;
//     onDeleteItem: (id: string, type: ActiveTabType) => void;
//     onAddNew: () => void;
// }

// export default function OthersItemList({
//     activeTab,
//     selectedDayId,
//     legs = [],
//     accommodations,
//     attractions,
//     diningSpots,
//     onSelectItem,
//     onDeleteItem,
//     onAddNew,
// }: OthersItemListProps) {
//     // Filter items matching the currently selected day
//     const currentItems = (() => {
//         switch (activeTab) {
//             case 'leg':
//                 return legs.filter(
//                     (i) => !selectedDayId || (i.day_id || i.dayId) === selectedDayId
//                 );
//             case 'accommodation':
//                 return accommodations.filter(
//                     (i) => !selectedDayId || (i.dayId || i.day_id) === selectedDayId
//                 );
//             case 'attraction':
//                 return attractions.filter(
//                     (i) => !selectedDayId || (i.dayId || i.day_id) === selectedDayId
//                 );
//             case 'dining':
//             default:
//                 return diningSpots.filter(
//                     (i) => !selectedDayId || (i.dayId || i.day_id) === selectedDayId
//                 );
//         }
//     })();

//     const tabLabel =
//         activeTab === 'leg'
//             ? 'Travel Leg'
//             : activeTab === 'accommodation'
//                 ? 'Stay'
//                 : activeTab === 'attraction'
//                     ? 'Attraction'
//                     : 'Dining';

//     return (
//         <section className="h-full border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
//             <div className="flex items-center justify-between gap-2">
//                 <div>
//                     <h2 className="text-xs font-bold dark:text-yellow-200 uppercase tracking-wider">
//                         {tabLabel} Entries
//                     </h2>
//                     <p className="text-xs dark:text-green-300">
//                         {currentItems.length} record{currentItems.length === 1 ? '' : 's'} found for day
//                     </p>
//                 </div>

//             </div>

//             <div className="space-y-2">
//                 {currentItems.length === 0 ? (
//                     <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
//                         <p className="text-xs text-slate-400">
//                             No {tabLabel.toLowerCase()}s recorded for this day.
//                         </p>
//                     </div>
//                 ) : (
//                     currentItems.map((item, idx) => {
//                         const title =
//                             activeTab === 'leg'
//                                 ? `${item.sequence_order || idx + 1}. ${item.origin_name || 'Origin'} → ${item.destination_name || 'Destination'}`
//                                 : item.name;

//                         const subtitle =
//                             activeTab === 'leg'
//                                 ? `${item.mode || 'car'}${item.distance_km ? ` • ${item.distance_km} km` : ''}`
//                                 : item.address || item.category || item.status || 'TiDB Record';

//                         return (
//                             <div
//                                 key={item.id}
//                                 className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-400 transition"
//                             >
//                                 <div className="flex items-center gap-3 min-w-0">
//                                     <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0 text-blue-500">
//                                         {activeTab === 'leg' && <Car className="w-4 h-4" />}
//                                         {activeTab === 'accommodation' && <Building2 className="w-4 h-4" />}
//                                         {activeTab === 'attraction' && <MapPin className="w-4 h-4" />}
//                                         {activeTab === 'dining' && <Utensils className="w-4 h-4" />}
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
//                                             {title}
//                                         </p>
//                                         <span className="text-[10px] text-slate-400 uppercase font-mono truncate block">
//                                             {subtitle}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-1.5 shrink-0">
//                                     <ActionButton
//                                         type="button"
//                                         variant="secondary"
//                                         onClick={() => onSelectItem(item)}
//                                         className="px-2 py-1.5 hover:text-blue-600 dark:hover:text-blue-400"
//                                         title="Edit item"
//                                     >
//                                         <Edit3 className="w-3.5 h-3.5" />
//                                     </ActionButton>
//                                     <ActionButton
//                                         type="button"
//                                         variant="secondary"
//                                         onClick={() => onDeleteItem(item.id, activeTab)}
//                                         className="px-2 py-1.5 hover:text-rose-600 dark:hover:text-rose-400"
//                                         title="Delete item"
//                                     >
//                                         <Trash2 className="w-3.5 h-3.5" />
//                                     </ActionButton>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>
//         </section>
//     );
// }


'use client';

import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/edit/page';
import {
    Plus,
    Building2,
    MapPin,
    Utensils,
    Car,
    Edit3,
    Trash2,
} from 'lucide-react';
import { ActionButton } from '@/components/ui/FormControls';

interface OthersItemListProps {
    activeTab: ActiveTabType;
    selectedDayId: string | null;
    legs: any[];
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
    legs = [],
    accommodations = [],
    attractions = [],
    diningSpots = [],
    onSelectItem,
    onDeleteItem,
    onAddNew,
}: OthersItemListProps) {
    const matchesSelectedDay = (item: any) => {
        if (!selectedDayId) return true;
        const itemDayId = item?.dayId ?? item?.day_id ?? null;
        return itemDayId === selectedDayId;
    };

    const currentItems = (() => {
        switch (activeTab) {
            case 'leg':
                return legs.filter(matchesSelectedDay);
            case 'accommodation':
                return accommodations.filter(matchesSelectedDay);
            case 'attraction':
                return attractions.filter(matchesSelectedDay);
            case 'dining':
            default:
                return diningSpots.filter(matchesSelectedDay);
        }
    })();

    const tabLabel =
        activeTab === 'leg'
            ? 'Travel Leg'
            : activeTab === 'accommodation'
                ? 'Stay'
                : activeTab === 'attraction'
                    ? 'Attraction'
                    : 'Dining';

    return (
        <section className="h-full border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h2 className="text-xs font-bold text-slate-700 dark:text-yellow-200 uppercase tracking-wider">
                        {tabLabel} Entries
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-green-300">
                        {currentItems.length} record{currentItems.length === 1 ? '' : 's'} found for day
                    </p>
                </div>

                <ActionButton
                    type="button"
                    variant="secondary"
                    onClick={onAddNew}
                    className="text-blue-600 dark:text-blue-400"
                >
                    <Plus className="w-3.5 h-3.5" /> Add New
                </ActionButton>
            </div>

            <div className="space-y-2">
                {currentItems.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                        <p className="text-xs text-slate-400">
                            No {tabLabel.toLowerCase()}s recorded for this day.
                        </p>
                    </div>
                ) : (
                    currentItems.map((item, idx) => {
                        const seq = item.sequenceOrder ?? item.sequence_order ?? idx + 1;
                        const origin = item.originName ?? item.origin_name ?? 'Origin';
                        const destination = item.destinationName ?? item.destination_name ?? 'Destination';
                        const distance = item.distanceKm ?? item.distance_km;

                        const title =
                            activeTab === 'leg'
                                ? `${seq}. ${origin} → ${destination}`
                                : item.name;

                        const subtitle =
                            activeTab === 'leg'
                                ? `${item.mode || 'car'}${distance ? ` • ${distance} km` : ''}`
                                : item.address || item.category || item.status || 'TiDB Record';

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-400 transition"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0 text-blue-500">
                                        {activeTab === 'leg' && <Car className="w-4 h-4" />}
                                        {activeTab === 'accommodation' && <Building2 className="w-4 h-4" />}
                                        {activeTab === 'attraction' && <MapPin className="w-4 h-4" />}
                                        {activeTab === 'dining' && <Utensils className="w-4 h-4" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                            {title}
                                        </p>
                                        <span className="text-[10px] text-slate-400 uppercase font-mono truncate block">
                                            {subtitle}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <ActionButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => onSelectItem(item)}
                                        className="px-2 py-1.5 hover:text-blue-600 dark:hover:text-blue-400"
                                        title="Edit item"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </ActionButton>
                                    <ActionButton
                                        type="button"
                                        variant="secondary"
                                        onClick={() => onDeleteItem(item.id, activeTab)}
                                        className="px-2 py-1.5 hover:text-rose-600 dark:hover:text-rose-400"
                                        title="Delete item"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </ActionButton>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}