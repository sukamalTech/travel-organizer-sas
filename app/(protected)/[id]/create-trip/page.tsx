


// import { Suspense } from 'react';
// import { createClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import { connection } from 'next/server';
// import Link from 'next/link';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { Calendar, Compass, ArrowRight, MapPin, Car, Truck, Bike, Train, Plane, Bus, Edit3, PlusCircle, Sparkles } from 'lucide-react';





// // Inner component handling params, connection, and data fetching inside Suspense
// async function TripDashboardContent({ params }: { params: Promise<{ id: string }> }) {
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
//         <div className="min-h-screen w-full flex flex-col bg-background/95 text-foreground font-sans">
//             {/* Top Navigation Header */}
//             <header className="h-16 bg-card/85 backdrop-blur-md border-b border-border/60 px-6 flex items-center justify-between shadow-xs sticky top-0 z-50">
//                 <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
//                         <Compass className="w-5 h-5 animate-spin-slow" />
//                     </div>
//                     <div>
//                         <h1 className="font-extrabold text-foreground text-sm tracking-tight flex items-center gap-2">
//                             Travel Command Center <Sparkles className="w-3.5 h-3.5 text-purple-500" />
//                         </h1>
//                         <p className="text-[11px] text-muted-foreground font-medium">
//                             User ID: <span className="font-mono text-primary">{userId.slice(0, 8)}...</span>
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <Link href={`/${userId}/createNewTrip`} className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-500">
//                         <Sparkles className="h-5 w-5" />
//                         Create New Trip
//                     </Link>
//                     {/* <CreateTripModal userId={user.id} action={handleCreateNewTrip} buttonText="✨ New Journey" buttonSize="sm" /> */}
//                 </div>
//             </header>

//             {/* Main Content Area */}
//             <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
//                 {/* Banner / Intro Section */}
//                 <div className="relative overflow-hidden rounded-3xl bg-card/70 backdrop-blur-md border border-border/80 p-8 md:p-10 mb-10 shadow-sm">
//                     <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
//                         <Compass className="w-72 h-72 text-primary" />
//                     </div>
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
//                         <div className="space-y-3">
//                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 text-primary text-xs font-extrabold tracking-wider uppercase shadow-2xs border border-primary/20">
//                                 <MapPin className="h-3.5 w-3.5" /> My Journeys Dashboard
//                             </div>
//                             <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
//                                 Expeditions & Road Trips
//                             </h2>
//                             <p className="text-muted-foreground text-sm max-w-2xl font-medium">
//                                 Design custom routes, manage day-by-day itineraries, and organize your dream expeditions effortlessly.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Empty State vs Trip Cards Grid */}
//                 {userTrips.length === 0 ? (
//                     <Card className="border-dashed border-2 border-border/80 bg-card/50 backdrop-blur-sm py-20 text-center rounded-3xl shadow-sm">
//                         <CardContent className="flex flex-col items-center justify-center space-y-4">
//                             <div className="p-5 bg-primary/10 rounded-2xl text-primary shadow-inner">
//                                 <Compass className="h-10 w-10 animate-pulse" />
//                             </div>
//                             <div className="space-y-1.5 max-w-md mx-auto">
//                                 <h3 className="text-xl font-bold tracking-tight">No journeys started yet</h3>
//                                 <p className="text-sm text-muted-foreground">
//                                     Your travel canvas is empty. Create your very first road trip or expedition to get started!
//                                 </p>
//                             </div>
//                             <div className="pt-2"></div>
//                         </CardContent>
//                     </Card>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {userTrips.map((trip) => {
//                             const mode = trip.primary_mode || trip.primary_transport || 'car';


//                             return (
//                                 <Card
//                                     key={trip.id}
//                                     className="group flex flex-col justify-between border border-border/80 bg-card/80 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 relative"
//                                 >
//                                     <CardHeader className="space-y-3 pb-4">
//                                         <div className="flex justify-between items-start gap-3">
//                                             <CardTitle className="text-lg font-extrabold text-blue-600 dark:text-blue-400 group-hover:underline transition-colors line-clamp-1 tracking-tight">
//                                                 {trip.title || 'Untitled Journey'}
//                                             </CardTitle>
//                                             <span className={`inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-3 py-1 rounded-full font-extrabold shrink-0 border`}>

//                                                 {mode}
//                                             </span>
//                                         </div>
//                                         <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground font-semibold pt-1">
//                                             <Calendar className="h-3.5 w-3.5 text-primary" />
//                                             {trip.start_date} {trip.end_date && trip.end_date !== trip.start_date ? `— ${trip.end_date}` : ''}
//                                         </CardDescription>
//                                     </CardHeader>

