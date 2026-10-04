import { z } from "zod";

export const TransportModeEnum = z.enum([
  "train",
  "bus",
  "car",
  "bike",
  "flight",
  "ferry",
  "walking",
]);
export type TransportMode = z.infer<typeof TransportModeEnum>;

export const CarBikeMetadataSchema = z.object({
  distance_km: z.number().min(0, "Distance must be positive").optional(),
  highway_number: z.string().optional(),
  fuel_stops: z.array(z.string()).default([]),
  road_condition: z
    .enum(["smooth", "patchy", "gravel", "severe"])
    .default("smooth"),
  vehicle_check_reminders: z.array(z.string()).default([]),
});

export const TransitMetadataSchema = z.object({
  train_name: z.string().min(1, "Train/Bus name is required"),
  train_number: z.string().optional(),
  pnr: z.string().optional(),
  coach_type: z.string().optional(),
  seat_number: z.string().optional(),
  departure_platform: z.string().optional(),
  fare: z.number().min(0).optional(),
});

export const FlightMetadataSchema = z.object({
  airline: z.string().min(1, "Airline is required"),
  flight_number: z.string().min(1, "Flight number is required"),
  terminal: z.string().optional(),
  gate: z.string().optional(),
  seat: z.string().optional(),
  booking_reference: z.string().optional(),
});

export const TravelLegFormSchema = z.object({
  id: z.string().uuid().optional(),
  day_id: z.string().optional(),
  trip_id: z.string().min(1, "Trip ID is required"),
  sequence_order: z.number().int().min(0).default(1),
  mode: TransportModeEnum,
  origin_name: z.string().min(1, "Origin name is required"),
  origin_lat: z.number().nullable().optional(),
  origin_lng: z.number().nullable().optional(),
  destination_name: z.string().min(1, "Destination name is required"),
  destination_lat: z.number().nullable().optional(),
  destination_lng: z.number().nullable().optional(),
  departure_time: z.string().optional(),
  arrival_time: z.string().optional(),
  metadata: z
    .union([
      CarBikeMetadataSchema,
      TransitMetadataSchema,
      FlightMetadataSchema,
      z.record(z.string(), z.any()),
    ])
    .default({}),
});

// Output type (after validation defaults applied)
export type TravelLegFormValues = z.infer<typeof TravelLegFormSchema>;

// Input type (what form fields accept prior to submission)
export type TravelLegFormInput = z.input<typeof TravelLegFormSchema>;
