

//-----------------------------------------------------------------
// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/others-details/page';
// import { Save, X, Search, MapPin, Loader2 } from 'lucide-react';

// interface OthersFormPanelProps {
//     activeTab: ActiveTabType;
//     selectedItem: any;
//     isSubmitting: boolean;
//     onSubmit: (values: any) => void;
//     onCancel: () => void;
// }

// export default function OthersFormPanel({
//     activeTab,
//     selectedItem,
//     isSubmitting,
//     onSubmit,
//     onCancel,
// }: OthersFormPanelProps) {
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

//     const handleChange = (field: string, val: any) => {
//         setFormData((prev: any) => ({ ...prev, [field]: val }));
//     };

//     // Handle Mapbox Autocomplete Search Trigger
//     const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const val = e.target.value;
//         setSearchQuery(val);
//         handleChange('name', val);

//         if (!val.trim() || !MAPBOX_TOKEN) {
//             setSuggestions([]);
//             setShowDropdown(false);
//             return;
//         }

//         setIsSearching(true);
//         setShowDropdown(true);

//         if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

//         searchTimeoutRef.current = setTimeout(async () => {
//             try {
//                 // Mapbox Search Box API endpoint for typeahead/suggestions
//                 const sessionToken = '12345678-1234-1234-1234-123456789abc'; // Can be randomized per session
//                 const endpoint = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
//                     val
//                 )}&access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}&types=poi,address&limit=5`;

//                 const res = await fetch(endpoint);
//                 const data = await res.json();
//                 setSuggestions(data.suggestions || []);
//             } catch (err) {
//                 console.error('Error fetching Mapbox suggestions:', err);
//                 setSuggestions([]);
//             } finally {
//                 setIsSearching(false);
//             }
//         }, 300);
//     };

//     // Handle Selecting a Suggestion from Dropdown
//     const handleSelectSuggestion = async (suggestion: any) => {
//         const placeName = suggestion.name;
//         const mapboxId = suggestion.mapbox_id;

//         setSearchQuery(placeName);
//         setShowDropdown(false);
//         setSuggestions([]);

//         // Update local name field
//         handleChange('name', placeName);
//         if (suggestion.full_address) {
//             handleChange('address', suggestion.full_address);
//         }

//         // Extract coordinates if available directly in suggestion context
//         if (suggestion.geometry?.coordinates) {
//             const [lng, lat] = suggestion.geometry.coordinates;
//             handleChange('longitude', lng);
//             handleChange('latitude', lat);
//         }

//         // Fetch deep details (such as operating hours) using Mapbox Places API
//         if (mapboxId && MAPBOX_TOKEN) {
//             try {
//                 const detailsEndpoint = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${MAPBOX_TOKEN}&session_token=12345678-1234-1234-1234-123456789abc`;
//                 const res = await fetch(detailsEndpoint);
//                 const data = await res.json();

//                 if (data.features && data.features.length > 0) {
//                     const feature = data.features[0];
//                     const props = feature.properties;
//                     const coords = feature.geometry?.coordinates;

//                     if (coords) {
//                         handleChange('longitude', coords[0]);
//                         handleChange('latitude', coords[1]);
//                     }

//                     if (props?.full_address) {
//                         handleChange('address', props.full_address);
//                     }

//                     // Map hours if available from Mapbox metadata
//                     if (props?.metadata?.opening_hours) {
//                         // Example parsing or setting raw hours if schema matches
//                         // Adjust parsing based on your specific backend schema format
//                     }

//                     // Set category highlights if available
//                     if (props?.poi_category && Array.isArray(props.poi_category)) {
//                         handleChange('highlights', props.poi_category);
//                     }
//                 }
//             } catch (err) {
//                 console.error('Error fetching Mapbox place details:', err);
//             }
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };

