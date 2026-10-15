
// app/[id]/create-trip/createNewTrip/page.tsx (Server Component)
export const instant = false;
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Adjust to your Supabase server client path
import CreateTripClient from './create-trip-client';
import { Suspense } from 'react';
interface PageProps {
  params: Promise<{ id: string }>;
}

// Server Action to handle form submission and database insertion
async function handleCreateTripAction(formData: FormData) {
  'use server';

  const ownerId = formData.get('owner_id') as string;
  const title = (formData.get('title') as string) || 'My New Journey';
  const description = (formData.get('description') as string) || '';
  const startDate = formData.get('start_date') as string;
  const endDate = formData.get('end_date') as string;
  const primaryMode = (formData.get('primary_mode') as string) || 'car';

  const supabase = await createClient();

  // Verify session inside server action for absolute security
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== ownerId) {
    throw new Error('Unauthorized access or session expired.');
  }

  // Insert into 'trips' table matching your Supabase schema
  const { data: newTrip, error: tripInsertError } = await supabase
    .from('trips')
    .insert({
      owner_id: ownerId,
      title: title,
      description: description,
      start_date: startDate,
      end_date: endDate,
      primary_mode: primaryMode,
    })
    .select('id')
    .single();

  if (tripInsertError || !newTrip) {
    console.error('Failed to create trip:', tripInsertError?.message);
    throw new Error(`Failed to create trip: ${tripInsertError?.message || 'Unknown error'}`);
  }

  // Create default Day 1 itinerary record
  await supabase.from('itinerary_days').insert({
    trip_id: newTrip.id,
    day_number: 1,
    date: startDate,
    summary: 'Day 1 Planning',
  });

  // Construct search params to pass to the edit page
  const queryParams = new URLSearchParams({
    startDate,
    endDate,
    title,
  }).toString();

  // Redirect to the target edit page with params
  redirect(`/${ownerId}/create-trip/trips/${newTrip.id}/edit?${queryParams}`);
}

export default async function CreateNewTripPage({ params }: PageProps) {
  const resolvedParams = await params;
  const urlId = resolvedParams.id;

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Security Check: If user is not logged in or URL ID does not match logged-in user
  if (error || !user || user.id !== urlId) {
    redirect('/auth/login'); // Adjust login route as needed
  }

  return (
    <Suspense fallback={<CreateTripLoadingSkeleton />}>
      <CreateTripClient ownerId={urlId} action={handleCreateTripAction} />;
    </Suspense>)
}

function CreateTripLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded-full" />
        <div className="h-8 w-3/4 bg-muted rounded-lg" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="space-y-4 pt-4">
          <div className="h-12 w-full bg-muted rounded-xl" />
          <div className="h-24 w-full bg-muted rounded-xl" />
          <div className="h-12 w-full bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}