//                                     <CardContent className="pt-0 pb-5 space-y-3">
//                                         {/* Action 1: Edit Full Itinerary */}
//                                         <Link
//                                             href={`/${user.id}/create-trip/trips/${trip.id}/edit`}
//                                             className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/10 hover:bg-emerald-600/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-primary/20 hover:border-emerald-500/30 text-primary font-bold text-xs transition-all shadow-xs group/btn"
//                                         >
//                                             <span className="flex items-center gap-2">
//                                                 <Edit3 className="h-4 w-4" /> Edit Full Itinerary
//                                             </span>
//                                             <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
//                                         </Link>

//                                         {/* Action 2: Add Other Details */}
//                                         <Link
//                                             href={`/${user.id}/create-trip/trips/${trip.id}/others-details`}
//                                             className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-purple-500/10 hover:bg-emerald-600/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-purple-500/20 hover:border-emerald-500/30 text-purple-600 dark:text-purple-400 font-bold text-xs transition-all shadow-xs group/sub"
//                                         >
//                                             <span className="flex items-center gap-2">
//                                                 <PlusCircle className="h-4 w-4 transition-transform group-hover/sub:scale-110" /> Add Other Details (Stays, Food, Sights)
//                                             </span>
//                                             <ArrowRight className="h-4 w-4 transition-transform group-hover/sub:translate-x-1" />
//                                         </Link>
//                                     </CardContent>
//                                 </Card>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // Loading Skeleton Fallback
// function DashboardSkeleton() {
//     return (
//         <div className="min-h-screen w-full flex flex-col bg-background font-sans p-6 space-y-8 animate-pulse">
//             <div className="h-16 bg-muted/40 rounded-xl" />
//             <div className="h-48 bg-muted/40 rounded-3xl" />
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <div className="h-64 bg-muted/40 rounded-3xl" />
//                 <div className="h-64 bg-muted/40 rounded-3xl" />
//                 <div className="h-64 bg-muted/40 rounded-3xl" />
//             </div>
//         </div>
//     );
// }

// export default function DashboardGateway({ params }: { params: Promise<{ id: string }> }) {
//     return (
//         <Suspense fallback={<DashboardSkeleton />}>
//             <TripDashboardContent params={params} />
//         </Suspense>
//     );
// }
// import { Suspense } from 'react';
// import { createClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import { connection } from 'next/server';
// import Link from 'next/link';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { Calendar, Compass, ArrowRight, MapPin, Edit3, PlusCircle, Sparkles, Map, Navigation, Hotel, Eye } from 'lucide-react';

// // Inner component handling params, connection, and data fetching inside Suspense
// async function TripDashboardContent({ params }: { params: Promise<{ id: string }> }) {
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
//         <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">

//             {/* Top Navigation Header */}
//             <header className="h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between shadow-xs sticky top-0 z-50">
//                 <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-inner">
//                         <Compass className="w-5 h-5 animate-spin-slow" />
//                     </div>
//                     <div>
//                         <h1 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
//                             Travel Command Center <Sparkles className="w-3.5 h-3.5 text-purple-500" />
//                         </h1>
//                         <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
//                             User ID: <span className="font-mono text-indigo-600 dark:text-indigo-400">{userId.slice(0, 8)}...</span>
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <Link
//                         href={`/${userId}/createNewTrip`}
//                         className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
//                     >
//                         <Sparkles className="h-4 w-4" />
//                         Create New Trip
//                     </Link>
//                 </div>
//             </header>

//             {/* Main Content Area in Responsive 2-Column Grid */}
//             <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">


//                 {/* Banner / Intro Section */}
//                 <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-slate-50 to-indigo-50/20 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-indigo-950/30 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
//                     <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
//                         <Compass className="w-64 h-64 text-indigo-600 dark:text-indigo-400" />
//                     </div>
//                     <div className="space-y-3 relative z-10">
//                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold tracking-wider uppercase border border-indigo-500/20 shadow-inner">
//                             <MapPin className="h-3.5 w-3.5" /> My Journeys Dashboard
//                         </div>
//                         <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
//                             Expeditions & Road Trips
//                         </h2>
//                         <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
//                             Design custom routes, manage day-by-day itineraries, and organize your dream expeditions effortlessly.
//                         </p>
//                     </div>
//                 </div>

