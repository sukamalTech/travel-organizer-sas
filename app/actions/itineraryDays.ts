// app/actions/itineraryDays.ts
"use server";

import { eq, asc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { itineraryDays } from "@/db/schema";

async function requireAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user.id;
}

// 1. Fetch all itinerary days for a trip
export async function getTripItineraryDays(tripId: string) {
  await requireAuthUser();

  const rows = await db
    .select()
    .from(itineraryDays)
    .where(eq(itineraryDays.tripId, tripId))
    .orderBy(asc(itineraryDays.dayNumber));

  return rows.map((row) => ({
    id: row.id,
    trip_id: row.tripId,
    day_number: row.dayNumber,
    date: row.date,
    summary: row.summary,
    daily_notes: row.dailyNotes,
    night_stay_location: row.nightStayLocation,
    night_stay_notes: row.nightStayNotes,
    day_metadata:
      typeof row.dayMetadata === "string"
        ? JSON.parse(row.dayMetadata)
        : row.dayMetadata || { stays: [], dining: [], attractions: [] },
    created_at: row.createdAt,
  }));
}

// 2. Add a new date/day to a trip
export async function createItineraryDay(data: {
  tripId: string;
  dayNumber: number;
  date: string;
  summary?: string;
}) {
  await requireAuthUser();

  const id = globalThis.crypto.randomUUID();
  const defaultMeta = { stays: [], dining: [], attractions: [] };

  await db.insert(itineraryDays).values({
    id,
    tripId: data.tripId,
    dayNumber: data.dayNumber,
    date: data.date,
    summary: data.summary || `Day ${data.dayNumber}`,
    dailyNotes: "",
    nightStayLocation: null,
    nightStayNotes: null,
    dayMetadata: defaultMeta,
  });

  return {
    id,
    trip_id: data.tripId,
    day_number: data.dayNumber,
    date: data.date,
    summary: data.summary || `Day ${data.dayNumber}`,
    daily_notes: "",
    night_stay_location: null,
    night_stay_notes: null,
    day_metadata: defaultMeta,
  };
}

// 3. Update Night Stay, Daily Notes, and Stays/Dining/Attractions metadata
export async function updateItineraryDayDetails(
  dayId: string,
  data: {
    nightStayLocation?: string | null;
    nightStayNotes?: string | null;
    dailyNotes?: string | null;
    summary?: string | null;
    dayMetadata?: Record<string, any>;
  },
) {
  await requireAuthUser();

  await db
    .update(itineraryDays)
    .set({
      ...(data.nightStayLocation !== undefined && {
        nightStayLocation: data.nightStayLocation || null,
      }),
      ...(data.nightStayNotes !== undefined && {
        nightStayNotes: data.nightStayNotes || null,
      }),
      ...(data.dailyNotes !== undefined && {
        dailyNotes: data.dailyNotes,
      }),
      ...(data.summary !== undefined && {
        summary: data.summary,
      }),
      ...(data.dayMetadata !== undefined && {
        dayMetadata: data.dayMetadata,
      }),
    })
    .where(eq(itineraryDays.id, dayId));

  return { success: true };
}

// 4. Update a single day's calendar date
export async function updateItineraryDayDate(dayId: string, newDate: string) {
  await requireAuthUser();

  await db
    .update(itineraryDays)
    .set({ date: newDate })
    .where(eq(itineraryDays.id, dayId));

  return { success: true };
}

// 5. Drag & Drop Reorder: Update day_number & sequential dates while keeping day IDs intact
export async function reorderItineraryDays(
  reorderedDays: { id: string; day_number: number; date: string }[],
) {
  await requireAuthUser();

  for (const day of reorderedDays) {
    await db
      .update(itineraryDays)
      .set({
        dayNumber: day.day_number,
        date: day.date,
      })
      .where(eq(itineraryDays.id, day.id));
  }

  return { success: true };
}

// 6. Delete a day and re-sequence remaining days
export async function deleteItineraryDay(
  dayId: string,
  remainingDays: { id: string; day_number: number }[],
) {
  await requireAuthUser();

  await db.delete(itineraryDays).where(eq(itineraryDays.id, dayId));

  for (const day of remainingDays) {
    await db
      .update(itineraryDays)
      .set({ dayNumber: day.day_number })
      .where(eq(itineraryDays.id, day.id));
  }

  return { success: true };
}
