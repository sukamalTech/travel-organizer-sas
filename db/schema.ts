// db/schema.ts
import {
  mysqlTable,
  serial,
  varchar,
  int,
  text,
  decimal,
  timestamp,
  time,
  json,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: int("age").notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

// Accomodation schema

export const accommodations = mysqlTable("accommodations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  tripId: varchar("trip_id", { length: 36 }).notNull(),
  dayId: varchar("day_id", { length: 36 }), // Optional field
  name: text("name").notNull(),
  status: text("status").notNull(),
  latitude: decimal("latitude", { precision: 11, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  phoneNumber: text("phone_number"),
  checkIn: timestamp("check_in", { mode: "string", fsp: 3 }),
  checkOut: timestamp("check_out", { mode: "string", fsp: 3 }),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  currency: text("currency"),
  bookingReference: text("booking_reference"),
  externalBookingUrl: text("external_booking_url"),
});
export type Accommodation = typeof accommodations.$inferSelect;
export type NewAccommodation = typeof accommodations.$inferInsert;

// Dining schema
export const diningSpots = mysqlTable("dining_spots", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  tripId: varchar("trip_id", { length: 36 }).notNull(),
  dayId: varchar("day_id", { length: 36 }), // Hollow diamond indicates nullable / optional
  name: text("name").notNull(),
  category: text("category").notNull(),
  cuisineType: text("cuisine_type"),
  latitude: decimal("latitude", { precision: 11, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  rating: decimal("rating", { precision: 3, scale: 2 }), // e.g. up to 5.00 rating score
});

export type DiningSpot = typeof diningSpots.$inferSelect;
export type NewDiningSpot = typeof diningSpots.$inferInsert;
// Attraction schema
export const attractions = mysqlTable("attractions", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  tripId: varchar("trip_id", { length: 36 }).notNull(),
  dayId: varchar("day_id", { length: 36 }), // Hollow diamond indicates optional / nullable
  name: text("name").notNull(),
  distanceFromBaseKm: decimal("distance_from_base_km", {
    precision: 8,
    scale: 2,
  }),
  latitude: decimal("latitude", { precision: 11, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }),
  currency: text("currency"),
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  highlights: json("highlights"), // Stored as JSON array in MySQL/TiDB since native text arrays aren't standard
  photographyNotes: json("photography_notes"), // Maps to JSON type for JSONB equivalent
});

export type Attraction = typeof attractions.$inferSelect;
export type NewAttraction = typeof attractions.$inferInsert;
