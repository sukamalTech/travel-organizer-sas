




// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/others-details/page';
// import { Save, X, Search, MapPin, Loader2, Navigation, Check } from 'lucide-react';
// import dynamic from 'next/dynamic';

// interface OthersFormPanelProps {
//     activeTab: ActiveTabType;
//     selectedItem: any;
//     isSubmitting: boolean;
//     onSubmit: (values: any) => void;
//     onCancel: () => void;
// }

// const COMMON_FACILITIES = [
//     'Parking',
//     'Wi-Fi',
//     'Swimming Pool',
//     'AC',
//     'Restaurant',
//     'Room Service',
//     'Power Backup',
//     'Pet Friendly'
// ];

// export default function OthersFormPanel({
//     activeTab,
//     selectedItem,
//     isSubmitting,
//     onSubmit,
//     onCancel,
// }: OthersFormPanelProps) {
//     const LocationMapPreview = dynamic(
//         () => import('./LocationMapPreview'),
//         { ssr: false }
//     );
//     const [formData, setFormData] = useState<any>({});

//     // Mapbox Search States
//     const [searchQuery, setSearchQuery] = useState('');
//     const [suggestions, setSuggestions] = useState<any[]>([]);
//     const [isSearching, setIsSearching] = useState(false);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     // Replace with your Mapbox Public Access Token
//     const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

//     useEffect(() => {
//         setFormData(selectedItem || {});
//         setSearchQuery(selectedItem?.name || '');
//     }, [selectedItem]);

//     const resetForm = () => {
//         setFormData({});
//         setSearchQuery('');
//         setSuggestions([]);
//         setShowDropdown(false);
//     };

//     const handleChange = (field: string, val: any) => {
//         setFormData((prev: any) => ({ ...prev, [field]: val }));
//     };

//     const toggleFacility = (facility: string) => {
//         const currentFacilities = Array.isArray(formData.facilities) ? formData.facilities : [];
//         if (currentFacilities.includes(facility)) {
//             handleChange(
//                 'facilities',
//                 currentFacilities.filter((f: string) => f !== facility)
//             );
//         } else {
//             handleChange('facilities', [...currentFacilities, facility]);
//         }
//     };

//     const handleSearchSubmit = async (e?: React.FormEvent) => {
//         if (e) e.preventDefault();
//         if (!searchQuery.trim()) return;

//         setIsSearching(true);
//         setShowDropdown(false);
//         handleChange('name', searchQuery);

//         try {
//             // OpenStreetMap Nominatim API (Free, no API key required)
//             const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//                 searchQuery
//             )}&format=jsonv2&extratags=1&addressdetails=1&limit=5`;

//             const res = await fetch(endpoint, {
//                 headers: {
//                     'User-Agent': 'TravelItineraryApp/1.0 (contact@example.com)' // Required by OSM usage policy
//                 }
//             });
//             const data = await res.json();
//             setSuggestions(data || []);
//             if (data && data.length > 0) {
//                 setShowDropdown(true);
//             }
//         } catch (err) {
//             console.error('Error fetching Nominatim places:', err);
//             setSuggestions([]);
//         } finally {
//             setIsSearching(false);
//         }
//     };

//     // Handle selecting a place from the search results
//     const handleSelectSuggestion = (item: any) => {
//         const placeName = item.name || item.display_name.split(',')[0];

//         setSearchQuery(placeName);
//         setShowDropdown(false);
//         setSuggestions([]);

//         // Populate form fields
//         handleChange('name', placeName);
//         if (item.display_name) {
//             handleChange('address', item.display_name);
//         }
//         if (item.lat && item.lon) {
//             handleChange('latitude', parseFloat(item.lat));
//             handleChange('longitude', parseFloat(item.lon));
//         }

//         // Capture small description / category if available from OSM extratags
//         if (item.extratags) {
//             const desc = item.extratags.description || item.extratags.wikipedia || item.category;
//             if (desc) {
//                 handleChange('highlights', [desc]);
//             }
//         }
//     };
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         await onSubmit(formData);
//         resetForm();
//     };

