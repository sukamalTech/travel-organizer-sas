



// import { createClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';
// import { connection } from 'next/server';
// import Link from 'next/link';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { Calendar, Compass, ArrowRight, MapPin, Car, Truck, Bike, Train, Plane, Bus, Hotel, Utensils, Sparkles, Edit3 } from 'lucide-react';
// import { CreateTripModal } from './trips/_components/create-trip-modal';

// // Helper to return icon based on transport mode
// function getModeIcon(mode: string) {
//     switch (mode?.toLowerCase()) {
//         case 'suv': return <Truck className="h-3.5 w-3.5" />;
//         case 'bike': return <Bike className="h-3.5 w-3.5" />;
//         case 'train': return <Train className="h-3.5 w-3.5" />;
//         case 'flight': return <Plane className="h-3.5 w-3.5" />;
//         case 'bus': return <Bus className="h-3.5 w-3.5" />;
//         default: return <Car className="h-3.5 w-3.5" />;
//     }
// }

// // Server Action to process form data from the popup modal
// async function handleCreateNewTrip(formData: FormData) {
//     'use server';
//     const userId = formData.get('userId') as string;
//     const title = (formData.get('title') as string) || 'My New Journey';
//     const primaryMode = (formData.get('primary_mode') as string) || 'car';

//     const supabase = await createClient();
//     const today = new Date().toISOString().split('T')[0];

//     const { data: newTrip, error: tripInsertError } = await supabase
//         .from('trips')
//         .insert({
//             owner_id: userId,
//             title: title,
//             start_date: today,
//             end_date: today,
//             primary_mode: primaryMode,
//         })
//         .select('id')
//         .single();

//     if (tripInsertError || !newTrip) {
//         console.error('Failed to create trip:', tripInsertError?.message);
//         throw new Error(`Failed to create default trip: ${tripInsertError?.message || 'Unknown error'}`);
//     }

//     await supabase.from('itinerary_days').insert({
//         trip_id: newTrip.id,
//         day_number: 1,
//         date: today,
//         summary: 'Day 1 Planning',
//     });

//     redirect(`/${userId}/create-trip/trips/${newTrip.id}/edit`);
// }

// export default async function DashboardGateway({ params }: { params: Promise<{ id: string }> }) {
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
//     console.log(userTrips)
//     return (
//         <div className="container mx-auto px-4 py-12 max-w-7xl">
//             {/* Header Section with Colorful Modern Banner feel */}
//             <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-purple-500/10 to-blue-500/15 border border-primary/20 p-8 md:p-10 mb-12 shadow-sm">
//                 <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
//                     <Compass className="w-72 h-72 text-primary animate-spin-slow" />
//                 </div>
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
//                     <div className="space-y-3">
//                         <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold tracking-wider uppercase shadow-sm">
//                             <MapPin className="h-4 w-4" /> Travel Command Center
//                         </div>
//                         <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
//                             My Journeys
//                         </h1>
//                         <p className="text-muted-foreground text-base max-w-2xl font-medium">
//                             Design custom routes, manage day-by-day itineraries, and organize your dream expeditions effortlessly.
//                         </p>
//                     </div>

//                     <CreateTripModal userId={user.id} action={handleCreateNewTrip} buttonText="✨ New Journey" buttonSize="lg" />
//                 </div>
//             </div>

//             {/* Empty State vs Trip Cards Grid */}
//             {userTrips.length === 0 ? (
//                 <Card className="border-dashed border-2 border-border/80 bg-card/50 backdrop-blur-sm py-20 text-center rounded-3xl shadow-sm">
//                     <CardContent className="flex flex-col items-center justify-center space-y-4">
//                         <div className="p-5 bg-primary/10 rounded-2xl text-primary shadow-inner">
//                             <Compass className="h-10 w-10 animate-pulse" />
//                         </div>
//                         <div className="space-y-1.5 max-w-md mx-auto">
//                             <h3 className="text-xl font-bold tracking-tight">No journeys started yet</h3>
//                             <p className="text-sm text-muted-foreground">
//                                 Your travel canvas is empty. Create your very first road trip or expedition to get started!
//                             </p>
//                         </div>
//                         <div className="pt-2">
//                             <CreateTripModal
//                                 userId={user.id}
//                                 action={handleCreateNewTrip}
//                                 buttonText="Create Your First Trip"
//                                 buttonSize="lg"
//                             />
//                         </div>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {userTrips.map((trip) => {
//                         const mode = trip.primary_mode || 'car';
//                         return (
//                             <Card
//                                 key={trip.id}
//                                 className="group flex flex-col justify-between border-2 border-border/80 bg-card/90 backdrop-blur-md shadow-md hover:shadow-2xl hover:border-primary/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
//                             >
//                                 <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/50 via-purple-500 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" />

