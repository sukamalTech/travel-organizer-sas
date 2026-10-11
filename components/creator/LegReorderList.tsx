// src/components/creator/LegReorderList.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
import { GripVertical, Train, Car, Bus, Plane, Bike, Footprints, Edit3, Trash2, Ship, AlertTriangle } from 'lucide-react';

interface LegReorderListProps {
    legs: LegItem[];
    onReorder: (legs: LegItem[]) => void;
    onSelectLeg: (leg: LegItem) => void;
    onDeleteLeg: (id: string) => Promise<void>;
    selectedLegId?: string | null;
}

const truncateText = (text: string, maxLength: number = 11) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

function SortableLegRow({
    leg,
    onSelect,
    onConfirmDelete,
    isSelected,
}: {
    leg: LegItem;
    onSelect: () => void;
    onConfirmDelete: () => void;
    isSelected: boolean;
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
            onClick={onSelect}
            className={`flex items-center justify-between p-3 mb-2 rounded-xl transition cursor-pointer shadow-sm ${isSelected
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
                    title="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
                    {renderModeIcon(leg.mode)}
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={`${leg.origin_name} → ${leg.destination_name}`}>
                        {truncateText(leg.origin_name || 'Origin', 11)} &rarr; {truncateText(leg.destination_name || 'Destination', 11)}
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
                    className={`p-1.5 rounded-lg transition ${isSelected
                            ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50'
                            : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    title="Edit Leg"
                >
                    <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onConfirmDelete();
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

export default function LegReorderList({ legs, onReorder, onSelectLeg, onDeleteLeg, selectedLegId }: LegReorderListProps) {
    const [items, setItems] = useState<LegItem[]>(legs);
    const [legToDelete, setLegToDelete] = useState<LegItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setItems(legs);
    }, [legs]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
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

    const confirmDelete = async () => {
        if (!legToDelete) return;
        setIsDeleting(true);
        try {
            await onDeleteLeg(legToDelete.id);
        } finally {
            setIsDeleting(false);
            setLegToDelete(null);
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
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                        {items.map((leg) => (
                            <SortableLegRow
                                key={leg.id}
                                leg={leg}
                                isSelected={selectedLegId === leg.id}
                                onSelect={() => onSelectLeg(leg)}
                                onConfirmDelete={() => setLegToDelete(leg)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Delete Confirmation Modal Popup */}
            {legToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in text-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-xl">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100">Delete Travel Leg</h3>
                                <p className="text-slate-500 text-[11px]">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl font-medium">
                            Are you sure you want to delete leg <span className="font-bold">#{legToDelete.sequence_order}</span> ({legToDelete.origin_name} &rarr; {legToDelete.destination_name})?
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setLegToDelete(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-md disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}