// Haversine distance in kilometers
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Open-Loop TSP Solver with Destination Magnet Heuristic.
 */
export function solveOpenTSP(
  startPoint: { lat: number; lng: number },
  attractions: any[],
  endPoint?: { latitude: number; longitude: number; name?: string } | null,
) {
  let unvisited = attractions.filter(
    (a) =>
      !endPoint ||
      a.latitude !== endPoint.latitude ||
      a.longitude !== endPoint.longitude,
  );

  let current = startPoint;
  const sortedAttractions: any[] = [];

  while (unvisited.length > 0) {
    let bestIndex = 0;
    let minScore = Infinity;

    unvisited.forEach((spot, idx) => {
      const distFromCurrent = calculateDistance(
        current.lat,
        current.lng,
        spot.latitude,
        spot.longitude,
      );

      let score = distFromCurrent;
      if (endPoint) {
        const distToEnd = calculateDistance(
          spot.latitude,
          spot.longitude,
          endPoint.latitude,
          endPoint.longitude,
        );
        score = distFromCurrent + distToEnd * 0.4;
      }

      if (score < minScore) {
        minScore = score;
        bestIndex = idx;
      }
    });

    const nextSpot = unvisited[bestIndex];
    sortedAttractions.push(nextSpot);
    current = { lat: nextSpot.latitude, lng: nextSpot.longitude };
    unvisited.splice(bestIndex, 1);
  }

  if (endPoint) {
    sortedAttractions.push(endPoint);
  }

  return sortedAttractions;
}

export function addMinutesToTime(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
