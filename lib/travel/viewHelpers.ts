export function buildGoogleMapsUrl(params: {
  lat?: string | number | null;
  lng?: string | number | null;
  query?: string | null;
  originLat?: string | number | null;
  originLng?: string | number | null;
  originQuery?: string | null;
  isRoute?: boolean;
}): string {
  const { lat, lng, query, originLat, originLng, originQuery, isRoute } =
    params;

  const hasDestCoords =
    lat !== null &&
    lat !== undefined &&
    lat !== "" &&
    !Number.isNaN(Number(lat)) &&
    lng !== null &&
    lng !== undefined &&
    lng !== "" &&
    !Number.isNaN(Number(lng));

  const destStr = hasDestCoords
    ? `${Number(lat)},${Number(lng)}`
    : encodeURIComponent((query || "").trim());

  if (isRoute) {
    const hasOrigCoords =
      originLat !== null &&
      originLat !== undefined &&
      originLat !== "" &&
      !Number.isNaN(Number(originLat)) &&
      originLng !== null &&
      originLng !== undefined &&
      originLng !== "" &&
      !Number.isNaN(Number(originLng));

    const origStr = hasOrigCoords
      ? `${Number(originLat)},${Number(originLng)}`
      : encodeURIComponent((originQuery || "").trim());

    if (origStr && destStr) {
      return `https://www.google.com/maps/dir/?api=1&origin=${origStr}&destination=${destStr}`;
    }
  }

  return `https://www.google.com/maps/search/?api=1&query=${destStr || "India"}`;
}

export function formatReadableDate(dateStr?: string | null): {
  weekday: string;
  shortDate: string;
  fullDate: string;
} {
  if (!dateStr) {
    return { weekday: "Day", shortDate: "TBD", fullDate: "Date not set" };
  }
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { weekday: "", shortDate: dateStr, fullDate: dateStr };
  }
  return {
    weekday: parsed.toLocaleDateString("en-IN", { weekday: "short" }),
    shortDate: parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    fullDate: parsed.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

export function formatTime12Hr(timeStr?: string | null): string | null {
  if (!timeStr) return null;
  const parts = String(timeStr).split(":");
  if (parts.length < 2) return timeStr;
  const h = Number(parts[0]);
  const m = parts[1];
  if (Number.isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${period}`;
}

export function normalizeStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

// Helper to safely get a trip display label from whatever columns exist on `trips`
function getTripDisplayTitle(trip: any): string {
  return (
    trip?.title ||
    trip?.name ||
    trip?.trip_name ||
    trip?.destination ||
    "Untitled Trip"
  );
}

function getTripSubtitle(trip: any): string {
  return (
    trip?.destination ||
    trip?.route_summary ||
    trip?.summary ||
    (trip?.start_date ? `Starts ${trip.start_date}` : "Custom Route")
  );
}
