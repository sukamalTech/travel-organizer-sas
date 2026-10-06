// 'use client';

// import React, { useState } from 'react';
// import { TransportMode } from '@/lib/validations/itinerary';
// import {
//     DndContext,
//     closestCenter,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors,
//     DragEndEvent,
// } from '@dnd-kit/core';
// import {
//     arrayMove,
//     SortableContext,
//     sortableKeyboardCoordinates,
//     verticalListSortingStrategy,
//     useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { GripVertical, Train, Car, Bus, Plane, Bike, Footprints, Edit3, Trash2 } from 'lucide-react';

// export interface LegItem {
//     id: string;
//     day_id?: string;
//     trip_id?: string;
//     origin_name: string;
//     destination_name: string;
//     mode: TransportMode;
//     sequence_order: number;
//     metadata?: Record<string, any>;
//     [key: string]: any;
// }

// // interface LegReorderListProps {
// //     legs: LegItem[];
// //     onReorder: (reorderedLegs: LegItem[]) => void;
// //     onSelectLeg: (leg: LegItem) => void;
// //     onDeleteLeg: (id: string) => void;
// // }
// interface LegReorderListProps {
//     legs: LegItem[];
//     onReorder: (legs: LegItem[]) => void;
//     onSelectLeg: (leg: LegItem) => void;
//     onDeleteLeg: (id: string) => Promise<void>;
// }

// function SortableLegRow({
//     leg,
//     onSelect,
//     onDelete,
// }: {
//     leg: LegItem;
//     onSelect: () => void;
//     onDelete: () => void;
// }) {
//     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: leg.id });

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//     };

//     const renderModeIcon = (mode: string) => {
//         switch (mode) {
//             case 'train': return <Train className="w-4 h-4 text-blue-500" />;
//             case 'car': return <Car className="w-4 h-4 text-emerald-500" />;
//             case 'bike': return <Bike className="w-4 h-4 text-amber-500" />;
//             case 'flight': return <Plane className="w-4 h-4 text-indigo-500" />;
//             case 'bus': return <Bus className="w-4 h-4 text-purple-500" />;
//             default: return <Footprints className="w-4 h-4 text-slate-500" />;
//         }
//     };

//     return (
//         <div
//             ref={setNodeRef}
//             style={style}
//             className="flex items-center justify-between p-3 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-400 transition"
//         >
//             <div className="flex items-center gap-3">
//                 <button {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600">
//                     <GripVertical className="w-4 h-4" />
//                 </button>
//                 <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
//                     {renderModeIcon(leg.mode)}
//                 </div>
//                 <div>
//                     <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
//                         {leg.origin_name} &rarr; {leg.destination_name}
//                     </p>
//                     <span className="text-[10px] text-slate-400 uppercase font-mono">{leg.mode} leg</span>
//                 </div>
//             </div>

//             <div className="flex items-center gap-1">
//                 <button
//                     onClick={onSelect}
//                     className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
//                 >
//                     <Edit3 className="w-3.5 h-3.5" />
//                 </button>
//                 <button
//                     onClick={onDelete}
//                     className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
//                 >
//                     <Trash2 className="w-3.5 h-3.5" />
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default function LegReorderList({ legs, onReorder, onSelectLeg, onDeleteLeg }: LegReorderListProps) {
//     const [items, setItems] = useState<LegItem[]>(legs);

//     const sensors = useSensors(
//         useSensor(PointerSensor),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates,
//         })
//     );

//     const handleDragEnd = (event: DragEndEvent) => {
//         const { active, over } = event;

//         if (over && active.id !== over.id) {
//             const oldIndex = items.findIndex((item) => item.id === active.id);
//             const newIndex = items.findIndex((item) => item.id === over.id);

//             const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
//                 ...item,
//                 sequence_order: idx + 1,
//             }));

//             setItems(reordered);
//             onReorder(reordered);
//         }
//     };

//     return (
//         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//             <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
//                 <div className="space-y-1">
//                     {items.map((leg) => (
//                         <SortableLegRow
//                             key={leg.id}
//                             leg={leg}
//                             onSelect={() => onSelectLeg(leg)}
//                             onDelete={() => onDeleteLeg(leg.id)}
//                         />
//                     ))}
//                 </div>
//             </SortableContext>
//         </DndContext>
//     );
// }


'use client';

import React, { useState, useEffect } from 'react';
// Import LegItem directly from your validations file to avoid type mismatches
import { LegItem } from '@/lib/validations/itinerary';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Train, Car, Bus, Plane, Bike, Footprints, Edit3, Trash2, Ship } from 'lucide-react';

interface LegReorderListProps {
    legs: LegItem[];
    onReorder: (legs: LegItem[]) => void;
    onSelectLeg: (leg: LegItem) => void;
    onDeleteLeg: (id: string) => Promise<void>;
}

function SortableLegRow({
    leg,
    onSelect,
    onDelete,
}: {
    leg: LegItem;
    onSelect: () => void;
    onDelete: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: leg.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const renderModeIcon = (mode: string) => {
        switch (mode) {
            case 'train':
                return <Train className="w-4 h-4 text-blue-500" />;
            case 'car':
                return <Car className="w-4 h-4 text-emerald-500" />;
            case 'bike':
                return <Bike className="w-4 h-4 text-amber-500" />;
            case 'flight':
                return <Plane className="w-4 h-4 text-indigo-500" />;
            case 'bus':
                return <Bus className="w-4 h-4 text-purple-500" />;
            case 'ferry':
                return <Ship className="w-4 h-4 text-teal-500" />;
            case 'walk':
            default:
                return <Footprints className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-3 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-400 transition"
        >
            <div className="flex items-center gap-3 min-w-0">
                {/* Drag Handle */}
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
                    title="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
                    {renderModeIcon(leg.mode)}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {leg.origin_name || 'Origin'} &rarr; {leg.destination_name || 'Destination'}
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                        Leg #{leg.sequence_order} &bull; {leg.mode}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect();
                    }}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                    title="Edit Leg"
                >
                    <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                    title="Delete Leg"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default function LegReorderList({ legs, onReorder, onSelectLeg, onDeleteLeg }: LegReorderListProps) {
    const [items, setItems] = useState<LegItem[]>(legs);

    // Sync local state when parent legs prop updates (e.g. on fetch, delete, add)
    useEffect(() => {
        setItems(legs);
    }, [legs]);

    // Activation constraint prevents accidental drag when clicking buttons
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires 5px move to initiate drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
                ...item,
                sequence_order: idx + 1,
            }));

            setItems(reordered);
            onReorder(reordered);
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-xs text-slate-400">No travel legs added for this day yet.</p>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                    {items.map((leg) => (
                        <SortableLegRow
                            key={leg.id}
                            leg={leg}
                            onSelect={() => onSelectLeg(leg)}
                            onDelete={() => onDeleteLeg(leg.id)}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}