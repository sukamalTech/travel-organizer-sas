// 'use client';

// import React from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card } from "@/components/ui/card";
// import { Hotel, Utensils, Landmark } from "lucide-react";
// import { MapNavigatorButton } from "@/components/view/MapNavigatorButton";

// interface OtherDetailsTabProps {
//     selectedDayId: string | null;
//     currentSelectedDay: any;
//     onClearFilter: () => void;
//     accommodations: any[];
//     diningSpots: any[];
//     attractions: any[];
// }

// export function OtherDetailsTab({
//     selectedDayId,
//     currentSelectedDay,
//     onClearFilter,
//     accommodations,
//     diningSpots,
//     attractions
// }: OtherDetailsTabProps) {
//     return (
//         <div className="space-y-3">
//             {selectedDayId && currentSelectedDay && (
//                 <div className="mb-3 p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
//                     <span className="font-semibold text-primary">
//                         Showing items for Day {currentSelectedDay.day_number} ({currentSelectedDay.date})
//                     </span>
//                     <button onClick={onClearFilter} className="text-[10px] underline text-muted-foreground hover:text-foreground font-medium cursor-pointer">
//                         Show All
//                     </button>
//                 </div>
//             )}
//             <Tabs defaultValue="stays" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3 mb-3 h-9 p-1 bg-muted/60 rounded-xl text-[11px]">
//                     <TabsTrigger value="stays" className="font-bold rounded-lg">Stays ({accommodations.length})</TabsTrigger>
//                     <TabsTrigger value="dining" className="font-bold rounded-lg">Dining ({diningSpots.length})</TabsTrigger>
//                     <TabsTrigger value="attractions" className="font-bold rounded-lg">Attractions ({attractions.length})</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="stays" className="space-y-3">
//                     {accommodations.length === 0 ? (
//                         <div className="p-8 text-center rounded-2xl border border-dashed border-border/85 bg-card/50"><p className="text-xs text-muted-foreground">No accommodations saved.</p></div>
//                     ) : (
//                         accommodations.map((acc) => (
//                             <Card key={acc.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
//                                 <div className="flex items-start justify-between gap-2">
//                                     <div className="space-y-0.5">
//                                         <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground"><Hotel className="w-4 h-4 text-blue-500 shrink-0" />{acc.name}</p>
//                                         <p className="text-muted-foreground">{acc.address || "No address provided"}</p>
//                                     </div>
//                                     <span className="text-[10px] bg-blue-500/10 text-blue-600 border border-blue-500/20 font-extrabold px-2 py-0.5 rounded-full capitalize shrink-0">{acc.status || 'Booked'}</span>
//                                 </div>
//                                 {acc.latitude && acc.longitude && <MapNavigatorButton lat={Number(acc.latitude)} lng={Number(acc.longitude)} label={acc.name} />}
//                             </Card>
//                         ))
//                     )}
//                 </TabsContent>

//                 <TabsContent value="dining" className="space-y-3">
//                     {diningSpots.length === 0 ? (
//                         <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50"><p className="text-xs text-muted-foreground">No dining spots saved.</p></div>
//                     ) : (
//                         diningSpots.map((spot: any) => (
//                             <Card key={spot.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
//                                 <div className="space-y-0.5">
//                                     <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground"><Utensils className="w-4 h-4 text-amber-500 shrink-0" />{spot.name}</p>
//                                     <p className="text-muted-foreground">{spot.cuisineType || spot.cuisine_type || spot.category || "Restaurant / Cafe"}</p>
//                                 </div>
//                                 {spot.latitude && spot.longitude && <MapNavigatorButton lat={Number(spot.latitude)} lng={Number(spot.longitude)} label={spot.name} />}
//                             </Card>
//                         ))
//                     )}
//                 </TabsContent>

//                 <TabsContent value="attractions" className="space-y-3">
//                     {attractions.length === 0 ? (
//                         <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50"><p className="text-xs text-muted-foreground">No attractions saved.</p></div>
//                     ) : (
//                         attractions.map((attr) => (
//                             <Card key={attr.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
//                                 <div className="space-y-0.5">
//                                     <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground"><Landmark className="w-4 h-4 text-purple-500 shrink-0" />{attr.name}</p>
//                                     <p className="text-muted-foreground">Entry Fee: <strong className="text-foreground">{attr.currency || "₹"} {attr.entryFee ?? attr.entry_fee ?? "Free"}</strong></p>
//                                 </div>
//                                 {attr.latitude && attr.longitude && <MapNavigatorButton lat={Number(attr.latitude)} lng={Number(attr.longitude)} label={attr.name} />}
//                             </Card>
//                         ))
//                     )}
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }

