



// import { Suspense } from 'react';
// import { Badge } from "@/components/ui/badge";
// import { ChevronRight } from "lucide-react";
// import { createClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import { connection } from 'next/server';
// import Link from 'next/link';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Calendar, Compass } from 'lucide-react';

// /**
//  * Robustly parses date strings formatted as YYYY-MM-DD, DD-MM-YYYY, or DD.MM.YYYY
//  */
// function parseCustomDate(dateStr: string | null | undefined): Date | null {
//     if (!dateStr) return null;

//     if (dateStr.includes(".")) {
//         const parts = dateStr.split(".");
//         if (parts.length === 3) {
//             const [day, month, year] = parts;
//             return new Date(`${year}-${month}-${day}`);
//         }
//     }

//     if (dateStr.includes("-") && dateStr.split("-")[0].length === 2) {
//         const parts = dateStr.split("-");
//         if (parts.length === 3) {
//             const [day, month, year] = parts;
//             return new Date(`${year}-${month}-${day}`);
//         }
//     }

//     const parsed = new Date(dateStr);
//     return isNaN(parsed.getTime()) ? null : parsed;
// }

// // Inner component handling connection, cookies, and data fetching inside Suspense
// async function TripsContent({ params }: { params: Promise<{ id: string }> }) {
//     await connection();
//     const { id: userId } = await params;

//     const supabase = await createClient();

//     const {
//         data: { user },
//     } = await supabase.auth.getUser();

//     if (!user || user.id !== userId) {
//         redirect('/auth/login');
//     }

//     const { data: trips, error: tripsError } = await supabase
//         .from('trips')
//         .select('*')
//         .eq('owner_id', user.id)
//         .order('updated_at', { ascending: false });

//     if (tripsError) {
//         console.error('Failed to fetch trips:', tripsError.message);
//     }

//     const userTrips = trips || [];

//     return (
//         <main className="min-h-screen bg-background text-foreground pb-20 px-4 pt-6 max-w-md mx-auto">
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-bold tracking-tight">My Travel Diary</h1>
//                 <Badge variant="outline" className="text-xs">Mobile First</Badge>
//             </div>

//             <div className="space-y-4">
//                 <h2 className="text-lg font-semibold flex items-center gap-2">
//                     <Compass className="w-5 h-5 text-primary" /> Upcoming Adventures
//                 </h2>

//                 {userTrips.length === 0 ? (
//                     <p className="text-sm text-muted-foreground bg-card p-4 rounded-xl border text-center shadow-xs">
//                         No upcoming trips found. Plan your next getaway!
//                     </p>
//                 ) : (
//                     userTrips.map((trip) => {
//                         return (
//                             <Link key={trip.id} href={`/${userId}/view-trips/${trip.id}`}>
//                                 <Card className="hover:border-primary transition-all shadow-sm active:scale-[0.99] mb-3 bg-card text-card-foreground border-border/70">
//                                     <CardHeader className="p-4 pb-2">
//                                         <div className="flex justify-between items-start gap-2">
//                                             <CardTitle className="text-base font-bold line-clamp-1">{trip.title || 'Untitled Journey'}</CardTitle>
//                                             <Badge variant="secondary" className="text-[10px] uppercase shrink-0">
//                                                 {trip.primary_mode || trip.primary_transport || "Road Trip"}
//                                             </Badge>
//                                         </div>
//                                     </CardHeader>
//                                     <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-1.5">
//                                         <div className="flex items-center gap-1.5">
//                                             <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
//                                             <span>Starts: <strong className="text-foreground">{trip.start_date || 'TBD'}</strong></span>
//                                         </div>
//                                         <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
//                                             <span className="font-medium text-foreground">Expedition Plan</span>
//                                             <span className="text-primary flex items-center gap-0.5 font-medium">
//                                                 Explore <ChevronRight className="w-3.5 h-3.5" />
//                                             </span>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </Link>
//                         );
//                     })
//                 )}
//             </div>
//         </main>
//     );
// }

// // Loading Skeleton Fallback
// function TripsSkeleton() {
//     return (
//         <main className="min-h-screen bg-background text-foreground pb-20 px-4 pt-6 max-w-md mx-auto space-y-4 animate-pulse">
//             <div className="flex items-center justify-between mb-6">
//                 <div className="h-8 w-36 bg-muted/40 rounded-md" />
//                 <div className="h-5 w-20 bg-muted/40 rounded-md" />
//             </div>
//             <div className="h-6 w-40 bg-muted/40 rounded-md" />
//             <div className="h-28 bg-muted/40 rounded-xl" />
//             <div className="h-28 bg-muted/40 rounded-xl" />
//         </main>
//     );
// }

// export default function TripsPage({ params }: { params: Promise<{ id: string }> }) {
//     return (
//         <Suspense fallback={<TripsSkeleton />}>
//             <TripsContent params={params} />
//         </Suspense>
//     );
// }