//     const lat = formData.latitude ? parseFloat(formData.latitude) : null;
//     const lng = formData.longitude ? parseFloat(formData.longitude) : null;

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 relative">
//             {/* Name Input with On-Demand Search */}
//             <div className="relative">
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Name</label>
//                 <div className="relative flex items-center">
//                     <input
//                         type="text"
//                         required
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         onKeyDown={(e) => {
//                             if (e.key === 'Enter') {
//                                 handleSearchSubmit();
//                             }
//                         }}
//                         placeholder={
//                             activeTab === 'accommodation'
//                                 ? 'Search Hotel Name (Press Enter)'
//                                 : activeTab === 'attraction'
//                                     ? 'Search Monument Name (Press Enter)'
//                                     : 'Search Restaurant Name (Press Enter)'
//                         }
//                         className="text-slate-900 dark:text-slate-100 w-full pl-8 pr-16 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />

//                     <button
//                         type="button"
//                         onClick={() => handleSearchSubmit()}
//                         className="absolute right-1.5 px-2 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-medium hover:bg-blue-700 transition"
//                     >
//                         {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
//                     </button>
//                 </div>

//                 {/* Search Results Dropdown */}
//                 {showDropdown && suggestions.length > 0 && (
//                     <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto text-xs">
//                         {suggestions.map((item, idx) => (
//                             <li
//                                 key={idx}
//                                 onClick={() => handleSelectSuggestion(item)}
//                                 className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-start gap-2 border-b border-slate-100 dark:border-slate-800 last:border-none"
//                             >
//                                 <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
//                                 <div>
//                                     <p className="font-semibold text-slate-900 dark:text-slate-100">
//                                         {item.name || item.display_name.split(',')[0]}
//                                     </p>
//                                     <p className="text-[10px] text-slate-500 truncate">{item.display_name}</p>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>


//             {/* Accommodation Specific Fields */}
//             {activeTab === 'accommodation' && (
//                 <>
//                     {/* Optional Place Name */}
//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Place Name</label>
//                         <input
//                             type="text"
//                             placeholder="e.g. Downtown District, Mall Road"
//                             value={formData.placeName || ''}
//                             onChange={(e) => handleChange('placeName', e.target.value)}
//                             className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status / Type</label>
//                             <select
//                                 value={formData.status || 'Confirmed'}
//                                 onChange={(e) => handleChange('status', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             >
//                                 <option value="Confirmed">Confirmed</option>
//                                 <option value="Budget">Budget</option>
//                                 <option value="Homestay">Homestay</option>
//                                 <option value="2 Star">2 Star</option>
//                                 <option value="3 Star">3 Star</option>
//                                 <option value="4 Star">4 Star</option>
//                                 <option value="5 Star">5 Star</option>
//                                 <option value="Tent">Tent</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Currency</label>
//                             <input
//                                 type="text"
//                                 placeholder="e.g. USD, EUR"
//                                 value={formData.currency || ''}
//                                 onChange={(e) => handleChange('currency', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     {/* Facilities Array Multi-select */}
//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Facilities</label>
//                         <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
//                             {COMMON_FACILITIES.map((facility) => {
//                                 const isSelected = Array.isArray(formData.facilities) && formData.facilities.includes(facility);
//                                 return (
//                                     <button
//                                         key={facility}
//                                         type="button"
//                                         onClick={() => toggleFacility(facility)}
//                                         className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${isSelected
//                                             ? 'bg-blue-600 text-white shadow-sm'
//                                             : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
//                                             }`}
//                                     >
//                                         {isSelected && <Check className="w-3 h-3" />}
//                                         {facility}
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Estimated Cost</label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 value={formData.estimatedCost || ''}
//                                 onChange={(e) => handleChange('estimatedCost', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Actual Cost</label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 value={formData.actualCost || ''}
//                                 onChange={(e) => handleChange('actualCost', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
//                             <input
//                                 type="text"
//                                 value={formData.phoneNumber || ''}
//                                 onChange={(e) => handleChange('phoneNumber', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Booking Reference</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingReference || ''}
//                                 onChange={(e) => handleChange('bookingReference', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">External Booking URL</label>
//                         <input
//                             type="url"
//                             placeholder="https://..."
//                             value={formData.externalBookingUrl || ''}
//                             onChange={(e) => handleChange('externalBookingUrl', e.target.value)}
//                             className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.latitude || ''}
//                                 onChange={(e) => handleChange('latitude', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.longitude || ''}
//                                 onChange={(e) => handleChange('longitude', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>
//                 </>
//             )}

//             {/* Attraction Specific Fields (with highlights and photographyNotes JSON arrays) */}
//             {activeTab === 'attraction' && (
//                 <>
//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Currency</label>
//                             <input
//                                 type="text"
//                                 placeholder="e.g. USD, EUR"
//                                 value={formData.currency || ''}
//                                 onChange={(e) => handleChange('currency', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Entry Fee</label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 value={formData.entryFee || ''}
//                                 onChange={(e) => handleChange('entryFee', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Opening Time</label>
//                             <input
//                                 type="time"
//                                 step="900"
//                                 value={formData.openingTime || ''}
//                                 onChange={(e) => handleChange('openingTime', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Closing Time</label>
//                             <input
//                                 type="time"
//                                 step="900"
//                                 value={formData.closingTime || ''}
//                                 onChange={(e) => handleChange('closingTime', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.latitude || ''}
//                                 onChange={(e) => handleChange('latitude', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.longitude || ''}
//                                 onChange={(e) => handleChange('longitude', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Highlights (comma separated)</label>
//                         <input
//                             type="text"
//                             value={formData.highlights || ''}
//                             onChange={(e) => handleChange('highlights', e.target.value)}
//                             placeholder="e.g. Sunset view, Architecture, Museum"
//                             className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Photography Notes (comma separated)</label>
//                         <input
//                             type="text"
//                             value={formData.photographyNotes || ''}
//                             onChange={(e) => handleChange('photographyNotes', e.target.value)}
//                             placeholder="e.g. Drone allowed, Tripod restricted, Golden hour best"
//                             className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                         />
//                     </div>
//                 </>
//             )}

//             {/* Dining Specific Fields */}
//             {activeTab === 'dining' && (
//                 <div className="space-y-3">
//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Category</label>
//                             <input
//                                 type="text"
//                                 value={formData.category || ''}
//                                 onChange={(e) => handleChange('category', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cuisine Type</label>
//                             <input
//                                 type="text"
//                                 value={formData.cuisineType || ''}
//                                 onChange={(e) => handleChange('cuisineType', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Estimated Cost</label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 value={formData.estimatedCost || ''}
//                                 onChange={(e) => handleChange('estimatedCost', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Rating</label>
//                             <input
//                                 type="number"
//                                 step="0.1"
//                                 max="5"
//                                 value={formData.rating || ''}
//                                 onChange={(e) => handleChange('rating', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.latitude || ''}
//                                 onChange={(e) => handleChange('latitude', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
//                             <input
//                                 type="number"
//                                 step="any"
//                                 value={formData.longitude || ''}
//                                 onChange={(e) => handleChange('longitude', e.target.value)}
//                                 className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Universal Address / Location Field */}
//             <div>
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Address / Location</label>
//                 <input
//                     type="text"
//                     value={formData.address || ''}
//                     onChange={(e) => handleChange('address', e.target.value)}
//                     placeholder="Full street address"
//                     className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
//                 />
//             </div>

//             {/* Enhanced Styled Live Map Preview Card */}
//             {lat && lng && (
//                 <LocationMapPreview
//                     lat={lat}
//                     lng={lng}
//                     placeName={formData.name}
//                 />
//             )}

//             <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
//                 {selectedItem?.id && (
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
//                     >
//                         <X className="w-3.5 h-3.5" /> Cancel
//                     </button>
//                 )}
//                 <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
//                 >
//                     <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save to TiDB'}
//                 </button>
//             </div>
//         </form>
//     );
// }



'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/edit/page';
import { Save, X, Search, MapPin, Loader2, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { TextInput, ActionButton } from '@/components/ui/FormControls';

interface OthersFormPanelProps {
    activeTab: ActiveTabType;
    selectedItem: any;
    isSubmitting: boolean;
    onSubmit: (values: any) => void;
    onCancel: () => void;
}

const COMMON_FACILITIES = [
    'Parking',
    'Wi-Fi',
    'Swimming Pool',
    'AC',
    'Restaurant',
    'Room Service',
    'Power Backup',
    'Pet Friendly',
];

const LocationMapPreview = dynamic(() => import('./LocationMapPreview'), { ssr: false });

export default function OthersFormPanel({
    activeTab,
    selectedItem,
    isSubmitting,
    onSubmit,
    onCancel,
}: OthersFormPanelProps) {
    const [formData, setFormData] = useState<any>({});

    // Place Search States (Nominatim)
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setFormData(selectedItem || {});
        setSearchQuery(selectedItem?.name || '');
    }, [selectedItem]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    const resetForm = () => {
        setFormData({});
        setSearchQuery('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    const handleChange = (field: string, val: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: val }));
    };

    const toggleFacility = (facility: string) => {
        const currentFacilities = Array.isArray(formData.facilities) ? formData.facilities : [];
        if (currentFacilities.includes(facility)) {
            handleChange(
                'facilities',
                currentFacilities.filter((f: string) => f !== facility)
            );
        } else {
            handleChange('facilities', [...currentFacilities, facility]);
        }
    };

    const handleSearchSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setShowDropdown(false);
        handleChange('name', searchQuery);

        try {
            const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                searchQuery
            )}&format=jsonv2&extratags=1&addressdetails=1&limit=5`;

            const res = await fetch(endpoint, {
                headers: {
                    'User-Agent': 'TravelItineraryApp/1.0 (contact@example.com)',
                },
            });
            const data = await res.json();
            setSuggestions(data || []);
            if (data && data.length > 0) {
                setShowDropdown(true);
            }
        } catch (err) {
            console.error('Error fetching Nominatim places:', err);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSuggestion = (item: any) => {
        const placeName = item.name || item.display_name.split(',')[0];

        setSearchQuery(placeName);
        setShowDropdown(false);
        setSuggestions([]);

        handleChange('name', placeName);
        if (item.display_name) {
            handleChange('address', item.display_name);
        }
        if (item.lat && item.lon) {
            handleChange('latitude', parseFloat(item.lat));
            handleChange('longitude', parseFloat(item.lon));
        }

        if (item.extratags) {
            const desc = item.extratags.description || item.extratags.wikipedia || item.category;
            if (desc) {
                handleChange('highlights', [desc]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        resetForm();
    };

    const lat = formData.latitude ? parseFloat(formData.latitude) : null;
    const lng = formData.longitude ? parseFloat(formData.longitude) : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 relative">
            {/* Name Input with On-Demand Search */}
            <div className="relative space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Name
                </label>
                <div className="relative flex items-center">
                    <input
                        type="text"
                        required
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleChange('name', e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchSubmit();
                            }
                        }}
                        placeholder={
                            activeTab === 'accommodation'
                                ? 'Search Hotel Name (Press Enter)'
                                : activeTab === 'attraction'
                                    ? 'Search Monument Name (Press Enter)'
                                    : 'Search Restaurant Name (Press Enter)'
                        }
                        className="w-full pl-8 pr-20 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />

                    <ActionButton
                        type="button"
                        variant="primary"
                        onClick={() => handleSearchSubmit()}
                        className="absolute right-1 px-2.5 py-1 text-[10px] rounded-lg"
                    >
                        {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Search'}
                    </ActionButton>
                </div>

                {showDropdown && suggestions.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto text-xs">
                        {suggestions.map((item, idx) => (
                            <li
                                key={idx}
                                onClick={() => handleSelectSuggestion(item)}
                                className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-start gap-2 border-b border-slate-100 dark:border-slate-800 last:border-none"
                            >
                                <MapPin className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        {item.name || item.display_name.split(',')[0]}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate">{item.display_name}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Accommodation Specific Fields */}
            {activeTab === 'accommodation' && (
                <>
                    <TextInput
                        label="Place Name"
                        placeholder="e.g. Downtown District, Mall Road"
                        value={formData.placeName || ''}
                        onChange={(e) => handleChange('placeName', e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Status / Type
                            </label>
                            <select
                                value={formData.status || 'Confirmed'}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
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

                        <TextInput
                            label="Currency"
                            placeholder="e.g. INR, USD"
                            value={formData.currency || ''}
                            onChange={(e) => handleChange('currency', e.target.value)}
                        />
                    </div>

                    {/* Facilities Array Multi-select */}
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Facilities
                        </label>
                        <div className="flex flex-wrap gap-1.5 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                            {COMMON_FACILITIES.map((facility) => {
                                const isSelected =
                                    Array.isArray(formData.facilities) &&
                                    formData.facilities.includes(facility);
                                return (
                                    <ActionButton
                                        key={facility}
                                        type="button"
                                        variant={isSelected ? 'primary' : 'secondary'}
                                        onClick={() => toggleFacility(facility)}
                                        className="px-2.5 py-1 text-[10px] rounded-lg"
                                    >
                                        {isSelected && <Check className="w-3 h-3" />}
                                        {facility}
                                    </ActionButton>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Estimated Cost"
                            type="number"
                            step="0.01"
                            value={formData.estimatedCost || ''}
                            onChange={(e) => handleChange('estimatedCost', e.target.value)}
                        />
                        <TextInput
                            label="Actual Cost"
                            type="number"
                            step="0.01"
                            value={formData.actualCost || ''}
                            onChange={(e) => handleChange('actualCost', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Phone Number"
                            value={formData.phoneNumber || ''}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                        />
                        <TextInput
                            label="Booking Reference"
                            value={formData.bookingReference || ''}
                            onChange={(e) => handleChange('bookingReference', e.target.value)}
                        />
                    </div>

                    <TextInput
                        label="External Booking URL"
                        type="url"
                        placeholder="https://..."
                        value={formData.externalBookingUrl || ''}
                        onChange={(e) => handleChange('externalBookingUrl', e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Latitude"
                            type="number"
                            step="any"
                            value={formData.latitude || ''}
                            onChange={(e) => handleChange('latitude', e.target.value)}
                        />
                        <TextInput
                            label="Longitude"
                            type="number"
                            step="any"
                            value={formData.longitude || ''}
                            onChange={(e) => handleChange('longitude', e.target.value)}
                        />
                    </div>
                </>
            )}

            {/* Attraction Specific Fields */}
            {activeTab === 'attraction' && (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Currency"
                            placeholder="e.g. INR, USD"
                            value={formData.currency || ''}
                            onChange={(e) => handleChange('currency', e.target.value)}
                        />
                        <TextInput
                            label="Entry Fee"
                            type="number"
                            step="0.01"
                            value={formData.entryFee || ''}
                            onChange={(e) => handleChange('entryFee', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Opening Time"
                            type="time"
                            step="900"
                            value={formData.openingTime || ''}
                            onChange={(e) => handleChange('openingTime', e.target.value)}
                        />
                        <TextInput
                            label="Closing Time"
                            type="time"
                            step="900"
                            value={formData.closingTime || ''}
                            onChange={(e) => handleChange('closingTime', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Latitude"
                            type="number"
                            step="any"
                            value={formData.latitude || ''}
                            onChange={(e) => handleChange('latitude', e.target.value)}
                        />
                        <TextInput
                            label="Longitude"
                            type="number"
                            step="any"
                            value={formData.longitude || ''}
                            onChange={(e) => handleChange('longitude', e.target.value)}
                        />
                    </div>

                    <TextInput
                        label="Highlights (comma separated)"
                        value={formData.highlights || ''}
                        onChange={(e) => handleChange('highlights', e.target.value)}
                        placeholder="e.g. Sunset view, Architecture, Museum"
                    />
                    <TextInput
                        label="Photography Notes (comma separated)"
                        value={formData.photographyNotes || ''}
                        onChange={(e) => handleChange('photographyNotes', e.target.value)}
                        placeholder="e.g. Drone allowed, Tripod restricted, Golden hour best"
                    />
                </>
            )}

            {/* Dining Specific Fields */}
            {activeTab === 'dining' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Category"
                            value={formData.category || ''}
                            onChange={(e) => handleChange('category', e.target.value)}
                        />
                        <TextInput
                            label="Cuisine Type"
                            value={formData.cuisineType || ''}
                            onChange={(e) => handleChange('cuisineType', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Estimated Cost"
                            type="number"
                            step="0.01"
                            value={formData.estimatedCost || ''}
                            onChange={(e) => handleChange('estimatedCost', e.target.value)}
                        />
                        <TextInput
                            label="Rating"
                            type="number"
                            step="0.1"
                            max="5"
                            value={formData.rating || ''}
                            onChange={(e) => handleChange('rating', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="Latitude"
                            type="number"
                            step="any"
                            value={formData.latitude || ''}
                            onChange={(e) => handleChange('latitude', e.target.value)}
                        />
                        <TextInput
                            label="Longitude"
                            type="number"
                            step="any"
                            value={formData.longitude || ''}
                            onChange={(e) => handleChange('longitude', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Universal Address / Location Field */}
            <TextInput
                label="Address / Location"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Full street address"
            />

            {/* Live Map Preview Card */}
            {lat && lng && (
                <LocationMapPreview lat={lat} lng={lng} placeName={formData.name} />
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                {selectedItem?.id && (
                    <ActionButton type="button" variant="secondary" onClick={onCancel}>
                        <X className="w-3.5 h-3.5" /> Cancel
                    </ActionButton>
                )}
                <ActionButton type="submit" variant="primary" size="md" disabled={isSubmitting}>
                    <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save to TiDB'}
                </ActionButton>
            </div>
        </form>
    );
}