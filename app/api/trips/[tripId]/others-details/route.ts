// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/db";
// import {
//   accommodations,
//   diningSpots,
//   attractions,
//   travelLegs,
// } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import crypto from "crypto";

// // GET: Fetch all accommodations, attractions, and dining spots for a given trip
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ tripId: string }> },
// ) {
//   try {
//     const resolvedParams = await params;
//     const tripId = resolvedParams.tripId;

//     const tripAccommodations = await db
//       .select()
//       .from(accommodations)
//       .where(eq(accommodations.tripId, tripId));

//     const tripAttractions = await db
//       .select()
//       .from(attractions)
//       .where(eq(attractions.tripId, tripId));

//     const tripDinings = await db
//       .select()
//       .from(diningSpots)
//       .where(eq(diningSpots.tripId, tripId));
//     const tripLegs = await db
//       .select()
//       .from(travelLegs)
//       .where(eq(travelLegs.tripId, tripId));
//     return NextResponse.json({
//       accommodations: tripAccommodations,
//       attractions: tripAttractions,
//       travelLegs: tripLegs,
//       diningSpots: tripDinings,
//     });
//   } catch (error: any) {
//     console.error("Error fetching others-details:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// // POST: Create a new accommodation, attraction, or dining spot in TiDB
// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ tripId: string }> },
// ) {
//   try {
//     const resolvedParams = await params;
//     const tripId = resolvedParams.tripId;
//     const body = await request.json();
//     const { type, ...data } = body;

//     const id = crypto.randomUUID();

//     if (type === "accommodation") {
//       await db.insert(accommodations).values({
//         id,
//         tripId,
//         dayId: data.dayId || null,
//         name: data.name,
//         placeName: data.placeName || null, // Added
//         facilities: data.facilities || [], // Added
//         status: data.status || "Confirmed",
//         latitude: data.latitude ? String(data.latitude) : null,
//         longitude: data.longitude ? String(data.longitude) : null,
//         address: data.address || null,
//         phoneNumber: data.phoneNumber || null,
//         checkIn: data.checkIn
//           ? new Date(data.checkIn).toISOString().slice(0, 19).replace("T", " ")
//           : null,
//         checkOut: data.checkOut
//           ? new Date(data.checkOut).toISOString().slice(0, 19).replace("T", " ")
//           : null,
//         estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
//         actualCost: data.actualCost ? String(data.actualCost) : null,
//         currency: data.currency || "INR",
//         bookingReference: data.bookingReference || null,
//         externalBookingUrl: data.externalBookingUrl || null,
//       });
//     } else if (type === "attraction") {
//       await db.insert(attractions).values({
//         id,
//         tripId,
//         dayId: data.dayId || null,
//         name: data.name,
//         address: data.address || null, // Added
//         latitude: data.latitude ? String(data.latitude) : null,
//         longitude: data.longitude ? String(data.longitude) : null,
//         entryFee: data.entryFee ? String(data.entryFee) : null,
//         currency: data.currency || "INR",
//         openingTime: data.openingTime || null,
//         closingTime: data.closingTime || null,
//         highlights: data.highlights || [],
//         photographyNotes: data.photographyNotes || [],
//       });
//     } else if (type === "dining") {
//       await db.insert(diningSpots).values({
//         id,
//         tripId,
//         dayId: data.dayId || null,
//         name: data.name,
//         category: data.category || "Restaurant",
//         cuisineType: data.cuisineType || null,
//         latitude: data.latitude ? String(data.latitude) : null,
//         longitude: data.longitude ? String(data.longitude) : null,
//         address: data.address || null,
//         estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
//         rating: data.rating ? String(data.rating) : null,
//       });
//     } else if (type === "leg") {
//       // await db.insert(travelLegs).values({
//       //   id,
//       //   tripId,
//       //   dayId: data.dayId || null,
//       //   mode: data.mode || null,
//       //   originName: data.originName,
//       //   originLat: data.originLat ? String(data.latitude) : null,
//       //   originLng: data.originLng ? String(data.latitude) : null,
//       //   destinationName: data.destinationName,
//       //   destinationLat: data.destinationLat ? String(data.latitude) : null,
//       //   destinationLng: data.destinationLng ? String(data.latitude) : null,

//       //   departureTime: data.departureTime || null,
//       //   arrivalTime: data.arrivalTime || null,