//                                 <CardHeader className="space-y-3 pb-4">
//                                     <div className="flex justify-between items-start gap-3">
//                                         <CardTitle className="text-xl font-extrabold group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
//                                             {trip.title || 'Untitled Journey'}
//                                         </CardTitle>
//                                         <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full font-extrabold shrink-0 border border-primary/20">
//                                             {getModeIcon(mode)}
//                                             {mode}
//                                         </span>
//                                     </div>
//                                     <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground font-semibold pt-1">
//                                         <Calendar className="h-4 w-4 text-primary" />
//                                         {trip.start_date} {trip.end_date && trip.end_date !== trip.start_date ? `— ${trip.end_date}` : ''}
//                                     </CardDescription>
//                                 </CardHeader>

//                                 <CardContent className="pt-0 pb-5 space-y-4">
//                                     {/* Edit / Main Itinerary Button */}
//                                     <Link
//                                         href={`/${user.id}/create-trip/trips/${trip.id}/edit`}
//                                         className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold text-xs transition-all shadow-2xs group/btn"
//                                     >
//                                         <span className="flex items-center gap-2">
//                                             <Edit3 className="h-4 w-4" /> Edit Full Itinerary
//                                         </span>
//                                         <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
//                                     </Link>

//                                     {/* Three Specific Section Navigation Buttons */}
//                                     <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/60">
//                                         <Link
//                                             href={`/${user.id}/create-trip/trips/${trip.id}/others-edit`}
//                                             title="Accommodations"
//                                             className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-muted/40 hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-600 border border-border/60 text-muted-foreground transition-all text-[11px] font-bold gap-1 group/sub"
//                                         >
//                                             <Hotel className="h-4 w-4 transition-transform group-hover/sub:scale-110" />
//                                             <span>Stays</span>
//                                         </Link>

//                                         <Link
//                                             href={`/${user.id}/create-trip/${trip.id}/attractions`}
//                                             title="Attractions"
//                                             className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-muted/40 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-600 border border-border/60 text-muted-foreground transition-all text-[11px] font-bold gap-1 group/sub"
//                                         >
//                                             <Sparkles className="h-4 w-4 transition-transform group-hover/sub:scale-110" />
//                                             <span>Sights</span>
//                                         </Link>

//                                         <Link
//                                             href={`/${user.id}/create-trip/${trip.id}/dining-options`}
//                                             title="Dining Options"
//                                             className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-muted/40 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600 border border-border/60 text-muted-foreground transition-all text-[11px] font-bold gap-1 group/sub"
//                                         >
//                                             <Utensils className="h-4 w-4 transition-transform group-hover/sub:scale-110" />
//                                             <span>Dining</span>
//                                         </Link>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Compass, ArrowRight, MapPin, Car, Truck, Bike, Train, Plane, Bus, Edit3, PlusCircle, Sparkles } from 'lucide-react';
import { CreateTripModal } from './trips/_components/create-trip-modal';

// Helper to return icon based on transport mode
function getModeIcon(mode: string) {
    switch (mode?.toLowerCase()) {
        case 'suv': return <Truck className="h-3.5 w-3.5" />;
        case 'bike': return <Bike className="h-3.5 w-3.5" />;
        case 'train': return <Train className="h-3.5 w-3.5" />;
        case 'flight': return <Plane className="h-3.5 w-3.5" />;
        case 'bus': return <Bus className="h-3.5 w-3.5" />;
        default: return <Car className="h-3.5 w-3.5" />;
    }
}

// Server Action to process form data from the popup modal
async function handleCreateNewTrip(formData: FormData) {
    'use server';
    const userId = formData.get('userId') as string;
    const title = (formData.get('title') as string) || 'My New Journey';
    const primaryMode = (formData.get('primary_mode') as string) || 'car';

    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    const { data: newTrip, error: tripInsertError } = await supabase
        .from('trips')
        .insert({
            owner_id: userId,
            title: title,
            start_date: today,
            end_date: today,
            primary_mode: primaryMode,
        })
        .select('id')
        .single();

    if (tripInsertError || !newTrip) {
        console.error('Failed to create trip:', tripInsertError?.message);
        throw new Error(`Failed to create default trip: ${tripInsertError?.message || 'Unknown error'}`);
    }

    await supabase.from('itinerary_days').insert({
        trip_id: newTrip.id,
        day_number: 1,
        date: today,
        summary: 'Day 1 Planning',
    });

    redirect(`/${userId}/create-trip/trips/${newTrip.id}/edit`);
}

