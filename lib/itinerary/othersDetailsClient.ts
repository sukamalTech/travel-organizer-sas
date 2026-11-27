import { ActiveTabType } from "@/components/creator/OthersFormPanel";

export interface TripOthersDetailsResponse {
  accommodations: any[];
  attractions: any[];
  diningSpots: any[];
  travelLegs: any[];
}

/**
 * Fetches all logistics records for a trip (optionally filtered by dayId).
 * Keeping all items for the trip lets client-side day filtering stay instant
 * while also supporting day-specific queries.
 */
export async function fetchTripOthersDetails(
  tripId: string,
  dayId?: string | null,
): Promise<TripOthersDetailsResponse> {
  const query = dayId ? `?dayId=${encodeURIComponent(dayId)}` : "";
  const res = await fetch(`/api/trips/${tripId}/others-details${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || "Failed to fetch trip logistics details.");
  }

  const json = await res.json();
  return {
    accommodations: Array.isArray(json.accommodations)
      ? json.accommodations
      : [],
    attractions: Array.isArray(json.attractions) ? json.attractions : [],
    diningSpots: Array.isArray(json.diningSpots) ? json.diningSpots : [],
    travelLegs: Array.isArray(json.travelLegs)
      ? json.travelLegs
      : Array.isArray(json.legs)
        ? json.legs
        : [],
  };
}

/**
 * Creates (POST) or updates (PUT) an accommodation, attraction, dining spot, or leg.
 */
export async function saveTripOthersDetail(params: {
  tripId: string;
  dayId: string | null;
  type: ActiveTabType;
  formData: Record<string, any>;
  existingId?: string | null;
}): Promise<void> {
  const { tripId, dayId, type, formData, existingId } = params;
  const method = existingId ? "PUT" : "POST";

  const payload = {
    ...formData,
    tripId,
    dayId,
    type,
    id: existingId || undefined,
  };

  const res = await fetch(`/api/trips/${tripId}/others-details`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || "Failed to save record.");
  }
}

/**
 * Deletes a logistics record by id and type.
 */
export async function deleteTripOthersDetail(
  tripId: string,
  id: string,
  type: ActiveTabType,
): Promise<void> {
  const res = await fetch(
    `/api/trips/${tripId}/others-details?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}`,
    { method: "DELETE" },
  );

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || "Failed to delete record.");
  }
}
