import { NextResponse } from "next/server";
import { db } from "@/db"; // Your Drizzle DB client instance
import { accommodations, diningSpots, attractions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tripId = searchParams.get("tripId");

  if (!tripId) {
    return NextResponse.json(
      { error: "Missing tripId parameter" },
      { status: 400 },
    );
  }

  try {
    const [accs, dinings, attrs] = await Promise.all([
      db.select().from(accommodations).where(eq(accommodations.tripId, tripId)),
      db.select().from(diningSpots).where(eq(diningSpots.tripId, tripId)),
      db.select().from(attractions).where(eq(attractions.tripId, tripId)),
    ]);

    return NextResponse.json({
      accommodations: accs,
      diningSpots: dinings,
      attractions: attrs,
    });
  } catch (error) {
    console.error("TiDB fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
