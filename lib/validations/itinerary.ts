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
export const TravelLegFormSchema = z.object({
  id: z.string().optional(),
  trip_id: z.string().min(1, "Trip ID is required"),
  day_id: z.string().min(1, "Day ID is required"),
  distance_km: z.coerce
    .number()
    .min(0, "Distance must be positive")
    .optional()
    .nullable(),
  sequence_order: z.number().int().min(0).optional().default(1),
  mode: TransportModeEnum,

  // Origin details
  origin_name: z.string().min(1, "Origin name is required"),
  origin_coordinates: CoordinatesSchema,
  origin_lat: z.number().nullable().optional(),
  origin_lng: z.number().nullable().optional(),

  // Destination details
  destination_name: z.string().min(1, "Destination name is required"),
  destination_coordinates: CoordinatesSchema,
  destination_lat: z.number().nullable().optional(),
  destination_lng: z.number().nullable().optional(),

  // Schedule
  departure_time: z.string().optional().nullable(),
  arrival_time: z.string().optional().nullable(),

  // Flexible metadata
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

// Output type (after schema validation)
export type TravelLegFormValues = z.infer<typeof TravelLegFormSchema>;

// Input type (what form fields submit)
export type TravelLegFormInput = z.input<typeof TravelLegFormSchema>;

// ==========================================
// 5. Shared UI & DB Types
// ==========================================
export type LegItem = Omit<TravelLegFormInput, "trip_id" | "day_id"> & {
  id: string;
  trip_id?: string;
  day_id?: string;
  sequence_order: number;
  mode: TransportMode;
  origin_name: string;
  destination_name: string;
  distance_km?: number | null;
  created_at?: string;
  metadata?: Record<string, any>;
};

export interface ItineraryDay {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  summary: string | null;
  daily_notes: string | null;
}
