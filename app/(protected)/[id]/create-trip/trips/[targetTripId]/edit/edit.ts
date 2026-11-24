// const handleSelectLeg = (leg: LegItem) => {
//         setSelectedLeg(leg);
//         const parseCoordinates = (coord: any) => {
//             if (!coord) return { lat: null, lng: null };
//             if (typeof coord === 'string') {
//                 const match = coord.match(/\(([^,]+),([^)]+)\)/);
//                 if (match) {
//                     return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
//                 }
//             } else if (typeof coord === 'object' && 'x' in coord && 'y' in coord) {
//                 return { lng: coord.x, lat: coord.y };
//             }
//             return { lat: null, lng: null };
//         };
//         const originCoords = parseCoordinates(leg.origin_coordinates);
//         const destCoords = parseCoordinates(leg.destination_coordinates);

//         form.reset({
//             id: leg.id,
//             trip_id: tripId,
//             day_id: leg.day_id || selectedDayId || '',
//             mode: leg.mode,
//             origin_name: leg.origin_name,
//             origin_lat: originCoords.lat,
//             origin_lng: originCoords.lng,
//             destination_name: leg.destination_name,
//             destination_lat: destCoords.lat,
//             destination_lng: destCoords.lng,
//             departure_time: leg.departure_time
//                 ? new Date(leg.departure_time).toISOString().slice(0, 16)
//                 : '',
//             arrival_time: leg.arrival_time
//                 ? new Date(leg.arrival_time).toISOString().slice(0, 16)
//                 : '',
//             distance_km: leg.distance_km ?? undefined,
//             sequence_order: leg.sequence_order,
//             metadata: leg.metadata || {},
//         });
//         setMobileView('form');
//     };

// const handleUpdateExtras = async (updatedExtras: {
//         stays: DayExtraItem[];
//         dining: DayExtraItem[];
//         attractions: DayExtraItem[];
//     }) => {
//         setDayExtras(updatedExtras);
//         await handleSaveDayDetails(updatedExtras);
//     };

// const handleReorderLegs = async (reordered: LegItem[]) => {
//         setLegs(reordered);
//         for (const leg of reordered) {
//             await supabase
//                 .from('travel_legs')
//                 .update({ sequence_order: leg.sequence_order })
//                 .eq('id', leg.id);
//         }
//     };

// <main
//                         className={`lg:col-span-4 p-3.5 bg-white/70 dark:bg-slate-900/50 h-full overflow-y-auto space-y-4 ${mobileView === 'form' ? 'block' : 'hidden lg:block'
//                             }`}
//                     >
//                         {errorMessage && (
//                             <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2 font-bold">
//                                 <AlertCircle className="w-4 h-4 shrink-0" />
//                                 <span>{errorMessage}</span>
//                             </div>
//                         )}

//                         {selectedDay ? (
//                             <AddLegSection
//                                 form={form}
//                                 onSubmit={onSubmitLeg}
//                                 isSubmitting={isSubmitting}
//                                 selectedLeg={selectedLeg}
//                                 onCloseSelectedLeg={() => {
//                                     setSelectedLeg(null);
//                                     setMobileView('list');
//                                 }}
//                                 dayNumber={selectedDay.day_number}
//                                 legDate={selectedDay.date}
//                             />
//                         ) : (
//                             <div className="h-full w-full" />
//                         )}
//                     </main>
