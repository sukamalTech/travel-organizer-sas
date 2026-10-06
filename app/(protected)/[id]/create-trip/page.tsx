// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';

export const instant = false;

export default async function DashboardGateway() {
    await connection();

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Query user's most recently updated trip
    const { data: latestTrip } = await supabase
        .from('trips')
        .select('id')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    let targetTripId = latestTrip?.id;

    // If no trip exists yet, create default initial trip & Day 1
    if (!targetTripId) {
        const today = new Date().toISOString().split('T')[0];

        const { data: newTrip, error: tripInsertError } = await supabase
            .from('trips')
            .insert({
                owner_id: user.id,
                title: 'My First Journey',
                start_date: today,
                end_date: today,
                primary_mode: 'car',
            })
            .select('id')
            .single();

        if (tripInsertError || !newTrip) {
            console.error('Failed to create trip:', tripInsertError?.message || tripInsertError);
            throw new Error(`Failed to create default trip: ${tripInsertError?.message || 'Unknown error'}`);
        }

        targetTripId = newTrip.id;

        const { error: dayInsertError } = await supabase.from('itinerary_days').insert({
            trip_id: newTrip.id,
            day_number: 1,
            date: today,
            summary: 'Day 1 Planning',
        });

        if (dayInsertError) {
            console.error('Failed to create itinerary day:', dayInsertError.message);
        }
    }

    // Guard against redirecting with undefined ID
    if (!targetTripId) {
        throw new Error('Trip ID resolution failed.');
    }

    redirect(`/${user.id}/create-trip/trips/${targetTripId}/edit`);
}