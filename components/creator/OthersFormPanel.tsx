'use client';
import React, { useState, useEffect } from 'react';
import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/others-details/page';
import { Save, X } from 'lucide-react';

interface OthersFormPanelProps {
    activeTab: ActiveTabType;
    selectedItem: any;
    isSubmitting: boolean;
    onSubmit: (values: any) => void;
    onCancel: () => void;
}

export default function OthersFormPanel({
    activeTab,
    selectedItem,
    isSubmitting,
    onSubmit,
    onCancel,
}: OthersFormPanelProps) {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        setFormData(selectedItem || {});
    }, [selectedItem]);

    const handleChange = (field: string, val: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: val }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Name</label>
                <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder={activeTab === 'accommodation' ? 'Hotel Name' : activeTab === 'attraction' ? 'Monument Name' : 'Restaurant Name'}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Accommodation Specific Fields */}
            {activeTab === 'accommodation' && (
                // <>
                //     <div className="grid grid-cols-2 gap-3">
                //         <div>
                //             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status</label>
                //             <input
                //                 type="text"
                //                 value={formData.status || 'Confirmed'}
                //                 onChange={(e) => handleChange('status', e.target.value)}
                //                 className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //             />
                //         </div>
                //         <div>
                //             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Estimated Cost</label>
                //             <input
                //                 type="number"
                //                 step="0.01"
                //                 value={formData.estimatedCost || ''}
                //                 onChange={(e) => handleChange('estimatedCost', e.target.value)}
                //                 className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //             />
                //         </div>
                //     </div>
                //     <div className="grid grid-cols-2 gap-3">
                //         <div>
                //             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Check-In</label>
                //             <input
                //                 type="datetime-local"
                //                 value={formData.checkIn ? formData.checkIn.slice(0, 16) : ''}
                //                 onChange={(e) => handleChange('checkIn', e.target.value)}
                //                 className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //             />
                //         </div>
                //         <div>
                //             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Check-Out</label>
                //             <input
                //                 type="datetime-local"
                //                 value={formData.checkOut ? formData.checkOut.slice(0, 16) : ''}
                //                 onChange={(e) => handleChange('checkOut', e.target.value)}
                //                 className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //             />
                //         </div>
                //     </div>
                // </>
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status / Type</label>
                            <select
                                value={formData.status || 'Confirmed'}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Budget">Budget</option>
                                <option value="Homestay">Homestay</option>
                                <option value="2 Star">2 Star</option>
                                <option value="3 Star">3 Star</option>
                                <option value="4 Star">4 Star</option>
                                <option value="5 Star">5 Star</option>
                                <option value="Tent">Tent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Currency</label>
                            <input
                                type="text"
                                placeholder="e.g. USD, EUR"
                                value={formData.currency || ''}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Estimated Cost</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.estimatedCost || ''}
                                onChange={(e) => handleChange('estimatedCost', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Actual Cost</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.actualCost || ''}
                                onChange={(e) => handleChange('actualCost', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={formData.phoneNumber || ''}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Booking Reference</label>
                            <input
                                type="text"
                                value={formData.bookingReference || ''}
                                onChange={(e) => handleChange('bookingReference', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">External Booking URL</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={formData.externalBookingUrl || ''}
                            onChange={(e) => handleChange('externalBookingUrl', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude || ''}
                                onChange={(e) => handleChange('latitude', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude || ''}
                                onChange={(e) => handleChange('longitude', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Attraction Specific Fields */}
            {activeTab === 'attraction' && (
                // <div className="grid grid-cols-2 gap-3">
                //     <div>
                //         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Entry Fee</label>
                //         <input
                //             type="number"
                //             step="0.01"
                //             value={formData.entryFee || ''}
                //             onChange={(e) => handleChange('entryFee', e.target.value)}
                //             className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //         />
                //     </div>
                //     <div>
                //         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Distance From Base (km)</label>
                //         <input
                //             type="number"
                //             step="0.1"
                //             value={formData.distanceFromBaseKm || ''}
                //             onChange={(e) => handleChange('distanceFromBaseKm', e.target.value)}
                //             className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //         />
                //     </div>
                // </div>
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Currency</label>
                            <input
                                type="text"
                                placeholder="e.g. USD, EUR"
                                value={formData.currency || ''}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Entry Fee</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.entryFee || ''}
                                onChange={(e) => handleChange('entryFee', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Opening Time (15m interval)</label>
                            <input
                                type="time"
                                step="900"
                                value={formData.openingTime || ''}
                                onChange={(e) => handleChange('openingTime', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Closing Time (15m interval)</label>
                            <input
                                type="time"
                                step="900"
                                value={formData.closingTime || ''}
                                onChange={(e) => handleChange('closingTime', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Distance From Base (km)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.distanceFromBaseKm || ''}
                            onChange={(e) => handleChange('distanceFromBaseKm', e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 28.6139"
                                value={formData.latitude || ''}
                                onChange={(e) => handleChange('latitude', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 77.2090"
                                value={formData.longitude || ''}
                                onChange={(e) => handleChange('longitude', e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Highlights (comma-separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. Sunset view, Historic architecture, Guided tour"
                            value={Array.isArray(formData.highlights) ? formData.highlights.join(', ') : (formData.highlights || '')}
                            onChange={(e) => handleChange('highlights', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Photography Notes (comma-separated)</label>
                        <textarea
                            rows={2}
                            placeholder="e.g. Best light during golden hour, Tripod allowed"
                            value={Array.isArray(formData.photographyNotes) ? formData.photographyNotes.join(', ') : (formData.photographyNotes || '')}
                            onChange={(e) => handleChange('photographyNotes', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none"
                        />
                    </div>
                </>
            )}

            {/* Dining Specific Fields */}
            {activeTab === 'dining' && (
                // <div className="grid grid-cols-2 gap-3">
                //     <div>
                //         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cuisine Type</label>
                //         <input
                //             type="text"
                //             value={formData.cuisineType || ''}
                //             onChange={(e) => handleChange('cuisineType', e.target.value)}
                //             placeholder="e.g. Local Bengali, Cafe"
                //             className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //         />
                //     </div>
                //     <div>
                //         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Rating (out of 5)</label>
                //         <input
                //             type="number"
                //             step="0.1"
                //             max="5"
                //             value={formData.rating || ''}
                //             onChange={(e) => handleChange('rating', e.target.value)}
                //             className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                //         />
                //     </div>
                // </div>
                <div className="space-y-3">
                    {/* Row 1: Category & Cuisine Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category || ''}
                                onChange={(e) => handleChange('category', e.target.value)}
                                placeholder="e.g. Restaurant, Cafe"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cuisine Type</label>
                            <input
                                type="text"
                                value={formData.cuisineType || ''}
                                onChange={(e) => handleChange('cuisineType', e.target.value)}
                                placeholder="e.g. Local Bengali, Cafe"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Row 2: Estimated Cost & Rating */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Estimated Cost (Per Person)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.estimatedCost || ''}
                                onChange={(e) => handleChange('estimatedCost', e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Rating (out of 5)</label>
                            <input
                                type="number"
                                step="0.1"
                                max="5"
                                value={formData.rating || ''}
                                onChange={(e) => handleChange('rating', e.target.value)}
                                placeholder="e.g. 4.5"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Row 3: Latitude & Longitude */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude || ''}
                                onChange={(e) => handleChange('latitude', e.target.value)}
                                placeholder="e.g. 22.5726"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude || ''}
                                onChange={(e) => handleChange('longitude', e.target.value)}
                                placeholder="e.g. 88.3639"
                                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Address / Location</label>
                <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Full street address"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                {selectedItem?.id && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                    <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save to TiDB'}
                </button>
            </div>
        </form>
    );
}