import { Suspense } from 'react';
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Compass } from 'lucide-react';

/**
 * Robustly parses date strings formatted as YYYY-MM-DD, DD-MM-YYYY, or DD.MM.YYYY
 */
function parseCustomDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;

    if (dateStr.includes(".")) {
        const parts = dateStr.split(".");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
        }
    }

    if (dateStr.includes("-") && dateStr.split("-")[0].length === 2) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
        }
    }

    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
}

// Dynamic Transport Mode Styling helper
function getModeStyle(mode: string = '') {
    switch (mode.toLowerCase()) {
        case 'car':
        case 'suv':
            return {
                bg: 'bg-blue-500/10 dark:bg-blue-500/20',
                border: 'border-blue-500/30',
                text: 'text-blue-600 dark:text-blue-400',
            };
        case 'flight':
        case 'plane':
            return {
                bg: 'bg-purple-500/10 dark:bg-purple-500/20',
                border: 'border-purple-500/30',
                text: 'text-purple-600 dark:text-purple-400',
            };
        case 'train':
            return {
                bg: 'bg-amber-500/10 dark:bg-amber-500/20',
                border: 'border-amber-500/30',
                text: 'text-amber-600 dark:text-amber-400',
            };
        case 'bus':
            return {
                bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
                border: 'border-emerald-500/30',
                text: 'text-emerald-600 dark:text-emerald-400',
            };
        case 'bike':
            return {
                bg: 'bg-rose-500/10 dark:bg-rose-500/20',
                border: 'border-rose-500/30',
                text: 'text-rose-600 dark:text-rose-400',
            };
        default:
            return {
                bg: 'bg-primary/10',
                border: 'border-primary/30',
                text: 'text-primary',
            };
    }
}

// Inner component handling connection, cookies, and data fetching inside Suspense
async function TripsContent({ params }: { params: Promise<{ id: string }> }) {
    await connection();
    const { id: userId } = await params;

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
        redirect('/auth/login');
    }

    const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });

    if (tripsError) {
        console.error('Failed to fetch trips:', tripsError.message);
    }

    const userTrips = trips || [];

    return (
        <main className="min-h-screen bg-background/95 text-foreground pb-24 px-4 pt-4 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-extrabold tracking-tight">My Travel Diary</h1>
                <Badge variant="outline" className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border-primary/30 text-primary">
                    Mobile First
                </Badge>
            </div>

            <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
                    <Compass className="w-4 h-4 text-primary" /> Upcoming Adventures
                </h2>

                {userTrips.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/50">
                        <p className="text-xs text-muted-foreground">No upcoming trips found. Plan your next getaway!</p>
                    </div>
                ) : (
                    userTrips.map((trip) => {
                        const transportMode = trip.primary_mode || trip.primary_transport || "Road Trip";
                        const modeStyle = getModeStyle(transportMode);

                        return (
                            <Link key={trip.id} href={`/${userId}/view-trips/${trip.id}`}>
                                <Card className="group hover:border-primary/50 transition-all shadow-xs active:scale-[0.99] mb-3 bg-card/80 backdrop-blur-md border-border/80 rounded-2xl overflow-hidden">
                                    <CardHeader className="p-3.5 pb-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-sm font-extrabold line-clamp-1 text-blue-600 dark:text-blue-400 group-hover:underline">
                                                {trip.title || 'Untitled Journey'}
                                            </CardTitle>
                                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${modeStyle.bg} ${modeStyle.border} ${modeStyle.text}`}>
                                                {transportMode}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-3.5 pt-0 text-xs space-y-2.5">
                                        {/* Date Pill Block */}
                                        <div className="flex items-center justify-between p-2 rounded-xl bg-muted/30 border border-border/50 text-[11px]">
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                                <span>Starts:</span>
                                            </div>
                                            <span className="font-bold text-foreground">{trip.start_date || 'TBD'}</span>
                                        </div>

                                        {/* Footer Action Bar with Hover Green Effect */}
                                        <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px]">
                                            <span className="font-medium text-muted-foreground">Expedition Plan</span>
                                            <span className="text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1 font-bold transition-colors">
                                                Explore <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })
                )}
            </div>
        </main>
    );
}

// Loading Skeleton Fallback
function TripsSkeleton() {
    return (
        <main className="min-h-screen bg-background/95 text-foreground pb-24 px-4 pt-4 max-w-md mx-auto space-y-4 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-36 bg-muted/40 rounded-xl" />
                <div className="h-6 w-20 bg-muted/40 rounded-full" />
            </div>
            <div className="h-4 w-32 bg-muted/40 rounded-md" />
            <div className="h-32 bg-muted/40 rounded-2xl" />
            <div className="h-32 bg-muted/40 rounded-2xl" />
        </main>
    );
}

export default function TripsPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<TripsSkeleton />}>
            <TripsContent params={params} />
        </Suspense>
    );
}