//       //   distanceKm: data.distanceKm,
//       //   sequenceOrder: data.sequenceOrder || null,

//       //   metadata: data.metadata || null,
//       // });

//       const toNullableDecimal = (val: unknown): string | null => {
//         if (
//           val === null ||
//           val === undefined ||
//           val === "" ||
//           val === "undefined"
//         ) {
//           return null;
//         }
//         const num = typeof val === "number" ? val : Number(val);
//         return Number.isFinite(num) ? num.toFixed(8) : null;
//       };

//       await db.insert(travelLegs).values({
//         id,
//         tripId,
//         dayId: data.dayId,
//         mode: data.mode || "car",
//         originName: String(data.originName ?? "").trim(),
//         originLat: toNullableDecimal(data.originLat),
//         originLng: toNullableDecimal(data.originLng),
//         destinationName: String(data.destinationName ?? "").trim(),
//         destinationLat: toNullableDecimal(data.destinationLat),
//         destinationLng: toNullableDecimal(data.destinationLng),
//         departureTime:
//           data.departureTime && data.departureTime !== "undefined"
//             ? data.departureTime
//             : null,
//         arrivalTime:
//           data.arrivalTime && data.arrivalTime !== "undefined"
//             ? data.arrivalTime
//             : null,
//         distanceKm:
//           data.distanceKm !== undefined &&
//           data.distanceKm !== null &&
//           data.distanceKm !== "" &&
//           Number.isFinite(Number(data.distanceKm))
//             ? Number(data.distanceKm)
//             : null,
//         sequenceOrder: Number(data.sequenceOrder) || 1,
//         metadata:
//           data.metadata && typeof data.metadata === "object"
//             ? data.metadata
//             : {},
//       });
//     } else {
//       return NextResponse.json(
//         { error: "Invalid item type specified" },
//         { status: 400 },
//       );
//     }

//     return NextResponse.json({ success: true, id });
//   } catch (error: any) {
//     console.error("Error creating record in TiDB:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// // PUT: Update an existing record in TiDB
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ tripId: string }> },
// ) {
//   try {
//     const body = await request.json();
//     const { id, type, ...data } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Missing record ID for update" },
//         { status: 400 },
//       );
//     }

//     if (type === "accommodation") {
//       await db
//         .update(accommodations)
//         .set({
//           name: data.name,
//           placeName: data.placeName || null,
//           facilities: data.facilities || [],
//           status: data.status,
//           dayId: data.dayId || null,
//           address: data.address || null,
//           phoneNumber: data.phoneNumber || null,
//           checkIn: data.checkIn
//             ? new Date(data.checkIn)
//                 .toISOString()
//                 .slice(0, 19)
//                 .replace("T", " ")
//             : null,
//           checkOut: data.checkOut
//             ? new Date(data.checkOut)
//                 .toISOString()
//                 .slice(0, 19)
//                 .replace("T", " ")
//             : null,
//           estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
//           actualCost: data.actualCost ? String(data.actualCost) : null,
//           currency: data.currency || "INR",
//           bookingReference: data.bookingReference || null,
//           externalBookingUrl: data.externalBookingUrl || null,
//           latitude: data.latitude ? String(data.latitude) : null,
//           longitude: data.longitude ? String(data.longitude) : null,
//         })
//         .where(eq(accommodations.id, id));
//     } else if (type === "attraction") {
//       await db
//         .update(attractions)
//         .set({
//           name: data.name,
//           dayId: data.dayId || null,
//           address: data.address || null,
//           entryFee: data.entryFee ? String(data.entryFee) : null,
//           currency: data.currency || "INR",
//           openingTime: data.openingTime || null,
//           closingTime: data.closingTime || null,
//           latitude: data.latitude ? String(data.latitude) : null,
//           longitude: data.longitude ? String(data.longitude) : null,
//           highlights: data.highlights || [],
//           photographyNotes: data.photographyNotes || [],
//         })
//         .where(eq(attractions.id, id));
//     } else if (type === "dining") {
//       await db
//         .update(diningSpots)
//         .set({
//           name: data.name,
//           dayId: data.dayId || null,
//           category: data.category,
//           cuisineType: data.cuisineType || null,
//           address: data.address || null,
//           estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
//           rating: data.rating ? String(data.rating) : null,
//           latitude: data.latitude ? String(data.latitude) : null,
//           longitude: data.longitude ? String(data.longitude) : null,
//         })
//         .where(eq(diningSpots.id, id));
//     } else if (type === "leg") {
//       await db
//         .update(travelLegs)
//         .set({
//           dayId: data.dayId || null,
//           mode: data.mode || null,
//           originName: data.originName,
//           originLat: data.originLat ? String(data.latitude) : null,
//           originLng: data.originLng ? String(data.latitude) : null,
//           destinationName: data.destinationName,
//           destinationLat: data.destinationLat ? String(data.latitude) : null,
//           destinationLng: data.destinationLng ? String(data.latitude) : null,
//           departureTime: data.departureTime || null,
//           arrivalTime: data.arrivalTime || null,
//           distanceKm: data.distanceKm,
//           sequenceOrder: data.sequenceOrder || null,
//           metadata: data.metadata || null,
//         })
//         .where(eq(travelLegs.id, id));
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Error updating record in TiDB:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// // DELETE: Remove record from TiDB
// export async function DELETE(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");
//     const type = searchParams.get("type");

