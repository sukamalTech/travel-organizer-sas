import { z } from "zod";

// ==========================================
// 1. Transport Modes
// ==========================================
export const TransportModeEnum = z.enum([
  "car",
  "bike",
  "train",
  "bus",
  "flight",
  "ferry",
  "walk",
]);

export type TransportMode = z.infer<typeof TransportModeEnum>;

// ==========================================
// 2. Coordinates Schema
// ==========================================
export const CoordinatesSchema = z
  .object({
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
  })
  .nullable()
  .optional();

export type Coordinates = z.infer<typeof CoordinatesSchema>;

// ==========================================
// 3. Mode-Specific Metadata Schemas
// ==========================================
export const CarBikeMetadataSchema = z.object({
  highway_number: z.string().optional(),
  fuel_stops: z.array(z.string()).optional().default([]),
  road_condition: z
    .enum(["smooth", "patchy", "gravel", "severe"])
    .optional()
    .default("smooth"),
  vehicle_check_reminders: z.array(z.string()).optional().default([]),
});
export type CarBikeMetadata = z.infer<typeof CarBikeMetadataSchema>;

export const TransitMetadataSchema = z.object({
  train_name: z.string().optional(),
  train_number: z.string().optional(),
  pnr: z.string().optional(),
  coach_type: z.string().optional(),
  seat_number: z.string().optional(),
  departure_platform: z.string().optional(),
  fare: z.coerce.number().min(0).optional().nullable(),
});
export type TransitMetadata = z.infer<typeof TransitMetadataSchema>;

export const FlightMetadataSchema = z.object({
  airline: z.string().optional(),
  flight_number: z.string().optional(),
  terminal: z.string().optional(),
  gate: z.string().optional(),
  seat: z.string().optional(),
  booking_reference: z.string().optional(),
});
export type FlightMetadata = z.infer<typeof FlightMetadataSchema>;

// ==========================================
// 4. Main Travel Leg Form Schema
// ==========================================

// ==========================================
// 5. Shared UI & DB Types
// ==========================================

export interface ItineraryDay {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  summary: string | null;
  daily_notes: string | null;
}
