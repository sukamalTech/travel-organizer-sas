import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Compass, ArrowRight, MapPin, Car, Truck, Bike, Train, Plane, Bus, Edit3, PlusCircle, Sparkles } from 'lucide-react';
/**
 * Robustly parses date strings formatted as YYYY-MM-DD, DD-MM-YYYY, or DD.MM.YYYY
 */
function parseCustomDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;

    // Handle DD.MM.YYYY format (with dots)
    if (dateStr.includes(".")) {
        const parts = dateStr.split(".");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
        }
    }

    // Handle DD-MM-YYYY format
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 2) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return new Date(`${year}-${month}-${day}`);
        }
    }

    // Fallback to standard ISO / Date constructor
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
}

export default async function TripsPage({ params }: { params: Promise<{ id: string }> }) {
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

    console.log(userTrips)

    return (
        <main className="min-h-screen bg-background text-foreground pb-20 px-4 pt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight">My Travel Diary</h1>
                <Badge variant="outline" className="text-xs">Mobile First</Badge>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Compass className="w-5 h-5 text-primary" /> Upcoming Adventures
                </h2>

                {userTrips.length === 0 ? (
                    <p className="text-sm text-muted-foreground bg-card p-4 rounded-xl border text-center">
                        No upcoming trips found. Plan your next getaway!
                    </p>
                ) : (
                    userTrips.map((trip) => {
                        return (
                            <Link key={trip.id} href={`/trips/${trip.id}`}>
                                <Card className="hover:border-primary transition-all shadow-sm active:scale-[0.99] mb-3">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base font-bold">{trip.title}</CardTitle>
                                            <Badge variant="secondary" className="text-[10px]">
                                                {trip.primary_transport || "Road Trip"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            <span>Starts: </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t mt-2">
                                            <span className="font-medium text-foreground"> Days Trip</span>
                                            <span className="text-primary flex items-center gap-0.5 font-medium">
                                                Explore <ChevronRight className="w-3.5 h-3.5" />
                                                <Link
                                                    href={`/${user.id}/view-trips/${trip.id}`}
                                                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-xs transition-all shadow-xs group/btn"
                                                ></Link>
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