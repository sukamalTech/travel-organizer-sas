"server";

import { db } from "@/db"; // Import your Drizzle DB instance
import { attractions } from "@/db/schema"; // Import your schema definition
import { eq } from "drizzle-orm";

export interface AttractionData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  openingTime: string | null;
  closingTime: string | null;
}

export async function getAttractionsByDayId(
  dayId: string,
): Promise<AttractionData[]> {
  const result = await db
    .select({
      id: attractions.id,
      name: attractions.name,
      address: attractions.address,
      latitude: attractions.latitude,
      longitude: attractions.longitude,
      openingTime: attractions.openingTime,
      closingTime: attractions.closingTime,
    })
    .from(attractions)
    .where(eq(attractions.dayId, dayId));

  // Convert decimal strings returned by MySQL/TiDB to numbers for Mapbox
  return result
    .filter((item) => item.latitude !== null && item.longitude !== null)
    .map((item) => ({
      ...item,
      latitude: parseFloat(item.latitude as string),
      longitude: parseFloat(item.longitude as string),
    }));
}