export default async function DashboardGateway({ params }: { params: Promise<{ id: string }> }) {
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
        <div className="min-h-screen w-full flex flex-col bg-background font-sans">
            {/* Top Navigation Header matching Editor Portal style */}
            <header className="h-16 bg-card/80 backdrop-blur-md border-b border-primary/20 px-6 flex items-center justify-between shadow-xs relative sticky top-0 z-50">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-80" />
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-inner">
                        <Compass className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-foreground text-sm tracking-tight flex items-center gap-2">
                            Travel Command Center <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        </h1>
                        <p className="text-[11px] text-muted-foreground font-medium">
                            User ID: <span className="font-mono text-primary">{userId.slice(0, 8)}...</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CreateTripModal userId={user.id} action={handleCreateNewTrip} buttonText="✨ New Journey" buttonSize="sm" />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                {/* Banner / Intro Section */}
                <div className="relative overflow-hidden rounded-3xl bg-card/70 backdrop-blur-md border border-primary/20 p-8 md:p-10 mb-10 shadow-sm">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-purple-500 to-blue-500 opacity-80" />
                    <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                        <Compass className="w-72 h-72 text-primary" />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 text-primary text-xs font-extrabold tracking-wider uppercase shadow-2xs border border-primary/20">
                                <MapPin className="h-3.5 w-3.5" /> My Journeys Dashboard
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                                Expeditions & Road Trips
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-2xl font-medium">
                                Design custom routes, manage day-by-day itineraries, and organize your dream expeditions effortlessly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Empty State vs Trip Cards Grid */}
                {userTrips.length === 0 ? (
                    <Card className="border-dashed border-2 border-border/80 bg-card/50 backdrop-blur-sm py-20 text-center rounded-3xl shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-5 bg-primary/10 rounded-2xl text-primary shadow-inner">
                                <Compass className="h-10 w-10 animate-pulse" />
                            </div>
                            <div className="space-y-1.5 max-w-md mx-auto">
                                <h3 className="text-xl font-bold tracking-tight">No journeys started yet</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your travel canvas is empty. Create your very first road trip or expedition to get started!
                                </p>
                            </div>
                            <div className="pt-2">
                                <CreateTripModal
                                    userId={user.id}
                                    action={handleCreateNewTrip}
                                    buttonText="Create Your First Trip"
                                    buttonSize="lg"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userTrips.map((trip) => {
                            const mode = trip.primary_mode || 'car';
                            return (
                                <Card
                                    key={trip.id}
                                    className="group flex flex-col justify-between border-2 border-border/80 bg-card/70 backdrop-blur-md shadow-md hover:shadow-2xl hover:border-primary/60 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 relative"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/50 via-purple-500 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                                    <CardHeader className="space-y-3 pb-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <CardTitle className="text-lg font-extrabold group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
                                                {trip.title || 'Untitled Journey'}
                                            </CardTitle>
                                            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full font-extrabold shrink-0 border border-primary/20 shadow-2xs">
                                                {getModeIcon(mode)}
                                                {mode}
                                            </span>
                                        </div>
                                        <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground font-semibold pt-1">
                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                            {trip.start_date} {trip.end_date && trip.end_date !== trip.start_date ? `— ${trip.end_date}` : ''}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pt-0 pb-5 space-y-3">
                                        {/* Action 1: Edit Full Itinerary */}
                                        <Link
                                            href={`/${user.id}/create-trip/trips/${trip.id}/edit`}
                                            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-xs transition-all shadow-xs group/btn"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Edit3 className="h-4 w-4" /> Edit Full Itinerary
                                            </span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>

                                        {/* Action 2: Add Other Details */}
                                        <Link
                                            href={`/${user.id}/create-trip/trips/${trip.id}/others-details`}
                                            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold text-xs transition-all shadow-xs group/sub"
                                        >
                                            <span className="flex items-center gap-2">
                                                <PlusCircle className="h-4 w-4 transition-transform group-hover/sub:scale-110" /> Add Other Details (Stays, Food, Sights)
                                            </span>
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover/sub:translate-x-1" />
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}