//     const lat = formData.latitude ? parseFloat(formData.latitude) : null;
//     const lng = formData.longitude ? parseFloat(formData.longitude) : null;

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 relative">
//             {/* Name Input with Autocomplete Dropdown */}
//             <div className="relative">
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Name</label>
//                 <div className="relative">
//                     <input
//                         type="text"
//                         required
//                         value={searchQuery}
//                         onChange={handleNameInputChange}
//                         onFocus={() => {
//                             if (suggestions.length > 0) setShowDropdown(true);
//                         }}
//                         placeholder={
//                             activeTab === 'accommodation'
//                                 ? 'Search Hotel Name'
//                                 : activeTab === 'attraction'
//                                     ? 'Search Monument Name'
//                                     : 'Search Restaurant Name'
//                         }
//                         className="text-slate-900 dark:text-slate-100 w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
//                     {isSearching && (
//                         <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin absolute right-2.5 top-2.5" />
//                     )}
//                 </div>

//                 {/* Autocomplete Suggestions Dropdown */}
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
//                                     <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
//                                     <p className="text-[10px] text-slate-500 truncate">{item.full_address || item.place_formatted}</p>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             {/* Accommodation Specific Fields */}
//             {activeTab === 'accommodation' && (
//                 <>
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

//             {/* Attraction Specific Fields */}
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

//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Distance From Base (km)</label>
//                         <input
//                             type="number"
//                             step="0.1"
//                             value={formData.distanceFromBaseKm || ''}
//                             onChange={(e) => handleChange('distanceFromBaseKm', e.target.value)}
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

//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Highlights</label>
//                         <input
//                             type="text"
//                             value={Array.isArray(formData.highlights) ? formData.highlights.join(', ') : (formData.highlights || '')}
//                             onChange={(e) => handleChange('highlights', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
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

//             {/* Small Live Map Preview Widget if Lat/Lng exist */}
//             {lat && lng && MAPBOX_TOKEN && (
//                 <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-32 relative">
//                     <iframe
//                         title="Location Preview"
//                         width="100%"
//                         height="100%"
//                         frameBorder="0"
//                         src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+2563eb(${lng},${lat})/${lng},${lat},14,0/300x128@2x?access_token=${MAPBOX_TOKEN}`}
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
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

//--------------------------------------------

// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/others-details/page';
// import { Save, X, Search, MapPin, Loader2, Navigation } from 'lucide-react';

// interface OthersFormPanelProps {
//     activeTab: ActiveTabType;
//     selectedItem: any;
//     isSubmitting: boolean;
//     onSubmit: (values: any) => void;
//     onCancel: () => void;
// }

// export default function OthersFormPanel({
//     activeTab,
//     selectedItem,
//     isSubmitting,
//     onSubmit,
//     onCancel,
// }: OthersFormPanelProps) {
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

//     // Handle Mapbox Autocomplete Search Trigger
//     const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const val = e.target.value;
//         setSearchQuery(val);
//         handleChange('name', val);

//         if (!val.trim() || !MAPBOX_TOKEN) {
//             setSuggestions([]);
//             setShowDropdown(false);
//             return;
//         }

//         setIsSearching(true);
//         setShowDropdown(true);

//         if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

//         searchTimeoutRef.current = setTimeout(async () => {
//             try {
//                 const sessionToken = '12345678-1234-1234-1234-123456789abc';
//                 const endpoint = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
//                     val
//                 )}&access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}&types=poi,address&limit=5`;

//                 const res = await fetch(endpoint);
//                 const data = await res.json();
//                 setSuggestions(data.suggestions || []);
//             } catch (err) {
//                 console.error('Error fetching Mapbox suggestions:', err);
//                 setSuggestions([]);
//             } finally {
//                 setIsSearching(false);
//             }
//         }, 300);
//     };

//     // Handle Selecting a Suggestion from Dropdown
//     const handleSelectSuggestion = async (suggestion: any) => {
//         const placeName = suggestion.name;
//         const mapboxId = suggestion.mapbox_id;