'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Hotel, Utensils, Landmark } from "lucide-react";
import { MapNavigatorButton } from "@/components/view/MapNavigatorButton";
import { DayRouteOptimizer } from "@/components/view/DayRouteOptimizer";

interface OtherDetailsTabProps {
    selectedDayId: string | null;
    currentSelectedDay: any;
    onClearFilter: () => void;
    accommodations: any[];
    diningSpots: any[];
    attractions: any[];
}

export function OtherDetailsTab({
    selectedDayId,
    currentSelectedDay,
    onClearFilter,
    accommodations,
    diningSpots,
    attractions
}: OtherDetailsTabProps) {
    return (
        <div className="space-y-3">
            {selectedDayId && currentSelectedDay && (
                <div className="mb-3 p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary">
                        Showing items for Day {currentSelectedDay.day_number} ({currentSelectedDay.date})
                    </span>
                    <button onClick={onClearFilter} className="text-[10px] underline text-muted-foreground hover:text-foreground font-medium cursor-pointer">
                        Show All
                    </button>
                </div>
            )}
            <Tabs defaultValue="stays" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-3 h-9 p-1 bg-muted/60 rounded-xl text-[11px]">
                    <TabsTrigger value="stays" className="font-bold rounded-lg">Stays ({accommodations.length})</TabsTrigger>
                    <TabsTrigger value="dining" className="font-bold rounded-lg">Dining ({diningSpots.length})</TabsTrigger>
                    <TabsTrigger value="attractions" className="font-bold rounded-lg">Attractions ({attractions.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="stays" className="space-y-3">
                    {accommodations.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-border/85 bg-card/50"><p className="text-xs text-muted-foreground">No accommodations saved.</p></div>
                    ) : (
                        accommodations.map((acc) => (
                            <Card key={acc.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-0.5">
                                        <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground"><Hotel className="w-4 h-4 text-blue-500 shrink-0" />{acc.name}</p>
                                        <p className="text-muted-foreground">{acc.address || "No address provided"}</p>
                                    </div>
                                    <span className="text-[10px] bg-blue-500/10 text-blue-600 border border-blue-500/20 font-extrabold px-2 py-0.5 rounded-full capitalize shrink-0">{acc.status || 'Booked'}</span>
                                </div>
                                {acc.latitude && acc.longitude && <MapNavigatorButton lat={Number(acc.latitude)} lng={Number(acc.longitude)} label={acc.name} />}
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="dining" className="space-y-3">
                    {diningSpots.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50"><p className="text-xs text-muted-foreground">No dining spots saved.</p></div>
                    ) : (
                        diningSpots.map((spot: any) => (
                            <Card key={spot.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
                                <div className="space-y-0.5">
                                    <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground"><Utensils className="w-4 h-4 text-amber-500 shrink-0" />{spot.name}</p>
                                    <p className="text-muted-foreground">{spot.cuisineType || spot.cuisine_type || spot.category || "Restaurant / Cafe"}</p>
                                </div>
                                {spot.latitude && spot.longitude && <MapNavigatorButton lat={Number(spot.latitude)} lng={Number(spot.longitude)} label={spot.name} />}
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="attractions" className="space-y-3">
                    {/* Route Optimization Button & Map Integration for Attractions View */}
                    {attractions.length > 0 && (
                        <Card className="p-3 bg-card border-border/80 rounded-2xl shadow-xs">
                            <p className="text-[11px] font-bold text-muted-foreground mb-1">Route Planning</p>
                            <DayRouteOptimizer dayAttractions={attractions} />
                        </Card>
                    )}

                    {attractions.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50"><p className="text-xs text-muted-foreground">No attractions saved.</p></div>
                    ) : (
                        attractions.map((attr) => (
                            <Card key={attr.id} className="p-3.5 text-xs space-y-2.5 bg-card border-border/80 rounded-2xl shadow-xs">
                                <div className="space-y-0.5">
                                    <p className="font-extrabold text-sm flex items-center gap-1.5 text-foreground"><Landmark className="w-4 h-4 text-purple-500 shrink-0" />{attr.name}</p>
                                    <p className="text-muted-foreground">Entry Fee: <strong className="text-foreground">{attr.currency || "₹"} {attr.entryFee ?? attr.entry_fee ?? "Free"}</strong></p>
                                </div>
                                {attr.latitude && attr.longitude && <MapNavigatorButton lat={Number(attr.latitude)} lng={Number(attr.longitude)} label={attr.name} />}
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}