//     if (!id || !type) {
//       return NextResponse.json(
//         { error: "Missing id or type parameters" },
//         { status: 400 },
//       );
//     }

//     if (type === "accommodation") {
//       await db.delete(accommodations).where(eq(accommodations.id, id));
//     } else if (type === "attraction") {
//       await db.delete(attractions).where(eq(attractions.id, id));
//     } else if (type === "dining") {
//       await db.delete(diningSpots).where(eq(diningSpots.id, id));
//     } else if (type === "leg") {
//       await db.delete(travelLegs).where(eq(travelLegs.id, id));
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Error deleting record from TiDB:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  accommodations,
  diningSpots,
  attractions,
  travelLegs,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";

const toNullableDecimal = (val: unknown): string | null => {
  if (val === null || val === undefined || val === "" || val === "undefined") {
    return null;
  }
  const num = typeof val === "number" ? val : Number(val);
  return Number.isFinite(num) ? num.toFixed(8) : null;
};

const toNullableNumber = (val: unknown): number | null => {
  if (val === null || val === undefined || val === "" || val === "undefined") {
    return null;
  }
  const num = typeof val === "number" ? val : Number(val);
  return Number.isFinite(num) ? num : null;
};

// GET: Fetch all accommodations, attractions, dining spots, and travel legs for a trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;
    const { searchParams } = new URL(request.url);
    const dayId = searchParams.get("dayId");

    const tripAccommodations = await db
      .select()
      .from(accommodations)
      .where(
        dayId
          ? and(
              eq(accommodations.tripId, tripId),
              eq(accommodations.dayId, dayId),
            )
          : eq(accommodations.tripId, tripId),
      );

    const tripAttractions = await db
      .select()
      .from(attractions)
      .where(
        dayId
          ? and(eq(attractions.tripId, tripId), eq(attractions.dayId, dayId))
          : eq(attractions.tripId, tripId),
      );

    const tripDinings = await db
      .select()
      .from(diningSpots)
      .where(
        dayId
          ? and(eq(diningSpots.tripId, tripId), eq(diningSpots.dayId, dayId))
          : eq(diningSpots.tripId, tripId),
      );

    const tripLegs = await db
      .select()
      .from(travelLegs)
      .where(
        dayId
          ? and(eq(travelLegs.tripId, tripId), eq(travelLegs.dayId, dayId))
          : eq(travelLegs.tripId, tripId),
      );

    return NextResponse.json({
      accommodations: tripAccommodations,
      attractions: tripAttractions,
      travelLegs: tripLegs,
      diningSpots: tripDinings,
    });
  } catch (error: any) {
    console.error("Error fetching others-details:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST: Create a new accommodation, attraction, dining spot, or travel leg in TiDB
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;
    const body = await request.json();
    const { type, ...data } = body;

    const id = crypto.randomUUID();

    if (type === "accommodation") {
      await db.insert(accommodations).values({
        id,
        tripId,
        dayId: data.dayId || null,
        name: data.name,
        placeName: data.placeName || null,
        facilities: data.facilities || [],
        status: data.status || "Confirmed",
        latitude: toNullableDecimal(data.latitude),
        longitude: toNullableDecimal(data.longitude),
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
        address: data.address || null,
        latitude: toNullableDecimal(data.latitude),
        longitude: toNullableDecimal(data.longitude),
        entryFee: data.entryFee ? String(data.entryFee) : null,
        currency: data.currency || "INR",
        openingTime: data.openingTime || null,
        closingTime: data.closingTime || null,
        highlights: data.highlights || [],
        photographyNotes: data.photographyNotes || [],
      });
    } else if (type === "dining") {
      await db.insert(diningSpots).values({
        id,
        tripId,
        dayId: data.dayId || null,
        name: data.name,
        category: data.category || "Restaurant",
        cuisineType: data.cuisineType || null,
        latitude: toNullableDecimal(data.latitude),
        longitude: toNullableDecimal(data.longitude),
        address: data.address || null,
        estimatedCost: data.estimatedCost ? String(data.estimatedCost) : null,
        rating: data.rating ? String(data.rating) : null,
      });
    } else if (type === "leg") {
      await db.insert(travelLegs).values({
        id,
        tripId,
        dayId: data.dayId,
        mode: data.mode || "car",
        originName: String(data.originName ?? "").trim(),
        originLat: toNullableDecimal(data.originLat),
        originLng: toNullableDecimal(data.originLng),
        destinationName: String(data.destinationName ?? "").trim(),
        destinationLat: toNullableDecimal(data.destinationLat),
        destinationLng: toNullableDecimal(data.destinationLng),
        departureTime:
          data.departureTime && data.departureTime !== "undefined"
            ? data.departureTime
            : null,
        arrivalTime:
          data.arrivalTime && data.arrivalTime !== "undefined"
            ? data.arrivalTime
            : null,
        distanceKm: toNullableNumber(data.distanceKm),
        sequenceOrder: Number(data.sequenceOrder) || 1,
        metadata:
          data.metadata && typeof data.metadata === "object"
            ? data.metadata
            : {},
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
    await params;
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
          placeName: data.placeName || null,
          facilities: data.facilities || [],
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
          currency: data.currency || "INR",
          bookingReference: data.bookingReference || null,
          externalBookingUrl: data.externalBookingUrl || null,
          latitude: toNullableDecimal(data.latitude),
          longitude: toNullableDecimal(data.longitude),
        })
        .where(eq(accommodations.id, id));
    } else if (type === "attraction") {
      await db
        .update(attractions)
        .set({
          name: data.name,
          dayId: data.dayId || null,
          address: data.address || null,
          entryFee: data.entryFee ? String(data.entryFee) : null,
          currency: data.currency || "INR",
          openingTime: data.openingTime || null,
          closingTime: data.closingTime || null,
          latitude: toNullableDecimal(data.latitude),
          longitude: toNullableDecimal(data.longitude),
          highlights: data.highlights || [],
          photographyNotes: data.photographyNotes || [],
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
          latitude: toNullableDecimal(data.latitude),
          longitude: toNullableDecimal(data.longitude),
        })
        .where(eq(diningSpots.id, id));
    } else if (type === "leg") {
      await db
        .update(travelLegs)
        .set({
          dayId: data.dayId,
          mode: data.mode || "car",
          originName: String(data.originName ?? "").trim(),
          originLat: toNullableDecimal(data.originLat),
          originLng: toNullableDecimal(data.originLng),
          destinationName: String(data.destinationName ?? "").trim(),
          destinationLat: toNullableDecimal(data.destinationLat),
          destinationLng: toNullableDecimal(data.destinationLng),
          departureTime:
            data.departureTime && data.departureTime !== "undefined"
              ? data.departureTime
              : null,
          arrivalTime:
            data.arrivalTime && data.arrivalTime !== "undefined"
              ? data.arrivalTime
              : null,
          distanceKm: toNullableNumber(data.distanceKm),
          sequenceOrder: Number(data.sequenceOrder) || 1,
          metadata:
            data.metadata && typeof data.metadata === "object"
              ? data.metadata
              : {},
        })
        .where(eq(travelLegs.id, id));
    } else {
      return NextResponse.json(
        { error: "Invalid item type specified" },
        { status: 400 },
      );
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
    } else if (type === "leg") {
      await db.delete(travelLegs).where(eq(travelLegs.id, id));
    } else {
      return NextResponse.json(
        { error: "Invalid item type specified" },
        { status: 400 },
      );
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
