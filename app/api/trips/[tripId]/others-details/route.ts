import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Adjust path to your Drizzle DB client instance
import { accommodations, diningSpots, attractions } from "@/db/schema"; // Adjust path to your schema file
import { eq } from "drizzle-orm";
import crypto from "crypto";

// GET: Fetch all accommodations, attractions, and dining spots for a given trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const resolvedParams = await params;
    const tripId = resolvedParams.tripId;

    const tripAccommodations = await db
      .select()
      .from(accommodations)
      .where(eq(accommodations.tripId, tripId));

    const tripAttractions = await db
      .select()
      .from(attractions)
      .where(eq(attractions.tripId, tripId));

    const tripDining = await db
      .select()
      .from(diningSpots)
      .where(eq(diningSpots.tripId, tripId));

    return NextResponse.json({
      accommodations: tripAccommodations,
      attractions: tripAttractions,
      diningSpots: tripDining,
    });
  } catch (error: any) {
    console.error("Error fetching others-details:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST: Create a new accommodation, attraction, or dining spot in TiDB
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const resolvedParams = await params;
    const tripId = resolvedParams.tripId;
    const body = await request.json();
    const { type, ...data } = body;

    const id = crypto.randomUUID();

    if (type === "accommodation") {
      await db.insert(accommodations).values({
        id,
        tripId,
        dayId: data.dayId || null,
        name: data.name,
        status: data.status || "Confirmed",
        latitude: data.latitude ? String(data.latitude) : null,
        longitude: data.longitude ? String(data.longitude) : null,
        address: data.address || null,
        phoneNumber: data.phoneNumber || null,
        checkIn: data.checkIn
          ? new Date(data.checkIn).toISOString().slice(0, 19).replace("T", " ")
          : null,
        checkOut: data.checkOut
          ? new Date(data.checkOut).toISOString().slice(0, 19).replace("T", " ")
          : null,
        estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
        actualCost: data.actualCost ? String(data.actualCost) : null,
        currency: data.currency || "INR",
        bookingReference: data.bookingReference || null,
        externalBookingUrl: data.externalBookingUrl || null,
      });
    } else if (type === "attraction") {
      await db.insert(attractions).values({
        id,
        tripId,
        dayId: data.dayId || null,
        name: data.name,
        distanceFromBaseKm: data.distanceFromBaseKm
          ? String(data.distanceFromBaseKm)
          : null,
        latitude: data.latitude ? String(data.latitude) : null,
        longitude: data.longitude ? String(data.longitude) : null,
        entryFee: data.entryFee ? String(data.entryFee) : null,
        currency: data.currency || "INR",
        openingTime: data.openingTime || null,
        closingTime: data.closingTime || null,
        highlights: data.highlights || [],
        photographyNotes: data.photographyNotes || {},
      });
    } else if (type === "dining") {
      await db.insert(diningSpots).values({
        id,
        tripId,
        dayId: data.dayId || null,
        name: data.name,
        category: data.category || "Restaurant",
        cuisineType: data.cuisineType || null,
        latitude: data.latitude ? String(data.latitude) : null,
        longitude: data.longitude ? String(data.longitude) : null,
        address: data.address || null,
        estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
        rating: data.rating ? String(data.rating) : null,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid item type specified" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Error creating record in TiDB:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT: Update an existing record in TiDB
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const body = await request.json();
    const { id, type, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing record ID for update" },
        { status: 400 },
      );
    }

    if (type === "accommodation") {
      await db
        .update(accommodations)
        .set({
          name: data.name,
          status: data.status,
          dayId: data.dayId || null,
          address: data.address || null,
          phoneNumber: data.phoneNumber || null,
          checkIn: data.checkIn
            ? new Date(data.checkIn)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null,
          checkOut: data.checkOut
            ? new Date(data.checkOut)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null,
          estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
          actualCost: data.actualCost ? String(data.actualCost) : null,
        })
        .where(eq(accommodations.id, id));
    } else if (type === "attraction") {
      await db
        .update(attractions)
        .set({
          name: data.name,
          dayId: data.dayId || null,
          distanceFromBaseKm: data.distanceFromBaseKm
            ? String(data.distanceFromBaseKm)
            : null,
          entryFee: data.entryFee ? String(data.entryFee) : null,
          openingTime: data.openingTime || null,
          closingTime: data.closingTime || null,
        })
        .where(eq(attractions.id, id));
    } else if (type === "dining") {
      await db
        .update(diningSpots)
        .set({
          name: data.name,
          dayId: data.dayId || null,
          category: data.category,
          cuisineType: data.cuisineType || null,
          address: data.address || null,
          estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
          rating: data.rating ? String(data.rating) : null,
        })
        .where(eq(diningSpots.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating record in TiDB:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE: Remove record from TiDB
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing id or type parameters" },
        { status: 400 },
      );
    }

    if (type === "accommodation") {
      await db.delete(accommodations).where(eq(accommodations.id, id));
    } else if (type === "attraction") {
      await db.delete(attractions).where(eq(attractions.id, id));
    } else if (type === "dining") {
      await db.delete(diningSpots).where(eq(diningSpots.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting record from TiDB:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