//                 {/* Empty State vs Trip Cards Grid */}
//                 {userTrips.length === 0 ? (
//                     <div className="rounded-3xl border-dashed border-2 border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl py-16 text-center shadow-xl p-8">
//                         <div className="flex flex-col items-center justify-center space-y-4">
//                             <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-inner">
//                                 <Compass className="h-10 w-10 animate-pulse" />
//                             </div>
//                             <div className="space-y-1.5 max-w-md mx-auto">
//                                 <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">No journeys started yet</h3>
//                                 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
//                                     Your travel canvas is empty. Create your very first road trip or expedition to get started!
//                                 </p>
//                             </div>
//                             <div className="pt-2">
//                                 <Link
//                                     href={`/${userId}/createNewTrip`}
//                                     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all"
//                                 >
//                                     <Sparkles className="w-4 h-4" /> Create First Trip
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         {userTrips.map((trip) => {
//                             const mode = trip.primary_mode || trip.primary_transport || 'car';

//                             return (
//                                 <Card
//                                     key={trip.id}
//                                     className="group flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 relative p-1"
//                                 >
//                                     <CardHeader className="space-y-3 pb-4 pt-4 px-5">
//                                         <div className="flex justify-between items-start gap-3">
//                                             <CardTitle className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 group-hover:underline transition-colors line-clamp-1 tracking-tight">
//                                                 {trip.title || 'Untitled Journey'}
//                                             </CardTitle>
//                                             <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-extrabold shrink-0 border bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
//                                                 {mode}
//                                             </span>
//                                         </div>
//                                         <CardDescription className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-0.5">
//                                             <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
//                                             {trip.start_date} {trip.end_date && trip.end_date !== trip.start_date ? `— ${trip.end_date}` : ''}
//                                         </CardDescription>
//                                     </CardHeader>

//                                     <CardContent className="pt-0 pb-5 px-5 space-y-3">
//                                         {/* Action 1: Edit Full Itinerary */}
//                                         <Link
//                                             href={`/${userId}/create-trip/trips/${trip.id}/edit`}
//                                             className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 hover:bg-emerald-600/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-indigo-500/20 hover:border-emerald-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-all shadow-xs group/btn"
//                                         >
//                                             <span className="flex items-center gap-2">
//                                                 <Edit3 className="h-4 w-4" /> Edit Full Itinerary
//                                             </span>
//                                             <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
//                                         </Link>

//                                         {/* Action 2: Add Other Details */}
//                                         <Link
//                                             href={`/${userId}/create-trip/trips/${trip.id}/others-details`}
//                                             className="w-full flex items-center justify-between p-3 rounded-2xl bg-purple-500/10 hover:bg-emerald-600/10 hover:text-emerald-600 dark:hover:text-emerald-400 border border-purple-500/20 hover:border-emerald-500/30 text-purple-600 dark:text-purple-400 font-bold text-xs transition-all shadow-xs group/sub"
//                                         >
//                                             <span className="flex items-center gap-2">
//                                                 <PlusCircle className="h-4 w-4 transition-transform group-hover/sub:scale-110" /> Add Stays, Food & Sights
//                                             </span>
//                                             <ArrowRight className="h-4 w-4 transition-transform group-hover/sub:translate-x-1" />
//                                         </Link>
//                                     </CardContent>
//                                 </Card>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>

//     );
// }

// // Loading Skeleton Fallback
// function DashboardSkeleton() {
//     return (
//         <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 font-sans p-6 space-y-8 animate-pulse">
//             <div className="h-16 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                 <div className="lg:col-span-5 h-[500px] bg-slate-200 dark:bg-slate-900 rounded-3xl" />
//                 <div className="lg:col-span-7 space-y-6">
//                     <div className="h-40 bg-slate-200 dark:bg-slate-900 rounded-3xl" />
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                         <div className="h-56 bg-slate-200 dark:bg-slate-900 rounded-3xl" />
//                         <div className="h-56 bg-slate-200 dark:bg-slate-900 rounded-3xl" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function DashboardGateway({ params }: { params: Promise<{ id: string }> }) {
//     return (
//         <Suspense fallback={<DashboardSkeleton />}>
//             <TripDashboardContent params={params} />
//         </Suspense>
//     );
// }

import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Compass, ArrowRight, MapPin, Edit3, PlusCircle, Sparkles, Map, Navigation, Hotel, Eye } from 'lucide-react';

// Helper function to get color styling based on travel mode
const getModeTheme = (mode: string) => {
    switch (mode.toLowerCase()) {
        case 'car':
            return {
                badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
                secondaryButton: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20',
            };
        case 'train':
            return {
                badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
                secondaryButton: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 border border-blue-500/20',
            };
        case 'bike':
        case 'motorcycle':
            return {
                badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20',
                secondaryButton: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/20',
            };
        case 'bus':
            return {
                badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
                button: 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20',
                secondaryButton: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 border border-orange-500/20',
            };
        case 'flight':
        case 'plane':
            return {
                badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
                button: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20',
                secondaryButton: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 border border-purple-500/20',
            };
        default:
            return {
                badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
                button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20',
                secondaryButton: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20',
            };
    }
};

// Inner component handling params, connection, and data fetching inside Suspense
async function TripDashboardContent({ params }: { params: Promise<{ id: string }> }) {
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
        <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">

            {/* Top Navigation Header */}
            <header className="h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between shadow-xs sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 shadow-inner">
                        <Compass className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
                            Travel Command Center <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        </h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            User ID: <span className="font-mono text-indigo-600 dark:text-indigo-400">{userId.slice(0, 8)}...</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/${userId}/createNewTrip`}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
                    >
                        <Sparkles className="h-4 w-4" />
                        Create New Trip
                    </Link>
                </div>
            </header>

            {/* Main Content Area in Responsive 2-Column Grid */}
            <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">



                {/* Right Column: Expeditions & Trip Cards Dashboard */}
                <div >

                    {/* Banner / Intro Section */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/90 via-slate-50 to-indigo-50/20 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-indigo-950/30 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
                        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                            <Compass className="w-64 h-64 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="space-y-3 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold tracking-wider uppercase border border-indigo-500/20 shadow-inner">
                                <MapPin className="h-3.5 w-3.5" /> My Journeys Dashboard
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Expeditions & Road Trips
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
                                Design custom routes, manage day-by-day itineraries, and organize your dream expeditions effortlessly.
                            </p>
                        </div>
                    </div>

                    {/* Empty State vs Trip Cards Grid */}
                    {userTrips.length === 0 ? (
                        <div className="rounded-3xl border-dashed border-2 border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl py-16 text-center shadow-xl p-8">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-inner">
                                    <Compass className="h-10 w-10 animate-pulse" />
                                </div>
                                <div className="space-y-1.5 max-w-md mx-auto">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">No journeys started yet</h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Your travel canvas is empty. Create your very first road trip or expedition to get started!
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <Link
                                        href={`/${userId}/createNewTrip`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all"
                                    >
                                        <Sparkles className="w-4 h-4" /> Create First Trip
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {userTrips.map((trip) => {
                                const mode = trip.primary_mode || trip.primary_transport || 'car';
                                const theme = getModeTheme(mode);

                                return (
                                    <Card
                                        key={trip.id}
                                        className="group flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 relative"
                                    >
                                        <CardHeader className="space-y-2.5 pb-3 pt-4 px-5">
                                            <div className="flex justify-between items-start gap-3">
                                                <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 tracking-tight">
                                                    {trip.title || 'Untitled Journey'}
                                                </CardTitle>
                                                <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-extrabold shrink-0 border ${theme.badge}`}>
                                                    {mode}
                                                </span>
                                            </div>
                                            <CardDescription className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                                {trip.start_date} {trip.end_date && trip.end_date !== trip.start_date ? `— ${trip.end_date}` : ''}
                                            </CardDescription>
                                        </CardHeader>

                                        {/* Bottom Action Line with Small Rounded Buttons */}
                                        <CardContent className="pt-2 pb-4 px-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
                                            {/* Edit Itinerary Button */}
                                            <Link
                                                href={`/${userId}/create-trip/trips/${trip.id}/edit`}
                                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${theme.button}`}
                                            >
                                                <Edit3 className="h-3.5 w-3.5" /> Itinerary
                                            </Link>

                                            {/* Add Details Button */}
                                            <Link
                                                href={`/${userId}/create-trip/trips/${trip.id}/others-details`}
                                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${theme.secondaryButton}`}
                                            >
                                                <PlusCircle className="h-3.5 w-3.5" /> Stay-Dining-Attractions
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Loading Skeleton Fallback
function DashboardSkeleton() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 font-sans p-6 space-y-8 animate-pulse">
            <div className="h-16 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 h-[500px] bg-slate-200 dark:bg-slate-900 rounded-3xl" />
                <div className="lg:col-span-7 space-y-6">
                    <div className="h-40 bg-slate-200 dark:bg-slate-900 rounded-3xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="h-48 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
                        <div className="h-48 bg-slate-200 dark:bg-slate-900 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardGateway({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <TripDashboardContent params={params} />
        </Suspense>
    );
}