// types/trip.ts

export type TransportMode = "car" | "flight" | "train" | "walk" | "other"; // Match your transport_mode enum
export type VisibilityLevel = "private" | "public" | "shared"; // Match your visibility_level enum

export interface Trip {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  primary_mode: TransportMode;
  cover_image_url?: string;
  visibility: VisibilityLevel;
  is_template: boolean;
  cloned_from_trip_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDay {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  summary?: string;
  daily_notes?: string;
}

export interface Accommodation {
  id: string;
  trip_id: string;
  day_id: string | null;
  name: string;
  status: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  phone_number?: string;
  check_in?: string;
  check_out?: string;
  estimated_cost?: number;
  actual_cost?: number;
  currency: string;
  booking_reference?: string;
  external_booking_url?: string;
}

export interface DiningSpot {
  id: string;
  trip_id: string;
  day_id: string | null;
  name: string;
  category: string;
  cuisine_type?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  estimated_cost?: number;
  rating?: number;
  notes?: string;
}

export interface Attraction {
  id: string;
  trip_id: string;
  day_id: string | null;
  name: string;
  distance_from_base_km?: number;
  latitude?: number;
  longitude?: number;
  entry_fee?: number;
  currency: string;
  opening_time?: string;
  closing_time?: string;
  highlights?: string[];
  photography_notes?: Record<string, any>;
}