//         setSearchQuery(placeName);
//         setShowDropdown(false);
//         setSuggestions([]);

//         handleChange('name', placeName);
//         if (suggestion.full_address) {
//             handleChange('address', suggestion.full_address);
//         }

//         if (suggestion.geometry?.coordinates) {
//             const [lng, lat] = suggestion.geometry.coordinates;
//             handleChange('longitude', lng);
//             handleChange('latitude', lat);
//         }

//         if (mapboxId && MAPBOX_TOKEN) {
//             try {
//                 const detailsEndpoint = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${MAPBOX_TOKEN}&session_token=12345678-1234-1234-1234-123456789abc`;
//                 const res = await fetch(detailsEndpoint);
//                 const data = await res.json();

//                 if (data.features && data.features.length > 0) {
//                     const feature = data.features[0];
//                     const props = feature.properties;
//                     const coords = feature.geometry?.coordinates;

//                     if (coords) {
//                         handleChange('longitude', coords[0]);
//                         handleChange('latitude', coords[1]);
//                     }

//                     if (props?.full_address) {
//                         handleChange('address', props.full_address);
//                     }

//                     if (props?.poi_category && Array.isArray(props.poi_category)) {
//                         handleChange('highlights', props.poi_category);
//                     }
//                 }
//             } catch (err) {
//                 console.error('Error fetching Mapbox place details:', err);
//             }
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         await onSubmit(formData);
//         resetForm(); // Automatically clear state after saving
//     };

//     const lat = formData.latitude ? parseFloat(formData.latitude) : null;
//     const lng = formData.longitude ? parseFloat(formData.longitude) : null;

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 relative">
//             {/* Name Input with Autocomplete Dropdown */}
//             <div className="relative">
//                 <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Name</label>
//                 <div className="relative">
//                     <input
//                         type="text"
//                         required
//                         value={searchQuery}
//                         onChange={handleNameInputChange}
//                         onFocus={() => {
//                             if (suggestions.length > 0) setShowDropdown(true);
//                         }}
//                         placeholder={
//                             activeTab === 'accommodation'
//                                 ? 'Search Hotel Name'
//                                 : activeTab === 'attraction'
//                                     ? 'Search Monument Name'
//                                     : 'Search Restaurant Name'
//                         }
//                         className="text-slate-900 dark:text-slate-100 w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
//                     {isSearching && (
//                         <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin absolute right-2.5 top-2.5" />
//                     )}
//                 </div>

//                 {/* Autocomplete Suggestions Dropdown */}
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
//                                     <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
//                                     <p className="text-[10px] text-slate-500 truncate">{item.full_address || item.place_formatted}</p>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             {/* Accommodation Specific Fields */}
//             {activeTab === 'accommodation' && (
//                 <>
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

//             {/* Attraction Specific Fields */}
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

//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Distance From Base (km)</label>
//                         <input
//                             type="number"
//                             step="0.1"
//                             value={formData.distanceFromBaseKm || ''}
//                             onChange={(e) => handleChange('distanceFromBaseKm', e.target.value)}
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

//                     <div>
//                         <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Highlights</label>
//                         <input
//                             type="text"
//                             value={Array.isArray(formData.highlights) ? formData.highlights.join(', ') : (formData.highlights || '')}
//                             onChange={(e) => handleChange('highlights', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
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
//             {lat && lng && MAPBOX_TOKEN && (
//                 <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-md transition-all group">
//                     <img
//                         alt="Map location preview"
//                         src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-s+2563eb(${lng},${lat})/${lng},${lat},15,0/600x240@2x?access_token=${MAPBOX_TOKEN}`}
//                         className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
//                     <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow">
//                         <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-medium border border-white/10">
//                             <Navigation className="w-3 h-3 text-blue-400 animate-pulse" />
//                             <span className="truncate max-w-[180px]">{formData.name || 'Selected Location'}</span>
//                         </div>
//                         <a
//                             href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="bg-blue-600/90 hover:bg-blue-600 text-[10px] px-2 py-1 rounded-lg font-bold backdrop-blur-md transition shadow-sm"
//                         >
//                             Open Maps
//                         </a>
//                     </div>
//                 </div>
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
import { ActiveTabType } from '@/app/(protected)/[id]/create-trip/trips/[targetTripId]/others-details/page';
import { Save, X, Search, MapPin, Loader2, Navigation, Check } from 'lucide-react';

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
    'Pet Friendly'
];

export default function OthersFormPanel({
    activeTab,
    selectedItem,
    isSubmitting,
    onSubmit,
    onCancel,
}: OthersFormPanelProps) {
    const [formData, setFormData] = useState<any>({});

    // Mapbox Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Replace with your Mapbox Public Access Token
    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    useEffect(() => {
        setFormData(selectedItem || {});
        setSearchQuery(selectedItem?.name || '');
    }, [selectedItem]);

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

    // Handle Mapbox Autocomplete Search Trigger
    const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        handleChange('name', val);

        if (!val.trim() || !MAPBOX_TOKEN) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        setShowDropdown(true);

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const sessionToken = '12345678-1234-1234-1234-123456789abc';
                const endpoint = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
                    val
                )}&access_token=${MAPBOX_TOKEN}&session_token=${sessionToken}&types=poi,address&limit=5`;

                const res = await fetch(endpoint);
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            } catch (err) {
                console.error('Error fetching Mapbox suggestions:', err);
                setSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    // Handle Selecting a Suggestion from Dropdown
    const handleSelectSuggestion = async (suggestion: any) => {
        const placeName = suggestion.name;
        const mapboxId = suggestion.mapbox_id;

        setSearchQuery(placeName);
        setShowDropdown(false);
        setSuggestions([]);

        handleChange('name', placeName);
        if (suggestion.full_address) {
            handleChange('address', suggestion.full_address);
        }

        if (suggestion.geometry?.coordinates) {
            const [lng, lat] = suggestion.geometry.coordinates;
            handleChange('longitude', lng);
            handleChange('latitude', lat);
        }

        if (mapboxId && MAPBOX_TOKEN) {
            try {
                const detailsEndpoint = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?access_token=${MAPBOX_TOKEN}&session_token=12345678-1234-1234-1234-123456789abc`;
                const res = await fetch(detailsEndpoint);
                const data = await res.json();

                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    const props = feature.properties;
                    const coords = feature.geometry?.coordinates;

                    if (coords) {
                        handleChange('longitude', coords[0]);
                        handleChange('latitude', coords[1]);
                    }

                    if (props?.full_address) {
                        handleChange('address', props.full_address);
                    }

                    if (props?.poi_category && Array.isArray(props.poi_category)) {
                        handleChange('highlights', props.poi_category);
                    }
                }
            } catch (err) {
                console.error('Error fetching Mapbox place details:', err);
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
            {/* Name Input with Autocomplete Dropdown */}
            <div className="relative">
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Name</label>
                <div className="relative">
                    <input
                        type="text"
                        required
                        value={searchQuery}
                        onChange={handleNameInputChange}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowDropdown(true);
                        }}
                        placeholder={
                            activeTab === 'accommodation'
                                ? 'Search Hotel Name'
                                : activeTab === 'attraction'
                                    ? 'Search Monument Name'
                                    : 'Search Restaurant Name'
                        }
                        className="text-slate-900 dark:text-slate-100 w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    {isSearching && (
                        <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin absolute right-2.5 top-2.5" />
                    )}
                </div>

                {/* Autocomplete Suggestions Dropdown */}
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
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{item.full_address || item.place_formatted}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Accommodation Specific Fields */}
            {activeTab === 'accommodation' && (
                <>
                    {/* Optional Place Name */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Place Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Downtown District, Mall Road"
                            value={formData.placeName || ''}
                            onChange={(e) => handleChange('placeName', e.target.value)}
                            className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status / Type</label>
                            <select
                                value={formData.status || 'Confirmed'}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Facilities Array Multi-select */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Facilities</label>
                        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                            {COMMON_FACILITIES.map((facility) => {
                                const isSelected = Array.isArray(formData.facilities) && formData.facilities.includes(facility);
                                return (
                                    <button
                                        key={facility}
                                        type="button"
                                        onClick={() => toggleFacility(facility)}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${isSelected
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {isSelected && <Check className="w-3 h-3" />}
                                        {facility}
                                    </button>
                                );
                            })}
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
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Actual Cost</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.actualCost || ''}
                                onChange={(e) => handleChange('actualCost', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Booking Reference</label>
                            <input
                                type="text"
                                value={formData.bookingReference || ''}
                                onChange={(e) => handleChange('bookingReference', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                            className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude || ''}
                                onChange={(e) => handleChange('longitude', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Attraction Specific Fields (with highlights and photographyNotes JSON arrays) */}
            {activeTab === 'attraction' && (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Currency</label>
                            <input
                                type="text"
                                placeholder="e.g. USD, EUR"
                                value={formData.currency || ''}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Entry Fee</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.entryFee || ''}
                                onChange={(e) => handleChange('entryFee', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Opening Time</label>
                            <input
                                type="time"
                                step="900"
                                value={formData.openingTime || ''}
                                onChange={(e) => handleChange('openingTime', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Closing Time</label>
                            <input
                                type="time"
                                step="900"
                                value={formData.closingTime || ''}
                                onChange={(e) => handleChange('closingTime', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude || ''}
                                onChange={(e) => handleChange('latitude', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude || ''}
                                onChange={(e) => handleChange('longitude', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Highlights (comma separated)</label>
                        <input
                            type="text"
                            value={formData.highlights || ''}
                            onChange={(e) => handleChange('highlights', e.target.value)}
                            placeholder="e.g. Sunset view, Architecture, Museum"
                            className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Photography Notes (comma separated)</label>
                        <input
                            type="text"
                            value={formData.photographyNotes || ''}
                            onChange={(e) => handleChange('photographyNotes', e.target.value)}
                            placeholder="e.g. Drone allowed, Tripod restricted, Golden hour best"
                            className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                        />
                    </div>
                </>
            )}

            {/* Dining Specific Fields */}
            {activeTab === 'dining' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category || ''}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cuisine Type</label>
                            <input
                                type="text"
                                value={formData.cuisineType || ''}
                                onChange={(e) => handleChange('cuisineType', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Rating</label>
                            <input
                                type="number"
                                step="0.1"
                                max="5"
                                value={formData.rating || ''}
                                onChange={(e) => handleChange('rating', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude || ''}
                                onChange={(e) => handleChange('latitude', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude || ''}
                                onChange={(e) => handleChange('longitude', e.target.value)}
                                className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Universal Address / Location Field */}
            <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Address / Location</label>
                <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Full street address"
                    className="text-slate-900 dark:text-slate-100 w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
            </div>

            {/* Enhanced Styled Live Map Preview Card */}
            {lat && lng && MAPBOX_TOKEN && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-md transition-all group">
                    <img
                        alt="Map location preview"
                        src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-s+2563eb(${lng},${lat})/${lng},${lat},15,0/600x240@2x?access_token=${MAPBOX_TOKEN}`}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow">
                        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-medium border border-white/10">
                            <Navigation className="w-3 h-3 text-blue-400 animate-pulse" />
                            <span className="truncate max-w-[180px]">{formData.name || 'Selected Location'}</span>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600/90 hover:bg-blue-600 text-[10px] px-2 py-1 rounded-lg font-bold backdrop-blur-md transition shadow-sm"
                        >
                            Open Maps
                        </a>
                    </div>
                </div>
            )}

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